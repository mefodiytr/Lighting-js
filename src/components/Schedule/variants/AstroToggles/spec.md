# AstroToggles

## Суть

Два независимых toggle'а: «Включать на закате» и «Выключать на
рассвете», каждый с опциональным offset в минутах («за 30 минут
до заката»). Чистое астро-управление, без таймера.

## Когда выбирать

- Дефолт для outdoor lighting (фасад, сад, дорожки)
- Когда хочется «свет работает в тёмное время суток»
- Дополнение к manual toggle (override system)

## Когда не выбирать

- Внутреннее освещение, не привязанное к солнцу
- Когда нужна точная программа на часы → `Timeline24h`

## API

```ts
interface AstroToggleRule {
  enableAtSunset: boolean;
  sunsetOffsetMin: number;                // -120..+120
  disableAtSunrise: boolean;
  sunriseOffsetMin: number;
  sceneId?: string;                       // активируемая сцена
}

interface AstroTogglesProps {
  rule: AstroToggleRule;
  onChange: (next: AstroToggleRule) => void;
  showCurrentTimes?: boolean;             // показывать реальные часы заката/рассвета
  location?: { lat: number; lng: number };
  disabled?: boolean;
}
```

## Жесты и состояния

| Жест                  | Эффект                                         |
|-----------------------|------------------------------------------------|
| Tap toggle            | Switch enable/disable                          |
| Drag offset slider    | Изменение minutes (-120..+120)                 |
| Tap offset preset     | «-30мин», «При закате», «+15мин»               |
| Keyboard              | Tab между controls, Space для toggle           |

## Accessibility

- Два `role="switch"` для on/off
- Offset slider — `role="slider"`, `aria-valuetext`: «За 30 минут
  до заката»
- Описание под каждым toggle'ом — реальное время «Сегодня закат
  в 18:42, включится в 18:12»

## Цветовые стили

### cinematic-dark
Two rows, каждая row 64px высотой. Toggle слева (CardToggle.IosSwitch
стиль), label с иконкой ☀/☾ по центру, offset-slider горизонтальный
снизу. Sunset row — тёплый акцент `--color-accent`, sunrise row —
slightly cooler.

### editorial-dark
Минималистично, две одинаковые секции с gold accent.

### neo-brutalism
Каждая row — отдельная panel с чёрным border. Toggle, label, slider
вертикально.

### material
M3-style rows с trailing switches.

### cupertino
iOS-стиль grouped list rows с trailing switches и detail-disclosure.

### ivory-day
Тёплые rows с тёмными toggles.

## Технические заметки

- Sun-events computation — на backend. UI получает уже
  «сегодня закат: 18:42», offset применяется визуально для UX
- Offset slider snap to: -60, -30, -15, 0, +15, +30, +60
- При отсутствии location — показывать warning «Укажите местоположение
  для астро-таймера» и блокировать controls
- Persistent storage: рекомендуется сохранять offset как rule в
  backend, а не локально
