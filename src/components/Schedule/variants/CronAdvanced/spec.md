# CronAdvanced

## Суть

Текстовое поле для cron-выражения (`0 19 * * 1-5`) + human-readable
preview («Каждый будний день в 19:00»). Эксперт-режим для
инсталляторов и опытных пользователей. Скрыт за «Показать
дополнительно».

## Когда выбирать

- Инсталлятор, B2B, MCS
- Когда нужны сложные правила, недоступные через UI
  («первый понедельник месяца», «каждые 2 часа»)
- Migration из других систем (KNX, Crestron) с cron-rules

## Когда не выбирать

- Конечный пользователь — никогда
- Premium home-screen

## API

```ts
interface CronAdvancedProps {
  value?: string;                          // "0 19 * * 1-5"
  defaultValue?: string;
  onChange?: (next: string) => void;
  showHumanReadable?: boolean;             // default true
  validate?: boolean;                      // syntax check
  templates?: CronTemplate[];              // quick-start templates
  disabled?: boolean;
}

interface CronTemplate {
  label: string;
  expression: string;
}
```

Default templates:
```ts
[
  { label: 'Каждый день в 19:00',           expression: '0 19 * * *' },
  { label: 'Будни в 18:00',                 expression: '0 18 * * 1-5' },
  { label: 'Выходные в 09:00',              expression: '0 9 * * 0,6' },
  { label: 'Каждые 15 минут с 8 до 22',     expression: '*/15 8-22 * * *' },
]
```

## Жесты и состояния

| Жест                       | Эффект                                       |
|----------------------------|----------------------------------------------|
| Type в input               | onChange, validation, preview обновляется    |
| Tap template               | Auto-fill expression                         |
| Tap «Validate»             | Manual check + show errors                   |

## Accessibility

- `<input>` с `pattern` (валидация cron syntax)
- `aria-describedby` к preview-string
- Error messages с `role="alert"` при invalid
- Templates как `<button>`'ы с описанием

## Цветовые стили

### cinematic-dark
Input — Fraunces mono 16pt, тёмный bg, бронзовый border. Preview —
mono 12pt `--color-text-muted` ниже. Templates — pill-chips в строке
сверху.

### editorial-dark
Минимальный layout, gold accent на focused input.

### neo-brutalism
Input — крупный mono на белом фоне, чёрный 3px border. Templates —
square chips.

### material
M3 OutlinedTextField с helper-text (preview).

### cupertino
iOS-стиль text field с list templates.

### ivory-day
Светлый input, тёмная типографика.

## Технические заметки

- Cron parser — utility (cron-parser library или own implementation
  для базовых паттернов)
- Human-readable conversion — cronstrue library
- Validation: regex-based primary + parser-based secondary
- Preview обновляется на blur (не на каждый keystroke) для UX
- Сохраняемое значение — raw expression string
- Display в UI всегда сопровождается «Эксперт-режим» badge
