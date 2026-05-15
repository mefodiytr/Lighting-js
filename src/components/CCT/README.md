# CCT — Correlated Color Temperature

Температура белого в Кельвинах (2200–6500K). Влияет на «тёплый —
холодный» белый. Отдельный виджет от `ColorPicker`, т.к. это
одномерное значение по особой шкале (Planckian locus).

## Общий API

```ts
interface CCTCommon {
  value?: number;                    // Kelvin, 2200..6500
  defaultValue?: number;
  onChange?: (next: number) => void;
  onChangeEnd?: (next: number) => void;
  min?: number;                      // default 2200
  max?: number;                      // default 6500
  presets?: number[];                // [2700, 3000, 4000, 5000, 6500]
  disabled?: boolean;
  label: ReactNode;
}
```

Внутренние утилиты:
- `kelvinToRgb(k)` — Planckian locus → RGB для визуализации
- `kelvinToHex(k)` — то же, hex-строкой
- `nearestPreset(k, presets)` — для double-tap-to-neutral

## Варианты

| Файл               | UX-метафора                                              |
|--------------------|----------------------------------------------------------|
| `LinearKelvin`     | Slider с реальным градиентом Planckian locus 2200→6500K  |
| `ArcSunMoon`       | Полукруг от ☀ к ☾, естественная метафора                  |
| `PresetChips`      | Чипсы «Свеча/Тёплый/Нейтральный/Дневной/Холодный»        |
| `DoubleTapNeutral` | Расширение к любому slider: double-tap = 4000K           |
| `NumericKelvin`    | Числовой ввод в K (инженерные режимы)                    |
| `CircadianCurve`   | Slider не нужен — автоматика по времени суток            |

## Когда какой выбирать

- **Дефолт** → `LinearKelvin` + `DoubleTapNeutral` overlay
- **Премиум-апартаменты** → `ArcSunMoon` (выглядит как термостат Nest)
- **Семейное жильё** → `PresetChips`
- **Эксперт / инсталлятор** → `NumericKelvin`
- **Автоматизация** → `CircadianCurve` (не контрол, а индикатор)

## Принципы реализации

- Градиент Planckian locus — статический CSS `linear-gradient`
  c пиками по 6 опорным точкам (предвычисленный)
- `kelvinToRgb` — JS-таблица lookup + интерполяция (на каждый
  рендер не считается, мемоизация)
- `CircadianCurve` — отдельный mode, при котором controls
  становятся `disabled` и показывается timeline
