import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const SLAT_COUNT = 7;

/**
 * Venetian blind tile — slat angle 0-90° (0=closed, 90=horizontal open).
 * Attrs: label, position (lift 0-100), tilt (0-90, lamella angle)
 */
export class BmsBlindTile extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'position', 'tilt'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'shades-position');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-mono" data-meta></span>
        </div>
        <div class="bms-blind-visual" data-visual></div>
        <bms-horizontal-slider data-pos min="0" max="100" step="1" unit="%" label="высота" accent="shades-position"></bms-horizontal-slider>
        <bms-horizontal-slider data-tilt min="0" max="90" step="5" unit="°" label="наклон" accent="shades-position"></bms-horizontal-slider>`;
      this.querySelector('[data-pos]').addEventListener('change', (e) => {
        this.setAttribute('position', String(e.detail.value));
        this.emit('position-change', { position: e.detail.value });
      });
      this.querySelector('[data-tilt]').addEventListener('change', (e) => {
        this.setAttribute('tilt', String(e.detail.value));
        this.emit('tilt-change', { tilt: e.detail.value });
      });
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const pos = this.num('position', 50);
    const tilt = this.num('tilt', 45);
    this.querySelector('[data-label]').textContent = this.str('label', 'Жалюзи');
    this.querySelector('[data-meta]').textContent = `${pos}% / ${tilt}°`;
    this.querySelector('[data-pos]').setAttribute('value', String(pos));
    this.querySelector('[data-tilt]').setAttribute('value', String(tilt));
    const visual = this.querySelector('[data-visual]');
    visual.innerHTML = '';
    const visibleSlats = Math.ceil((pos / 100) * SLAT_COUNT);
    for (let i = 0; i < visibleSlats; i++) {
      const slat = document.createElement('div');
      slat.className = 'bms-blind-slat';
      // tilt: 0 → vertical (rotateX 0, looks like closed slat), 90 → horizontal open
      slat.style.transform = `rotateX(${90 - tilt}deg)`;
      visual.append(slat);
    }
    this.setAttribute('value', String(pos));
    this.classList.toggle('is-active', pos > 0);
  }
}

defineWidget('bms-blind-tile', BmsBlindTile);
