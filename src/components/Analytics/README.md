# Analytics — потребление и история

Визуализация энергопотребления, истории включений, мгновенной
мощности. Декларативная, без drag-zoom (для премиум-сегмента —
максимум swipe между периодами).

## Общий API

```ts
interface TimeSeriesPoint { t: number; v: number; }   // unix ms + value

interface AnalyticsCommon {
  series: TimeSeriesPoint[];
  unit: 'W' | 'kWh' | 'kW' | '%';
  period?: 'hour' | 'day' | 'week' | 'month';
  disabled?: boolean;
}
```

## Варианты

| Файл               | UX-метафора                                            |
|--------------------|--------------------------------------------------------|
| `Sparkline`        | Мини-график в карточке (inline, без осей)              |
| `FullscreenChart`  | kWh по дням/месяцам, столбчатый с осями                |
| `LiveGauge`        | Стрелка-индикатор мгновенной мощности (analog dial)    |
| `RoomComparison`   | Рейтинг комнат «самые прожорливые», цветовая шкала     |

## Когда какой выбирать

- **На карточке устройства** → `Sparkline`
- **Отдельная страница «История»** → `FullscreenChart`
- **Премиум, «здесь и сейчас»** → `LiveGauge`
- **Объект с несколькими помещениями** → `RoomComparison`

## Принципы реализации

- Графики строятся SVG (компактно, scalable), без Chart.js/D3
  для базовых вариантов
- `Sparkline` — `<path>` с `stroke-linejoin: round`, без точек
- `FullscreenChart` — bar/area chart с tooltip на tap (не hover);
  swipe-between-periods через pan-gesture
- `LiveGauge` — SVG-arc, анимация стрелки через
  `transform: rotate()` с `transition: var(--motion-spring)`
- `RoomComparison` — `<ul>` с inline-bar (`background: linear-gradient`)
