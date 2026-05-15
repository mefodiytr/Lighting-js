# PhotoCard

## Суть

Карточка сцены с реальной фотографией комнаты в этой сцене. Самый
наглядный paттерн — пользователь сразу видит, как будет выглядеть
помещение. Требует фотосессии, но даёт огромную ценность.

## Когда выбирать

- Premium-объекты с бюджетом на фотосъёмку
- Hero-tile сцен на главной странице
- Когда сцены сильно отличаются (закат vs утро vs кино)

## Когда не выбирать

- Нет качественных фото — fallback к `GradientSwatch`
- Сцены динамические и часто меняются — фото устареет

## API

```ts
interface PhotoCardProps {
  id: string;
  name: string;
  photoUrl: string;
  photoBlurDataUrl?: string;        // base64 LQIP placeholder
  active?: boolean;
  onActivate: (id: string) => void;
  onLongPress?: (id: string) => void;
  disabled?: boolean;
  aspectRatio?: number;             // default 4/3
  overlay?: 'none' | 'soft' | 'strong';
}
```

## Жесты и состояния

| Жест               | Эффект                                            |
|--------------------|---------------------------------------------------|
| Tap                | Activate сцена (тонкая haptic, сцена выехала)     |
| Long-press         | Открыть редактор сцены                            |
| Keyboard Enter     | Activate                                          |

| State    | Visual                                                   |
|----------|----------------------------------------------------------|
| inactive | Слегка dim, overlay name снизу                           |
| active   | Bright frame, чек-mark или glow border                   |
| pressing | scale(0.98)                                              |

## Accessibility

- `<button>` с `aria-pressed`, `aria-label="Сцена X, активна"`
- Photo — `<img alt="">` (декоративно — name уже в label)
- Минимум 88×88 touch-target
- Контраст name на overlay ≥ 4.5:1 — overlay-strength опция

## Цветовые стили

Фото = база, тема влияет на frame, overlay-density, active-indicator.

### cinematic-dark
Card border тонкий бронзовый, при active — толще + glow `rgba(var(--cr)
var(--cg) var(--cb) / 0.4)`. Overlay gradient `linear-gradient(0deg,
rgba(0,0,0,0.7) 0%, transparent 60%)` для читаемости name снизу. Name —
Fraunces 17pt в нижнем левом.

### editorial-dark
Border square, gold. Overlay tighter, name italic serif на нём.

### neo-brutalism
Border чёрный 4px, offset shadow. Active — фон-border переключается
на жёлтый. Name в большой чёрной box внизу.

### material
M3 card elevated, active state — checked indicator в правом верхнем,
M3 ripple на tap.

### cupertino
iOS rounded card с большим радиусом 20px. Active — checkmark.iOS-blue,
subtle frosted-overlay снизу для name.

### ivory-day
Светлый frame с тёплой тенью. Active — тёмная бронзовая рамка.

## Технические заметки

- LQIP через `photoBlurDataUrl`: показывается blurred placeholder до
  загрузки реального фото (Plaiceholder/Blurhash)
- Lazy loading: `loading="lazy"` на `<img>`
- Image optimization: WebP/AVIF с fallback JPEG
- Active-state с `transition: 600ms` для smooth entrance
- Long-press detect — общий `useLongPress({ ms: 600 })` hook
- При `disabled` — фото обесцвечивается через `filter: grayscale(60%)`
