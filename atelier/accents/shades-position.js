import { defineAccent } from './_factory.js';

export default defineAccent({
  id: 'shades-position',
  name: 'Положение штор',
  unit: '%',
  range: [0, 100],
  presets: [
    { value:   0, glow: [ 60,  65,  80], deep: [ 30,  35, 50],  light: [120, 125, 140] },
    { value:  25, glow: [110, 115, 130], deep: [ 70,  75, 90],  light: [170, 175, 190] },
    { value:  50, glow: [170, 175, 180], deep: [120, 125, 130], light: [210, 215, 220] },
    { value:  75, glow: [220, 220, 210], deep: [170, 170, 160], light: [240, 240, 230] },
    { value: 100, glow: [245, 240, 220], deep: [200, 195, 175], light: [255, 252, 240] },
  ],
});
