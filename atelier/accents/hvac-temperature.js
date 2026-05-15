import { defineAccent } from './_factory.js';

export default defineAccent({
  id: 'hvac-temperature',
  name: 'Температура воздуха',
  unit: '°C',
  range: [16, 30],
  presets: [
    { value: 16, glow: [ 80, 180, 230], deep: [ 40, 130, 190], light: [180, 220, 245] },
    { value: 19, glow: [150, 210, 235], deep: [ 90, 160, 200], light: [210, 235, 248] },
    { value: 22, glow: [220, 230, 220], deep: [170, 190, 180], light: [240, 245, 235] },
    { value: 24, glow: [250, 220, 180], deep: [220, 180, 130], light: [255, 240, 215] },
    { value: 27, glow: [255, 170, 110], deep: [220, 130,  70], light: [255, 210, 175] },
    { value: 30, glow: [255, 100,  70], deep: [200,  60, 40],  light: [255, 170, 145] },
  ],
});
