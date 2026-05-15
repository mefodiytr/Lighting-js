# SwipeBetween

## Суть

Горизонтальный swipe всего экрана между комнатами, как Stories в
Instagram. Никаких tab-bar'ов — вся ширина экрана для контента,
переключение жестом. Indicator (dots или mini-pills) показывает
позицию.

## Когда выбирать

- Premium mobile, минималистичный UI без видимых tabs
- 3–7 комнат — оптимум для swipe-нав
- Когда content уникален и заслуживает всю ширину

## Когда не выбирать

- Когда внутри content нужен горизонтальный scroll — конфликт
- Desktop / mouse — swipe-only недоступен (нужен fallback)
- >7 комнат — слишком много свайпов до нужной

## API

```ts
interface SwipeBetweenProps {
  items: NavigationItem[];
  activeId: string;
  onChange: (id: string) => void;
  indicator?: 'dots' | 'pills' | 'page' | 'none';
  indicatorPosition?: 'top' | 'bottom';
  threshold?: number;                  // px движения для switch, default 60
  showEdgeArrows?: boolean;           // для desktop
  children: (activeItem) => ReactNode;  // render-prop для content
}
```

## Жесты и состояния

| Жест                       | Эффект                                       |
|----------------------------|----------------------------------------------|
| Swipe horizontal           | Переход к prev/next item                     |
| Slow drag                  | Live-tracking translateX                     |
| Release < threshold        | Snap back                                    |
| Release ≥ threshold        | Snap к next                                  |
| Tap dot/pill в indicator   | Jump к этому item                            |
| Keyboard ←→                | Prev/next                                    |

## Accessibility

- `<section role="tabpanel" aria-labelledby={tabId}>` для контента
- Indicator — `<nav role="tablist">` с dots как tabs
- Skip-link к контенту, чтобы SR не пробивался через все панели
- `aria-live` объявляет переход

## Цветовые стили

### cinematic-dark
Indicator dots: бронзовые, активная крупнее с outer glow.
Position-page text (e.g. «Гостиная · 2/5») mono dim.

### editorial-dark
Indicator — тонкие gold lines (не dots), italic page-text.

### neo-brutalism
Indicator — chunky чёрные/жёлтые squares как pixel-bar.

### material
M3 page-indicator: dots primary, animated scaling.

### cupertino
iOS Stories indicator: filled bars на top, progress.

### ivory-day
Тёплые dots, тёмная бронза для active.

## Технические заметки

- Pointer events: `pointerdown` → tracking → `pointerup`
- Translate: `transform: translateX(${currentIndex * -100 + delta}%)`
- Spring при snap (CSS transition с custom cubic-bezier)
- `touch-action: pan-y` — разрешаем вертикальный scroll внутри
- Inertial scrolling: при быстром flick — momentum через velocity
  calculation в `pointerup`
- Lazy-render: рендерим только active + 1 prev + 1 next, остальные
  как placeholder для performance
