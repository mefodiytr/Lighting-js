import { defineAccent } from './_factory.js';

export default defineAccent({
  id: 'alarm-level',
  name: 'Уровень тревоги',
  unit: '',
  range: [0, 3],
  mode: 'discrete',
  presets: [
    { value: 0, name: 'normal',   glow: [130, 140, 150], deep: [ 80,  90, 100], light: [190, 200, 210] },
    { value: 1, name: 'warning',  glow: [255, 200, 110], deep: [220, 160,  70], light: [255, 225, 175] },
    { value: 2, name: 'alarm',    glow: [255, 130,  70], deep: [220,  90, 40],  light: [255, 190, 150] },
    { value: 3, name: 'critical', glow: [240,  70,  60], deep: [200,  40, 35],  light: [250, 160, 140] },
  ],
});
