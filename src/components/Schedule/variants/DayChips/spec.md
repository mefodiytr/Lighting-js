# DayChips

## Суть

Семь chip'ов «Пн-Вс» (или «Mon-Sun») с возможностью multi-select +
поле «От—До» для времени. Стиль Google Calendar repeat-options.
Простой, плоский, формальный.

## Когда выбирать

- Дефолт для repeat-rule «каждый вторник и четверг с 18:00 до 23:00»
- Settings-страница, расписание устройства
- Семейное жильё с базовой автоматикой

## Когда не выбирать

- Когда нужна разная программа на разные дни → `WeekGrid`
- Простое «утро-вечер без weekday» → `PresetChips`

## API

```ts
interface DayChipsRule {
  id: string;
  days: Weekday[];                      // 0-6, multi-select
  startTime: { h: number; m: number };
  endTime?: { h: number; m: number };
  sceneId?: string;
  enabled: boolean;
}

interface DayChipsProps {
  rule?: DayChipsRule;
  onChange?: (next: DayChipsRule) => void;
  weekStartsOn?: 'monday' | 'sunday';
  showWeekendShortcut?: boolean;        // «Будни / Выходные» chip'ы
  disabled?: boolean;
}
```

## Жесты и состояния

| Жест                       | Эффект                                       |
|----------------------------|----------------------------------------------|
| Tap chip                   | Toggle day inclusion (multi)                 |
| Tap «Будни»                | Select Mon-Fri, deselect Sat-Sun             |
| Tap «Выходные»             | Select Sat-Sun, deselect rest                |
| Tap time field             | Open time-picker (system native)             |
| Keyboard navigation        | ←→ между chips, Space toggle                 |

## Accessibility

- `<fieldset><legend>День недели</legend>` с chip'ами как checkboxes
- Каждый chip — `role="checkbox"` + `aria-checked`
- Time fields — `<input type="time">` (нативный picker)
- Связь с rule через `aria-describedby`

## Цветовые стили

### cinematic-dark
Chip — square 40×40, бронзовый thin border, mono day-letter
«M T W T F S S» по центру. Active: бронзовый fill, white text.
Time-fields — Fraunces 28pt, mono суффикс «:».

### editorial-dark
Chip более минимальный, gold accent. Time italic serif.

### neo-brutalism
Chip square 44×44 с чёрным 3px border. Active — жёлтый fill,
чёрный текст. Time fields — крупный mono.

### material
M3 FilterChip с outlined→filled. M3 TimePicker для time.

### cupertino
iOS pill chip selection. iOS-native time picker (wheel).

### ivory-day
Светлые chips с тёплым border, active — тёмный бронзовый.

## Технические заметки

- Day order зависит от `weekStartsOn`: ['Mo', 'Tu', ...] или
  ['Su', 'Mo', ...]
- «Будни» = `[1, 2, 3, 4, 5]`, «Выходные» = `[0, 6]`
- Time-fields — `<input type="time">` для cross-platform native
  picker. Validation: end > start (если end задан)
- Persisting: rule сериализуется в backend как `{ days: [1,3,5],
  startTime: "18:00", endTime: "23:00" }`
