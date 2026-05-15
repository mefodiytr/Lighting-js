# BottomTabs

## Суть

Tab-bar внизу экрана: 3–5 главных контекстов под пальцем. Стандарт
mobile-приложений (iOS Tab Bar, Material BottomNavigation).
Доминирует на больших телефонах (6"+).

## Когда выбирать

- Mobile-only / mobile-first
- 3–5 главных разделов (комнаты или функции — сцены/расписания/настройки)
- Когда хочется hand-reach под большой палец

## Когда не выбирать

- Desktop / tablet wide — теряется визуально → `TopTabs`
- >5 пунктов — не помещаются → последний слот «Ещё» с overflow-menu
- Когда основной контент уже большой и tab-bar забирает место

## API

```ts
interface BottomTabsProps {
  items: NavigationItem[];          // 3-5 рекомендуется
  activeId: string;
  onChange: (id: string) => void;
  badges?: Record<string, number>;
  showLabels?: 'always' | 'active-only' | 'never';
  haptics?: boolean;
}
```

## Жесты и состояния

| Жест           | Эффект                              |
|----------------|-------------------------------------|
| Tap            | Activate, haptic tick               |
| Tap по active  | Scroll-to-top (если поддерживается) |
| Long-press     | Quick-actions menu (iOS-style)      |

## Accessibility

- `<nav role="tablist" aria-label="Main">`
- `aria-current="page"` на active tab
- Минимум 48×48 touch-target (M3) для каждого
- Safe-area-inset-bottom: `padding-bottom: env(safe-area-inset-bottom)`
  для iPhone с home-indicator

## Цветовые стили

### cinematic-dark
Bar высота 64px + safe-area. Фон `rgba(10, 8, 6, 0.85)` с
`backdrop-blur(24px)`. Icon 24px по центру, label под ним 11pt
mono. Active: icon `--color-accent`, label `--color-text-primary`,
плюс subtle dot indicator 4px над иконкой. Inactive: dim.

### editorial-dark
Без blur background, плоский. Active — gold icon + label uppercase.

### neo-brutalism
Bar белый с чёрной 3px рамкой сверху. Tab — square slot 64×64 с
чёрной обводкой каждый. Active — фон жёлтый.

### material
M3 NavigationBar (height 80dp). Icon с label всегда. State-layer 
ripple при tap.

### cupertino
iOS Tab Bar: blur background, icon + label compact. SF Symbols.

### ivory-day
Тёплый bg, тёмная бронза для active.

## Технические заметки

- Safe-area через CSS env-variables
- Backdrop-blur fallback: solid background для старых браузеров
  через `@supports`
- Scroll-to-top: если active tab tap, отправлять `window.scrollTo
  ({ top: 0, behavior: 'smooth' })` или event для child route
- Long-press quick-actions — context-menu через portal
- showLabels='active-only' анимирует label при switch
