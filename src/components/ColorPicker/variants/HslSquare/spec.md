# HslSquare

## Суть

Квадрат saturation × lightness + отдельная вертикальная/горизонтальная
полоса hue. Adobe Photoshop-стиль. Точнее `HsvWheel` для дизайнеров,
но менее интуитивно для конечных пользователей.

## Когда выбирать

- Эксперт-режим: «Я хочу #FFA500»
- Когда пользователю важна точность L (светлота) отдельно от S
- B2B продукт с инсталляторами

## Когда не выбирать

- Конечный пользователь премиум-апартаментов → `HsvWheel`
- Семейное жильё → `SwatchPalette`

## API

```ts
interface HslSquareProps {
  value?: { h: number; s: number; l: number };
  defaultValue?: { h: number; s: number; l: number };
  onChange?: (next: { h: number; s: number; l: number }) => void;
  onChangeEnd?: (next: { h: number; s: number; l: number }) => void;
  size?: number;                  // px, default 240
  hueStripOrientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  label: ReactNode;
  format?: 'hsv' | 'hsl' | 'hex' | 'rgb';
}
```

## Жесты и состояния

| Жест                       | Эффект                                       |
|----------------------------|----------------------------------------------|
| Drag в квадрате            | x = saturation, y = lightness                |
| Drag по hue-strip          | Меняется hue, квадрат перекрашивается        |
| Tap                        | Cursor прыгает                               |
| Keyboard ←→↑↓ в квадрате   | Точные шаги по S и L                         |

## Accessibility

- Каждая ось — отдельный hidden `<input type="range">` с `role="slider"`
- Three groups: hue / saturation / lightness, каждая labeled
- `aria-valuetext` человекочитаемый

## Цветовые стили

Сам квадрат и strip рисуют свою палитру. Тема влияет на:
- Card вокруг
- Cursor outline и shape
- Hex preview text

### cinematic-dark
Card с тонким бронзовым border. Cursor — белый круг 14px с тёмным
outline. Hex preview — `font-mono`, золотой.

### editorial-dark
Card минимальный, cursor square 12px (геометрический).

### neo-brutalism
Card квадрат, border 3px чёрный. Cursor — чёрный квадрат 16px.

### material
Card M3-elevated. Cursor — primary 18px с halo.

### cupertino
Frosted card. Cursor — белый 16px iOS-style.

### ivory-day
Card молочный. Cursor — тёмная бронза 14px.

## Технические заметки

- Квадрат — `<canvas>` с прерисовкой при изменении hue:
  каждый пиксель `hsl(currentHue, x/w, 1 - y/h)`
- Дешёвле — два слоя `linear-gradient`: один white→transparent
  (saturation), второй transparent→black (lightness), поверх
  фон с текущим hue
- Hue-strip — статический `linear-gradient(0deg, hsl(0,100,50)
  через все 360°)`
- Cursor — absolute `<div>` через `style={left, top}` в %
