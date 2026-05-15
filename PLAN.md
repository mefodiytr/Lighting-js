# Lighting-js — план библиотеки виджетов

## Контекст

Библиотека UI-виджетов для мобильной панели управления освещением.
Источник вдохновения — `cinematic-dark` showcase из 8 toggle-вариантов
(стекло, лампа, жидкость, латунь, LED, нео-пад, long-press, прожектор).

Цель: разнести виджеты по семантике (Toggle, Dimmer, ColorPicker, CCT,
Scene, Navigation, Schedule, Status, Analytics) и для каждого
зафиксировать набор реализационных вариантов, каждый из которых
должен поддерживать несколько цветовых стилей (тем).

## Архитектурное решение: 3 ортогональных оси

После анализа стилевых направлений и color-tweening паттерна
выделили три независимых измерения:

1. **Вариант** — UX-паттерн и материальная метафора виджета
   (`IosSwitch`, `Knob`, `Touchpad2D`, ...). Жёстко фиксирует разметку,
   жесты, поведение, анимации.
2. **Тема** (chrome) — палитра фон/текст/бордеры, типографика, тени,
   кривые движения. Применяется через смену `data-theme` на корне,
   которая переопределяет CSS custom properties.
3. **Accent / Ambient Tone** — цвет управляемого света сейчас
   (Candle/Amber/Warm/Day/Crimson/Magenta/Cyan/Violet). Передаётся
   через 9 numeric-каналов (`--cr/--cg/--cb`, `--dr/--dg/--db`,
   `--lr/--lg/--lb`), зарегистрированных через `@property` для
   плавной интерполяции. См. `src/theme/accents.css` и `accents.ts`.

Тема фиксирует «как выглядит шрейм UI». Accent — «какого цвета
сейчас лампа». Variant — «какой жест и метафора». Эти три выбираются
независимо.

### Гибридная модель совместимости

Не каждый вариант имеет смысл в каждой теме. Делим варианты:

- **Core (универсальные)** — переживают любую тему: `IosSwitch`,
  `MaterialSwitch`, `CardToggle`, `HorizontalSlider`, `VerticalSlider`,
  `HsvWheel`, `LinearKelvin`, `BottomTabs`, ...
- **Character (стиль-специфичные)** — живут только в совместимых
  темах: `LampButton`/`SvgFixture` (cinematic-dark, editorial-dark),
  `LongPressDrag` (любая, но визуально сильнее в тактильных темах),
  `FloorPlan` (любая, но плотнее в HUD).

Совместимость декларируется в `spec.md` каждого варианта и
проверяется типом `<Toggle variant="bulb" theme="cinematic-dark" />` —
конкретный набор валидных пар закодирован через discriminated unions.

## Каталог тем (фаза 1)

| ID                | Тип            | Когда выбирать                                       |
|-------------------|----------------|------------------------------------------------------|
| `cinematic-dark`  | Атмосферная    | Премиум-апартаменты, бутик-отели                     |
| `editorial-dark`  | Атмосферная    | Журнальный премиум, golden accents                   |
| `neo-brutalism`   | Индустриальная | B2B, MCS, инженерные дашборды                        |
| `material`        | Современная    | Android-PWA, семейное жильё                          |
| `cupertino`       | Современная    | iOS-PWA, привычный паттерн                           |
| `ivory-day`       | Светлая        | Дневной режим, дополнение к cinematic-dark           |

Расширения (фаза 2+): `terminal-hud`, `claymorphism`, `mid-century`,
`wabi-sabi`, `frutiger-aero`.

## Структура репозитория

```
src/
  theme/
    themes/
      cinematic-dark.css     # :root[data-theme='cinematic-dark']
      editorial-dark.css
      neo-brutalism.css
      material.css
      cupertino.css
      ivory-day.css
  components/
    MATRIX.md                # таблица категория × вариант × тема
    Toggle/
      README.md              # обзор категории
      variants/
        IosSwitch/spec.md
        MaterialSwitch/spec.md
        ...
    Dimmer/
    ColorPicker/
    CCT/
    Scene/
    Navigation/
    Schedule/
    Status/
    Analytics/
```

## Формат `spec.md` варианта

Каждый variant-spec содержит:

1. **Суть** — 1 абзац: UX-паттерн, метафора, поведение
2. **Когда выбирать / когда не выбирать**
3. **Props (TypeScript)** — публичный API
4. **Жесты и состояния** — таблица: gesture → state transition
5. **Accessibility** — role, aria-*, keyboard, screen reader
6. **Цветовые стили** — раздел на каждую совместимую тему:
   ключевые токены, отличия от других тем, скриншот-описание
7. **Технические заметки** — perf-нюансы, fallbacks, anti-patterns

## Дорожная карта

| Спринт | Фокус                                                  |
|--------|--------------------------------------------------------|
| S1     | Каркас: токены, темы, spec.md для всех 60 вариантов    |
| S2     | Toggle (6 вариантов) — реальный код + Storybook        |
| S3     | Dimmer (8 вариантов) — реальный код                    |
| S4     | ColorPicker + CCT                                      |
| S5     | Scene + Navigation                                     |
| S6     | Schedule + Status + Analytics                          |
| S7     | A11y-аудит, perf-аудит, v1.0.0                         |

## Стек

- TypeScript (strict), React 18+
- Vite (lib mode) + `vite-plugin-dts`
- CSS Modules + CSS custom properties для токенов
- Storybook 8 (MDX) + Vitest + Playwright (visual regression)
- Changesets для релизов
