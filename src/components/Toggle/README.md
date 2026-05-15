# Toggle — переключатель состояния

Бинарный виджет «вкл/выкл». Универсальный жест: тап.
Для критических нагрузок — long-press вариант.

## Семантика

```ts
interface ToggleCommon {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  label: ReactNode;                  // обязателен для a11y
  description?: ReactNode;
  haptics?: boolean;
}
```

Все варианты экспортируются как самостоятельные компоненты
(`<IosSwitch>`, `<CardToggle>`, ...) и одновременно — через
дискриминированный union `<Toggle variant="..." />` для динамического
выбора в конфиге.

## Варианты

| Файл                     | UX-метафора                    | Совместимость с темами        |
|--------------------------|--------------------------------|-------------------------------|
| `IosSwitch`              | Классический iOS-switch        | Все темы                      |
| `MaterialSwitch`         | M3 switch с крупным thumb      | Все темы                      |
| `CardToggle`             | Вся карточка кликабельна       | Все темы                      |
| `LampButton`             | Круг-лампочка с glow           | dark / day, не brutalism      |
| `TapZones`               | Hot-zones на фото комнаты      | Все темы (◐ в brutalism)      |
| `SvgFixture`             | Реалистичный SVG-светильник    | Только cinematic-/editorial-dark |

## Когда какой выбирать

- **MCS-оператор** → `IosSwitch` или `MaterialSwitch`: компактно,
  быстро, привычно
- **Премиум-житель, ежедневная сцена** → `CardToggle` или
  `LampButton`: тактильнее, эмоциональнее, крупный tap-target
- **Премиум-житель, шоу-режим** → `SvgFixture`: фотореалистичный
  отклик, кинематографично
- **Карта объекта, план комнаты** → `TapZones`: «нажми на лампу
  на фото»

## Принципы реализации

- Все варианты используют общий хук `useToggleState({ checked,
  defaultChecked, onChange })` для controlled/uncontrolled
- Все варианты следуют WAI-ARIA `role="switch"` + `aria-checked`
- Клавиатура: Space/Enter переключает; Esc отменяет жест
  long-press
- Visual state передаётся через `data-state="on|off|pressing"`,
  стили на этом атрибуте
- При `prefers-reduced-motion` все `transition` глушатся до
  `var(--duration-instant)`
