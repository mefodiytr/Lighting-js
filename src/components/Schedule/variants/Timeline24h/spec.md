# Timeline24h

## Суть

Горизонтальная полоса 24 часов с маркерами событий (rule trigger'ов)
по позициям. Visually-immediate представление, где видно «утром
свет включается на час, вечером на 5 часов». Click/drag на маркеры
редактирует events.

## Когда выбирать

- Обзор однодневной программы
- Visual planning сценария «День»
- Когда сразу нужно увидеть пустые/занятые часы

## Когда не выбирать

- Недельная программа (разные дни) → `WeekGrid`
- Сложные cron-rules → `CronAdvanced`

## API

```ts
interface TimelineEvent {
  id: string;
  startHour: number;        // 0..23.99
  endHour?: number;         // optional для durational
  sceneId?: string;
  channelValue?: number;
  color?: Rgb;
}

interface Timeline24hProps {
  events: TimelineEvent[];
  onChange?: (events: TimelineEvent[]) => void;
  showCurrentTime?: boolean;
  hourLabels?: 'all' | '6h' | '12h';      // плотность
  height?: number;
  disabled?: boolean;
}
```

## Жесты и состояния

| Жест                          | Эффект                                       |
|-------------------------------|----------------------------------------------|
| Tap на пустое место           | Create новый event на этом часе              |
| Tap на event                  | Select для редактирования                    |
| Drag event                    | Move start/end                               |
| Drag handle на краях event    | Resize duration                              |
| Long-press                    | Delete confirm                               |
| Keyboard ←→ в selected event  | -1h/+1h                                      |

## Accessibility

- `<svg role="img">` с альтернативным `<ul>` of events для SR
- Каждый event — `role="button"` с `aria-label`: «Включение в 19:00,
  длительность 5 часов»
- Current time — `aria-live` объявление «Сейчас 14:35»

## Цветовые стили

### cinematic-dark
Background — карточка с inset-shadow. Hour-marks — мелкие бронзовые
ticks. Event-bars: `rgba(var(--cr) var(--cg) var(--cb) / 0.6)` или
event.color. Current-time vertical line — бронзовая пунктирная.
Selected event: бронзовый thicker outline.

### editorial-dark
Тонкие gold marks. Event-bars — плоские золотые.

### neo-brutalism
Hours — крупные чёрные labels. Event-bars — solid чёрные/жёлтые boxes
с offset shadow.

### material
M3-styled chart. Event-bars — primary tonal.

### cupertino
iOS Calendar-style: события как rounded rects, color-coded.

### ivory-day
Светлый bg, тёплые event-bars.

## Технические заметки

- SVG width 1440px (24h × 60px) или dynamic. Scrollable если screen
  меньше
- Event-bars: `<rect x={startHour*60} width={duration*60}>` или %
- Hit-test: SVG events + pointer-tracking
- Resize-handles: invisible 12px wide regions на краях event'а
- Snap-to-step (15min) при drag/resize — `Math.round(value * 4) / 4`
- Collision detection: при move/resize проверять overlap с другими
  events, опционально предотвращать
