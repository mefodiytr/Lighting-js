# PresetChips

## Суть

Набор кнопок-чипсов с осмысленными CCT-значениями: «Свеча 2200K»,
«Тёплый 2700K», «Нейтральный 4000K», «Дневной 5500K», «Холодный
6500K». Тап = моментальный CCT с smooth-transition. Самый
доступный CCT-виджет.

## Когда выбирать

- Семейное жильё, пожилые, дети
- Когда не нужен любой K — только 4–5 опорных
- Дополнение к `LinearKelvin` или `ArcSunMoon` (override-chips)

## Когда не выбирать

- Эксперт хочет точную K → `NumericKelvin`
- Premium-эстетика — слишком утилитарно (хотя в editorial-dark
  смотрится дорого с serif-типографикой)

## API

```ts
interface CctPresetItem {
  id: string;
  label: string;             // «Свеча»
  subtitle?: string;         // «2200K»
  kelvin: number;
}

interface PresetChipsProps {
  presets?: CctPresetItem[];                  // default — стандартные 5
  value?: number;                              // current K
  onChange?: (next: number) => void;
  layout?: 'horizontal' | 'grid';
  disabled?: boolean;
  label: ReactNode;
}
```

Default presets:
```ts
[
  { id: 'candle',  label: 'Свеча',       subtitle: '2200K', kelvin: 2200 },
  { id: 'warm',    label: 'Тёплый',      subtitle: '2700K', kelvin: 2700 },
  { id: 'neutral', label: 'Нейтральный', subtitle: '4000K', kelvin: 4000 },
  { id: 'day',     label: 'Дневной',     subtitle: '5500K', kelvin: 5500 },
  { id: 'cool',    label: 'Холодный',    subtitle: '6500K', kelvin: 6500 },
]
```

## Жесты и состояния

| Жест                | Эффект                                     |
|---------------------|--------------------------------------------|
| Tap chip            | CCT прыгает (smooth transition 700ms)      |
| Keyboard ←→         | Перемещение фокуса между chip'ами          |
| Enter/Space         | Активация                                  |

| State    | Visual                                            |
|----------|---------------------------------------------------|
| inactive | Outline, swatch внутри                            |
| active   | Filled tonal, label контрастен                    |

## Accessibility

- `role="radiogroup"`, каждый chip — `role="radio"` + `aria-checked`
- Touch-target ≥ 44×44 (chip padding адаптируется)
- При активации — `aria-live` объявляет название preset'а

## Цветовые стили

Swatch внутри chip'а — `kelvinToRgb(preset.kelvin)` —
инвариантно. Тема влияет на frame и label.

### cinematic-dark
Chip: rounded 999px capsule, фон `rgba(30,24,18,0.5)`, бронзовый
border thin. Active: бронзовый fill, label `--color-text-primary`,
inner glow. Swatch 12px circle слева внутри chip'а.

### editorial-dark
Chip square, минимальный padding, gold accent для active. Subtitle
italic mono.

### neo-brutalism
Chip square 88×56 с чёрным 3px border, offset shadow. Active: chip
залит swatch-цветом, label чёрный. Без скруглений.

### material
M3 FilterChip с selected-state и checkmark slot.

### cupertino
iOS segmented control: pill-group с rounded background и selected
indicator (slide-anim между chip'ами).

### ivory-day
Светлый chip с тёплым border. Active — тёплое тонирование.

## Технические заметки

- Layout `horizontal` — `display: flex; overflow-x: auto; scroll-snap`
- Layout `grid` — `display: grid; grid-template-columns: repeat(auto-fit,
  minmax(80px, 1fr))`
- Smooth K-transition реализуется через `accentToCssVars` на корне
  при изменении `value` — accent-vars (--cr/--cg/--cb) интерполируются
  через `@property`
- Сам chip остаётся в текущем состоянии — анимация только на
  «фоне лампы»
