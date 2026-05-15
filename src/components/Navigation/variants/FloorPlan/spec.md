# FloorPlan

## Суть

Миниатюра плана этажа (SVG). Каждая комната — зона на схеме, тап
открывает её. Визуально красиво для крупных объектов: пользователь
сразу понимает, где какой пространственный контекст.

## Когда выбирать

- Большой объект (отель, офис) с понятным планом
- Premium-эстетика, тех-обзор
- Поиск комнаты по местоположению, не по имени

## Когда не выбирать

- Маленькая квартира — overkill
- Когда нет SVG плана этажа (нужна работа дизайнера)

## API

```ts
interface FloorPlanProps {
  floorPlanSvg: string;                    // url или inline-svg
  rooms: Array<{
    id: string;
    name: string;
    bounds: { x: number; y: number; w: number; h: number };  // % или px
    /** Состояние освещения для подсветки */
    lightingOn: boolean;
    /** Доминирующий цвет (RGB-лампы) */
    color?: Rgb;
  }>;
  activeId?: string;
  onChange: (id: string) => void;
  showLabels?: boolean;
  zoomable?: boolean;
}
```

## Жесты и состояния

| Жест                       | Эффект                                       |
|----------------------------|----------------------------------------------|
| Tap на комнату             | Activate, plan zoomed slightly               |
| Pinch zoom (если zoomable) | Увеличение схемы                             |
| Pan after zoom             | Перемещение                                  |
| Keyboard Tab               | Переход между rooms                          |
| Keyboard Enter             | Activate focused                             |

## Accessibility

- `<svg role="img" aria-label="План этажа">`
- Каждая комната — `<button role="button">` поверх SVG-зоны
- `aria-pressed` для active, `aria-label="Комната X, освещение
  включено"`
- Альтернативно — параллельный hidden list comnnat (SR-friendly)

## Цветовые стили

### cinematic-dark
Schema-lines бронзовые. Комнаты с lightingOn — заливаются
полупрозрачным `rgba(var(--cr) var(--cg) var(--cb) / 0.25)` (или
дом-color если задан room.color). Active room: бронзовый border 2px
+ glow. Labels — мелкий mono.

### editorial-dark
Тонкие лайны gold. Минимум labels.

### neo-brutalism
Lines чёрные 3px. Комнаты «занятые» — заливка жёлтым. Active — border
6px.

### material
M3-style, label chip'и поверх зон.

### cupertino
iOS-style: subtle blue lines, frosted overlay для active.

### ivory-day
Светлый план, тёмные lines, тёплый «включенный» fill.

## Технические заметки

- SVG: оптимизирован через SVGO, inline для контроля цветов через CSS
- Room-bounds: либо координаты в SVG, либо overlay-`<button>`'ы
  абсолютно позиционированные
- Zoom: `transform: scale()` на корне SVG, pinch-handler через 2
  pointer events
- Lightning-fill: отдельный `<rect>` или `<path>` per room с
  `fill-opacity` зависящим от lightingOn
- Анимация изменения цвета — через accent-vars (тот же color-tween)
- Plan editor (создание зон) — отдельный admin-mode компонент
  `FloorPlan.Editor` (вне MVP)
