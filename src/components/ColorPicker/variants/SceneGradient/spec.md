# SceneGradient

## Суть

Горизонтальная (или вертикальная) градиентная полоса, состоящая
из 3–7 ключевых точек — каждая точка соответствует «мудборду»
(закат, океан, лесной мох, ...). Пользователь scroll'ит по полосе
и видит как градиент тянется, выбирая своё настроение.
Premium-вариант для эстетов.

## Когда выбирать

- Premium-объекты, lifestyle-эстетика
- Когда вместо «синий» хочется «океан»
- Mood-режим: smooth interpolation между mood-цветами

## Когда не выбирать

- Семейное жильё: метафора непонятна
- B2B: слишком декоративно

## API

```ts
interface SceneGradientStop {
  id: string;
  name: string;           // «Sunset», «Ocean», «Forest»
  color: { r: number; g: number; b: number };
}

interface SceneGradientProps {
  stops: SceneGradientStop[];           // ≥2
  value?: number;                       // 0..1 позиция по полосе
  defaultValue?: number;
  onChange?: (next: { value: number; color: Rgb }) => void;
  onChangeEnd?: (next: { value: number; color: Rgb }) => void;
  orientation?: 'horizontal' | 'vertical';
  showStopNames?: boolean;
  disabled?: boolean;
  label: ReactNode;
}
```

## Жесты и состояния

| Жест                       | Эффект                                       |
|----------------------------|----------------------------------------------|
| Drag по полосе             | Live `onChange` с интерполированным RGB      |
| Tap по stop-имени          | Snap к этому stop'у с анимацией              |
| Keyboard ←→                | -step/+step                                  |
| Long-press                 | Fine-mode (медленнее)                        |

## Accessibility

- `role="slider"`, `aria-valuemin=0`, `aria-valuemax=stops.length-1`
- `aria-valuetext`: «Между Sunset и Ocean, ближе к Sunset»
- Stop-names — labelled buttons, alt-jump

## Цветовые стили

Сам gradient = сцена, тема влияет на frame и cursor:

### cinematic-dark
Полоса 240×56px скруглена 28px, бронзовый thin border. Cursor —
крупный 24px круг с outer glow матчающего цвета. Stop-names ниже,
mono с подсветкой активного.

### editorial-dark
Полоса прямоугольная. Cursor — gold pin. Stop-names italic serif.

### neo-brutalism — ◐ адаптация
Без gradient interpolation — каждый stop становится крупным
square-блоком, выделение по tap. По сути это уже больше `Swatch
Palette`. В чистом виде brutalism не любит плавных переходов.

### material
M3 elevated track. Cursor — primary 28px halo.

### cupertino
iOS-style polished bar. Cursor — белый 24px shadow.

### ivory-day
Полоса с тёплым frame. Cursor — тёмная бронза с тёплым glow.

## Технические заметки

- Gradient: `linear-gradient(90deg, rgb(stop1) 0%, rgb(stop2)
  ${1/(n-1)*100}%, ...)`
- Интерполяция: при `value=0.4` и stops `[a, b, c, d]` — найти
  pair (b, c), сегмент 0.33..0.66, local-t = (0.4-0.33)/0.33
- При `showStopNames` — names как `<ul>` под полосой,
  `flex-justify: space-between`
- Smooth interpolation работает в RGB-space (canonical) или
  HSL (для более «насыщенных» переходов) — выбирается опцией
