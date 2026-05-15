# LiveGauge

## Суть

Аналоговая стрелка-индикатор (как amp-meter в audio) мгновенной
мощности. Бьётся в реальном времени, premium-эстетика. Не для
точных значений, для эмоции «прямо сейчас 1.2 кВт идёт».

## Когда выбирать

- Premium hero-tile на главной
- Шоу-объект, где аналоговая стрелка работает на брэнд
- Realtime monitoring (refresh каждые 1-2 сек)

## Когда не выбирать

- Когда нужны точные числа → numeric display + Sparkline
- Когда нет realtime feed → бесполезно

## API

```ts
interface LiveGaugeProps {
  value: number;                       // current
  min?: number;                        // default 0
  max?: number;                        // default 5000 (W)
  unit?: string;                       // 'W' | 'kW' | '%'
  thresholds?: Array<{
    value: number;
    color: string;
  }>;                                  // marker colors на arc
  arc?: number;                        // sweep angle, default 240
  size?: number;                       // px, default 200
  showDigital?: boolean;               // также показывать numeric
  smoothMs?: number;                   // smoothing animation, default 600
  disabled?: boolean;
  label: ReactNode;
}
```

## Поведение

- При изменении value — needle плавно анимируется (spring)
- Tap на gauge — переход к `FullscreenChart` (опц.)
- Realtime updates через props (parent сам стримит)

## Accessibility

- `<svg role="img" aria-label="Текущая мощность 1.2 кВт">`
- Numeric value дублируется в digital-display (если showDigital)
- `aria-live="polite"` объявляет крупные изменения (>10%)

## Цветовые стили

### cinematic-dark (canonical)
Arc-background — `stroke="rgba(80, 65, 48, 0.3)"`, `stroke-width="8"`.
Filled-arc от min до value — `stroke="rgb(var(--cr) var(--cg) var(--cb))"`.
Needle — латунная (linear-gradient bronze) тонкая стрелка от center.
Tick-marks бронзовые. Digital display: Fraunces large 36pt с unit
mono.

### editorial-dark
Минимальные ticks, gold needle.

### neo-brutalism
Arc — чёрные/жёлтые блоки сегментами (как odometer). Needle — толстая
чёрная. Digital — крупный mono.

### material
M3-styled gauge с tonal arc. Needle primary.

### cupertino
iOS-Health style: smooth arc, accent-blue, мягкий needle.

### ivory-day
Светлый bg, тёмная needle.

## Технические заметки

- SVG circle/arc — `<path>` arc-command
- Filled-arc — отдельный path с stroke-dasharray + dashoffset
- Needle — `<line>` или `<polygon>` (тонкий треугольник), вращается
  через `transform="rotate(${angle} cx cy)"`
- Smoothing: при изменении value — `requestAnimationFrame` lerp с
  smoothMs duration
- Thresholds — sub-arcs разных цветов или цветные tick-marks
- Performance: при update >2Hz — debounce visual до 30fps
