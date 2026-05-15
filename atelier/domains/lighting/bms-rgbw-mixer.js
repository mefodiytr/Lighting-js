import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const CHANNELS = [
  { id: 'r', label: 'R', color: 'rgb(240, 90, 80)' },
  { id: 'g', label: 'G', color: 'rgb(120, 210, 130)' },
  { id: 'b', label: 'B', color: 'rgb(110, 170, 240)' },
  { id: 'w', label: 'W', color: 'rgb(255, 240, 220)' },
];

/**
 * RGBW colour mixer — 4 separate channels each 0-100%, with preview swatch.
 * Attrs: label, r, g, b, w (each 0-100), brightness (0-100, multiplies all)
 */
export class BmsRgbwMixer extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'r', 'g', 'b', 'w', 'brightness'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-rgbw');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-mono bms-caption" data-hex>—</span>
        </div>
        <div class="bms-rgbw-preview" data-preview></div>
        <div class="bms-rgbw-channels" data-channels></div>
        <bms-horizontal-slider data-brightness label="общая яркость" min="0" max="100" step="1" unit="%"></bms-horizontal-slider>`;
      const channels = this.querySelector('[data-channels]');
      for (const ch of CHANNELS) {
        const row = document.createElement('div');
        row.className = 'bms-rgbw-channel';
        row.style.setProperty('--ch-color', ch.color);
        row.innerHTML = `
          <div class="lbl">${ch.label}</div>
          <input type="range" min="0" max="100" value="0" data-ch="${ch.id}" />
          <div><span data-v="${ch.id}">0</span>%</div>`;
        const input = row.querySelector('input');
        input.addEventListener('input', () => {
          this.setAttribute(ch.id, input.value);
          this.emit('channel-change', { channel: ch.id, value: Number(input.value) });
        });
        channels.append(row);
      }
      this.querySelector('[data-brightness]').addEventListener('change', (e) => {
        this.setAttribute('brightness', String(e.detail.value));
      });
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const br = this.num('brightness', 100) / 100;
    const r = this.num('r', 0), g = this.num('g', 0), b = this.num('b', 0), w = this.num('w', 0);
    // Approximate RGBW → RGB: add W as warm white (255,240,220) weighted
    const wMix = w / 100;
    const finalR = Math.round((r * 2.55 + 255 * wMix * 0.8) * br);
    const finalG = Math.round((g * 2.55 + 240 * wMix * 0.8) * br);
    const finalB = Math.round((b * 2.55 + 220 * wMix * 0.8) * br);
    const clamp = (v) => Math.max(0, Math.min(255, v));
    const cR = clamp(finalR), cG = clamp(finalG), cB = clamp(finalB);
    this.querySelector('[data-label]').textContent = this.str('label', 'RGBW смеситель');
    this.querySelector('[data-preview]').style.background = `rgb(${cR}, ${cG}, ${cB})`;
    this.querySelector('[data-hex]').textContent = `#${cR.toString(16).padStart(2,'0')}${cG.toString(16).padStart(2,'0')}${cB.toString(16).padStart(2,'0')}`.toUpperCase();
    for (const ch of CHANNELS) {
      const v = this.num(ch.id, 0);
      const input = this.querySelector(`[data-ch="${ch.id}"]`);
      if (input && input.value !== String(v)) input.value = String(v);
      this.querySelector(`[data-v="${ch.id}"]`).textContent = v;
    }
    this.querySelector('[data-brightness]').setAttribute('value', String(this.num('brightness', 100)));
    this.classList.toggle('is-active', br > 0 && (r + g + b + w) > 0);
  }
}

defineWidget('bms-rgbw-mixer', BmsRgbwMixer);
