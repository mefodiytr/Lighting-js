# Schedule.PresetChips

## Суть

Чипсы временнЫх preset'ов — «Утро», «День», «Вечер», «Ночь» — без
указания точного часа. Привязка к астро-таймеру (например «Вечер» =
закат). Самый дружелюбный UX для нон-техно-пользователей.

## Когда выбирать

- Семейное жильё, пожилые
- Когда не важно знать точный час
- Onboarding: «когда хочешь, чтобы свет горел?»

## Когда не выбирать

- Когда нужна точная минута → `DayChips` или `CronAdvanced`
- Инсталлятор / B2B

## API

```ts
interface SchedulePresetItem {
  id: string;
  label: string;             // «Утро»
  description?: string;      // «С 7:00 до 10:00 или с рассвета»
  trigger:
    | { kind: 'fixedTime'; from: string; to?: string }
    | { kind: 'astro'; event: 'sunrise' | 'sunset'; offsetMin?: number };
}

interface SchedulePresetChipsProps {
  presets?: SchedulePresetItem[];        // default — 4 канонических
  activeIds: string[];                   // multi-select
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}
```

Default presets:
```ts
[
  { id: 'morning', label: 'Утро',  trigger: {kind:'fixedTime', from:'07:00', to:'10:00'} },
  { id: 'day',     label: 'День',  trigger: {kind:'fixedTime', from:'10:00', to:'17:00'} },
  { id: 'evening', label: 'Вечер', trigger: {kind:'astro', event:'sunset'} },
  { id: 'night',   label: 'Ночь',  trigger: {kind:'fixedTime', from:'23:00', to:'07:00'} },
]
```

## Жесты и состояния

| Жест                | Эффект                              |
|---------------------|-------------------------------------|
| Tap chip            | Toggle inclusion                    |
| Keyboard ←→         | Перемещение фокуса                  |
| Space               | Toggle                              |

## Accessibility

- `<fieldset>` с chip'ами как `role="checkbox"`
- При активации — `aria-live` объявление «Утро добавлено»
- Description раскрывается на focus/hover как tooltip

## Цветовые стили

### cinematic-dark
Chip — pill rounded 999px, padding 12-20px, бронзовый thin border.
Icon (☀ ☼ ☾ ★) слева внутри chip. Active: бронзовый fill, glow.

### editorial-dark
Chip с italic font, gold accent.

### neo-brutalism
Chip square, чёрный 3px border. Active — жёлтый fill.

### material
M3 InputChip с trailing-icon (checkmark при selected).

### cupertino
iOS-pill multi-select с checkmark.

### ivory-day
Светлые chips с тёплым border.

## Технические заметки

- Layout: `flex; flex-wrap: wrap; gap: 8px`
- Icon — Lucide или Material Symbol per preset (sunrise/sun/sunset/moon)
- Astro-trigger compute на backend — UI просто показывает «закат»
  без расчёта реального часа
- Сериализация: `{ presets: ['morning', 'evening'] }` → backend
  resolves конкретные тайминги
