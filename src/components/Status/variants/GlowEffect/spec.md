# GlowEffect

## Суть

Не самостоятельный визуальный виджет, а **эффект**: карточка
устройства светится цветом текущего состояния (тёплый glow когда
лампа горит тёплым 2700K, синий — когда холодный, и т.д.).
Premium-эмоция «карточка живёт цветом самой лампы».

## Когда выбирать

- Premium home-screen, hero-tiles
- Когда хочется передать «лампа горит» эмоционально, не только
  информационно
- Темы cinematic-dark / editorial-dark, где glow гармонично читается

## Когда не выбирать

- Brutalism, material light, light-day themes — glow выглядит
  чужеродно
- Когда карточек много в плотной решётке — glow визуально
  пересекаются

## API

```ts
// Hook-API
interface UseGlowEffectOptions {
  enabled?: boolean;
  intensity?: number;                  // 0..1, scale glow strength
  color?: Rgb;                          // override accent color
  pulse?: boolean;                      // breathing когда active
}

function useGlowEffect(
  active: boolean,
  opts?: UseGlowEffectOptions,
): { className: string; style: CSSProperties };

// HOC-API
function WithGlowEffect(
  Component: ComponentType<any>,
  defaults?: UseGlowEffectOptions,
): ComponentType;
```

## Поведение

Возвращает CSS-объект с `box-shadow` и/или `filter: drop-shadow`,
динамически зависящий от:
- active (on/off)
- intensity (опция или контроль extern)
- accent vars (--cr/--cg/--cb)

## Accessibility

- Чисто визуальный, без accessibility интерактива
- Не должен использоваться как ЕДИНСТВЕННЫЙ индикатор state'а —
  всегда дополняется `aria-pressed` или `data-state` на корне

## Цветовые стили

### cinematic-dark (canonical)
Карточка получает `box-shadow: 0 0 32px rgba(var(--cr) var(--cg)
var(--cb) / ${intensity * 0.5}), 0 0 64px rgba(var(--dr) var(--dg)
var(--db) / ${intensity * 0.2})`. При pulse — breathe 4s.

### editorial-dark
Тоньше glow: `0 0 20px ... opacity 0.3`.

### neo-brutalism — ✕ НЕ РЕАЛИЗУЕТСЯ
Эффект противоречит языку «hard shadow, без blur». Альтернатива —
solid фон карточки или жёлтая обводка.

### material — ◐ адаптация
M3 не использует glow, но при active можно сделать subtle
`box-shadow` с tonal-surface оттенком. Без pulse.

### cupertino — ◐ адаптация
iOS лёгкий glow приемлем (как notification badge bloom), но
сдержанно. Pulse только если важно.

### ivory-day — ✕ НЕ РЕАЛИЗУЕТСЯ
На светлом фоне glow тонет. Альтернатива — accent-coloured border.

## Технические заметки

- Glow реализуется через `box-shadow` с rgba-fade
- Pulse: `@keyframes` на opacity и box-shadow-spread
- При `prefers-reduced-motion` — pulse off, static glow
- При множестве карточек с glow на одном экране — performance
  budget может страдать (composite-overlap). Ограничение через
  `max-glows: 6` на view, остальные fallback к border-accent
- Класс `accent-animated` смешивается, чтобы glow color
  интерполировался при смене preset'а
