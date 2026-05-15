# HorizontalSlider

## Суть

Классический горизонтальный slider: track, thumb, заливка от
начала до thumb. Самый компактный диммер. Привычен, но узкий
tap-target по вертикали — на мобильнике с пальцем неточно.

## Когда выбирать

- Плотные списки устройств (одна строка = одно устройство)
- Когда есть параллельные значения, которые нужно сравнить
- В строке настроек устройства как часть формы

## Когда не выбирать

- Hero-control одного канала на большом экране → `VerticalSlider`/`ArcSlider`
- Главная карточка комнаты → `DragByCard`
- Доступность для пожилых → `StepButtons`

## API

```ts
interface HorizontalSliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (next: number) => void;
  onChangeEnd?: (next: number) => void;
  min?: number;          // default 0
  max?: number;          // default 100
  step?: number;         // default 1
  disabled?: boolean;
  label: ReactNode;
  showValue?: boolean;   // показывать число справа от track
  haptics?: 'off' | 'tick';
}
```

## Жесты и состояния

| Жест                       | Эффект                              |
|----------------------------|-------------------------------------|
| Tap по track               | Thumb прыгает к точке, `onChange`   |
| Drag thumb                 | Live-stream `onChange`              |
| Drag по track (вне thumb)  | Подхватывает thumb с точки тапа     |
| Keyboard ←/→               | -step/+step                         |
| Shift+←/→                  | -10×step/+10×step                   |
| Home/End                   | min/max                             |

## Accessibility

- `role="slider"`, `aria-valuemin/max/now`, `aria-label`
- Высота touch-target ≥ 44px через `padding` + `margin`
- `aria-valuetext` для человекочитаемого значения («45 процентов»)

## Цветовые стили

### cinematic-dark
Track: `#1a1410` с inset-shadow. Fill: `linear-gradient(90deg,
rgba(var(--cr) var(--cg) var(--cb) / 0.95), rgba(var(--dr) var(--dg)
var(--db) / 0.85))`. Thumb: бронзовый круг 22px с radial-highlight.
Glow вокруг thumb на drag: `0 0 16px rgba(var(--cr) var(--cg) var(--cb) / 0.5)`.

### editorial-dark
Track тоньше (4px), fill — золотой плоский. Thumb 18px, без highlight.

### neo-brutalism
Track: чёрный border 3px, белая заливка. Fill: жёлтый `#ffd400` flat.
Thumb: чёрный квадрат 20×20, offset shadow `4px 4px 0 0 #000`.

### material
M3 slider: track 4px, thumb 20px с halo 40px при tap (state-layer).
Discrete-режим показывает tick marks.

### cupertino
iOS slider: track 4px серый, fill — accent-blue, thumb 28px белый
с iOS shadow. Bounce при достижении границ через CSS spring.

### ivory-day
Track молочный с тёплой inset, fill — `rgba(var(--cr) var(--cg)
var(--cb) / 0.7)`. Thumb белый с тёплой тенью.

## Технические заметки

- Реализуется как `<input type="range">` с visually-hidden +
  кастомный визуал — для best-in-class a11y и keyboard «из коробки»
- Drag — pointer events на видимом track, синхронизация со скрытым input
- При `step > 1` — snap-to-step при `pointerup`, не во время drag
- `accent-animated` класс на корне для color-tween
