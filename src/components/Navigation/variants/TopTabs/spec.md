# TopTabs

## Суть

Горизонтальные табы вверху экрана, каждая комната = таб. Активная
выделена цветом, индикатором или underline. Классика desktop/web.

## Когда выбирать

- 3–6 комнат
- Desktop / tablet, где ширина позволяет
- Когда табы важно показать ВСЕ сразу

## Когда не выбирать

- >6 комнат — не помещаются → `PillCarousel`
- Mobile portrait — кнопки далеко от пальца → `BottomTabs`
- Иерархия комнат сложная → `TreeView`

## API

```ts
interface TopTabsProps {
  items: NavigationItem[];
  activeId: string;
  onChange: (id: string) => void;
  badges?: Record<string, number>;       // id → count
  disabled?: boolean;
  scrollable?: boolean;                  // если items >6, allow scroll
}
```

## Жесты и состояния

| Жест           | Эффект                          |
|----------------|---------------------------------|
| Tap tab        | Activate, smooth indicator move |
| Keyboard ←→    | Prev/next tab                   |
| Home/End       | First/last                      |
| Scroll         | Если scrollable=true            |

## Accessibility

- `<nav role="tablist">`
- Каждый tab — `role="tab"`, `aria-selected`, `aria-controls`
- Связь tab → panel через `aria-labelledby`
- Roving tabindex: только активный в tab-order

## Цветовые стили

### cinematic-dark
Высота 56px, тонкий бронзовый border снизу. Tab — text-only Fraunces
16pt, active имеет underline-indicator: бронзовая полоса 2px snake
между tabs. Badge — мелкий круг с числом справа от name.

### editorial-dark
Тонкий gold underline, italic font для active.

### neo-brutalism
Square tabs с чёрной 3px рамкой каждый. Active — фон жёлтый. Без
animation indicator.

### material
M3 PrimaryTab с filled background для active, underline 3px primary.

### cupertino
iOS segmented control style: pill background, active — solid filled
rounded rect. Subtle spring при tap.

### ivory-day
Тёплый underline-indicator, активная tab — тёмная бронза.

## Технические заметки

- Indicator-bar: absolute `<div>` с `left/width` рассчитанным из
  bounding-rect активной tab, transition 300ms ease
- Scrollable mode — `overflow-x: auto`, при switch — `scrollIntoView
  ({ inline: 'center' })` для активной
- Roving tabindex: только активная имеет `tabIndex={0}`, остальные
  `tabIndex={-1}`
- ResizeObserver для пересчёта indicator при resize окна
