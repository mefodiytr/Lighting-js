# SkeletonLoader

## Суть

Серые прямоугольники, имитирующие будущую структуру контента,
показываются во время загрузки. Лучше спиннеров — даёт пользователю
sense of progress и structure.

## Когда выбирать

- Любая асинхронная загрузка (карточки устройств, списки сцен)
- Когда время загрузки > 200ms
- Premium-сегмент: спиннер выглядит дёшево, skeleton — нет

## Когда не выбирать

- Mгновенная (<100ms) загрузка — лучше ничего не показывать
- Когда структура карточки часто меняется — skeleton устаревает

## API

```ts
interface SkeletonLoaderProps {
  variant?: 'text' | 'rect' | 'circle' | 'card';
  width?: number | string;
  height?: number | string;
  count?: number;                        // для повторения
  animation?: 'shimmer' | 'pulse' | 'none';
  children?: ReactNode;                  // structural pre-set
}
```

Композиция:
```tsx
<SkeletonLoader variant="card" width={160} height={160} />
<SkeletonLoader variant="text" width="60%" height={14} />
<SkeletonLoader variant="text" width="40%" height={12} />
```

## Поведение

- Без интерактивности
- Reading order: SR пропускает (`aria-hidden="true"`)

## Accessibility

- `aria-busy="true"` на родителе во время skeleton render
- `aria-hidden="true"` на самих skeleton элементах
- Optional `aria-live="polite"` с «Загрузка...» при первом show

## Цветовые стили

Тема влияет на цвет skeleton и animation tint.

### cinematic-dark
Base color: `rgba(60, 45, 30, 0.3)`. Shimmer-overlay: linear-gradient
`90deg, transparent, rgba(120, 95, 65, 0.15), transparent`,
`background-position` animation 1.5s linear infinite.

### editorial-dark
Тоньше shimmer, более «бумажный» матовый вид.

### neo-brutalism
Solid чёрный `#000` placeholder без shimmer. Pulse-blink-rate 500ms
(резко).

### material
M3 tonal grey, M3 shimmer animation.

### cupertino
iOS-style grey gradient, smooth shimmer.

### ivory-day
Beige base `rgba(220, 200, 170, 0.4)`, тёплый shimmer.

## Технические заметки

- Shimmer: `background: linear-gradient(90deg, base 0%, highlight
  50%, base 100%); background-size: 200% 100%; animation: shimmer
  1.5s linear infinite` keyframes для `background-position`
- При `prefers-reduced-motion` — `animation: none` и плоский color
- Card variant: combined shapes для типичных layouts (Toggle.Card,
  Scene.PhotoCard и т.д.)
- Should NOT block render: показывать сразу при `isLoading`, скрывать
  при data-ready
