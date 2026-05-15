# DoubleTapNeutral

## Суть

Не самостоятельный виджет, а **поведенческая надстройка** к любому
CCT-slider'у (Linear/Arc): двойной тап по slider'у возвращает
значение к «нейтральной» точке (обычно 4000K). Аналог
«середина громкости одним нажатием» в audio-mixer'ах.

## Когда выбирать

- Дополнение к `LinearKelvin` или `ArcSunMoon` — всегда полезно
- Когда пользователь регулярно «уходит и возвращается» к нейтрали
- Premium-сегмент, где маленькие удобства важны

## Когда не выбирать

- `PresetChips` уже имеет explicit-кнопку нейтрали
- Если double-tap уже занят другой функцией (zoom, edit)

## API

```ts
// Использование как HOC/decorator
interface UseDoubleTapNeutralOptions {
  enabled?: boolean;
  neutralValue: number;             // default 4000
  thresholdMs?: number;             // default 300ms между tap'ами
  visualFeedback?: boolean;         // вспышка на slider'е
  haptics?: boolean;
}

function useDoubleTapNeutral(
  ref: RefObject<HTMLElement>,
  onReset: (next: number) => void,
  opts: UseDoubleTapNeutralOptions,
): void;

// Или как Wrapper
interface DoubleTapNeutralProps {
  neutralValue: number;
  children: ReactElement;           // оборачиваемый slider
  onReset?: () => void;
}
```

## Поведение

| Жест                              | Эффект                                |
|-----------------------------------|---------------------------------------|
| Two taps < thresholdMs            | Reset к neutralValue, haptic pop      |
| Single tap                        | Передаётся в дочерний slider (normal) |
| Tap + move (drag)                 | Дочерний slider — drag, не considered |

## Accessibility

- Не имеет собственного виджета, но добавляет `aria-keyshortcuts`
  к slider: «Double-tap для возврата к нейтральному 4000K»
- Keyboard: ставится клавиша «N» как альтернатива (configurable)
- SR-доступ: hidden `<button>` рядом со slider'ом «Вернуть к
  нейтральному» — гарантирует доступность независимо от gesture

## Цветовые стили

Visual feedback при срабатывании — короткая вспышка на slider'е
(0.5s). Тема влияет на цвет вспышки:

### cinematic-dark
Track вспыхивает glow `rgba(var(--cr) var(--cg) var(--cb) / 0.5)`
на 400ms с fade. Thumb получает scale 1.15 → 1 spring.

### editorial-dark
Тонкая золотая вспышка, без scale.

### neo-brutalism
Thumb обводится толстой чёрной рамкой 6px на 300ms, потом возвращается.

### material
Ripple-effect из центра slider'а (M3 motion).

### cupertino
Subtle iOS-style spring: thumb bounce без visual flash.

### ivory-day
Тёплая вспышка, мягкая.

## Технические заметки

- Detection двойного тапа: `lastTapTime` в ref'е, при втором
  pointerdown проверяем `now - lastTapTime < thresholdMs`
- При срабатывании — `event.preventDefault()` для нижележащего
  slider'а, чтобы не сместить thumb
- Haptics: `navigator.vibrate(20)` для подтверждения
- Visual feedback — отдельный absolute-`<div>` поверх slider'а с
  CSS-keyframe animation
- Wrapper-форма не интерферирует с props детского виджета: cloneElement
  + `onPointerDown` proxy
