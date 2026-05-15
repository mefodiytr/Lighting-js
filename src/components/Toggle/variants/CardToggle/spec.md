# CardToggle

## Суть

Вся карточка устройства/комнаты — это touch-target. Тап в любом
месте карточки переключает состояние, визуальный отклик через
смену цвета фона, рамки, иконки и подсветки.
Паттерн Apple Home / Google Home.

## Когда выбирать

- Основной экран мобильной панели (главная сцена)
- Премиум-сегмент: щедрый tap-target, тактильно
- Когда нужен «один тап» без точного прицеливания

## Когда не выбирать

- Плотные списки (карточка занимает 80×80+ px)
- Если у карточки есть второй жест (drag-to-dim) — конфликт без
  четкого разделения зон. Решается через `LongPressDrag`.

## API

```ts
interface CardToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  label: ReactNode;                  // заголовок карточки
  description?: ReactNode;           // место/тип устройства
  icon?: ReactNode;
  fillStyle?: 'border' | 'background' | 'liquid';  // визуал on-состояния
  haptics?: boolean;
}
```

`fillStyle` — что меняется при on:
- `border` — подсвечивается рамка (минимально, для плотных решёток)
- `background` — карточка тонируется акцентом (сбалансировано)
- `liquid` — заливка снизу вверх (премиум-эффект из showcase)

## Жесты и состояния

| Жест                 | Эффект                                          |
|----------------------|-------------------------------------------------|
| Tap (anywhere)       | Переключение                                    |
| Long-press           | Открывает детали (если задан `onLongPress`)     |
| Keyboard Space/Enter | Переключение (фокус на всей карточке)           |

| State    | Visual                                              |
|----------|-----------------------------------------------------|
| off      | Muted: иконка `text-dim`, фон `bg-card-from→to`     |
| on       | Accent: иконка `text-primary`, фон `accent-deep`    |
| pressing | scale(0.98), 100ms                                  |
| disabled | Opacity 0.4, нет hover                              |

## Accessibility

- `role="switch"` на корневом `<button>`
- `aria-checked`, `aria-label` или `aria-labelledby`
- Tap-area ≥ 80×80px
- Описание состояния в `aria-description` (опционально)

## Цветовые стили

### cinematic-dark
Off: card-gradient `rgba(30,24,18,0.6) → rgba(18,14,10,0.4)`,
border `rgba(120,95,65,0.12)`. On: жидкая заливка `linear-gradient
(180deg, rgba(255,180,90,0.95), rgba(180,100,40,0.75))`. Лейбл при
on — `#2a1a0a` (контраст по заливке).

### editorial-dark
Off: матовый `#14110d`. On: золотая тонировка `rgba(212,175,100,0.4)`,
без жидкости. Свечение только через `box-shadow` 1px gold.

### neo-brutalism
Off: белая карточка с чёрным 3px бордером, offset shadow `6px 6px
0 0 #000`. On: фон `#ffd400`, бордер остаётся, shadow «утопает»:
`2px 2px 0 0 #000`. Tap = scale(1) → translate(4px, 4px). Резко.

### material
Off: M3 elevated surface. On: tonal `--color-accent` 16% поверх
surface. Ripple от точки тапа.

### cupertino
Off: frosted glass `rgba(255,255,255,0.78)` + `backdrop-blur`. On:
тинт `rgba(0,122,255,0.15)` + бордер `var(--color-accent)`.

### ivory-day
Off: молочная карточка. On: тёплая бронзовая заливка `#b8895a` 20%
+ border `#b8895a`. Иконка темнеет.

## Технические заметки

- `fillStyle="liquid"` — анимация через `clip-path` или
  `transform: translateY()` на абсолютном `.liquid` слое,
  длительность `--duration-luxe`
- При `prefers-reduced-motion` liquid → background-swap без анимации
- `useLongPress` опционально подключается, если задан `onLongPress`
- Drag-to-dim НЕ реализуется здесь (см. `LongPressDrag` или
  `DragByCard` для диммера)
