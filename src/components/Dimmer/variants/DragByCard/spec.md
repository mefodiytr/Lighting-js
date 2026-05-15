# DragByCard

## Суть

Карточка устройства одновременно — toggle и dimmer. Тап = toggle.
Вертикальный drag по карточке = регулировка яркости: карточка
«заполняется» снизу вверх как стакан, отражая текущее значение.
Паттерн Apple Home iOS 16+.

## Когда выбирать

- Главная карточка комнаты или устройства — премиум hero-tile
- Когда хочется один жест, объединяющий on/off и dim
- При больших tap-target'ах (≥120×120px)

## Когда не выбирать

- Плотные сетки 4×N — нет места для drag-жеста
- Если рядом есть другие drag-зависимые элементы (свайп навигации) —
  конфликты, требуется аккуратная обработка `touch-action`
- Когда нужно точное значение → лучше `HorizontalSlider` или `NumericKelvin`

## API

```ts
interface DragByCardProps {
  value?: number;             // 0..100, текущая яркость
  defaultValue?: number;
  onChange?: (next: number) => void;
  onChangeEnd?: (next: number) => void;
  on?: boolean;               // controlled on/off
  onToggle?: (next: boolean) => void;
  disabled?: boolean;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  width?: number;             // default 160
  height?: number;            // default 160, drag scales по высоте
  tapToToggleThreshold?: number; // px движения, ниже которого = tap не drag
  haptics?: 'off' | 'tick';
}
```

## Жесты и состояния

| Жест                            | Эффект                                           |
|---------------------------------|--------------------------------------------------|
| Tap (<10px движения)            | Toggle on/off                                    |
| Drag вверх/вниз                 | Live `onChange`, fill следует за пальцем         |
| Drag отпустить                  | `onChangeEnd`, snap к ближайшему step            |
| Long-press (опционально)        | Открыть детали (color, scene, schedule)          |

Логика «tap или drag»:
- Если за первые ~120ms движение < `tapToToggleThreshold` (default 10px)
  и пользователь отпустил → tap, переключаем on/off
- Если движение >= threshold → начинаем drag-режим, отключаем tap

## Accessibility

- `role="group"` на карточке + два дочерних control: hidden range
  и hidden switch для SR
- При drag — `aria-live="polite"` объявляет процент
- Keyboard: Space/Enter = toggle, ↑/↓ = ±5%, Shift+↑/↓ = ±25%
- Минимум 80×80 touch-target

## Цветовые стили

### cinematic-dark (canonical)
Off-fill: `linear-gradient(180deg, rgba(30,24,18,0.6),
rgba(18,14,10,0.4))`. On-fill снизу: `linear-gradient(180deg,
rgba(var(--cr) var(--cg) var(--cb) / 0.95) 0%, rgba(var(--dr) var(--dg)
var(--db) / 0.85) 100%)`. Wave-эффект на границе fill (SVG path с
`animate`), как в Toggle.LiquidFill. Лейбл темнеет когда fill подходит.

### editorial-dark
Без wave, плоский золотой fill. Тонкий outline сверху fill для
читабельности.

### neo-brutalism
Карточка с offset shadow. Fill: жёлтый flat снизу. Граница fill —
жирная чёрная горизонталь 3px. Никаких градиентов.

### material
Tonal-surface при off, primary-fill при on. Ripple от точки тапа на
toggle. Fill в drag-режиме без bounce.

### cupertino
Frosted glass карточка. Fill — accent-blue с прозрачностью. Iconography
SF Symbols.

### ivory-day
Молочная карточка off, fill — теплый gradient. Label темнее, чтобы
читался на light fill.

## Технические заметки

- Pointer events на корне карточки. `touch-action: none` на time drag,
  иначе iOS prevent scroll
- `clip-path` или `transform: translateY()` на абсолютном `.fill` слое.
  `transform` производительнее, но требует `overflow: hidden` на корне
- Threshold (10px) определяется через `Math.hypot(dx, dy)` от
  `pointerdown` точки
- Если `on === false`, drag не делает fill видимым — он
  «накапливается» в state, но визуально появляется только при toggle
  on (опциональный режим `dragImpliesOn=true` сразу включает на drag)
- При `prefers-reduced-motion` wave-анимация фильтруется до статики
