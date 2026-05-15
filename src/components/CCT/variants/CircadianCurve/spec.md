# CircadianCurve

## Суть

Не контрол, а **режим автоматики + визуализация**. Виджет
показывает кривую CCT по часам суток (тёплый утром/вечером,
холодный днём) с текущим временем-индикатором. Slider становится
read-only — управляется системой. Пользователь видит, что лампа
сейчас 3200K, потому что 19:00.

## Когда выбирать

- Premium-объекты с health/wellness-фокусом
- Когда хочется передать ценность автоматизации (а не контроля)
- Hero-tile на главной: «свет сам подстраивается»

## Когда не выбирать

- Когда нужен manual override (показывайте кнопку «Manual override»)
- Семейное жильё — может ввести в заблуждение «почему он сам меняется?»

## API

```ts
interface CircadianStop {
  hour: number;        // 0..23.99
  kelvin: number;
}

interface CircadianCurveProps {
  curve: CircadianStop[];           // ≥4 точки, рекомендованно 6 (6/9/12/15/18/22)
  currentKelvin: number;            // текущий, обычно из backend
  currentHour: number;              // 0..23.99
  enabled?: boolean;                // режим включён
  onToggleEnabled?: (next: boolean) => void;
  onManualOverride?: () => void;    // переключиться в ручной режим
  disabled?: boolean;
  label: ReactNode;
  size?: { width: number; height: number };
}
```

## Жесты и состояния

| Жест                       | Эффект                                       |
|----------------------------|----------------------------------------------|
| Tap по точке кривой        | Показать инфо: «18:00 — 3000K»               |
| Tap «Включить автоматику»  | Toggle enabled                               |
| Long-press на кривой       | Открыть редактор curve (admin/installer)     |
| Tap «Manual override»      | Выход из режима, переход к `LinearKelvin`    |

## Accessibility

- Виджет — `role="img"` с `aria-label` описанием текущего значения
  («Циркадная кривая: сейчас 19:00, 3200 Кельвинов, тёплый»)
- При hover/focus на точке — `aria-describedby` с tooltip
- Кнопки «Manual» / «Auto» — стандартные `<button>`

## Цветовые стили

Кривая — line-chart по часам, цвет каждого сегмента ≈ `kelvinToRgb
(stop.kelvin)`. Тема влияет на frame, axis, current-indicator,
кнопки.

### cinematic-dark
Фон — карточка с бронзовым frame. Кривая `<path>` с
`stroke-linecap: round`, color stops определяют сегменты. Current-time
индикатор — вертикальная пунктирная линия + крупная точка с outer
glow в текущем CCT-цвете. Axis: «6 / 12 / 18 / 24» mono dim.

### editorial-dark
Тонкая кривая, минимальный axis. Точка тек времени — мелкая gold dot.

### neo-brutalism
Кривая — ломаная (polyline), без smooth interpolation. Точки —
square 8px чёрные. Current-line — толстая чёрная 4px.

### material
M3 chart-style. Точки — dot 4px. Current — primary line.

### cupertino
iOS Health-app style: smooth filled-area chart, accent-blue line.

### ivory-day
Светлый chart с тёплой кривой, dark gridlines.

## Технические заметки

- Кривая: SVG `<path>` с smooth interpolation через
  `d="M ... C ..."` (Catmull-Rom или Hermite spline)
- Сегментная окраска: либо `<linearGradient>` по длине path, либо
  разбиение на N сегментов с разными `stroke` цветами
- Current-time индикатор обновляется каждую минуту через
  `setInterval` (или из backend push)
- Curve editor (long-press) — отдельный вид, draggable точки,
  редактирует `curve` array
- Disabled state: кривая dim, current-indicator продолжает двигаться
  но без glow
