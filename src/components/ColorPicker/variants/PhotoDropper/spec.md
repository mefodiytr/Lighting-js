# PhotoDropper

## Суть

Пользователь снимает или загружает фото (закат, картину, ткань),
по фото выбирает точку — виджет берёт цвет из неё и применяет к
лампе. Игровой UX, эмоциональный bridge между физическим миром и
светом.

## Когда выбирать

- Premium-emotional фича, маркетинговая ценность
- «Подбери свет под закат за окном»
- Опционально, не основной picker

## Когда не выбирать

- Если у устройства нет камеры или upload-API
- Когда пользователь хочет быстро — слишком много шагов

## API

```ts
interface PhotoDropperProps {
  value?: { r: number; g: number; b: number };
  onChange?: (next: { r: number; g: number; b: number }) => void;
  onChangeEnd?: (next: { r: number; g: number; b: number }) => void;
  source?: 'camera' | 'gallery' | 'url' | 'all';     // default 'all'
  defaultImageUrl?: string;
  averageRadius?: number;             // px усреднения, default 8
  disabled?: boolean;
  label: ReactNode;
}
```

## Жесты и состояния

| Жест                            | Эффект                                           |
|---------------------------------|--------------------------------------------------|
| Tap «Take photo» / «Pick file»  | Открывает source-dialog                          |
| Tap по фото                     | Cursor (eyedropper) прыгает, цвет под пальцем    |
| Drag по фото                    | Live-stream, picker следит за пальцем            |
| Pinch-zoom                      | Зум фото для точности (опционально)              |
| Long-press                      | Pixel-level (без averaging)                      |

## Accessibility

- `<input type="file" accept="image/*" capture="environment">`
  для камеры
- Альтернативно — кнопка «Без фото — введите hex», fallback к
  hex-input
- При drag — `aria-live` объявляет hex и приближённое имя цвета

## Цветовые стили

Тема влияет на UI вокруг фото: загрузчик, eyedropper-cursor,
preview-pill.

### cinematic-dark
Контейнер фото с тонким бронзовым border, скруглением 18px.
Eyedropper-cursor: ring 36px с прозрачным центром (показывает
цвет под фото) + outline в текущем цвете. Preview-pill снизу
показывает hex и swatch.

### editorial-dark
Минимальная рамка. Eyedropper — простой круг 24px с золотым
outline.

### neo-brutalism
Чёрная рамка 3px, offset shadow. Eyedropper — чёрный квадрат-frame
24px. Preview — большой hex-monospace внизу.

### material
M3 card вокруг фото. Eyedropper — primary 32px halo.

### cupertino
Frosted overlay для controls. Eyedropper — iOS magnifier-style.

### ivory-day
Светлая рамка с тёплым border. Eyedropper — тёмная бронза.

## Технические заметки

- Фото загружается в `<canvas>` для pixel-access:
  `ctx.getImageData(x, y, radius*2, radius*2)`
- Усреднение по `averageRadius` — простой sum/count R/G/B
- Защита от прозрачных пикселей: skip alpha < 200
- Производительность: drag throttle до 30fps (requestAnimationFrame)
- Camera capture на mobile: `<input type="file" capture>` —
  работает на iOS Safari и Android Chrome
- WebRTC `getUserMedia` для live-preview — отдельный premium mode,
  тяжелее по permissions
