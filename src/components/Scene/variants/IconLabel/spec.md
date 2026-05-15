# IconLabel

## Суть

Минималистичная карточка сцены: иконка (☀, ☾, 🎬, 🍷) + имя сцены +
маленький color-dot, показывающий «ключевой» цвет сцены. Без фото,
без градиента. Стиль iOS Shortcuts / Apple Home favorites.

## Когда выбирать

- 3–6 favorite scenes на главном
- Семейное жильё, понятные иконки
- Компактные сетки 3×N

## Когда не выбирать

- Premium «hero» — слишком пресный → `PhotoCard` или `GradientSwatch`
- Когда нужно отличать похожие сцены — иконки могут совпадать

## API

```ts
interface IconLabelProps {
  id: string;
  name: string;
  icon: ReactNode;                  // SVG/emoji/Material Symbol
  accentColor?: Rgb;                // для color-dot
  active?: boolean;
  onActivate: (id: string) => void;
  onLongPress?: (id: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

## Жесты и состояния

| Жест           | Эффект     |
|----------------|------------|
| Tap            | Activate   |
| Long-press     | Edit       |
| Keyboard Enter | Activate   |

## Accessibility

- `<button>`, `aria-pressed`, `aria-label`
- Icon — `<svg aria-hidden="true">`, имя в label несёт смысл
- Color-dot — `aria-hidden="true"` (декорация)

## Цветовые стили

### cinematic-dark
Card 120×120 скруглённая 18px, фон `--color-bg-card-from/to`,
бронзовый thin border. Icon крупный 40px по центру `--color-text-secondary`,
при active — `--color-accent`. Name внизу Fraunces 14pt. Color-dot 6px
в правом верхнем углу с glow при active.

### editorial-dark
Square card, минимальный layout. Icon golden при active.

### neo-brutalism
Square card с чёрным 4px border. Icon — крупный thick-stroke. Color-dot
квадрат 8×8. Active — фон жёлтый.

### material
M3 card outlined → filled при active. Icon Material Symbol с тонким
weight для contrast.

### cupertino
Rounded iOS-style 16px radius. Icon — SF Symbol filled при active.

### ivory-day
Светлая card, иконка тёплый dim в idle, тёмная бронза при active.

## Технические заметки

- Icon — расширяется через `text-color: currentColor`, унаследованный
  state-aware цвет
- Color-dot — `<span style={{background: rgb(...)}}>` 6px circle
- Size variants: sm 96, md 120, lg 144
- При `prefers-reduced-motion` active-transition мгновенный
- Иконки — рекомендуется Lucide или own SVG set (см. variants/Toggle/
  IosSwitch для стандартного подхода)
