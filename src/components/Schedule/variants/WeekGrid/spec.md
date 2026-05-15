# WeekGrid

## Суть

Двухмерная сетка 7 дней × 24 часа (168 клеток). Каждая клетка
кликабельна — создать event. Зрелое визуальное представление
недельной программы освещения.

## Когда выбирать

- Регулярная недельная программа (рабочие vs выходные)
- Power-user-режим, инсталлятор
- Когда нужен обзор «весь паттерн недели сразу»

## Когда не выбирать

- Простые сценарии «утром-вечером» → `DayChips` или `PresetChips`
- Mobile portrait — 168 клеток не помещаются

## API

```ts
interface WeekGridEvent {
  id: string;
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  startHour: number;
  endHour: number;
  sceneId?: string;
  color?: Rgb;
}

interface WeekGridProps {
  events: WeekGridEvent[];
  onChange?: (events: WeekGridEvent[]) => void;
  weekStartsOn?: 'monday' | 'sunday';
  cellSize?: { w: number; h: number };
  disabled?: boolean;
}
```

## Жесты и состояния

| Жест                            | Эффект                                          |
|---------------------------------|-------------------------------------------------|
| Tap на пустую клетку            | Create event длительностью 1 час                |
| Drag по клеткам                 | Bulk-create event с custom длиной               |
| Tap на event                    | Select                                          |
| Drag selected event             | Move                                            |
| Resize handle event             | Изменить duration                               |
| Keyboard arrows + Enter         | Cell selection navigation                       |

## Accessibility

- Каждая ячейка `role="gridcell"`, `<table role="grid">`
- Row/column headers labelled
- Roving tabindex по cells
- Keyboard `aria-activedescendant` для focus tracking

## Цветовые стили

### cinematic-dark
Cell — 32×24, тёмный фон, тонкий бронзовый divider. Event-bars
накладываются поверх grid'а, `rgba(var(--cr) var(--cg) var(--cb) / 0.5)`
fill, бронзовый outline. Selected event — солидная заливка.

### editorial-dark
Тоньше grid lines, gold events.

### neo-brutalism
Толстые чёрные grid-lines. Event-cells — solid жёлтые с border 3px.

### material
M3-style table с tonal events.

### cupertino
iOS Calendar week-view стилистика.

### ivory-day
Светлый grid, тёплые events.

## Технические заметки

- CSS `display: grid; grid-template-columns: repeat(7, ${cellW}px);
  grid-template-rows: repeat(24, ${cellH}px)` для основы
- Events позиционируются абсолютно поверх через grid-area
- Drag-bulk-create: при `pointerdown` — start cell, при `pointermove` —
  расширение selection, при `pointerup` — create event
- Touch на small screens — заменять на zoom-friendly режим или
  fallback к `Timeline24h` × 7 переключателю дней
- Conflict detection при move/resize
