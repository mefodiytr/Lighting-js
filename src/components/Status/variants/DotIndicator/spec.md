# DotIndicator

## Суть

Цветная точка (зелёный/жёлтый/красный/серый) — самый компактный
индикатор state'а. Размещается в углу карточки устройства или
рядом с label'ом.

## Когда выбирать

- Любой компактный context: списки, карточки, table rows
- Когда статусов мало (3-5 явных)
- В сочетании с другими индикаторами (например `InlineBadge` для
  деталей при tap)

## Когда не выбирать

- Когда нужны нюансы состояния («обновление 60%», «sync...»)
- Color-blind concerns — нужен текстовый label рядом

## API

```ts
interface DotIndicatorProps {
  kind: 'online' | 'offline' | 'fault' | 'updating' | 'pending' | 'unknown';
  size?: 'xs' | 'sm' | 'md';            // 6/8/12px
  pulse?: boolean;                       // breathe при active states
  ariaLabel?: string;                    // SR-описание
}
```

## Состояния

| Kind     | Цвет (semantic)            | Pulse default |
|----------|----------------------------|---------------|
| online   | green `--color-state-ok`   | no            |
| offline  | grey `--color-text-faint`  | no            |
| fault    | red `--color-state-danger` | yes           |
| updating | amber                      | yes           |
| pending  | dim accent                 | yes           |
| unknown  | grey, hollow ring          | no            |

## Accessibility

- `<span role="img" aria-label="Online">` или `<span aria-hidden>` если
  есть соседний text-label
- Не полагаться только на цвет: shape (filled/hollow) или label-suffix

## Цветовые стили

### cinematic-dark
Round 8px filled с лёгким glow в matching цвете. Pulse: `@keyframes`
shadow-pulse 2.5s.

### editorial-dark
Тоньше (6px), без glow.

### neo-brutalism
Square 10×10 solid colour. Pulse заменён на blinking step.

### material
M3 dot — round 8px, без glow. M3 Snackbar дублирует если важно.

### cupertino
iOS-style: small filled circle с iOS palette (system red/green/etc.).

### ivory-day
Тёплые тона. Green остаётся зелёным (semantic), accent теплее.

## Технические заметки

- CSS-only компонент: `<span>` с `border-radius: 50%` (или 0 для
  brutalism), `background`, optional `box-shadow` для glow
- Pulse: `@keyframes` opacity 1 → 0.4 → 1 OR scale 1 → 1.15 → 1
- При `prefers-reduced-motion` — pulse static
- Размер через `width/height` с `display: inline-block`
- ariaLabel: автогенерируется из kind если не задан
