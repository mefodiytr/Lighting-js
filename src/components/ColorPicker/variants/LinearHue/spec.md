# LinearHue

## Суть

Простая горизонтальная (или вертикальная) полоса всех цветов
радуги. Thumb или cursor показывает текущую позицию. Самый
минималистичный picker — только hue, без saturation/lightness.

## Когда выбирать

- Когда saturation/lightness не нужны (лампа уже отдаёт
  максимально насыщенный)
- Дополнение к другим виджетам (вместе с brightness-slider)
- Inline picker внутри карточки устройства, мало места

## Когда не выбирать

- Когда пользователю важен пастельный/мягкий цвет → `HsvWheel`
- Premium-эстетика хочет больше «материальности» → `SceneGradient`

## API

```ts
interface LinearHueProps {
  value?: number;                // 0..360
  defaultValue?: number;
  onChange?: (next: number) => void;
  onChangeEnd?: (next: number) => void;
  orientation?: 'horizontal' | 'vertical';
  size?: { width: number; height: number };
  disabled?: boolean;
  label: ReactNode;
}
```

## Жесты и состояния

| Жест               | Эффект                          |
|--------------------|---------------------------------|
| Tap по strip       | Cursor прыгает                  |
| Drag               | Live-stream `onChange`          |
| Keyboard ←→        | -step/+step (1deg)              |
| Shift+←→           | ±10deg                          |

## Accessibility

- `role="slider"`, `aria-valuemin=0`, `aria-valuemax=360`
- `aria-valuetext`: «Hue 240, синий» (с текстовой подсказкой по hue)
- Минимум 44×44 touch-target (расширение через padding)

## Цветовые стили

Strip — статический gradient, тема влияет на cursor и frame:

### cinematic-dark
Strip 32px высотой, скруглён 999px, тонкий бронзовый border.
Cursor — белый круг 16px с inset glow матчающего цвета и outer
glow `rgba(var(--cr) var(--cg) var(--cb) / 0.4)`.

### editorial-dark
Strip тоньше (12px). Cursor — gold dot 8px без glow.

### neo-brutalism
Strip square 24px, чёрный border 3px, offset shadow. Cursor —
чёрный square 20px.

### material
Strip 16px tonal-aware. Cursor — primary 20px M3 ripple.

### cupertino
Strip 18px iOS-style. Cursor — белый 22px shadow.

### ivory-day
Strip 28px с тёплым border. Cursor — тёмная бронза 14px.

## Технические заметки

- Strip: `linear-gradient(90deg,
  hsl(0,100,50), hsl(60,100,50), hsl(120,100,50),
  hsl(180,100,50), hsl(240,100,50), hsl(300,100,50), hsl(360,100,50))`
- Cursor: absolute, `left: ${(value/360)*100}%`
- Vertical orientation — gradient angle 0deg, cursor через `top`
