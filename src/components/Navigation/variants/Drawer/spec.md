# Drawer

## Суть

Боковая выезжающая панель (sliding sidebar) — бургер-меню классики.
Экономит экранное пространство на главном, но скрывает структуру —
discoverability ниже.

## Когда выбирать

- Много (>10) разделов, не помещаются на верхнем уровне
- Когда основной контент должен занимать весь viewport
- Desktop / tablet — drawer может быть постоянным (rail)

## Когда не выбирать

- Mobile-first, основная нав → `BottomTabs` или `PillCarousel`
- Когда пользователь часто переключается — drawer тормозит

## API

```ts
interface DrawerProps {
  items: NavigationItem[];
  activeId: string;
  onChange: (id: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: 'left' | 'right';
  variant?: 'modal' | 'persistent' | 'rail';
  badges?: Record<string, number>;
}
```

`variant`:
- `modal` — overlay поверх контента, scrim снизу
- `persistent` — постоянная sidebar, контент сдвигается
- `rail` — узкая (80px) collapsed-форма с иконками

## Жесты и состояния

| Жест                       | Эффект                                       |
|----------------------------|----------------------------------------------|
| Tap toggle button          | Open/close                                   |
| Swipe right edge → left    | Open                                         |
| Swipe drawer → right       | Close                                        |
| Tap scrim                  | Close                                        |
| Esc                        | Close                                        |
| Tap item                   | Activate + auto-close (для modal)            |

## Accessibility

- `<nav>` внутри drawer
- Focus-trap внутри открытого drawer
- При open — `inert` на main content
- `aria-expanded` на trigger-кнопке
- `role="dialog"` для modal-варианта

## Цветовые стили

### cinematic-dark
Drawer 280px wide, фон `linear-gradient(180deg, rgba(20, 14, 10,
0.96), rgba(10, 8, 6, 0.96))` + `backdrop-blur(32px)`. Бронзовый
border справа. Items — Fraunces 16pt в rows 56px. Active item:
фон `rgba(var(--cr) var(--cg) var(--cb) / 0.1)`, левый бронзовый bar.

### editorial-dark
Минималистичный, серьёзный typography. Gold accent for active.

### neo-brutalism
Drawer белый с чёрной 3px рамкой справа. Items — крупные чёрные mono.
Active — жёлтый фон.

### material
M3 NavigationDrawer с elevated surface, M3 list items.

### cupertino
iOS-style sidebar grouped list, frosted background.

### ivory-day
Молочный фон, тёмные items, тёплый active accent.

## Технические заметки

- Modal: portal в `document.body`, scrim — fixed-positioned div
  с `pointer-events` blocking
- Swipe-from-edge: `pointerdown` в первых 20px от края экрана,
  затем `pointermove` tracks drawer offset
- Focus-trap: `useFocusTrap` hook (TabKey-cycle внутри drawer)
- Persistent vs modal — controllable через media-query:
  `tablet+ → persistent`, `mobile → modal`
- `Esc`-handler через `useEffect` + `keydown` listener
