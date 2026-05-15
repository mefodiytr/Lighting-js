# ArcSlider

## Суть

Дугообразный slider (180° или 270°), thumb движется по дуге.
Экономит ширину, выглядит премиально. Знаменитая метафора —
термостат Nest. Понятнее RadialKnob, потому что есть видимая шкала.

## Когда выбирать

- Hero-control одного канала: яркость, CCT
- Компактная карточка устройства (квадрат >120×120)
- Премиум-сегмент, эстетика «приборной панели»

## Когда не выбирать

- Плотные списки → `HorizontalSlider`
- Когда углы пользователю абстрактны — пожилые, дети

## API

```ts
interface ArcSliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (next: number) => void;
  onChangeEnd?: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  arc?: number;              // суммарная дуга в deg, default 270 (Nest)
  startAngle?: number;       // нижняя точка по умолчанию -135 (down-left)
  disabled?: boolean;
  label: ReactNode;
  showValue?: boolean;       // число в центре дуги
  size?: number;             // px, default 200
  haptics?: 'off' | 'tick';
}
```

## Жесты и состояния

| Жест                       | Эффект                                       |
|----------------------------|----------------------------------------------|
| Drag thumb вдоль дуги      | Update value                                 |
| Tap по дуге                | Thumb прыгает к точке                        |
| Drag вне дуги              | Tangent extrapolation                        |
| Keyboard ←/→               | -step/+step                                  |

## Accessibility

- `role="slider"`, `aria-valuemin/max/now`
- `aria-valuetext`
- Touch-target расширен через прозрачное hit-area вокруг дуги
- Минимум 4.5:1 контраст для filled vs unfilled track

## Цветовые стили

### cinematic-dark
Unfilled track: `stroke="rgba(80, 65, 48, 0.3)" stroke-width="6"`.
Filled track: `stroke="rgb(var(--cr) var(--cg) var(--cb))"` с
`drop-shadow` для свечения. Thumb: бронзовый круг 22px с glow.
Лейбл и value — `font-mono` мелким shrift'ом в центре дуги.

### editorial-dark
Track тоньше (3px), filled — золотой плоский. Thumb 16px без glow.

### neo-brutalism — ◐ адаптация
Дуга реализована как ломаная (polyline) с прямыми сегментами вместо
гладкой кривой. Track — чёрный 4px. Fill — жёлтый 4px поверх.
Thumb — чёрный квадрат.

### material
M3 не имеет official ArcSlider, но реализуется в духе:
track 4px tonal, fill primary, thumb 24px с halo.

### cupertino
Тонкий iOS-style: track 6px, fill — accent-blue. Thumb 28px белый.

### ivory-day
Track — `#e8d8c4` 6px. Fill — тёплый rgb(var(--cr) var(--cg) var(--cb))
плотный. Thumb — белый с тёплой тенью.

## Технические заметки

- SVG `<path>` с `d="M ... A r r 0 1 1 ..."` (arc command)
- Filled track — отдельный path с тем же geometry, но
  `stroke-dasharray` и `stroke-dashoffset`, рассчитанные по value
- Thumb позиционируется через `cx, cy` из угла → координаты:
  `cx = center + r * Math.cos(rad)`
- Hit-area — невидимый широкий path (stroke-width 44px,
  pointer-events="stroke")
- `arc=270` (Nest), `arc=180` (полу-кольцо), `arc=120` (мини-bow)
