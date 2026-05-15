# VacationMode

## Суть

Специальный режим «отъезд из дома»: система генерирует
псевдо-случайные включения освещения, имитируя присутствие людей.
Виджет — переключатель + конфиг окон (часы, дни), реализующий
правило rule-kind = 'vacation'.

## Когда выбирать

- Когда пользователь уезжает (отпуск, командировка)
- Premium-объекты (security feature)
- Отдельный режим в settings/security

## Когда не выбирать

- Регулярная программа — это не для повседневности
- Когда нет рандомизатора в backend → fallback к статичному
  расписанию

## API

```ts
interface VacationWindow {
  startHour: number;
  endHour: number;
  intensity?: 'low' | 'medium' | 'high';   // частота включений
  rooms: string[];                          // какие комнаты участвуют
}

interface VacationModeProps {
  enabled: boolean;
  onToggleEnabled: (next: boolean) => void;
  startDate?: string;                       // ISO «from when»
  endDate?: string;                          // ISO «until»
  windows: VacationWindow[];
  onWindowsChange?: (next: VacationWindow[]) => void;
  randomSeed?: number;                       // для повторяемости в тестах
  disabled?: boolean;
}
```

## Жесты и состояния

| Жест                         | Эффект                                       |
|------------------------------|----------------------------------------------|
| Tap master toggle            | Enable/disable mode                          |
| Date-picker start/end        | Set vacation window                          |
| Add/remove window            | Управление окнами активности                 |
| Intensity slider per window  | Low/Medium/High                              |

## Accessibility

- Master toggle — `role="switch"`, prominent
- Windows — `<ul>` rows с editable controls
- Date pickers — `<input type="date">` нативные
- Warning при enable: «Свет будет включаться сам в указанные часы»

## Цветовые стили

### cinematic-dark
Главный banner card вверху с master toggle: фон `linear-gradient
(135deg, #3a1a14, #1a1410)` с тёплым акцентом «Vacation» mono icon.
Windows — карточки в списке ниже. Подпись «Имитация присутствия» —
gold serif.

### editorial-dark
Более серьёзный layout, минималистичный banner.

### neo-brutalism
Master toggle — большая чёрная кнопка с жёлтым «ON» при active.
Windows — square cards.

### material
M3-style page с FAB для add-window. Warning через M3 Snackbar.

### cupertino
iOS-style: master toggle row + grouped window-cards.

### ivory-day
Светлый banner с тёплым accent.

## Технические заметки

- Алгоритм randomizer в backend:
  - В каждом окне делается несколько включений
  - Случайные точки (через seed для повторяемости при тесте)
  - Длительность 30мин-3часа
- При enable — UI показывает confirmation dialog: «Точно?»
- При enable + startDate в будущем — countdown «Активируется через
  3 дня»
- Settings можно сохранять как preset (например «Двухнедельный отпуск»)
- Уведомление пользователю в день старта режима
