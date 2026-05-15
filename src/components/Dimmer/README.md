# Dimmer — регулятор яркости

Непрерывное значение 0–100% для канала освещения. Жест зависит
от варианта: drag, rotate, long-press, аппаратные кнопки.

## Общий API

```ts
interface DimmerCommon {
  value?: number;                    // 0..100, controlled
  defaultValue?: number;
  onChange?: (next: number) => void;
  onChangeEnd?: (next: number) => void;
  min?: number;                      // default 0
  max?: number;                      // default 100
  step?: number;                     // default 1
  disabled?: boolean;
  label: ReactNode;
  haptics?: boolean | 'tick';        // 'tick' — вибрация на каждом шаге
}
```

`onChange` стримит во время drag, `onChangeEnd` — финальное
значение при отпускании.

## Варианты

| Файл                | UX-метафора                            | Tap-target |
|---------------------|----------------------------------------|------------|
| `HorizontalSlider`  | Классический track + thumb             | Узкий      |
| `VerticalSlider`    | То же, вертикально (большой палец)     | Высокий    |
| `DragByCard`        | Тянешь карточку — она заполняется      | Огромный   |
| `RadialKnob`        | Круглый диск с вращением жестом        | Средний    |
| `ArcSlider`         | Дуга от 0 до 100, экономит место       | Дуга 180°  |
| `StepButtons`       | +/− кнопки шагом 10%                   | 2 крупные  |
| `LongPressDrag`     | Удержание + drag (без видимого слайдера)| Вся область|
| `VolumeKeys`        | PWA-перехват аппаратных кнопок громкости| 0px       |

## Когда какой выбирать

- **Главная карточка комнаты** → `DragByCard`: один жест на toggle и dim
- **Список устройств** → `HorizontalSlider`: компактно
- **Hero-control одного канала** → `VerticalSlider` или `ArcSlider`
- **Премиум, аналоговая эстетика** → `RadialKnob`
- **Доступность для пожилых** → `StepButtons`
- **Эксперт-режим** → `LongPressDrag` или `VolumeKeys`

## Принципы реализации

- Общий хук `useDimmerGesture({ value, min, max, step, onChange })`
  обрабатывает pointer-drag, snap-to-step, momentum
- Visual feedback во время drag: показывается текущее значение
  цифрой или процентом
- При `prefers-reduced-motion` — анимации glow/fill укорачиваются
- Haptics при пересечении шагов 10/25/50/75/100% (если `haptics='tick'`)

См. `variants/<Name>/spec.md` для деталей каждого.
