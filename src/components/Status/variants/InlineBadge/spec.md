# InlineBadge

## Суть

Маленький текстовый бейдж с label («Offline», «Update available»,
«Lamp fault») и иконкой/dot'ом. Размещается inline в карточке
устройства, рядом с label комнаты, etc.

## Когда выбирать

- Нужен текст состояния, не только dot
- Кросс-language UI (label локализуется)
- Когда есть несколько badges одновременно (status + warning)

## Когда не выбирать

- Очень компактный context (узкий column) → `DotIndicator`
- Когда нужно крупное уведомление → `Toast` / `PersistentBanner`

## API

```ts
interface InlineBadgeProps {
  kind: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  label: ReactNode;
  icon?: ReactNode;
  size?: 'sm' | 'md';
  outlined?: boolean;                    // outlined vs filled
}
```

## Состояния

Цвет берётся из kind:
- `info` → accent
- `success` → state-ok
- `warning` → amber
- `danger` → state-danger
- `neutral` → muted

## Accessibility

- Inline rendered with text — содержит сам label
- Не нужен `aria-label` дополнительный
- Если важен для контекста — окружить `<span role="status">`

## Цветовые стили

### cinematic-dark
Pill-form, padding 4-10px, 11-12pt mono uppercase. Filled-style:
fond пропорционально kind с opacity 0.2, border 1px того же color,
text — solid color. Иконка слева 12px.

### editorial-dark
Square form, минимальный, italic label.

### neo-brutalism
Square c чёрным 2px border, solid background по kind, чёрный text.
Mono uppercase крупно.

### material
M3 Chip-suggestion стиль, tonal kind-color.

### cupertino
iOS-style filled compact badge.

### ivory-day
Тёплые kind tints, тёмный text.

## Технические заметки

- Простой `<span>` с CSS-классом по kind
- Цветовые маппинги — единый утилитарный объект `kindToColor[kind]`
  использующий semantic tokens (--color-state-*)
- Size variants регулируют padding и font-size
- Outlined-form: `background: transparent`, `border` solid kind-color
