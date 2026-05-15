# ColorPicker — выбор цвета RGB-лампы

Выбор произвольного цвета для RGB/RGBW-светильников. Возвращает
цвет в HSV, HSL или HEX по выбору потребителя.

## Общий API

```ts
type ColorValue = { h: number; s: number; v: number; }  // или HSL/HEX через `format`

interface ColorPickerCommon {
  value?: ColorValue;
  defaultValue?: ColorValue;
  onChange?: (next: ColorValue) => void;
  onChangeEnd?: (next: ColorValue) => void;
  format?: 'hsv' | 'hsl' | 'hex' | 'rgb';   // формат value
  disabled?: boolean;
  label: ReactNode;
  alpha?: boolean;                          // отдельный alpha-канал
}
```

## Варианты

| Файл              | UX-метафора                                    | Сложность |
|-------------------|------------------------------------------------|-----------|
| `HsvWheel`        | Круг hue + насыщенность к центру (Hue, LIFX)   | Высокая   |
| `HslSquare`       | Квадрат S/L + полоса hue (Adobe-стиль)         | Средняя   |
| `LinearHue`       | Простая горизонтальная радуга                  | Низкая    |
| `SwatchPalette`   | Сетка 4×6 пресет-цветов (для бабушек)          | Низкая    |
| `Touchpad2D`      | 2D-pad: X=hue, Y=brightness (Hue iOS app)      | Средняя   |
| `PhotoDropper`    | Камера → eyedropper по фото                    | Высокая   |
| `SceneGradient`   | Градиентная полоса по мудбордам                | Низкая    |
| `RgbSliders`      | Три ползунка R/G/B (технари)                   | Низкая    |

## Когда какой выбирать

- **Дефолт для премиум** → `HsvWheel`
- **Семейное жильё** → `SwatchPalette` (предустановки) + опция HsvWheel
- **B2B / инженер** → `RgbSliders` или `HslSquare`
- **Игровой эксперимент** → `PhotoDropper`
- **Mood-режим** → `SceneGradient`

## Принципы реализации

- Все варианты работают в HSV внутренне (для CCT-управления удобнее);
  внешний формат конвертируется в `value` через утилиты
- Canvas vs SVG: `HsvWheel` и `HslSquare` — `<canvas>` (производительнее),
  остальное — SVG или CSS-gradients
- При drag — `requestAnimationFrame` throttle для `onChange`, финальный
  `onChangeEnd` всегда срабатывает
