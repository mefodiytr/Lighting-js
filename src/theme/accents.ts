/* ============================================================
   AccentPreset — ambient tones для управления освещением.
   Соответствует ColorPicker.SwatchPalette / SceneGradient default'ам
   и CCT.PresetChips.
   Передаётся в виджеты как inline style — рендерится в CSS-vars,
   которые объявлены в accents.css.
   ============================================================ */

export type Rgb = readonly [r: number, g: number, b: number];

export interface AccentPreset {
  /** Стабильный id для сериализации в конфиг */
  id: string;
  /** Отображаемое имя */
  name: string;
  /** Подпись под именем: CCT в Кельвинах или мудборд-метка */
  subtitle: string;
  /** Основной цвет — главный glow */
  glow: Rgb;
  /** Насыщенный/тёмный stop — границы, нижняя часть градиентов */
  deep: Rgb;
  /** Светлый stop — highlight, центр свечения, лейблы поверх заливки */
  light: Rgb;
  /** Опциональный Kelvin для CCT-виджетов; undefined для произвольного цвета */
  kelvin?: number;
}

/* Канонический набор. Первые 4 — точки на Planckian locus (CCT),
   остальные 4 — насыщенные мудборд-цвета для RGB-ламп. */
export const ACCENT_PRESETS: readonly AccentPreset[] = [
  { id: 'candle',  name: 'Candle',  subtitle: '2200K', kelvin: 2200,
    glow: [255, 150,  70], deep: [200,  95,  35], light: [255, 200, 130] },
  { id: 'amber',   name: 'Amber',   subtitle: '2700K', kelvin: 2700,
    glow: [255, 180,  90], deep: [220, 140,  60], light: [255, 220, 150] },
  { id: 'warm',    name: 'Warm',    subtitle: '3000K', kelvin: 3000,
    glow: [255, 205, 140], deep: [230, 175, 110], light: [255, 230, 195] },
  { id: 'day',     name: 'Day',     subtitle: '5500K', kelvin: 5500,
    glow: [235, 240, 250], deep: [180, 200, 230], light: [250, 250, 255] },
  { id: 'crimson', name: 'Crimson', subtitle: 'Drama',
    glow: [255,  75,  75], deep: [200,  30,  30], light: [255, 150, 150] },
  { id: 'magenta', name: 'Magenta', subtitle: 'Lounge',
    glow: [230,  80, 180], deep: [180,  40, 140], light: [255, 160, 220] },
  { id: 'cyan',    name: 'Cyan',    subtitle: 'Lagoon',
    glow: [ 90, 200, 230], deep: [ 40, 160, 200], light: [160, 230, 250] },
  { id: 'violet',  name: 'Violet',  subtitle: 'Royal',
    glow: [150, 100, 240], deep: [100,  50, 200], light: [200, 170, 255] },
] as const;

export const DEFAULT_ACCENT: AccentPreset = ACCENT_PRESETS[1]; // Amber

/**
 * Преобразует AccentPreset в inline CSS-vars для применения через
 * style={...}. Сами variable'ы объявлены через @property в accents.css.
 */
export function accentToCssVars(p: AccentPreset): React.CSSProperties {
  return {
    '--cr': p.glow[0],  '--cg': p.glow[1],  '--cb': p.glow[2],
    '--dr': p.deep[0],  '--dg': p.deep[1],  '--db': p.deep[2],
    '--lr': p.light[0], '--lg': p.light[1], '--lb': p.light[2],
  } as React.CSSProperties;
}

/**
 * Конвертация Kelvin → Rgb по аппроксимации Planckian locus
 * (Tanner Helland formula). Возвращает Rgb для произвольной CCT,
 * чтобы CCT-виджеты могли строить градиент.
 */
export function kelvinToRgb(k: number): Rgb {
  const t = Math.max(1000, Math.min(40000, k)) / 100;
  let r: number, g: number, b: number;

  if (t <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
    b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
    b = 255;
  }
  return [clamp(r), clamp(g), clamp(b)];
}

const clamp = (v: number): number => Math.max(0, Math.min(255, Math.round(v)));
