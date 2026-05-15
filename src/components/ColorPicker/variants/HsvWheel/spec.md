# HsvWheel

## Суть

Цветовое колесо: круговой hue (по периметру) + насыщенность к центру.
В центре — чистый белый, по краю — чистый цвет. Канонический паттерн
RGB-ламп (Philips Hue, LIFX). Интуитивно: «крути по кругу — выбирай
оттенок, тащи к центру — выбирай мягче».

## Когда выбирать

- Дефолт для RGB-ламп премиум-объектов
- Когда нужен свободный выбор оттенка (не пресетов)
- Хорошо на средних/больших экранах (≥240px размер колеса)

## Когда не выбирать

- Для семейных пользователей/детей → `SwatchPalette`
- B2B/инженер → `RgbSliders` или `HslSquare`
- Маленькие экраны (<360px шириной)

## API

```ts
interface HsvWheelProps {
  value?: { h: number; s: number; v?: number };  // h 0..360, s 0..1, v optional
  defaultValue?: { h: number; s: number; v?: number };
  onChange?: (next: { h: number; s: number; v?: number }) => void;
  onChangeEnd?: (next: { h: number; s: number; v?: number }) => void;
  size?: number;                      // px, default 240
  disabled?: boolean;
  label: ReactNode;
  brightnessSlider?: boolean;         // прикрепить V-slider снизу
  format?: 'hsv' | 'hsl' | 'hex' | 'rgb';   // формат внешнего value
}
```

## Жесты и состояния

| Жест                  | Эффект                                              |
|-----------------------|-----------------------------------------------------|
| Tap по колесу         | Cursor прыгает к точке, value = (angle, dist/r)     |
| Drag по колесу        | Live `onChange`                                     |
| Drag вне границ       | Clamp к ближайшей точке кольца                      |
| Keyboard ←→↑↓         | ±step по h/s                                        |

## Accessibility

- `role="slider"` на каждой оси: hue, saturation (два hidden range)
- `aria-valuetext`: «Hue 240 градусов, насыщенность 80 процентов»
- Альтернативный «текстовый ввод» режим — отображает hex, можно
  ввести руками

## Цветовые стили

Сам wheel рисует HSV-палитру и не зависит от темы. Тема влияет на:
- **Background card**: фон контейнера вокруг wheel
- **Cursor**: пин на колесе с outline
- **Label/value display**: текст вокруг

### cinematic-dark
Card-фон бронзовый, cursor — белый круг 16px с тёмным outline и
радиальным glow. Подпись value mono `--color-text-dim`.

### editorial-dark
Card — angular, без скруглений. Cursor — gold круг 12px.

### neo-brutalism
Card — белый прямоугольник с border 3px. Cursor — чёрный круг 18px
с offset shadow `4px 4px 0 0 #000`.

### material
M3 surface. Cursor — primary-coloured 20px с halo.

### cupertino
Frosted card с rounded 22px. Cursor — белый 16px с iOS shadow.

### ivory-day
Card — молочная. Cursor — тёмная бронза 14px.

## Технические заметки

- Реализация через `<canvas>` или WebGL-shader для производительности:
  каждый пиксель красится по `hsl(angle, dist/r, 0.5)` — Canvas
  один раз нарисовать, дальше показывать как `<img>`
- Cursor — отдельный absolute-`<div>` поверх canvas
- HSV ↔ HSL ↔ HEX ↔ RGB конверсии — отдельный utility module
  `colorMath.ts`
- При `prefers-reduced-motion` cursor двигается без spring-anim
- Если включён `brightnessSlider` — дополнительный `VerticalSlider`
  или `HorizontalSlider` снизу с reverse-gradient
