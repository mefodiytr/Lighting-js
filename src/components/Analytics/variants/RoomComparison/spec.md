# RoomComparison

## Суть

Рейтинговый список: комнаты отсортированы по потреблению, каждая
с горизонтальным bar (% от max). «Топ-прожора» сверху, минимальные —
снизу. Insight-orientированный виджет.

## Когда выбирать

- Большой объект с несколькими комнатами
- Insight-страница «Где экономить»
- Сезонные сравнения «прошлый vs текущий месяц»

## Когда не выбирать

- Маленькая квартира (1-2 комнаты) — нечего сравнивать
- В realtime — это aggregated view

## API

```ts
interface RoomComparisonItem {
  id: string;
  name: string;
  value: number;                       // kWh за period
  delta?: number;                       // change vs prev period (+/-%)
  color?: string;                       // override accent
}

interface RoomComparisonProps {
  rooms: RoomComparisonItem[];
  unit?: string;                       // 'kWh'
  period?: 'day' | 'week' | 'month';
  sortBy?: 'value' | 'delta' | 'name';
  onRoomClick?: (id: string) => void;
  showDelta?: boolean;
  disabled?: boolean;
}
```

## Жесты

| Жест             | Эффект                                        |
|------------------|-----------------------------------------------|
| Tap row          | onRoomClick — переход в детали комнаты        |
| Long-press       | Bulk actions (compare 2-3 комнат)             |
| Keyboard ↑↓      | Перемещение фокуса                            |
| Keyboard Enter   | Open room                                     |

## Accessibility

- `<table>` или `<ul>` с rows, каждая `<button role="link">`
- aria-label: «Гостиная, 12.4 кВт·ч за месяц, на 5% больше прошлого»
- Delta direction через icon + text (не только цвет)

## Цветовые стили

### cinematic-dark
Row 56px, name Fraunces 16pt слева, bar в центре, value mono справа.
Bar — gradient от accent-deep к accent-glow по длине пропорционально
value. Delta — мелкий ↑/↓ + % значение, кодированы цветом
state-danger / state-ok.

### editorial-dark
Серьёзный table, gold bars.

### neo-brutalism
Каждая row — square panel с чёрным border. Bar — solid жёлтый/чёрный.
Delta — крупный mono.

### material
M3 list с linear-progress bars в каждом item.

### cupertino
iOS-grouped list с inline progress.

### ivory-day
Светлые rows с тёплыми bars.

## Технические заметки

- Bar width: `width: ${(value/max) * 100}%`
- Sort animation: при изменении order — FLIP-anim (First-Last-Invert-
  Play): записать start positions, изменить order, перепозиционировать
  с translate, anim back to 0
- Delta calculation: `(current - prev) / prev * 100`
- Сортировка: внешняя через `sortBy` prop, не внутренняя
- Top-N: можно limit'ить (например показать top-5 + collapse rest)
