# Scene — карточки сцен

Преcет состояния освещения (несколько каналов с заданными
яркостью/цветом/CCT), активируемый одним тапом.

## Общий API

```ts
interface SceneTileCommon {
  id: string;
  name: string;
  active: boolean;
  onActivate: (id: string) => void;
  onLongPress?: (id: string) => void;     // открыть редактор
  disabled?: boolean;
}
```

## Варианты

| Файл               | Представление                                          |
|--------------------|--------------------------------------------------------|
| `PhotoCard`        | Фото реальной комнаты в этой сцене                     |
| `GradientSwatch`   | Карточка-градиент из цветов сцены, без фото            |
| `IconLabel`        | Иконка + имя + color-dot (iOS Shortcuts стиль)         |
| `AnimatedPreview`  | Пульсация/переливание для динамических сцен            |
| `Carousel`         | Горизонтальная карусель, текущая крупнее               |
| `Grid`             | Решётка 2×N, компактно                                 |
| `List`             | Вертикальный список с thumbnail (для много сцен)       |
| `LongPressEdit`    | Любой вариант + long-press для входа в редактор        |

## Когда какой выбирать

- **Премиум, есть бюджет на фотосессию** → `PhotoCard`
- **Быстрое прототипирование** → `GradientSwatch`
- **Список 3–6 любимых сцен** → `IconLabel` + `Grid`
- **20+ сцен** → `List` с thumbnail
- **Динамические сцены (party, sunrise simulator)** → `AnimatedPreview`

## Принципы реализации

- `GradientSwatch` строится автоматически из массива цветов сцены
  (`scene.colors[]`) — `conic-gradient` или `linear-gradient`
- `AnimatedPreview` использует CSS-keyframes; пауза при
  `prefers-reduced-motion`
- `LongPressEdit` — это поведенческая опция (`hold-700ms`), доступная
  для любого варианта через wrapper
- `Carousel` — на pure CSS scroll-snap (`scroll-snap-type: x mandatory`)
  без JS-карусели
