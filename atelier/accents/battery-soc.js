import { defineAccent } from './_factory.js';

export default defineAccent({
  id: 'battery-soc',
  name: 'Заряд аккумулятора',
  unit: '%',
  range: [0, 100],
  presets: [
    { value:   0, glow: [240,  85,  70], deep: [200,  50, 40],  light: [250, 170, 150] },
    { value:  15, glow: [255, 150,  80], deep: [220, 110,  50], light: [255, 200, 160] },
    { value:  35, glow: [255, 215, 110], deep: [220, 180,  70], light: [255, 235, 185] },
    { value:  65, glow: [180, 220, 130], deep: [130, 180,  90], light: [220, 240, 200] },
    { value: 100, glow: [110, 210, 140], deep: [ 60, 160,  90], light: [190, 240, 210] },
  ],
});
