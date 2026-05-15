# Schedule — расписания и таймеры

Программирование автоматизаций по времени: «включить вечером,
выключить на рассвете», «вечеринка по пятницам в 20:00» и т.д.

## Общий API

```ts
type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;  // 0 = вс

interface ScheduleRule {
  id: string;
  enabled: boolean;
  trigger:
    | { kind: 'time'; hour: number; minute: number; days: Weekday[] }
    | { kind: 'sunset' | 'sunrise'; offsetMin?: number };
  action: { sceneId?: string; channelId?: string; value?: number };
}

interface ScheduleCommon {
  rules: ScheduleRule[];
  onChange: (rules: ScheduleRule[]) => void;
  disabled?: boolean;
}
```

## Варианты

| Файл              | UX-метафора                                              |
|-------------------|----------------------------------------------------------|
| `Timeline24h`     | Горизонтальная полоса суток с маркерами событий          |
| `WeekGrid`        | Сетка 7×24 (неделя × часы), клетки кликабельны           |
| `DayChips`        | Кнопки Пн–Вс + поле «От–До» (Google Calendar-стиль)      |
| `PresetChips`     | «Утро/День/Вечер/Ночь» с привязкой к астро-таймеру       |
| `AstroToggles`    | «Включать на закате», «Выключать на рассвете» + offset   |
| `CronAdvanced`    | Cron-выражения для инсталляторов (скрыт за «дополнительно») |
| `VacationMode`    | Режим с рандомизацией (имитация присутствия)             |

## Когда какой выбирать

- **Простой кейс «утром-вечером»** → `PresetChips` или `AstroToggles`
- **Дневная программа** → `DayChips` + Timeline24h как preview
- **Сложные сценарии** → `WeekGrid`
- **Инсталлятор** → `CronAdvanced`
- **Отъезд из дома** → `VacationMode` (специальный режим)

## Принципы реализации

- Все варианты работают с одним и тем же массивом `rules` —
  разные представления одних данных
- Drag-and-drop в `Timeline24h` и `WeekGrid` — pointer-based,
  событие создаётся drag'ом, длительность редактируется ручками
- Астро-расчёт (закат/рассвет) — на стороне backend; виджет
  показывает только rule + текущий вычисленный час
- `VacationMode` — особый rule-kind, который генерирует
  псевдослучайные события в указанные окна
