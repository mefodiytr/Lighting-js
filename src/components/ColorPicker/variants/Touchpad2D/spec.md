# Touchpad2D

## Суть

2D-pad: одной точкой пальца меняем сразу две оси — обычно X=hue,
Y=brightness (или X=hue, Y=saturation). Сэкономлен жест: вместо
двух отдельных слайдеров — один drag. Паттерн Philips Hue iOS app.

## Когда выбирать

- Когда нужен «mood-режим»: меняй цвет и яркость одним свайпом
- Touch-first интерфейсы, premium
- Music-sync режим (приложение шевелит pad'ом по beat'у)

## Когда не выбирать

- Когда точность важна — каждая ось теряет точность из-за
  второй (плохо понимаешь, какую ось меняешь)
- Mouse-only desktop

## API

```ts
interface Touchpad2DProps {
  value?: { x: number; y: number };   // 0..1, 0..1
  defaultValue?: { x: number; y: number };
  onChange?: (next: { x: number; y: number }) => void;
  onChangeEnd?: (next: { x: number; y: number }) => void;
  axisMapping?: {
    x: 'hue' | 'saturation';
    y: 'brightness' | 'saturation' | 'hue';
  };
  size?: number;                      // default 240
  disabled?: boolean;
  label: ReactNode;
}
```

## Жесты и состояния

| Жест               | Эффект                                             |
|--------------------|----------------------------------------------------|
| Tap                | Cursor прыгает к точке                             |
| Drag               | Live-stream                                        |
| Touch ≥2 fingers   | Игнорируется (защита от случайного pinch)          |
| Keyboard ←→↑↓      | ±step по каждой оси                                |

## Accessibility

- Два hidden `<input type="range">` (один на ось) с `role="slider"`
- `aria-label` на pad: «2D control: горизонтально оттенок,
  вертикально яркость»
- При движении — `aria-live="polite"` объявляет оба значения

## Цветовые стили

Pad — динамический gradient (зависит от axisMapping). Тема влияет:
- Frame: border вокруг pad
- Cursor: точка пальца
- Optional readout: значения по краям

### cinematic-dark
Frame — бронзовый thin border, скруглён 18px. Pad background:
`linear-gradient(0deg, transparent, rgba(0,0,0,0.6))` поверх
hue-gradient. Cursor — белый круг 18px с outer glow в текущем цвете.

### editorial-dark
Frame square, gold border. Cursor — gold dot.

### neo-brutalism — ◐ адаптация
Frame square с чёрным 3px border, без скруглений. Cursor — чёрный
square 20px. Заливка pad'а упрощена: 4 жёстких квадранта вместо
плавного gradient.

### material
M3 elevated card. Cursor — primary 20px halo.

### cupertino
Frosted card, cursor — белый 18px iOS shadow.

### ivory-day
Светлый frame с тёплым border. Cursor — тёмная бронза.

## Технические заметки

- Pad: `<canvas>` с прерисовкой по axisMapping
- Иногда дешевле — два `linear-gradient` слоя поверх друг друга
  с разными directions
- Cursor — `position: absolute`, `left: x*100%`, `top: (1-y)*100%`
  (Y инвертирована, потому что вверху обычно «больше»)
- Pointer-events: используем `pointermove` напрямую, не через range
  inputs (slow для 2D)
- Защита от multi-touch: `if (event.touches.length > 1) return`
