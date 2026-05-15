import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Single shade tile — visual + position slider + state pill.
 * Attrs: label, position (0=closed/down, 100=open/up), state (open/closed/moving/fault)
 */
export class BmsShadeTile extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'position', 'state'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-shade-tile');
      this.setAttribute('accent', 'shades-position');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-pill" data-state></span>
        </div>
        <div class="bms-shade-visual">
          <div class="bms-shade-rail"></div>
          <div class="bms-shade-fabric" data-fabric></div>
        </div>
        <bms-horizontal-slider data-slider min="0" max="100" step="1" unit="%" label="открытие" accent="shades-position"></bms-horizontal-slider>`;
      this.querySelector('[data-slider]').addEventListener('change', (e) => {
        this.setAttribute('position', String(e.detail.value));
        this.emit('position-change', { position: e.detail.value });
      });
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const pos = this.num('position', 0);
    const state = this.str('state', pos === 100 ? 'open' : pos === 0 ? 'closed' : 'moving');
    this.querySelector('[data-label]').textContent = this.str('label', 'Штора');
    const pill = this.querySelector('[data-state]');
    pill.textContent = state;
    pill.classList.toggle('is-active', state === 'open' || state === 'moving');
    // fabric height: pos=100% → fabric fully up (height=0); pos=0% → fabric covers all (100%)
    this.querySelector('[data-fabric]').style.height = `${100 - pos}%`;
    this.querySelector('[data-slider]').setAttribute('value', String(pos));
    this.setAttribute('value', String(pos));
    this.classList.toggle('is-active', pos > 0);
  }
}

defineWidget('bms-shade-tile', BmsShadeTile);
