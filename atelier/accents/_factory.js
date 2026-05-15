import { registerAccent } from '../core/registry.js';

/**
 * @typedef {'continuous'|'discrete'} AccentMode
 *
 * @typedef {Object} AccentSpec
 * @property {string} id
 * @property {string} name
 * @property {string} unit
 * @property {[number, number]} range
 * @property {AccentMode} [mode='continuous']
 * @property {Array<{value:number, name?:string, glow:[number,number,number], deep:[number,number,number], light:[number,number,number]}>} presets
 */

const lerp = (a, b, t) => Math.round(a + (b - a) * t);

function interpolate(presets, value, mode) {
  if (mode === 'discrete') {
    const idx = Math.round(value);
    const i = Math.max(0, Math.min(presets.length - 1, idx));
    return presets[i];
  }
  if (value <= presets[0].value) return presets[0];
  if (value >= presets[presets.length - 1].value) return presets[presets.length - 1];
  for (let i = 0; i < presets.length - 1; i++) {
    const a = presets[i], b = presets[i + 1];
    if (value >= a.value && value <= b.value) {
      const t = (value - a.value) / (b.value - a.value);
      return {
        value,
        glow:  [lerp(a.glow[0],  b.glow[0],  t), lerp(a.glow[1],  b.glow[1],  t), lerp(a.glow[2],  b.glow[2],  t)],
        deep:  [lerp(a.deep[0],  b.deep[0],  t), lerp(a.deep[1],  b.deep[1],  t), lerp(a.deep[2],  b.deep[2],  t)],
        light: [lerp(a.light[0], b.light[0], t), lerp(a.light[1], b.light[1], t), lerp(a.light[2], b.light[2], t)],
      };
    }
  }
  return presets[0];
}

/** @param {AccentSpec} spec */
export function defineAccent(spec) {
  const mode = spec.mode || 'continuous';
  const accent = {
    id: spec.id,
    name: spec.name,
    unit: spec.unit,
    range: spec.range,
    mode,
    presets: spec.presets,
    interpolate(v) { return interpolate(spec.presets, v, mode); },
    cssVars(v) {
      const p = interpolate(spec.presets, v, mode);
      return {
        '--cr': p.glow[0],  '--cg': p.glow[1],  '--cb': p.glow[2],
        '--dr': p.deep[0],  '--dg': p.deep[1],  '--db': p.deep[2],
        '--lr': p.light[0], '--lg': p.light[1], '--lb': p.light[2],
      };
    },
  };
  registerAccent(accent);
  return accent;
}
