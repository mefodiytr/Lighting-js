import { defineAccent } from './_factory.js';

export default defineAccent({
  id: 'humidity',
  name: 'Относительная влажность',
  unit: '%RH',
  range: [20, 80],
  presets: [
    { value: 20, glow: [240, 220, 170], deep: [200, 180, 130], light: [250, 240, 210] },
    { value: 35, glow: [220, 225, 200], deep: [170, 180, 160], light: [240, 245, 230] },
    { value: 50, glow: [180, 220, 230], deep: [130, 180, 200], light: [220, 240, 245] },
    { value: 65, glow: [130, 200, 220], deep: [ 80, 150, 180], light: [190, 230, 245] },
    { value: 80, glow: [ 90, 180, 210], deep: [ 50, 130, 170], light: [170, 220, 240] },
  ],
});
