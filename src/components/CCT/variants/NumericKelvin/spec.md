# NumericKelvin

## Суть

Чистый числовой ввод CCT в Кельвинах (например `3500K`). Без
slider'а, без gradient'а — только цифры. Эксперт-режим для
инсталлятора, который точно знает, что нужно «строго 3000K».

## Когда выбирать

- Инсталлятор, инженер, B2B
- Калибровка устройства, валидация
- Settings-страница «дефолтная CCT при включении»

## Когда не выбирать

- Конечный пользователь — никогда
- Premium home-screen

## API

```ts
interface NumericKelvinProps {
  value?: number;
  defaultValue?: number;
  onChange?: (next: number) => void;
  onChangeEnd?: (next: number) => void;
  min?: number;                  // default 1800
  max?: number;                  // default 8000
  step?: number;                 // default 100
  disabled?: boolean;
  label: ReactNode;
  showStepButtons?: boolean;     // ± на боках, default true
  unit?: 'K' | 'mired';          // отображать в Кельвинах или mired
}
```

## Жесты и состояния

| Жест                  | Эффект                                          |
|-----------------------|-------------------------------------------------|
| Type в input          | Меняется value (валидация на blur)              |
| Tap ±                 | -step / +step                                   |
| Long-press ±          | Auto-repeat (как StepButtons)                   |
| Keyboard ↑↓ в input   | -step / +step                                   |
| Submit (Enter)        | onChangeEnd, blur                               |

## Accessibility

- `<input type="number">` с `min`/`max`/`step`
- `<label>` обязателен
- ± кнопки — отдельные `<button aria-label>`
- Контраст input border ≥ 3:1 во всех темах
- При invalid value — `aria-invalid="true"` + error message

## Цветовые стили

### cinematic-dark
Input — Fraunces 32pt, тёплый цвет (`--color-text-secondary`).
Unit suffix («K») mono 14pt справа dim. ± кнопки 40px round с
бронзовым outline. Контейнер карточкой.

### editorial-dark
Input — крупный serif italic. Подпись «Kelvin» под input. ± —
минималистичные.

### neo-brutalism
Input — большой mono 36pt чёрный на белом, рамка 3px. ± кнопки
square 48×48 чёрные.

### material
M3 OutlinedTextField + IconButton'ы. Roboto numeric.

### cupertino
iOS-style numeric pad на mobile (auto), inline stepper buttons.

### ivory-day
Молочный input с тёплым border, тёмный текст. ± светлые с тёплой
тенью.

## Технические заметки

- Validation:
  - Clamp при `onChange`: `Math.min(max, Math.max(min, value))`
  - При blur — round к ближайшему `step`
  - При invalid (NaN или вне диапазона) — отображать предыдущий
    valid и `aria-invalid`
- Mired conversion (опционально): `mired = 1_000_000 / kelvin`
- На mobile: `inputMode="numeric"` для нативной numpad клавиатуры
- На desktop: focus → select-all для лёгкого ввода
