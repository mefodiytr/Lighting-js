# Grid

## Суть

Сцены в плотной сетке: 2×N, 3×N, 4×N (адаптивно). Каждая ячейка —
квадрат с встроенным item (PhotoCard / GradientSwatch / IconLabel).
Самый компактный layout для среднего количества сцен.

## Когда выбирать

- 6–15 сцен, нужен обзор
- Когда хочется показать всё на одном экране без скролла
- Tablet / landscape — больше колонок

## Когда не выбирать

- <4 сцен — выглядит пусто
- >20 сцен — `List` практичнее

## API

```ts
interface SceneGridProps {
  scenes: Scene[];
  activeId?: string;
  onActivate: (id: string) => void;
  renderItem: (scene, isActive) => ReactElement;
  cols?: number | 'auto';
  gap?: number;                       // px, default 16
  disabled?: boolean;
}
```

`cols: 'auto'` использует `auto-fill` + `minmax(120px, 1fr)`.

## Жесты и состояния

| Жест               | Эффект                                  |
|--------------------|-----------------------------------------|
| Tap по item        | Activate                                |
| Long-press         | Edit mode (multi-select для batch ops)  |
| Keyboard Arrow     | Перемещение фокуса по сетке             |

## Accessibility

- `<ul role="list">`, items — `<li>` с `<button>` внутри
- Roving tabindex: только активный item в tab-order
- Keyboard nav: ←→↑↓ для перемещения, Enter для activate
- При edit-mode: каждый item — checkbox-like для multi-select

## Цветовые стили

Layout-агностичный. Каждый item наследует свой вариант. Тема влияет
на gap-spacing, активный outline, edit-mode visuals.

### cinematic-dark
Gap 20px. Edit-mode: items получают бронзовый wiggle (как iOS
delete-mode) и `<button>` x в углу.

### editorial-dark
Gap чуть больше (24px), без wiggle. Edit-mode — outline border.

### neo-brutalism
Gap 12px (tighter, brutalism любит плотность). Edit-mode: жёлтая
обводка selected items.

### material
Gap 16px. Edit-mode M3 dialog confirmation.

### cupertino
Gap 12px. Edit-mode iOS wiggle + delete-X.

### ivory-day
Gap 20px, мягкая тень между items.

## Технические заметки

- `display: grid; grid-template-columns: repeat(${cols}, 1fr)` или
  `repeat(auto-fill, minmax(120px, 1fr))` для adaptive
- Aspect-ratio items: `aspect-ratio: 1 / 1` для квадратов
- Edit-mode toggles через context: `<EditModeProvider>` или local state
- Keyboard nav: useRovingTabIndex hook (стандартный паттерн)
- При drag-to-reorder (опционально) — HTML5 DnD или Pointer API,
  re-emit `onReorder(newOrder)`
