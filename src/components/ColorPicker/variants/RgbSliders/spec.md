# RgbSliders

## Суть

Три горизонтальных слайдера: R, G, B по 0–255 каждый. Самый
утилитарный и прямой picker. Точный, но «нечеловеческий» — никто
не думает в RGB.

## Когда выбирать

- Эксперт-режим, инсталлятор, инженер
- Калибровка RGB-канала: «строго #FF8800»
- Совместимость с DMX-консолями (мысленно мапятся на RGB-channels)

## Когда не выбирать

- Конечный пользователь — никогда
- Premium-эстетика

## API

```ts
interface RgbSlidersProps {
  value?: { r: number; g: number; b: number };
  defaultValue?: { r: number; g: number; b: number };
  onChange?: (next: { r: number; g: number; b: number }) => void;
  onChangeEnd?: (next: { r: number; g: number; b: number }) => void;
  step?: number;             // default 1
  disabled?: boolean;
  label: ReactNode;
  hexInput?: boolean;        // показывать дополнительное поле hex
  format?: '8bit' | 'percent';   // отображать 0..255 или 0..100%
}
```

## Жесты и состояния

| Жест                  | Эффект                                |
|-----------------------|---------------------------------------|
| Drag любого слайдера  | Изменение одного канала, live         |
| Numeric input         | Ручное число                          |
| Hex input             | Парсит #RRGGBB → три канала           |
| Keyboard ←→ в slider  | -step/+step                           |

## Accessibility

- 3 `<input type="range">` с `role="slider"`, `aria-label` для
  каждого канала
- Hex-input — `<input type="text" pattern="#[0-9A-Fa-f]{6}">` с
  validation
- Color preview swatch — `aria-hidden="true"` (декоративно)

## Цветовые стили

Контрол утилитарный, тема влияет на shrift и layout. Track слайдера —
gradient в соответствующем канале (red track = от black к pure red и т.д.).

### cinematic-dark
Контейнер карточкой `--color-bg-card-from/to`. Labels mono dim
(`R`, `G`, `B`). Цифровые поля Fraunces serif. Hex-input в bottom.

### editorial-dark
Минимальный layout, цифры крупным serif. Hex выделен box.

### neo-brutalism
Каждый канал — отдельная panel с border 3px. Цифры — big mono.

### material
M3 sliders, labels на каждом, numeric input — M3 TextField.

### cupertino
iOS-style sliders в form-row. SF Pro labels.

### ivory-day
Светлый layout с тёплыми labels.

## Технические заметки

- Каждый track — gradient:
  - R: `linear-gradient(90deg, rgb(0,g,b), rgb(255,g,b))` — динамически
    пересчитывается при изменении других каналов
  - G: аналогично
  - B: аналогично
- Hex parsing: `parseInt(hex.slice(1,3), 16)` и т.д.
- Hex validation: regex `/^#[0-9A-Fa-f]{6}$/`
- При `format='percent'` — 0..100% mapping в обе стороны
