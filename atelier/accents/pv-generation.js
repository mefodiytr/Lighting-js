import { defineAccent } from './_factory.js';

export default defineAccent({
  id: 'pv-generation',
  name: 'Генерация PV',
  unit: 'kW',
  range: [0, 100],
  presets: [
    { value:   0, glow: [ 70,  75,  90], deep: [ 40,  45, 60],  light: [130, 135, 150] },
    { value:  20, glow: [180, 170, 130], deep: [130, 120, 90],  light: [220, 215, 190] },
    { value:  50, glow: [240, 210, 110], deep: [200, 170,  70], light: [250, 235, 180] },
    { value:  80, glow: [255, 220,  90], deep: [220, 185,  50], light: [255, 240, 175] },
    { value: 100, glow: [255, 230, 120], deep: [225, 195,  80], light: [255, 245, 195] },
  ],
});
