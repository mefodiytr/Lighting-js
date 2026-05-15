# MaterialSwitch

## Суть

Material Design 3 switch: крупнее iOS-варианта (52×32 track,
24→28px thumb с увеличением), state-layer ripple, outlined
track в off-состоянии. Бóльший tap-target — лучше для пальца.

## Когда выбирать

- Android-PWA, где пользователь ожидает Material
- Семейное жильё, пожилые пользователи: thumb крупнее
- Когда нужен ripple-feedback (визуальное подтверждение тапа)

## Когда не выбирать

- iOS-PWA — выглядит «чужим»
- Премиум-эстетика — Material слишком утилитарен
- Плотные списки — занимает больше места, чем `IosSwitch`

## API

```ts
interface MaterialSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;                  // M3 icon-on-thumb (необязательно)
  haptics?: boolean;
}
```

## Жесты и состояния

| Жест                 | Эффект                                |
|----------------------|---------------------------------------|
| Tap                  | Переключение + ripple на thumb        |
| Drag                 | Не поддерживается (M3 default)        |
| Keyboard Space/Enter | Переключение                          |

| State    | Visual                                          |
|----------|-------------------------------------------------|
| off      | Outlined track (border), thumb внутри 24px      |
| on       | Filled track, thumb 28px справа, icon если есть |
| pressing | State-layer overlay 12% opacity вокруг thumb    |
| disabled | Opacity 0.38                                    |

## Accessibility

- `role="switch"` + `aria-checked` + `aria-labelledby`
- Минимум 48×48px touch-target (M3 guideline)
- Контраст ≥ 3:1 для track-off outline на background

## Цветовые стили

### material (native)
Track-off: outlined `--color-text-faint` (1px border), фон
`--color-bg-elevated`. Track-on: filled `--color-accent`. Thumb-off:
`--color-text-muted`. Thumb-on: `--color-bg-base`. Icon — `--color-accent-deep`.

### cinematic-dark
Track-off: filled `#1a1410` с тёплым outline `rgba(120,95,65,0.4)`.
Track-on: `#3a2814` с бронзовым glow. Thumb-on — бронза. State-layer
ripple — `rgba(212, 167, 106, 0.12)`.

### editorial-dark
То же, но без glow, с золотым acent. Ripple — едва заметный 8%.

### neo-brutalism
Чёрный border 3px, прямые углы, без ripple. On — `#ffd400` fill.
Никаких transitions.

### cupertino
Используется крайне редко (на iOS нет M3 — обычно подменяется
на `IosSwitch`). Реализация — для дев-сред, где нужно сравнение.

### ivory-day
Track outlined тёплым тоном, on-state — `#b8895a`. Ripple —
тёплый молочный 20%.

## Технические заметки

- Ripple реализуется через CSS `radial-gradient` mask + JS-таймер,
  без библиотек. Один elemenet с `transform: scale()`.
- Thumb-resize (24→28px) делается через CSS `width`/`height` с
  transition, либо через `transform: scale(1.166)`
- State-layer — отдельный `::before` с `opacity` по pointer state
