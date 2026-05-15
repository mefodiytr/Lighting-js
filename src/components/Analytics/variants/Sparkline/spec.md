# Sparkline

## Суть

Мини-график (без осей, без подписей) в одну строку. Помещается
inline в карточку устройства — показывает тренд потребления за
последние N часов/дней. Минимальный, ненавязчивый.

## Когда выбирать

- В карточке устройства/комнаты как часть meta-info
- «График ради взгляда», без необходимости анализа
- Когда нужно показать «работает / не работает / прогресс»

## Когда не выбирать

- Когда важна шкала и точные числа → `FullscreenChart`
- Когда данных < 3 точек — нет смысла

## API

```ts
interface SparklineProps {
  data: number[] | TimeSeriesPoint[];
  unit?: string;                       // 'W', 'kWh'
  width?: number;                      // default 80
  height?: number;                     // default 24
  type?: 'line' | 'area' | 'bar';
  showLast?: boolean;                  // показать последнее значение справа
  showMinMax?: boolean;                // dots на min/max
  color?: string;                      // override accent
  disabled?: boolean;
  ariaLabel?: string;
}
```

## Жесты

| Жест           | Эффект                                      |
|----------------|---------------------------------------------|
| Tap            | Open full chart (опц., через onPress)       |
| Hover          | Tooltip (только desktop)                    |

## Accessibility

- `<svg role="img" aria-label="...">`
- ariaLabel должен описывать тренд: «За последние 24 часа от 20W
  до 80W, тренд возрастающий»
- Альтернатива: table с числами скрыта под `aria-describedby`

## Цветовые стили

### cinematic-dark
Line — `stroke="rgb(var(--cr) var(--cg) var(--cb))"`, без area-fill.
showLast — мелкий mono справа `--color-text-muted`. Min/max dots
мелкие тёплые точки.

### editorial-dark
Gold line, минималистично.

### neo-brutalism
Bar-type вместо line: чёрные square bars. Никаких градиентов.

### material
M3-style line, primary color. Area-fill 16% tonal.

### cupertino
iOS Health-app style: thin smooth curve, subtle area-fill gradient.

### ivory-day
Тёплая линия, светлый bg.

## Технические заметки

- Pure SVG: `<polyline>` для line, `<path d="...Z">` для area
- Нормализация: `value → y-coord = height - (value-min)/(max-min)*height`
- Smooth interpolation для line — Catmull-Rom через bezier control
  points (опционально, для «премиум» вида)
- Performance: <10 points = pre-render, >10 = `requestAnimationFrame`
  throttle при стриминговых данных
- No axes, no labels — самое главное правило sparkline
