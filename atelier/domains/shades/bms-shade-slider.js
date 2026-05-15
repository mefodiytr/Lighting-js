import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';
import { makeDragger } from '../../core/drag-engine.js';

/**
 * Vertical shade slider — drag down to lower, drag up to raise.
 * Attrs: label, position (0-100)
 */
export class BmsShadeSlider extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'position'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-shade-slider');
      this.setAttribute('accent', 'shades-position');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-mono bms-h2" data-pos>0%</span>
        </div>
        <div class="bms-shade-slider-vis" data-vis>
          <div class="bms-shade-fabric" data-fabric></div>
          <div class="bms-shade-rail"></div>
        </div>`;
      const vis = this.querySelector('[data-vis]');
      this.track(makeDragger(vis, {
        axis: 'vertical',
        trackEl: vis,
        onDrag: (p) => {
          const v = Math.round(p * 100);
          this.setAttribute('position', String(v));
          this.emit('position-change', { position: v });
        },
      }));
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const pos = this.num('position', 0);
    this.querySelector('[data-label]').textContent = this.str('label', 'Штора');
    this.querySelector('[data-pos]').textContent = `${pos}%`;
    this.querySelector('[data-fabric]').style.height = `${100 - pos}%`;
    this.setAttribute('value', String(pos));
    this.classList.toggle('is-active', pos > 0);
  }
}

defineWidget('bms-shade-slider', BmsShadeSlider);
