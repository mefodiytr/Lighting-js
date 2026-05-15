# TreeView

## Суть

Иерархический навигатор: этаж → комната → группа → устройство.
Раскрывается/складывается chevron'ом. Для крупных объектов (отели,
офисы), где плоская структура не подходит.

## Когда выбирать

- Большой объект: 3+ уровня иерархии
- Инсталлятор / админ
- Sidebar внутри `Drawer` (расширение)

## Когда не выбирать

- Простой 1-2 этаж домик → `PillCarousel`
- Mobile-first основная нав — слишком плотно

## API

```ts
interface TreeViewProps {
  items: NavigationItem[];                // recursive с children
  activeId: string;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onChange: (id: string) => void;
  onToggleExpand?: (id: string, expanded: boolean) => void;
  maxDepth?: number;                       // limit рекурсии
  showBadges?: boolean;
  disabled?: boolean;
}
```

## Жесты и состояния

| Жест                  | Эффект                                       |
|-----------------------|----------------------------------------------|
| Tap chevron           | Expand/collapse                              |
| Tap row (не chevron)  | Activate                                     |
| Keyboard ↑↓           | Перемещение между видимыми rows              |
| Keyboard ←            | Collapse (или к родителю)                    |
| Keyboard →            | Expand (или first child)                     |
| Keyboard Enter        | Activate                                     |

## Accessibility

- `<ul role="tree">`, items `role="treeitem"` с `aria-expanded`,
  `aria-selected`, `aria-level`
- `aria-posinset`, `aria-setsize` для крупных trees
- Roving tabindex
- Children — `<ul role="group">`

## Цветовые стили

### cinematic-dark
Row 44px, indent 24px на уровень. Chevron — мелкий бронзовый.
Active row: фон `rgba(var(--cr) var(--cg) var(--cb) / 0.1)`, лев. bar
бронза. Folder-rows бoldнее, leaf-rows тоньше.

### editorial-dark
Минимальный indent (16px), serif typography для folders, mono для
leaf devices.

### neo-brutalism
Indent 32px, chevron — большой `▶/▼` mono. Active — жёлтый фон.

### material
M3 TreeNode с ripple на expand-tap.

### cupertino
iOS list-style indent с chevron-rotate анимацией.

### ivory-day
Светлый layout, тёплые folder names.

## Технические заметки

- Recursion: каждый item рендерится с `depth` prop'ом, который
  определяет padding-left
- Virtualization для гигантских trees: `react-window` + flat-list
  представление с indentation
- Lazy-loading children: `onToggleExpand` может асинхронно загружать
  данные (skeleton показывается)
- Expanded-state — Set<string>, не nested object (быстрее checks)
- Drag-to-reorder (опционально, для admin-mode) — DnD API
