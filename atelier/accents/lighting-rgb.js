import { defineAccent } from './_factory.js';

export default defineAccent({
  id: 'lighting-rgb',
  name: 'RGB настроение',
  unit: '',
  range: [0, 7],
  mode: 'discrete',
  presets: [
    { value: 0, name: 'candle',   glow: [255, 140,  60], deep: [200,  90, 30],  light: [255, 200, 130] },
    { value: 1, name: 'sunset',   glow: [255, 110,  90], deep: [200,  70, 60],  light: [255, 180, 160] },
    { value: 2, name: 'magenta',  glow: [220,  90, 200], deep: [160,  50, 150], light: [240, 170, 230] },
    { value: 3, name: 'lavender', glow: [170, 140, 230], deep: [120,  90, 180], light: [220, 200, 250] },
    { value: 4, name: 'lagoon',   glow: [ 80, 200, 220], deep: [ 40, 140, 170], light: [180, 230, 240] },
    { value: 5, name: 'forest',   glow: [ 90, 200, 130], deep: [ 50, 140,  80], light: [180, 230, 200] },
    { value: 6, name: 'ice',      glow: [200, 230, 255], deep: [150, 180, 220], light: [230, 245, 255] },
    { value: 7, name: 'fire',     glow: [255,  90,  60], deep: [200,  50, 30],  light: [255, 170, 150] },
  ],
});
