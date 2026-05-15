import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const GAS_DEFAULTS = {
  CO:    { unit: 'ppm',  max: 200,  t1: 25,    t2: 100,  label: 'CO угарный газ' },
  CH4:   { unit: '% LEL', max: 100, t1: 10,    t2: 25,   label: 'CH₄ метан' },
  H2S:   { unit: 'ppm',  max: 50,   t1: 5,     t2: 15,   label: 'H₂S сероводород' },
  CO2:   { unit: 'ppm',  max: 5000, t1: 1000,  t2: 2000, label: 'CO₂ углекислый газ' },
  NH3:   { unit: 'ppm',  max: 50,   t1: 20,    t2: 35,   label: 'NH₃ аммиак' },
  O2:    { unit: '%',    max: 25,   t1: 19,    t2: 18,   label: 'O₂ кислород' },
};

/**
 * Gas sensor with linear meter + two thresholds.
 * Attrs: label, gas (CO/CH4/H2S/CO2/NH3/O2), value, threshold-1, threshold-2,
 *   unit, max-value, state
 */
export class BmsGasSensor extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'gas', 'threshold-1', 'threshold-2',
      'unit', 'max-value', 'state'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-gas');
      this.setAttribute('accent', 'alarm-level');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption" data-sub></span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>
        <div class="bms-row bms-between" style="align-items: baseline;">
          <span class="bms-gas-value"><span data-val>0</span></span>
          <span class="bms-caption bms-mono" data-unit>—</span>
        </div>
        <div class="bms-gas-bar">
          <div class="bms-gas-bar-mask" data-mask></div>
          <div class="bms-gas-threshold" data-t1></div>
          <div class="bms-gas-threshold" data-t2></div>
        </div>
        <div class="bms-row bms-between bms-mono" style="font-size: 11px; color: var(--bms-text-muted);">
          <span>0</span>
          <span>порог 1: <span data-t1l></span></span>
          <span>порог 2: <span data-t2l></span></span>
          <span data-max>—</span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const gas = this.str('gas', 'CO');
    const defaults = GAS_DEFAULTS[gas] || GAS_DEFAULTS.CO;
    const val = this.num('value', 0);
    const max = this.num('max-value', defaults.max);
    const t1 = this.num('threshold-1', defaults.t1);
    const t2 = this.num('threshold-2', defaults.t2);
    const unit = this.str('unit', defaults.unit);
    this.querySelector('[data-label]').textContent = this.str('label', defaults.label);
    this.querySelector('[data-sub]').textContent = `газоанализатор · ${gas}`;
    this.querySelector('[data-val]').textContent = val.toFixed(val < 10 ? 1 : 0);
    this.querySelector('[data-unit]').textContent = unit;
    this.querySelector('[data-max]').textContent = max;
    this.querySelector('[data-t1l]').textContent = t1;
    this.querySelector('[data-t2l]').textContent = t2;
    const pct = Math.max(0, Math.min(1, val / max));
    this.querySelector('[data-mask]').style.left = `${(pct * 100).toFixed(1)}%`;
    this.querySelector('[data-t1]').style.left = `${((t1 / max) * 100).toFixed(1)}%`;
    this.querySelector('[data-t2]').style.left = `${((t2 / max) * 100).toFixed(1)}%`;
    const state = this.str('state',
      val >= t2 ? 'critical' : val >= t1 ? 'warning' : 'normal');
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', state === 'critical' ? 'critical' : state === 'warning' ? 'warning' : 'ok');
    if (state === 'critical' || state === 'warning') dot.setAttribute('pulsing', '');
    else dot.removeAttribute('pulsing');
    dot.setAttribute('label', state);
    const sevValue = state === 'critical' ? 3 : state === 'warning' ? 1 : 0;
    this.setAttribute('value', String(sevValue));
    this.classList.toggle('is-active', state !== 'normal');
  }
}

defineWidget('bms-gas-sensor', BmsGasSensor);
