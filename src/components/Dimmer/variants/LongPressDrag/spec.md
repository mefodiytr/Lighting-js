# LongPressDrag

## Суть

Тап = toggle on/off. Удержание + drag = регулировка яркости БЕЗ
видимого слайдера на карточке. Паттерн Hue Bluetooth app: hold на
лампе, drag вверх-вниз — изменяет dim. Освобождает визуал, требует
обучения.

## Когда выбирать

- Минималистичный premium home-screen, где не должно быть
  «технических» элементов
- Power-user-режим: пользователь знает, что hold+drag работает
- Когда основной UX — это `LampButton` или `CardToggle` без
  отдельного диммера

## Когда не выбирать

- Дефолт для новых пользователей — никто не догадается
- Должен быть discoverable hint (см. ниже)
- В сложных layout'ах со свайпами — конфликт жестов

## API

```ts
interface LongPressDragProps {
  value?: number;
  defaultValue?: number;
  onChange?: (next: number) => void;
  onChangeEnd?: (next: number) => void;
  on?: boolean;                     // controlled toggle
  onToggle?: (next: boolean) => void;
  disabled?: boolean;
  label: ReactNode;
  holdMs?: number;                  // default 300ms — переход tap→drag
  feedbackMode?: 'overlay' | 'card-fill' | 'halo';
  hintAfterMs?: number;             // показать подсказку «hold to dim»
  haptics?: 'off' | 'pop' | 'tick';
  children: ReactNode;              // обёртывает любую карточку/виджет
}
```

`feedbackMode`:
- `overlay` — поверх ребёнка появляется полупрозрачный градиент со
  значением сверху
- `card-fill` — карточка-ребёнок заполняется (как `DragByCard`)
- `halo` — наружный glow меняет интенсивность

## Жесты и состояния

| Жест                            | Эффект                                          |
|---------------------------------|-------------------------------------------------|
| Tap (<holdMs)                   | Toggle on/off                                   |
| Hold ≥ holdMs (без движения)    | Включить drag-режим: haptic pop, hint появляется|
| Drag в hold-режиме              | Live `onChange`                                 |
| Release из drag-режима          | `onChangeEnd`                                   |

State machine:
- `idle` → `pressing` (pointerdown) → `tap` (release <holdMs) или
  `dragging` (≥holdMs или move >12px) → `idle` (release)

## Accessibility

- На SR — поведение неочевидно. Решение: рядом всегда есть
  hidden `<input type="range">` с такими же `value`/`min`/`max`
- `aria-label`: «Удержание + свайп для регулировки яркости»
- При hold-режиме — `aria-live` объявляет переход
- Keyboard: Space = toggle, ↑/↓ = dim (без hold-цикла)

## Цветовые стили

### cinematic-dark
Hold-режим: `feedbackMode='halo'` — внешний glow `box-shadow: 0 0
40px rgba(var(--cr) var(--cg) var(--cb) / 0.6)` пропорционален value.
Hint текст внизу: «HOLD TO DIM» mono `#5a4a36`.

### editorial-dark
Halo тоньше и золотой. Hint типографичнее: serif italic.

### neo-brutalism
Hold-режим: overlay panel внизу карточки с чёрным border и
цифрой value. Никакого halo.

### material
M3 long-press с ripple-expansion. Sheet снизу выезжает с slider'ом
(альтернативная UX — раз hold = sheet, drag по slider'у).

### cupertino
iOS-style: при hold карточка увеличивается на 1.05, появляется
HUD-overlay с текущим значением (как volume HUD).

### ivory-day
Halo тёплый плотный. Hint — `#8a7a64`.

## Технические заметки

- Реализуется как `<LongPressDragWrapper>` HOC/render-prop, обёртка
  вокруг любого ребёнка
- Detect hold через `setTimeout(holdMs)` + проверка движения за это
  время (`Math.hypot < 12px`)
- При вступлении в drag-mode — `navigator.vibrate(20)` для тактильного
  подтверждения
- Hint показывается ТОЛЬКО после `hintAfterMs` бесплодных tap-сессий
  (LocalStorage flag), чтобы не мешать опытным пользователям
- При `prefers-reduced-motion` halo-pulse статичен
