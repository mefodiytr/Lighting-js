# StepButtons

## Суть

Две крупные кнопки «−» и «+», между ними цифровой индикатор
яркости. Самый доступный вариант: пожилые, тремор, accessibility.
Не требует drag-жеста, не имеет precision-проблем.

## Когда выбирать

- Семейное жильё, пожилые пользователи
- Когда жесты ненадёжны (перчатки, мокрые руки)
- Аварийная доступность: в любой теме рабочая base-line
- Список устройств для быстрой корректировки на ±10/25%

## Когда не выбирать

- Премиум-эстетика — слишком утилитарно
- Когда нужно сразу установить 73% — много тапов

## API

```ts
interface StepButtonsProps {
  value?: number;
  defaultValue?: number;
  onChange?: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;           // default 10
  fineStep?: number;       // default 1 — для long-press
  disabled?: boolean;
  label: ReactNode;
  layout?: 'horizontal' | 'vertical';  // default horizontal
  showValue?: boolean;     // default true
  haptics?: 'off' | 'tick';
}
```

## Жесты и состояния

| Жест                          | Эффект                                        |
|-------------------------------|-----------------------------------------------|
| Tap «−»                       | -step                                         |
| Tap «+»                       | +step                                         |
| Long-press «−»/«+»            | Auto-repeat с ускорением (300ms → 100ms)      |
| Long-press 1500ms+            | Переход на `fineStep` (медленнее, точнее)     |
| Keyboard +/−                  | +step / -step                                 |

## Accessibility

- Два `<button>` с явными `aria-label` («Уменьшить яркость»,
  «Увеличить яркость»)
- Текущее value — `<output role="status" aria-live="polite">`
- Touch-target ≥ 48×48 (M3) или 44×44 (iOS)
- При достижении min/max — соответствующая кнопка `disabled` +
  aria-disabled, visual feedback

## Цветовые стили

### cinematic-dark
Кнопки: круг 56px, `background: linear-gradient(180deg, rgba(60,
45, 30, 0.3), rgba(30, 24, 18, 0.6))`, border `rgba(120, 95, 65,
0.3)`. Active при press: `rgba(var(--cr) var(--cg) var(--cb) / 0.15)`
fill. Value — Fraunces 32pt по центру, мягкий glow.

### editorial-dark
Кнопки square 48×48 с тонким border, без gradient. Value — крупный
serif 36pt.

### neo-brutalism
Кнопки чёрные square 64×64 с белым «+»/«−». Offset shadow `6px 6px
0 0 #000`. On press → shadow исчезает. Value: огромный mono 48pt.

### material
M3 FilledIconButton 56px. Ripple от тапа. Value — Roboto medium 24pt
в центре.

### cupertino
iOS «-/+» в pill-control (как volume в media). Value — SF Pro 22pt.

### ivory-day
Кнопки светло-бежевые с тёплой тенью. Press — тёмная заливка.

## Технические заметки

- Auto-repeat: `setTimeout(stepFn, delay)` где delay уменьшается
  каждые 200ms (300 → 250 → 200 → 150 → 100ms)
- `pointerdown` запускает первый step + setTimeout цикл,
  `pointerup`/`pointerleave`/`pointercancel` отменяют
- Haptics 'tick' на каждом шаге
- Disabled-кнопка не получает `pointerdown` события (CSS
  `pointer-events: none`)
- При `prefers-reduced-motion` press-анимация (scale 0.96) убирается
