# LongPressEdit

## Суть

Не самостоятельный виджет, а **поведенческая надстройка** к любому
варианту сцены (PhotoCard, GradientSwatch, IconLabel, ...): долгий
тап = вход в edit-режим без отдельной кнопки «Edit». Освобождает
UI, экономит экранное пространство.

## Когда выбирать

- Premium-эстетика: чистый UI без кнопок «Edit»
- Любой вариант сцены — обёртывается через wrapper
- Когда edit-операция редкая, основной use case — activate

## Когда не выбирать

- Когда edit-операция частая → визуальная кнопка «Edit» лучше
- Discoverability важна → нужен hint или onboarding

## API

```ts
interface LongPressEditOptions {
  enabled?: boolean;
  holdMs?: number;             // default 600
  haptics?: boolean;           // pop on enter
  hintAfterMs?: number;        // показать «Hold to edit» подсказку
}

function useSceneLongPressEdit(
  onEdit: (sceneId: string) => void,
  opts: LongPressEditOptions,
): {
  pointerHandlers: { onPointerDown, onPointerUp, ... };
  isPressing: boolean;
  progress: number;       // 0..1 для optional ring progress
};

// Wrapper-форма
interface LongPressEditWrapperProps {
  onEdit: (id: string) => void;
  holdMs?: number;
  children: ReactElement;
  showProgress?: boolean;
}
```

## Поведение

| Жест                            | Эффект                                       |
|---------------------------------|----------------------------------------------|
| Tap (<holdMs)                   | Передаётся ребёнку (activate сцена)          |
| Hold ≥ holdMs                   | Trigger onEdit, haptic pop, опц. progress ring |
| Release до holdMs               | Передаётся как tap                           |
| Move >12px после down           | Cancel: ни tap, ни edit (был случайный drag) |

## Accessibility

- На SR — нужен альтернативный путь к edit: «Edit»-кнопка в visible
  context-menu (через `aria-controls`)
- Keyboard: контекст-меню через Shift+F10 или ContextMenu key
- `aria-keyshortcuts="Long-press"` на корне сцены

## Цветовые стили

Optional progress ring отображает прогресс hold'а. Тема влияет на ring.

### cinematic-dark
Progress ring: SVG `<circle>` вокруг сцены, `stroke="var(--color-accent)"`
с `drop-shadow` glow. Появляется при `progress > 0.1`.

### editorial-dark
Тонкая золотая ring, без glow.

### neo-brutalism
Чёрная ring 4px, без анимации smooth — step-fill.

### material
M3-style ring с primary color и halo.

### cupertino
iOS-style: card scale до 1.05 при hold, halo вокруг.

### ivory-day
Тёплая бронзовая ring.

## Технические заметки

- Та же логика, что и `Dimmer/LongPressDrag`, но без drag-phase
- Detection: `pointerdown` → `setTimeout(holdMs)` → fire onEdit
- `pointerup` до timeout → fire onTap (передаётся child через
  cloneElement/render-prop)
- Move-threshold: 12px Manhattan distance
- Hint показывается ТОЛЬКО при первых N tap'ах (LocalStorage) и
  убирается после первого использования
