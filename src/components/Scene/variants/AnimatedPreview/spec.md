# AnimatedPreview

## Суть

Карточка сцены с активной анимацией (пульсация, переливание цветами,
slow flow), отражающей динамическую природу сцены — «Вечеринка»,
«Sunrise simulator», «Океан». Только для сцен, которые меняются во
времени, не для статичных.

## Когда выбирать

- Сцена сама по себе динамическая (effect-scene, animation profile)
- Premium-сегмент, шоу-эстетика
- Чтобы выделить динамические сцены от статичных в общем списке

## Когда не выбирать

- Статичные сцены — обманывает пользователя
- B2B / brutalism — анимация против эстетики
- Когда `prefers-reduced-motion` важен (всегда есть fallback)

## API

```ts
interface AnimatedPreviewProps {
  id: string;
  name: string;
  colors: Rgb[];
  animationType?: 'pulse' | 'flow' | 'shimmer' | 'cycle';
  speed?: 'slow' | 'medium' | 'fast';     // mapped to duration
  active?: boolean;
  onActivate: (id: string) => void;
  onLongPress?: (id: string) => void;
  disabled?: boolean;
  size?: number;
}
```

`animationType`:
- `pulse` — opacity-pulse во всех цветах одновременно
- `flow` — gradient двигается по карточке (как Aurora)
- `shimmer` — мерцание по точкам, как звёздное небо
- `cycle` — цвета меняются последовательно (party-mode)

## Жесты и состояния

| Жест           | Эффект         |
|----------------|----------------|
| Tap            | Activate       |
| Long-press     | Edit           |

## Accessibility

- `<button>`, `aria-pressed`, `aria-label`
- При `prefers-reduced-motion: reduce` — анимация заменяется на
  статический `GradientSwatch` (с тех же colors)
- Имя сцены содержит индикатор движения: «Сцена Океан, динамическая»

## Цветовые стили

Анимация = сцена, тема влияет на frame и активный индикатор.

### cinematic-dark
Card 160×160 22px, бронзовый border. Внутри — анимация. Active —
border 2px бронза + outer glow в основном цвете сцены. Name overlay
fade-overlay внизу.

### editorial-dark
Card square, gold accent. Slower animation (1.5× duration).

### neo-brutalism — ◐ адаптация
Анимация заменена на flickering чёрно-цветную смену. Без smooth.

### material
M3 card. Анимация в bounds card, ripple на tap.

### cupertino
iOS-rounded card. Animation softer, ease-in-out only.

### ivory-day
Светлая card, animation менее насыщенная.

## Технические заметки

- `pulse`: `@keyframes` opacity 1 → 0.6 → 1, duration 2–5s
- `flow`: `background-position` translate по `background-size: 200%`,
  duration 8–20s linear
- `shimmer`: SVG-noise mask с changing `feTurbulence` seed или
  CSS-only with `@property` numeric param
- `cycle`: JS-таймер меняет current color index, transitions через
  accent-vars
- При `disabled` — анимация pause через `animation-play-state: paused`
- При `prefers-reduced-motion` — `animation: none` + render gradient
  swatch вместо
