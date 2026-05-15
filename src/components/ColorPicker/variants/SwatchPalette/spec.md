# SwatchPalette

## Суть

Сетка пресет-цветов (или горизонтальная карусель chip'ов). Нет
свободного выбора — только из заданного набора. Самый простой
UX, идеален для семейного жилья и accessibility. Может работать
как **AmbientToneBar** — sticky-header, переключающий accent для
всего экрана (см. premium themed-edition пример).

## Когда выбирать

- Семейное жильё, пожилые, дети
- Быстрый ambient tone-picker для всей панели (Apple Home presets)
- Когда дизайнер заранее знает «вот эти 8 цветов — все, что нужно»

## Когда не выбирать

- Когда пользователь хочет произвольный оттенок → `HsvWheel`
- Эксперт-режим → `RgbSliders`

## API

```ts
import type { AccentPreset } from '@/theme/accents';

interface SwatchPaletteProps {
  presets: readonly AccentPreset[];   // обычно ACCENT_PRESETS
  activeId?: string;
  onChange?: (preset: AccentPreset) => void;
  layout?: 'grid' | 'carousel' | 'sticky-bar';
  cols?: number;                      // для grid, default 4
  showLabels?: boolean;               // показывать имя/CCT
  disabled?: boolean;
  label?: ReactNode;
}
```

`layout`:
- `grid` — 4×N сетка крупных swatch'ей
- `carousel` — горизонтальная прокрутка small chip'ов
- `sticky-bar` — sticky header сверху страницы (см. AmbientTone из
  premium themed-edition)

## Жесты и состояния

| Жест                | Эффект                                            |
|---------------------|---------------------------------------------------|
| Tap по swatch'у     | Активация preset, color tween                     |
| Scroll horizontal   | В carousel/sticky-bar                             |
| Keyboard ←→         | Перемещение фокуса между swatch'ами               |
| Enter/Space         | Активация                                         |

## Accessibility

- `role="radiogroup"`, каждый swatch — `role="radio"` +
  `aria-checked`, `aria-label="имя preset'а subtitle"`
- Touch-target ≥ 44×44 для каждого chip
- При активации — color name (например «Crimson») объявляется через
  `aria-live`

## Цветовые стили

### cinematic-dark (sticky-bar canonical)
Bar: `position: sticky; top: 0`, фон `rgba(10, 8, 6, 0.78)` с
`backdrop-blur(24px)`, тонкий бронзовый border снизу. Chip — circle
36px, transparent border. Active chip: scale 1.18, bronze border
2px, glow swatch с `box-shadow: 0 0 14px currentColor, 0 0 24px
currentColor`. Имя preset'а слева в Fraunces serif, subtitle italic
mono.

### editorial-dark
Bar тоньше, без blur. Chip — square 32px, минимум glow.

### neo-brutalism
Bar белый с чёрным border-bottom 3px. Chip — square 40px с чёрным
border. Active: чёрная толстая рамка + offset shadow.

### material
Bar M3 surface. Chip — M3 FilterChip с selected-state. Ripple.

### cupertino
Bar frosted-glass (наследуется из cinematic-dark fix). Chip — iOS
segmented selection.

### ivory-day
Bar молочный. Chip — round 36px, active имеет тёплый glow.

## Технические заметки

- `sticky-bar` использует `accentToCssVars(activeId)` на корне
  страницы → все виджеты ниже автоматически перекрашиваются
- `grid` layout — `display: grid; grid-template-columns: repeat
  (var(--cols), 1fr)`
- При смене preset'а — добавить класс `accent-animated` ко всем
  потомкам страницы для smooth tween (см. accents.css)
- LocalStorage: запоминаем последний выбранный preset для каждого
  потребителя (room/device id)
