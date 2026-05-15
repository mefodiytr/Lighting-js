# PillCarousel

## Суть

Горизонтально скроллящаяся карусель «таблеток» (pill-shaped chip'ов)
с именами комнат. Активная — выделена цветом и/или scale. Промежуточный
вариант между `TopTabs` (фиксированный набор) и `Drawer` (overflow):
видишь часть, скроллишь к остальному.

## Когда выбирать

- 5–12 комнат
- Когда tab-bar не помещается, но scroll OK
- Premium mobile look (carousel ≠ tabs)

## Когда не выбирать

- ≤4 комнат — лучше fixed tabs
- >15 — `Drawer` или `List`-based navigator
- Когда важно увидеть всё одновременно

## API

```ts
interface PillCarouselProps {
  items: NavigationItem[];
  activeId: string;
  onChange: (id: string) => void;
  badges?: Record<string, number>;
  snapAlign?: 'center' | 'start';
  showIcons?: boolean;
}
```

## Жесты и состояния

| Жест                  | Эффект                                       |
|-----------------------|----------------------------------------------|
| Scroll horizontal     | Free scroll                                  |
| Tap pill              | Activate, smooth scroll к центру             |
| Keyboard ←→           | Prev/next                                    |

## Accessibility

- `<nav role="tablist">` с pills как `role="tab"`
- При программной активации — `scrollIntoView({ inline: 'center' })`
- Touch-target ≥ 44 height
- `aria-current="page"` на active

## Цветовые стили

### cinematic-dark
Pill: 36-44px height, padding 14px horizontal, фон `rgba(30, 24, 18,
0.5)`, бронзовый thin border, name Fraunces 14pt. Active pill:
бронзовый fill, name `--color-text-primary`, glow `box-shadow: 0 0
12px rgba(var(--cr) var(--cg) var(--cb) / 0.3)`. Edge-fade-mask
по краям scroll-контейнера.

### editorial-dark
Pill square (12px radius), gold accent на active.

### neo-brutalism
Pill — square с чёрным 3px border. Active — жёлтый fill, без скруглений.
Offset shadow `4px 4px 0 0 #000`.

### material
M3 FilterChip с filled-selected state. Tonal-surface для inactive.

### cupertino
iOS-style: rounded 18px pills, system gray inactive, accent-blue
fill для active.

### ivory-day
Светлые pills с тёплым border, active — тёмная бронзовая заливка.

## Технические заметки

- Container: `overflow-x: auto; scrollbar-width: none`
- `scroll-snap-type: x mandatory; scroll-snap-align: ${snapAlign}`
  на pills
- Edge-fade: `mask-image: linear-gradient(90deg, transparent 0,
  black 8%, black 92%, transparent 100%)`
- Smooth-scroll-to-pill через `pill.scrollIntoView({ behavior:
  'smooth', inline: 'center' })`
- На touch — отключать smooth-behavior через `prefers-reduced-motion`
