# IosSwitch

## Суть

Классический iOS/Cupertino-switch: горизонтальная капсула,
скользящий круглый thumb, цветовая смена track при включении.
Привычен миллиардам пользователей, бесконфликтен, но
маленький tap-target (~50×30px) — на больших экранах
проигрывает `CardToggle`.

## Когда выбирать

- В плотных списках устройств, где важна высокая плотность
- Когда дизайн-язык продукта — Cupertino или нейтральный
- Для второстепенных опций (не основная сцена)

## Когда не выбирать

- На главной странице сцен (мал, не премиум)
- Для пожилых пользователей и людей с тремором (узкий target)
- Когда нужен «вау-эффект» — это самый сдержанный вариант

## API

```ts
interface IosSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  label: ReactNode;
  description?: ReactNode;
  size?: 'sm' | 'md' | 'lg';        // sm 44px, md 52px, lg 64px width
  haptics?: boolean;
}
```

## Жесты и состояния

| Жест                 | Эффект                          |
|----------------------|---------------------------------|
| Tap                  | Переключение, spring-анимация   |
| Drag thumb по track  | Live-drag, snap к ближайшему    |
| Keyboard Space/Enter | Переключение                    |
| Long-press           | Игнорируется (для long-press → отдельный вариант) |

| State    | Visual                                       |
|----------|----------------------------------------------|
| off      | Track: muted; thumb: справа налево, тень     |
| on       | Track: accent; thumb: справа, accent-glow    |
| disabled | Opacity 0.4, нет курсора                     |
| focus    | `outline` через `--ring-*`                   |

## Accessibility

- `role="switch"`, `aria-checked`, `aria-labelledby`
- Touch-target расширяется через invisible padding до 44×44px
- Анимация thumb отключается при `prefers-reduced-motion`
- Контраст track-off / background ≥ 3:1 — проверять в каждой теме

## Цветовые стили

### cinematic-dark
Track-off: `linear-gradient(180deg, #0a0806, #1c1612)` с
`box-shadow: inset 0 2px 4px rgba(0,0,0,0.6)`. Track-on: тёплая
бронза `linear-gradient(180deg, #3a2814, #5e3f1f)`, наружный glow
`--shadow-glow-on`. Thumb: радиальный градиент бронза → светлая
кость, тень внутрь.

### editorial-dark
Track как cinematic-dark, но без inner-shadow drama; thumb —
гладкий gold без highlight. Меньше gloss.

### neo-brutalism
Track — чёрная рамка 3px на белом, без скруглений. Thumb — чёрный
квадрат, 6px offset shadow. On-state: track заливается жёлтым
`#ffd400`, thumb остаётся чёрным. Никаких transitions кроме
мгновенного `100ms`.

### material
Стандартный M3-switch: track 52×32px, thumb 24px (off) → 28px (on)
с увеличением. State-layer ripple вокруг thumb при tap. On: primary
purple. Outlined track-border при off.

### cupertino
Каноничный iOS-switch. Track-off — `--color-state-off` (system
gray 16% alpha). Track-on — `--color-state-on` (system green).
Thumb 28px, белый, с iOS soft shadow.

### ivory-day
Track-off: `#e8d8c4` с лёгкой inset-shadow. Track-on: бронза
`#b8895a`. Thumb: белый с тёплой тенью.

## Технические заметки

- Реализуется как `<button role="switch">` (НЕ checkbox) —
  switch имеет лучшую SR-поддержку
- Drag-жест: `pointerdown → pointermove`, через CSS-переменную
  `--thumb-x` (translate), snap по `pointerup`
- Hit-area: `padding: 14px` + `margin: -14px` для tap-extension
  без визуального изменения
- На iOS PWA — отключить `touchstart` zoom через `touch-action: manipulation`
