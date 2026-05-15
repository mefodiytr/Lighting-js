# PersistentBanner

## Суть

Полноширотный баннер сверху приложения, который НЕ исчезает сам.
Для критичных long-running состояний: «Шлюз недоступен», «Обновление
прошивки», «Vacation mode активен». Пользователь должен закрыть
вручную (если dismissible) или система сама убирает при изменении.

## Когда выбирать

- Критичная информация уровня всего app (gateway offline)
- Long-running states (firmware update в процессе)
- Когда `Toast` слишком эфемерен

## Когда не выбирать

- Один device offline → `DotIndicator` + `InlineBadge` в карточке
- Подтверждение успеха → `Toast`

## API

```ts
interface PersistentBannerProps {
  kind: 'info' | 'warning' | 'danger';
  message: ReactNode;
  description?: ReactNode;
  action?: { label: string; onClick: () => void };
  dismissible?: boolean;
  icon?: ReactNode;
  onDismiss?: () => void;
}
```

## Поведение

- Не auto-dismiss
- Stack: если несколько критичных, показываются друг под другом
  (max 2-3)
- Можно скрывать через `dismissible`, но опасные ситуации
  (gateway-offline) — non-dismissible

## Accessibility

- `role="alert"` для danger, `role="status"` для info/warning
- При появлении — focus НЕ забирается, но `aria-live="assertive"`
  для danger ы `polite` для остальных
- Если есть action — кнопка достижима через Tab
- Контраст высокий: ≥ 7:1 для danger

## Цветовые стили

### cinematic-dark
Banner полная ширина, фиксирован сверху под header. Фон kind-coloured
с opacity 0.15 поверх dark base, border-bottom solid kind-color
2px. Иконка крупная (24px), message Fraunces 15pt, description mono
12pt подсказкой. Action — link-style справа.

### editorial-dark
Тонкий gold border, минимальный design.

### neo-brutalism
Banner белый с чёрным border 3px снизу. Фон kind-color (red/yellow/blue)
solid, чёрный mono text uppercase крупно. X-кнопка square справа.

### material
M3 Banner с tonal-surface, leading icon, trailing actions.

### cupertino
iOS-style сверху с frosted background, system colours по kind.

### ivory-day
Мягкие kind tints, тёмный typography.

## Технические заметки

- Portal в верх документа над основным контентом
- При появлении — main-content получает `padding-top: bannerHeight`
  чтобы не перекрыть
- ResizeObserver для banner height сбережёт padding точным
- Multiple banners — `<ul>` stacked, каждый row аналогично
- При dismiss — сохраняется в session/localStorage, чтобы не
  показывать повторно (для не-критичных, например «вы видели
  changelog» — info-banner)
- При обнаружении изменения state (gateway online again) —
  auto-dismiss + show success toast
