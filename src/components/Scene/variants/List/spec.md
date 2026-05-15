# List

## Суть

Вертикальный список сцен с thumbnail слева (фото или color-dot),
именем по центру, иконкой/таймером справа. Для большого количества
сцен — компактнее grid'а, проще скролить.

## Когда выбирать

- >15 сцен
- Сложные сцены с meta-данными (расписание, owner, last-used)
- Edit-режим: bulk operations, reorder

## Когда не выбирать

- <8 сцен — выглядит пусто, grid лучше
- Premium home-screen — слишком утилитарно

## API

```ts
interface SceneListItem {
  id: string;
  name: string;
  thumbnail?: string;             // url или Rgb для color-dot
  subtitle?: string;              // «3 светильника · 4000K»
  scheduledTime?: string;         // «Активируется в 21:00»
  active?: boolean;
}

interface SceneListProps {
  scenes: SceneListItem[];
  activeId?: string;
  onActivate: (id: string) => void;
  onLongPress?: (id: string) => void;
  searchable?: boolean;
  sortable?: boolean;
  groupBy?: 'none' | 'category' | 'recent';
  disabled?: boolean;
}
```

## Жесты и состояния

| Жест                       | Эффект                                       |
|----------------------------|----------------------------------------------|
| Tap row                    | Activate                                     |
| Long-press                 | Open context: edit, delete, share            |
| Swipe ← (mobile)           | Reveal action buttons (delete, edit)         |
| Keyboard ↑↓                | Перемещение                                  |
| Keyboard Enter             | Activate                                     |

## Accessibility

- `<ul role="list">`, rows — `<li>` + `<button>` обёртка
- Search — `<input type="search" role="searchbox">`
- Active row — `aria-current="true"`
- Skip-link для длинных списков

## Цветовые стили

### cinematic-dark
Row height 64px, padding 16px. Thumbnail 48×48 rounded 8px слева.
Name Fraunces 16pt по центру вертикально. Subtitle mono 11pt
`--color-text-muted`. Divider между rows: тонкая бронзовая полоса
`--color-border-subtle`. Active row: фон `rgba(var(--cr) var(--cg)
var(--cb) / 0.08)`, левый thin bar бронза.

### editorial-dark
Тоньше row (52px), divider — серая 1px. Active row — gold border
left 2px.

### neo-brutalism
Row 72px, divider чёрный 2px. Active row: фон жёлтый, name чёрный
mono bold.

### material
M3 ListItem с leading thumbnail, headline, supporting, trailing.
Ripple на tap.

### cupertino
iOS-стиль grouped list: rounded corners на первой/последней row,
divider от 16px left, chevron в trailing.

### ivory-day
Светлые rows с тёплой divider, active — тёплая заливка.

## Технические заметки

- Virtualization для больших списков (>100): `react-window` или
  `IntersectionObserver`-based
- Search-filter — fuzzy match (Fuse.js или встроенный includes)
- Swipe-actions — React Spring или CSS `transform` с
  pointer-tracking
- Group-by использует `<dl>` или `<section>` с `<h2>` заголовками
- Длинные списки: предзагрузка thumbnail'ов через `IntersectionObserver`
