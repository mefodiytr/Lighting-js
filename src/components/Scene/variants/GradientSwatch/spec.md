# GradientSwatch

## Суть

Карточка сцены — это автоматически сгенерированный градиент из
цветов, которые сцена включает. Например, сцена «Закат»: оранжевый
+ янтарный + бордовый → conic-gradient. Бесплатно (без фотосессии),
смотрится дорого.

## Когда выбирать

- Дефолт для сцен, когда нет фотосессии
- Быстрое прототипирование: новая сцена добавлена — сразу видна
- Premium-эстетика, абстрактный язык

## Когда не выбирать

- Когда сцен много (>20) и они визуально похожи — пользователь
  путается
- В одноцветных сценах (все каналы 3000K white) — gradient
  выглядит однообразно

## API

```ts
interface GradientSwatchProps {
  id: string;
  name: string;
  colors: Rgb[];                       // ≥2 цвета, рекомендуется 3-5
  gradientType?: 'linear' | 'conic' | 'radial';
  gradientAngle?: number;              // для linear
  active?: boolean;
  onActivate: (id: string) => void;
  onLongPress?: (id: string) => void;
  disabled?: boolean;
  size?: number;                       // default 160
}
```

## Жесты и состояния

| Жест               | Эффект                          |
|--------------------|---------------------------------|
| Tap                | Activate                        |
| Long-press         | Edit                            |
| Keyboard Enter     | Activate                        |

## Accessibility

- `<button>`, `aria-pressed`, `aria-label`
- Описание: «Сцена Закат, оранжевый и янтарный»
- Контраст name на gradient ≥ 4.5:1 — overlay-mask внизу с
  `linear-gradient(0deg, rgba(0,0,0,0.6), transparent)`

## Цветовые стили

Gradient = сцена, тема влияет на frame, name-shrift, active-indicator.

### cinematic-dark
Card 160×160 скруглённая 22px. Gradient на all card, name снизу
Fraunces serif в полосе overlay'я. Active: бронзовый border 2px + glow.

### editorial-dark
Card square, gold thin frame. Name italic мелкий.

### neo-brutalism
Card square с чёрным 4px border, offset shadow. Gradient упрощается
до 2-3 жёстких блоков-stripes вместо плавных. Name large mono в
чёрной box.

### material
M3 elevated. Name as M3 chip overlay.

### cupertino
Rounded 18px. Active — checkmark в углу.

### ivory-day
Светлая card, gradient мягче (`opacity: 0.85`), name тёмный.

## Технические заметки

- `linear-gradient(${angle}deg, rgb(c1), rgb(c2), ...)` — простейший
- `conic-gradient(from 0deg, rgb(c1) 0deg, rgb(c2) 120deg, ...)` —
  для «scene-wheel» эффекта (премиум look)
- `radial-gradient(circle at center, rgb(c1), rgb(c2))` — soft mood
- При `disabled` — opacity 0.4, saturation: 60% через `filter`
- Auto-detection gradientType:
  - 2 цвета → linear
  - 3+ цвета → conic
  - можно override через props
