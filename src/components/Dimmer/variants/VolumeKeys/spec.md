# VolumeKeys

## Суть

Аппаратные кнопки громкости устройства управляют яркостью текущего
канала. Не визуальный виджет, а UX-augment: подключается к
любому выбранному в фокусе диммеру и слушает hardware key events.
Из коробки на PWA не работает — требует Web Bluetooth/Volume API
или нативной обёртки (Capacitor).

## Когда выбирать

- Premium PWA с native-wrapper (Capacitor, Tauri Mobile, React Native)
- Когда screen-off use case: «нащупать кнопку громкости в темноте»
- Powerful augmentation для основного диммера

## Когда не выбирать

- Чистая web-only PWA: API недоступен, кнопки идут в системную громкость
- Если приложение конкурирует с медиа-плеером — UX-конфликт

## API

```ts
interface UseVolumeKeysOptions {
  enabled?: boolean;
  step?: number;                        // default 5
  onIncrease?: (next: number) => void;
  onDecrease?: (next: number) => void;
  onPress?: (key: 'up' | 'down') => void;   // raw event
  preventDefault?: boolean;             // блокировать system volume
}

// Hook-форма
function useVolumeKeys(opts: UseVolumeKeysOptions): void;

// Или Provider, чтобы один обработчик глобально
function VolumeKeysProvider(props: {
  channel: { value: number; onChange: (v: number) => void };
  enabled?: boolean;
}): null;
```

## Поведение

| Событие                 | Эффект                                    |
|-------------------------|-------------------------------------------|
| Hardware VolumeUp       | +step, haptic tick                        |
| Hardware VolumeDown     | -step, haptic tick                        |
| Hold VolumeUp/Down      | Auto-repeat (как `StepButtons`)           |
| Mute key (опционально)  | Toggle on/off                             |

Когда поддерживается:
- iOS PWA: НЕ поддерживается (Safari blocks)
- Android PWA: НЕ поддерживается (Chrome blocks)
- Capacitor/Cordova: ДА, через `@capacitor/app` plugin
- Tauri Mobile: ДА, через `tauri::plugin::hardware`
- Electron desktop: ДА (media-keys), но не «volume»

## Accessibility

- Нет визуального компонента → нет ARIA-ролей
- Должен иметь visual indicator где-то на экране, что hw-keys активны
  (например, бейдж «HW: ON» в углу)
- Disable-индикация когда controlled channel не выбран

## Цветовые стили

Виджет не имеет визуала — только опциональный индикатор-бейдж,
который наследует тему из `<DotIndicator>` или `<InlineBadge>` под
текущей `data-theme`. См. `Status/InlineBadge`.

## Технические заметки

- В Capacitor:
  ```ts
  import { App } from '@capacitor/app';
  App.addListener('volumeChange', ({ direction }) => { ... });
  ```
- На pure web: можно слушать `keydown` с `KeyboardEvent.code ===
  'AudioVolumeUp'` — иногда работает на desktop browser с физической
  клавиатурой, на mobile — нет
- Conflict resolution: всегда давать пользователю переключатель в
  Settings → «Управлять яркостью кнопками громкости (выкл по
  умолчанию)»
- Дебаунс/throttle на 50ms — иначе hardware repeat-rate слишком быстрый
- HW-key haptics не контролируются виджетом (это система решает)
