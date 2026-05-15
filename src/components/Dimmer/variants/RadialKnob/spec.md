# RadialKnob

## Суть

Круглый диск, который вращается жестом пальца по дуге. Тактильно
приятен (аналоговый thermostat-style), но требует обучения и
точности на маленьком экране.

## Когда выбирать

- Премиум-объекты, аналоговая эстетика (brass-knob из showcase v4)
- Multi-step режим: каждые 30° = один step (haptics на тиках)
- Hero-control в комнате с одной лампой

## Когда не выбирать

- Малые экраны (<360px) — knob занимает много места
- Когда нужна точность (90 vs 92%) — лучше slider
- Семейное жильё, пожилые — жест неинтуитивен

## API

```ts
interface RadialKnobProps {
  value?: number;
  defaultValue?: number;
  onChange?: (next: number) => void;
  onChangeEnd?: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;            // default 5 — крупные шаги для тактильности
  range?: [number, number]; // углы дуги в deg, default [-135, 135]
  disabled?: boolean;
  label: ReactNode;
  size?: 'sm' | 'md' | 'lg';   // 100/140/180px
  knurled?: boolean;        // имитация насечки
  haptics?: 'off' | 'tick';
}
```

## Жесты и состояния

| Жест                  | Эффект                                          |
|-----------------------|-------------------------------------------------|
| Drag по окружности    | Вращение, value по углу                         |
| Drag за пределами     | Tangent angle расчёт, продолжается              |
| Vertical drag         | Альтернативный mode (опция `verticalDrag=true`) |
| Double-tap            | Reset к defaultValue                            |
| Keyboard ←/→          | -step/+step                                     |

## Accessibility

- `role="slider"`, `aria-valuemin/max/now`, `aria-orientation="horizontal"`
  (хотя physically rotary — A11y лучше «slider»)
- `aria-valuetext` с понятным значением («50 процентов»)
- Минимум 88×88 размер на mobile для доступности

## Цветовые стили

### cinematic-dark (canonical)
Base: радиальный inset `#0a0806 → #1a1410`. Knob: `conic-gradient
(from 45deg, #8a6d3f, #d4a76a, #b8895a, #5e4528, #8a6d3f)` — латунь.
Knurled rim — `repeating-conic-gradient` через mask. Indicator —
тёмная риска. On-glow: `rgba(var(--cr) var(--cg) var(--cb) / 0.3)`
вокруг base.

### editorial-dark
Гладкий gold knob без знурлинга. Indicator — золотая точка.
Glow слабее.

### neo-brutalism — ◐ адаптация
Knob: чёрный круг с белой точкой-indicator. Без bevel/conic. On-glow
заменён на жёлтый ring 3px вокруг.

### material — ✕ НЕ РЕАЛИЗУЕТСЯ
M3 не имеет паттерна rotary knob. Если нужен — fallback на
`HorizontalSlider`.

### cupertino — ✕ НЕ РЕАЛИЗУЕТСЯ
iOS HIG не предусматривает rotary. Fallback на `HorizontalSlider`.

### ivory-day
Knob в светлой бронзе `#b8895a`, base — молочный inset. Indicator —
тёмная коричневая.

## Технические заметки

- Геометрия угла: `Math.atan2(y - cy, x - cx) * 180 / Math.PI`
- Накопление «отрицательного» поворота (jump через 180° → 181° или
  через -180° → -181°) — отслеживание delta между frame'ами, не
  абсолютного угла. Иначе knob будет «прыгать» при пересечении 0°.
- Snap-to-step при `pointerup`, не во время drag
- Haptics 'tick' — `navigator.vibrate(8)` при пересечении шага
- При `prefers-reduced-motion` отключаем bounce-spring при отпускании
