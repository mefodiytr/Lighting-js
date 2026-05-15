# SvgFixture

## Суть

Реалистичный SVG-рендер конкретного светильника (лампочка
Edison, подвес, прожектор, бра, торшер) с физически
правдоподобной заливкой при включении: filament накаливается,
стекло меняет цвет, появляется halo. Эталонный premium-вариант
из showcase v2.

## Когда выбирать

- Premium home-screen, hero-tile комнаты
- Карточка конкретного устройства с известным типом фикстуры
- Шоу-объекты, бутик-отели — атмосферный UI

## Когда не выбирать

- Когда модель фикстуры в проекте — не одна из канонических
  (поддерживаем фиксированный набор; кастомные SVG требуют ручной
  работы дизайнера)
- B2B / brutalism / material — метафора слишком декоративна
- Когда нужна высокая плотность интерфейса

## API

```ts
interface SvgFixtureProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  label: ReactNode;
  description?: ReactNode;
  fixture: 'edison' | 'pendant' | 'sconce' | 'floor-lamp' | 'spot' | 'chandelier';
  glowColor?: string;
  cct?: number;                         // 2200..6500K, влияет на цвет filament/glow
  size?: 'sm' | 'md' | 'lg';
}
```

## Жесты и состояния

| Жест                 | Эффект                                                |
|----------------------|-------------------------------------------------------|
| Tap                  | Переключение, filament накаливается, halo появляется  |
| Keyboard Space/Enter | Переключение                                          |

Анимация on:
1. 0–150ms: filament разогревается (filter `drop-shadow` grows)
2. 0–500ms: стекло меняет fill через SVG-gradient
3. 0–700ms: halo появляется и начинает breathe
4. При cct ≠ default — цвет filament и glow интерполируется по
   Planckian locus

## Accessibility

- `role="switch"`, `aria-checked`, label обязателен
- Анимация запуска (filament heat-up) отключается при
  `prefers-reduced-motion` — мгновенный jump в финальное состояние
- Текстовое описание фикстуры в `aria-description` (например
  «настольная лампа Edison»)

## Цветовые стили

### cinematic-dark (canonical)
Полная реализация из showcase v2:
- Glass: `radialGradient` 40%/35% c stops `#fff4dc`, `#ffc888`, `#aa6e30`
  при on; `#3a2e22`, `#2a2018`, `#1a1410` при off
- Filament: `linearGradient` `#fff4dc → #ffaa50` с drop-shadow
- Base: бронзовый `linearGradient` `#8a6d3f → #5e4528 → #3a2814`
- Halo: 280×280px radial, breathe 4s, opacity 1 → 0.85

### editorial-dark
То же, но без breathe (статический glow), цвета сдвинуты в gold:
filament `#fff0c8 → #d4af6a`. Меньше «киношности».

### neo-brutalism — ✕ НЕ РЕАЛИЗУЕТСЯ
Реализм фикстуры противоречит языку. Альтернатива — line-art
иконка фикстуры в `CardToggle`.

### material — ✕ НЕ РЕАЛИЗУЕТСЯ
То же. Material Symbols имеют свои стилизованные иконки фикстур
(`lightbulb`, `floor_lamp`), используйте их в `LampButton`.

### cupertino — ✕ НЕ РЕАЛИЗУЕТСЯ
Использовать SF Symbol эквиваленты в `LampButton`.

### ivory-day — ◐ адаптация
Background светлый, поэтому halo должен быть плотнее и теплее
(`rgba(220,150,70,0.5)`). Glass-fill в off — нейтрально-серый, не
угольный. Filament в off — `#9a8a72`.

## Технические заметки

- Каждый `fixture` — отдельный React-компонент с inline SVG
  (`<EdisonSvg>`, `<PendantSvg>`, ...), общий wrapper —
  `<SvgFixture>` диспетчит по типу
- Filament-glow реализуется через стек `filter: drop-shadow()`
  (см. v2 в showcase, до 2 drop-shadow подряд)
- CCT-цвет: маппим Kelvin → RGB по Planckian locus, передаём через
  CSS-переменную `--filament-color` внутрь SVG
- Halo — отдельный `<div>` снаружи `<svg>`, чтобы blur не съедал
  filament-glow
- Размер size=md ≈ 120×140 (как в showcase), sm = 80×95, lg = 180×210
