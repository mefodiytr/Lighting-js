# Status — индикаторы состояния и обратная связь

Визуальные сообщения о состоянии устройств, шлюза, команд. От
дискретных точек до полноэкранных баннеров.

## Общий API

```ts
type StatusKind = 'online' | 'offline' | 'fault' | 'updating' | 'pending';

interface StatusCommon {
  kind: StatusKind;
  message?: ReactNode;
  detail?: ReactNode;
}
```

## Варианты

| Файл               | UX-метафора                                                |
|--------------------|------------------------------------------------------------|
| `DotIndicator`     | Цветная точка в углу карточки (зелёный/жёлтый/красный)     |
| `SkeletonLoader`   | Серые блоки на время загрузки, вместо спиннеров            |
| `InlineBadge`      | Текстовый бейдж «Offline», «Update available» на карточке  |
| `Toast`            | Кратковременное уведомление снизу (snackbar)               |
| `PersistentBanner` | Баннер сверху, если шлюз недоступен                        |
| `GlowEffect`       | Вся карточка светится цветом текущего состояния             |

## Когда какой выбирать

- **Норма** → не показывать ничего
- **Сетевые проблемы шлюза** → `PersistentBanner` сверху
- **Подтверждение команды** → `Toast` 2.5s
- **Отдельная лампа offline** → `DotIndicator` + `InlineBadge`
- **Премиум-эмоция «горит цветом»** → `GlowEffect` (cinematic/editorial)

## Принципы реализации

- `Toast` — singleton-провайдер, очередь сообщений, max 3 одновременно
- `PersistentBanner` — рендерится в портале на корне приложения
- `DotIndicator` — pure-CSS, `position: absolute` в углу
- `SkeletonLoader` — shimmer-анимация через `linear-gradient` +
  `background-position` keyframes, отключается при `prefers-reduced-motion`
- `GlowEffect` — расширение `CardToggle`, не самостоятельный
  layout; импортируется как hook `useGlowEffect(state)`
