# FullscreenChart

## Suть

Полноразмерный график с осями, label'ами, tooltip'ами. Показывает
kWh по дням/месяцам, мгновенную мощность по времени. Отдельный экран,
не inline.

## Когда выбирать

- Отдельная страница «История потребления»
- Когда нужен анализ, не quick-glance
- Тариф/счета: «сколько я потратил в этом месяце»

## Когда не выбирать

- Inline в карточке устройства → `Sparkline`
- Real-time monitoring → `LiveGauge`

## API

```ts
interface FullscreenChartProps {
  series: Array<{
    id: string;
    label: string;
    data: TimeSeriesPoint[];
    color?: string;
  }>;
  type?: 'bar' | 'line' | 'area' | 'stacked-bar';
  period?: 'hour' | 'day' | 'week' | 'month' | 'year';
  unit: 'W' | 'kWh' | '%';
  showLegend?: boolean;
  showGrid?: boolean;
  comparisonSeries?: typeof series;       // overlay для compare
  onPeriodChange?: (next: Period) => void;
  disabled?: boolean;
}
```

## Жесты и состояния

| Жест                       | Эффект                                       |
|----------------------------|----------------------------------------------|
| Tap по bar/point           | Tooltip с точным значением                   |
| Swipe ←→                   | Previous/next period                         |
| Pinch zoom                 | Zoom-in на range                             |
| Pan after zoom             | Перемещение                                  |
| Tap legend item            | Toggle visibility of series                  |

## Accessibility

- `<figure>` + `<figcaption>` с обобщением: «Потребление за неделю,
  от 1.2 кВт·ч в понедельник до 5.8 кВт·ч в субботу»
- Таблица с данными скрыта под `aria-describedby` для SR
- Tooltip — `aria-live` через `role="tooltip"`
- Keyboard: ←→ для перехода между точками, Enter — show tooltip

## Цветовые стили

### cinematic-dark
Bars/lines в accent-rgb с tonal-stack для multi-series.
Grid-lines — тонкие бронзовые dotted. Axis-labels — mono small dim.
Tooltip — карточка с blur background, Fraunces value.

### editorial-dark
Минимальный grid, gold series. Tooltip — серьёзный layout.

### neo-brutalism
Bars solid чёрные/жёлтые с offset shadow. Grid толстые чёрные lines.
Axis mono uppercase.

### material
M3-styled chart, primary palette. Tooltip как M3 surface.

### cupertino
iOS Health-app: smooth area-fills, accent-blue, subtle grids.

### ivory-day
Светлый chart, тёмные series.

## Технические заметки

- Базовая реализация — SVG без библиотек (для контроля темы)
- Сложные кейсы — D3 или Visx, но желательно tree-shakeable subset
- Period-switcher — отдельный компонент `<PeriodSwitcher>` поверх
  chart'а (`day`/`week`/`month`/`year` chip'ы)
- Swipe-between-periods: pan-gesture на корне chart'а
- Tooltip позиционируется через `getBoundingClientRect` + clamp к
  viewport
- Compare-overlay: вторая seria с opacity 0.5
- Large datasets (>1000 points): aggregation на backend, не на client
