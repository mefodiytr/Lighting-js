import { defineAccent } from './_factory.js';

export default defineAccent({
  id: 'lighting-cct',
  name: 'Цветовая температура',
  unit: 'K',
  range: [1800, 6500],
  presets: [
    { value: 1800, glow: [255, 130,  50], deep: [200,  90, 30],  light: [255, 200, 150] },
    { value: 2200, glow: [255, 160,  80], deep: [210, 120, 60],  light: [255, 215, 170] },
    { value: 2700, glow: [255, 200, 130], deep: [220, 160, 90],  light: [255, 230, 200] },
    { value: 3200, glow: [255, 225, 180], deep: [220, 190, 140], light: [255, 240, 220] },
    { value: 4000, glow: [255, 245, 215], deep: [220, 210, 180], light: [255, 250, 240] },
    { value: 5000, glow: [240, 245, 255], deep: [200, 215, 235], light: [250, 252, 255] },
    { value: 6500, glow: [220, 235, 255], deep: [180, 205, 235], light: [240, 248, 255] },
  ],
});
