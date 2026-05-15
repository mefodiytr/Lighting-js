# LinearKelvin

## Суть

Горизонтальный slider с фоновым градиентом по Planckian locus
(2200K оранжево-тёплый → 6500K холодно-голубой). Самый прямой
паттерн «тёплый ↔ холодный белый» — пользователь сразу видит,
куда тянуть.

## Когда выбирать

- Дефолт для CCT-управления премиум и mass-market
- Когда нужно показать всю шкалу одним взглядом
- Совмещается с `DoubleTapNeutral` overlay для быстрого reset

## Когда не выбирать

- Когда CCT не редактируется (показать только → `CircadianCurve`)
- Семейное жильё — лучше пресет-чипсы

## API

```ts
interface LinearKelvinProps {
  value?: number;                // Kelvin, 2200..6500
  defaultValue?: number;
  onChange?: (next: number) => void;
  onChangeEnd?: (next: number) => void;
  min?: number;                  // default 2200
  max?: number;                  // default 6500
  step?: number;                 // default 50
  disabled?: boolean;
  label: ReactNode;
  showValue?: boolean;
  doubleTapTo?: number;          // K возврата по double-tap, default 4000
  haptics?: 'off' | 'tick';
}
```

## Жесты и состояния

| Жест                  | Эффект                                       |
|-----------------------|----------------------------------------------|
| Drag thumb            | Live update K, цвет thumb меняется           |
| Tap по track          | Thumb прыгает                                |
| Double-tap            | Reset к `doubleTapTo` (например 4000K)       |
| Keyboard ←→           | -step/+step (50K)                            |

## Accessibility

- `role="slider"`, `aria-valuemin/max/now`
- `aria-valuetext`: «3000 Кельвинов, тёплый белый»
- Touch-target ≥ 44px

## Цветовые стили

Фон track — статический Planckian gradient (одинаковый во всех
темах, потому что физическое представление CCT). Тема влияет на
frame, thumb, label.

### cinematic-dark
Track 240×40px скруглён 999px с фоном:
`linear-gradient(90deg, rgb(255, 180, 90) 0%, rgb(255, 200, 130) 25%,
rgb(255, 230, 180) 50%, rgb(230, 240, 255) 75%, rgb(180, 200, 255) 100%)`.
Тонкий бронзовый border. Thumb — белый круг 24px, fill = текущий
CCT-цвет (через `kelvinToRgb(value)`), с outer glow в matching
тоне. Value-display — справа, Fraunces 14pt.

### editorial-dark
Тонкая track-полоса 12px. Thumb — gold dot 16px. Value italic serif.

### neo-brutalism
Track square с чёрным 3px border. Thumb — чёрный square 24×24.
Value — большой mono `3000K` сбоку.

### material
M3 slider track 16px, thumb 22px halo. Value Roboto.

### cupertino
iOS-style track 8px, thumb 28px белый.

### ivory-day
Track с тёплым frame. Thumb — белый круг с тёплой тенью.

## Технические заметки

- `kelvinToRgb()` из `src/theme/accents.ts` — для вычисления цвета
  thumb и оптического preview
- Gradient track — статический CSS (5–7 stops по Planckian locus),
  не пересчитывается на каждом рендере
- Double-tap detection: `lastTapTime` < 300ms между tap'ами
- Haptics 'tick' при пересечении 2700/3000/4000/5000/5500K
