import { defineAccent } from './_factory.js';

export default defineAccent({
  id: 'hvac-co2',
  name: 'CO₂ в воздухе',
  unit: 'ppm',
  range: [400, 2000],
  presets: [
    { value:  400, glow: [120, 210, 140], deep: [ 70, 160,  90], light: [200, 240, 210] },
    { value:  600, glow: [180, 220, 130], deep: [130, 180,  90], light: [220, 240, 200] },
    { value:  900, glow: [240, 220, 110], deep: [200, 180,  70], light: [250, 240, 190] },
    { value: 1200, glow: [255, 180,  90], deep: [220, 140,  60], light: [255, 220, 170] },
    { value: 1600, glow: [255, 130,  80], deep: [220,  90, 50],  light: [255, 190, 150] },
    { value: 2000, glow: [240,  80,  70], deep: [200,  50, 40],  light: [250, 170, 150] },
  ],
});
