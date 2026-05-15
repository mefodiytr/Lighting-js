# Carousel

## Суть

Горизонтальная карусель карточек сцен с центральной выделенной
(scale 1.0) и боковыми (scale 0.85, opacity 0.7). Свайп листает,
текущая сцена — в центре. Cinematic, удобно для большого количества
сцен.

## Когда выбирать

- 5–15 сцен (карусель показывает 3–4 одновременно)
- Premium home-screen, hero-section
- Когда сцены — главное содержание экрана

## Когда не выбирать

- Сцен <5: карусель overkill → `Grid` или `IconLabel`
- Сцен >20: пользователь не доскроллит → `List`

## API

```ts
interface CarouselProps {
  scenes: Array<{
    id: string;
    name: string;
    /* + props совместимого варианта (PhotoCard/GradientSwatch) */
  }>;
  activeId?: string;
  onActivate: (id: string) => void;
  renderItem: (scene, isActive) => ReactElement;  // pluggable
  loop?: boolean;
  snapAlign?: 'center' | 'start';
  itemWidth?: number;                  // px
  itemGap?: number;
  disabled?: boolean;
}
```

## Жесты и состояния

| Жест                       | Эффект                                             |
|----------------------------|----------------------------------------------------|
| Swipe ←→ / scroll          | Листание                                           |
| Tap на side-card           | Snap к ней (становится active)                     |
| Tap на center-card         | Activate сцена                                     |
| Keyboard ←→                | Prev/next                                          |

## Accessibility

- `<div role="region" aria-roledescription="carousel">`
- Каждый item — `<button>` с `aria-current="true"` для активного
- `aria-live="polite"` объявляет смену центральной сцены
- Swipe не должен ловить вертикальный scroll: `touch-action: pan-y`

## Цветовые стили

Сами items наследуют свой вариант (`PhotoCard` или `GradientSwatch`).
Тема влияет на bg карусели, dots indicator, fade-edges.

### cinematic-dark
Карусель — `overflow-x: auto`, side-cards с `opacity: 0.6` и
`transform: scale(0.85)`. Edge-fade через `mask-image: linear-gradient
(90deg, transparent 0%, black 10%, black 90%, transparent 100%)`.
Dots-indicator снизу: маленькие бронзовые круги, активная — крупнее.

### editorial-dark
Без edge-fade, минималистично. Dots — золотые dashes.

### neo-brutalism
Никакого scale/opacity diminishing — каждая card в исходном размере.
Dots — square 8×8 чёрные/жёлтые.

### material
M3 motion: scale + elevation difference. Tab-like dots indicator.

### cupertino
iOS Stories-style: smooth side-fade, big rounded items. Page indicator
iOS-style.

### ivory-day
Светлый bg, тёплое side-dimming.

## Технические заметки

- `scroll-snap-type: x mandatory; scroll-snap-align: center` —
  pure-CSS реализация snap, без JS-карусели
- `IntersectionObserver` отслеживает, какой item центральный — для
  обновления `activeId` при scroll'е
- При программной активации (`activeId` извне) — `scrollIntoView
  ({ block: 'nearest', inline: 'center', behavior: 'smooth' })`
- Loop-режим — duplicate items в обоих концах + scroll repositioning
- При `prefers-reduced-motion` scale/opacity-transitions глушатся
