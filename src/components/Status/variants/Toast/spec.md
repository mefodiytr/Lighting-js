# Toast

## Суть

Кратковременное уведомление снизу экрана (snackbar). Подтверждение
команды («Сцена Закат активирована»), предупреждение, информация.
Авто-закрывается через 2.5–5 секунд.

## Когда выбирать

- Подтверждение успешного действия
- Не-критичные ошибки («Не удалось связаться, повтор...»)
- Уведомления о background-процессах

## Когда не выбирать

- Критичные ошибки → modal / `PersistentBanner`
- Длинные сообщения (>2 строк) — toast скрывается
- Когда требуется action confirmation (Yes/No)

## API

```ts
interface ToastOptions {
  id?: string;
  kind: 'info' | 'success' | 'warning' | 'danger';
  message: ReactNode;
  description?: ReactNode;
  duration?: number;                      // ms, default 3000
  action?: { label: string; onClick: () => void };  // optional CTA
  dismissible?: boolean;                  // default true
}

// Hook-API
function useToast(): {
  show: (opts: ToastOptions) => string;   // returns id
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

// Provider обязателен
function ToastProvider(props: {
  position?: 'top' | 'bottom' | 'top-right' | ...;
  max?: number;                            // одновременных, default 3
  children: ReactNode;
}): JSX.Element;
```

## Жесты и состояния

| Жест                  | Эффект                          |
|-----------------------|---------------------------------|
| Swipe-down (touch)    | Dismiss                         |
| Tap action button     | Triggers action, dismisses      |
| Tap close X           | Dismiss (если dismissible)      |
| Auto-timeout          | Auto-dismiss с fade             |

## Accessibility

- `role="status"` для info, `role="alert"` для danger
- `aria-live="polite"` для всех (sr читает при появлении)
- Focus НЕ автоматически забирается (toast — не модальный)
- При hover/focus — pause timer (стандартный UX)

## Цветовые стили

### cinematic-dark
Toast: pill-shape rounded 999px (или 14px для multi-line), фон
`rgba(20, 16, 12, 0.95)` с `backdrop-blur(20px)`, бронзовый border.
Иконка kind слева, message Fraunces 14pt, action mono dim.

### editorial-dark
Squared toast, gold accent.

### neo-brutalism
Square с чёрным 3px border, offset shadow `4px 4px 0 0 #000`.
Solid цветной фон по kind.

### material
M3 Snackbar — rectangular, single line preferred. Action в trailing.

### cupertino
iOS-style HUD: rounded pill в bottom-center, frosted blur.

### ivory-day
Молочный toast с тёмной типографикой.

## Технические заметки

- Singleton-Provider держит queue, max-ограничение
- Анимация enter: slide-in от bottom + fade, duration 350ms
- Exit: slide-out + fade
- Stacking: при max+1 — старейший pop'ается
- Portal в `document.body`, fixed position
- Swipe-to-dismiss: pointer-tracking, threshold 60px по Y, при
  > threshold — dismiss с continuation animation
- Timer pause при focus-within или mouseenter
