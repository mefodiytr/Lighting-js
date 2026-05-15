# Navigation — переключение между комнатами/этажами/группами

Иерархия объекта: этаж → комната → группа → устройство. Виджеты
для переключения текущего «контекста» панели.

## Общий API

```ts
interface NavigationItem {
  id: string;
  name: string;
  badge?: number;                    // например количество включенных
  icon?: ReactNode;
  children?: NavigationItem[];       // для tree-view
}

interface NavigationCommon {
  items: NavigationItem[];
  activeId: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}
```

## Варианты

| Файл              | UX-метафора                                                |
|-------------------|------------------------------------------------------------|
| `TopTabs`         | Горизонтальные табы вверху                                 |
| `BottomTabs`      | Вкладки внизу под пальцем (для больших телефонов)          |
| `PillCarousel`    | Скроллящиеся «таблетки» комнат, текущая выделена           |
| `Drawer`          | Боковая шторка (бургер-меню)                               |
| `TreeView`        | Этаж → комната → группа, разворачивающийся                 |
| `FloorPlan`       | Миниатюра плана этажа, тап по комнате открывает её         |
| `SwipeBetween`    | Горизонтальный свайп всего экрана между комнатами (Stories)|

## Когда какой выбирать

- **Объект 3–5 комнат** → `BottomTabs` или `PillCarousel`
- **Объект 5–15 комнат** → `PillCarousel` или `Drawer`
- **Большой объект (отель, офис)** → `TreeView` или `FloorPlan`
- **Премиум, кинематографично** → `SwipeBetween`
- **Эксперт / инсталлятор** → `TreeView` + breadcrumbs

## Принципы реализации

- `TopTabs`/`BottomTabs` — `<nav role="tablist">`, элементы
  `role="tab"` с `aria-selected`
- `PillCarousel` — scroll-snap, активная pill центрируется через
  `scrollIntoView({ inline: 'center' })`
- `Drawer` — focus-trap внутри, ESC закрывает, swipe-to-close
- `FloorPlan` — SVG-план, зоны как `<polygon role="button">`
- `SwipeBetween` — pan-gesture на корне страницы, переход через
  `transform: translateX` с inertia
