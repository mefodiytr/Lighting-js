# ArcSunMoon

## Суть

Полукруговая дуга от ☀ (солнце слева/снизу = тёплый) до ☾ (луна
справа/сверху = холодный). Естественная метафора смены света в
течение дня. Выглядит как термостат Nest или Apple Weather widget.

## Когда выбирать

- Premium-объекты, эстетика «приборной панели»
- Когда хочется передать эмоцию «время суток», не цифры
- Совмещение с `CircadianCurve` для автоматического режима

## Когда не выбирать

- Когда пользователю важна точная Kelvin-цифра → `LinearKelvin`
- B2B / инженер
- Малые экраны (<360px)

## API

```ts
interface ArcSunMoonProps {
  value?: number;                  // Kelvin, 2200..6500
  defaultValue?: number;
  onChange?: (next: number) => void;
  onChangeEnd?: (next: number) => void;
  min?: number;
  max?: number;
  size?: number;                   // px, default 220
  arc?: number;                    // deg, default 180
  showIcons?: boolean;             // sun/moon в концах
  showValue?: boolean;             // K в центре дуги
  disabled?: boolean;
  label: ReactNode;
}
```

## Жесты и состояния

| Жест                     | Эффект                                     |
|--------------------------|--------------------------------------------|
| Drag thumb вдоль дуги    | Update CCT                                 |
| Tap по дуге              | Thumb прыгает                              |
| Tap по ☀ icon            | Snap к min (тёплый)                        |
| Tap по ☾ icon            | Snap к max (холодный)                      |
| Keyboard ←→              | -step/+step                                |

## Accessibility

- `role="slider"`, `aria-valuemin/max/now`
- `aria-orientation` — n/a для arc, но `aria-valuetext` решает
- Icon-buttons имеют свой `aria-label` («Тёплый 2200K», «Холодный 6500K»)
- Touch-area через невидимый расширенный path

## Цветовые стили

Дуга-track — Planckian gradient (общий, инвариантен к теме).
Тема влияет на icons, thumb, value-display, frame.

### cinematic-dark
Track stroke 6px с linear-gradient вдоль дуги (через SVG-mask:
clipPath по path, fill — gradient). Иконки sun/moon — мелкие SVG
по краям, бронзовые при активной близости. Thumb — бронза 24px с
fill в текущем CCT. Value в центре: Fraunces 22pt + mono подпись K.

### editorial-dark
Тонкая дуга 4px. Иконки минималистичные line-art gold. Thumb dot 16px.

### neo-brutalism — ◐ адаптация
Дуга реализована как ломаная (8–10 прямых сегментов). Track —
чёрный 4px, fill — чёрный 4px поверх. Иконки — quadratic shape.
Без gradient в track, потому что brutalism не любит плавности.

### material
M3-elevated arc. Иконки Material Symbols (`wb_sunny`, `nightlight`).
Thumb primary с halo.

### cupertino
iOS-style тонкая arc. Иконки SF Symbols. Thumb 28px белый.

### ivory-day
Тёплый frame, иконки тёмная бронза. Value crispy serif.

## Технические заметки

- SVG `<path>` с arc-command. Track-fill — `<linearGradient>` через
  SVG-defs, маппится на длину дуги (приблизительно, не строго по
  Planckian locus — оптика приемлемая для UI)
- Thumb-fill: вычисляется через `kelvinToRgb(value)` → `fill="rgb(...)"`
- Геометрия: точка thumb через angle = startAngle + (value-min)/(max-min) * arc;
  `cx = center + r*cos(rad)`, `cy = center + r*sin(rad)`
- Sun/Moon icons — отдельные `<g>` с opacity, фокусируются на
  `aria-current` для SR
