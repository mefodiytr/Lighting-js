# VerticalSlider

## Суть

Вертикальный slider: track снизу-вверх, thumb по высоте, заливка
снизу. Эргономичен для большого пальца — длинный жест по высоте
руки. Стандарт для медиа-app (Apple Music, Spotify mixer).

## Когда выбирать

- Hero-control одного канала (диммер главной лампы комнаты)
- Faders multi-channel mixer (несколько вертикалок в ряд)
- Когда есть свободная высота на экране (>250px)

## Когда не выбирать

- Плотные списки → `HorizontalSlider`
- На landscape-устройствах с малой высотой
- Когда значение важно показать рядом с label → `HorizontalSlider`

## API

```ts
interface VerticalSliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (next: number) => void;
  onChangeEnd?: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label: ReactNode;
  height?: number;        // px, default 240
  showValueInside?: boolean;  // % число поверх заливки
  haptics?: 'off' | 'tick';
}
```

## Жесты и состояния

| Жест                  | Эффект                                          |
|-----------------------|-------------------------------------------------|
| Tap по track          | Fill прыгает к точке                            |
| Drag по любой точке   | Live-stream (не обязательно по thumb)           |
| Keyboard ↑/↓          | +step/-step (↑ = увеличение, естественно)       |
| PageUp/Down           | ±10×step                                        |
| Home/End              | max/min                                         |

## Accessibility

- `role="slider"`, `aria-orientation="vertical"`
- Width ≥ 44px (расширение через padding если визуальный track уже)
- `aria-valuetext` обязателен

## Цветовые стили

### cinematic-dark
Track: вертикальный fl `#0a0806 → #1c1612` inset. Fill: `linear-gradient
(0deg, rgba(var(--dr) var(--dg) var(--db) / 0.95) 0%, rgba(var(--cr)
var(--cg) var(--cb) / 0.95) 100%)` — насыщенный внизу, светлеет вверх.
Glow вокруг thumb. Thumb опционально скрыт (showThumb=false) — fill сам
по себе работает как индикатор.

### editorial-dark
Track тоньше (6px width), fill плоский золотой, без gradient.
Thumb — точка на верху fill.

### neo-brutalism
Track: белый прямоугольник с чёрным border 3px. Fill: жёлтый flat.
Thumb: чёрная горизонтальная полоса 4px высотой, идёт по верхней
границе fill.

### material
M3-style: track 4-8px wide, fill primary, thumb 20px на текущей
позиции, halo при tap.

### cupertino
iOS volume-style: track 8px wide rounded, fill — system gray
light, активный fill — accent-blue.

### ivory-day
Track молочный, fill теплый gradient `rgba(var(--cr) var(--cg)
var(--cb) / 0.7) → rgba(var(--dr) var(--dg) var(--db) / 0.8)`.

## Технические заметки

- Hidden `<input type="range" orient="vertical">` (Firefox) + CSS
  `writing-mode: vertical-lr; transform: rotate(180deg);` для Chrome
- При `showValueInside` — число позиционируется по `bottom: <value>%`
  и анимируется вместе с fill
- Multi-fader сетка реализуется через `display: grid` с вертикалками
  как ячейками
