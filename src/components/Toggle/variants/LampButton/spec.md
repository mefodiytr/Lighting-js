# LampButton

## Суть

Большая круглая кнопка с иконкой лампочки в центре. При
включении физически «загорается»: цвет иконки меняется, вокруг
появляется тёплый glow, дышащая halo-анимация. Паттерн Philips
Hue / Yeelight.

## Когда выбирать

- Карточка одного устройства, центральный hero-control
- Эмоциональный, узнаваемый — отлично для домашнего экрана
- Когда нужно метафорически передать «свет включается»

## Когда не выбирать

- Списки и решётки — занимает много места
- B2B / brutalism — метафора слишком «домашняя»
- Если виджет должен показывать ещё и яркость — нужен `RadialKnob`

## API

```ts
interface LampButtonProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  label: ReactNode;
  description?: ReactNode;
  bulbStyle?: 'edison' | 'globe' | 'pendant';
  glowColor?: string;                // переопределить тёплый glow (для RGB ламп)
  haptics?: boolean;
}
```

`bulbStyle` влияет на форму иконки (Edison — лампа накаливания
из showcase v2, globe — шар, pendant — подвесной).

## Жесты и состояния

| Жест                 | Эффект                                                    |
|----------------------|-----------------------------------------------------------|
| Tap                  | Переключение, halo появляется/уходит, breathe анимация    |
| Keyboard Space/Enter | Переключение                                              |

| State    | Visual                                                |
|----------|-------------------------------------------------------|
| off      | Холодная иконка, без glow, стекло тёмное              |
| on       | Тёплая иконка, наружное halo, breathe 4s              |
| pressing | scale(0.96)                                           |
| disabled | Opacity 0.4, нет glow                                 |

## Accessibility

- `role="switch"`, `aria-checked`, label обязателен
- При on — `aria-description` объявляет состояние свечения
- Halo-анимация (breathe) отключается при `prefers-reduced-motion` —
  оставляем статическое свечение
- Контраст иконки в обоих состояниях ≥ 4.5:1 на фоне

## Цветовые стили

### cinematic-dark (canonical)
Off: радиальный градиент тёмного стекла `#3a2e22 → #1a1410`,
filament — `#2a2018`. On: glass-fill `#fff4dc → #ffaa50`, filament
с `drop-shadow` 0 0 8px `#ff8c42`, halo `radial-gradient
(rgba(255,180,90,0.6) → transparent)` breathe 4s.

### editorial-dark
Меньше «киношности»: glass-fill глуше (#f0d8a0), halo тоньше и
короче (без breathe или 6s медленный), filament — голд без drop-shadow.

### neo-brutalism — ✕ НЕ РЕАЛИЗУЕТСЯ
Метафора реалистичной лампы конфликтует со стилем. Если нужен
кнопочный эквивалент — использовать `CardToggle` в brutalism-теме
с иконкой лампочки внутри (плоской, без glow).

### material
Lamp-icon из Material Symbols (`lightbulb`). Off: outlined, muted.
On: filled, accent-purple, ripple от тапа. Glow заменён на M3
tonal-surface переход.

### cupertino
SF Symbol `lightbulb.fill`. Off: gray-2. On: yellow (`#ffcc00` —
системный) с лёгким радиальным свечением. Никакой breathe — против
HIG.

### ivory-day
Halo бледнее, но виден на светлом фоне. Glass-fill — `#e8c889`.
Иконка тёплая.

## Технические заметки

- SVG лампа — inline, чтобы менять `fill`/`stroke` через CSS-переменные
- Halo — отдельный `<div>` с `filter: blur(20px)` и `radial-gradient`
- Breathe — `@keyframes` на `opacity` и `transform: scale()`,
  длительность 4s, `prefers-reduced-motion` глушит
- Edison-filament — `<path>` со сложной формой, при on применяется
  `filter: drop-shadow()` стэк (см. v2 в showcase)
- Для RGB-ламп — `glowColor` подменяет переменные
  `--color-glow-warm-rgb` локально через `style={{ ... }}`
