# TapZones

## Суть

Фоновое фото комнаты (или схематичный план) + невидимые
интерактивные зоны поверх реальных светильников. Тап по зоне —
переключает соответствующий канал. Визуальный отклик: на месте
лампы появляется свечение, накладываемое на фото blend-mode'ом.

## Когда выбирать

- Главный экран комнаты с фотореалистичным интерфейсом
- Премиум-объекты, где есть бюджет на фотосессию помещений
- Когда хочется отдалить пользователя от «техничного» UI

## Когда не выбирать

- Если нет качественных фото каждой комнаты в обоих состояниях
- Когда комната часто меняет конфигурацию (мебель → fixtures
  смещаются → фото устаревает)
- Для accessibility-первичных продуктов: SR-пользователю сложно

## API

```ts
interface TapZonesProps {
  photo: string;                            // url изображения
  photoOn?: string;                         // опционально — фото в on-состоянии
  zones: Array<{
    id: string;
    label: string;
    x: number;                              // %, 0..100
    y: number;
    radius?: number;                        // px tap-area, default 44
    checked: boolean;
    glowColor?: string;
    onChange: (next: boolean) => void;
  }>;
  aspectRatio?: number;                     // default 16/9
  groupToggle?: boolean;                    // long-press на пустоте → all on/off
}
```

## Жесты и состояния

| Жест                       | Эффект                                       |
|----------------------------|----------------------------------------------|
| Tap по зоне                | Переключение соответствующего канала         |
| Tap по пустой области      | Игнорируется (или toggle-all если включено)  |
| Long-press по зоне         | Открывает контролы яркости/цвета             |
| Keyboard Tab между зонами  | Фокус прыгает по `zones`, Space переключает  |

Каждая зона ведёт себя как отдельный switch, поэтому
`role="switch"` ставится на зону, не на корень.

## Accessibility

- Каждая зона — `<button role="switch">` с `aria-label`
- Визуальный focus-ring обязателен (зоны невидимы по умолчанию)
- Альтернативный SR-режим: автоматически дублирует список зон
  ниже фото в виде обычных переключателей (через `aria-hidden` на
  фото и видимый fallback-список)
- Контраст фото / glow не критичен (это атмосфера), но visible-focus
  ring должен быть AA на любом пикселе фото

## Цветовые стили

### cinematic-dark
Фото комнаты затемнено overlay `rgba(0,0,0,0.5)`. Glow зон —
`radial-gradient(circle, rgba(255,180,90,0.6) 0%, transparent
60%)`, blur 24px, blend-mode `screen`. Focus-ring — бронза, 2px,
вокруг невидимой круглой зоны.

### editorial-dark
Overlay чуть слабее (0.35), glow — золотой и точечный (без blur).
В off-зонах — едва видимая тонкая золотая окружность 1px (subtle
hint, что здесь есть control).

### neo-brutalism — ◐ адаптация
Фото заменяется на схематичный план (line-art, чёрные линии на
белом). Зоны — чёрные круги 24px с offset shadow. On — заливка
жёлтым `#ffd400`. Никакого blur/glow.

### material
Фото с M3 scrim overlay. Зоны — chip-marker (Material chip).
On — primary fill с tonal-surface. Ripple от тапа на зоне.

### cupertino
Фото frosted-tinted. Зоны — мягкие радиальные blooms iOS-blue/
warm-glow. Focus — синяя обводка iOS-style.

### ivory-day
Фото без overlay (фон светлый). Glow — теплее и плотнее, чтобы
читался на светлом. Focus — тёмная бронза.

## Технические заметки

- Контейнер `position: relative`, фото — `object-fit: cover` с
  фиксированным `aspect-ratio`
- Зоны позиционируются `position: absolute; left: {x}%; top: {y}%`
- При ресайзе зоны сохраняют относительные координаты (%)
- Для group-toggle (long-press на пустоте) — pointer-listener на
  контейнере + raycast-проверка
- Если `photoOn` задан — crossfade двух `<img>` поверх друг друга
  при изменении любого канала, длительность `--duration-luxe`
- Для редактора зон (выставление координат) — отдельный
  `<TapZones.Editor>` компонент (вне MVP)
