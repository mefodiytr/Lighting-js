import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const STATE_LABELS = {
  ok:           'OK',
  off:          'OFF',
  'lamp-fail':  'LAMP FAIL',
  'driver-fail':'DRIVER FAIL',
  disconnected: 'DISCONNECTED',
};

/**
 * Single DALI driver row — address, level, lamp glow, status.
 * Attrs: label, address (0-63), level (0-254 DALI scale), cct (1800-6500),
 *   group, state (ok/off/lamp-fail/driver-fail/disconnected)
 */
export class BmsDaliDriver extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'address', 'level', 'cct', 'group', 'state'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-dali');
      this.setAttribute('accent', 'lighting-cct');
      this.innerHTML = `
        <span class="bms-dali-addr" data-addr>—</span>
        <div class="bms-dali-lamp"></div>
        <div>
          <div class="bms-h2" data-label></div>
          <div class="bms-dali-meter">
            <div class="bms-dali-meter-fill" data-fill></div>
          </div>
        </div>
        <div class="bms-dali-level"><span data-pct>0</span>%</div>
        <span class="bms-mono" style="font-size: 11px; color: var(--bms-text-muted);" data-state>—</span>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const addr = this.num('address', 0);
    const lvl = this.num('level', 0);
    const cct = this.num('cct', 3200);
    const state = this.str('state', lvl > 0 ? 'ok' : 'off');
    const isOn = state === 'ok' && lvl > 0;
    const isFail = state === 'lamp-fail' || state === 'driver-fail' || state === 'disconnected';
    const pct = Math.round((lvl / 254) * 100);
    this.querySelector('[data-addr]').textContent = `A${addr.toString().padStart(2, '0')}`;
    this.querySelector('[data-label]').textContent = this.str('label', `Драйвер ${addr}`);
    this.querySelector('[data-fill]').style.width = `${pct}%`;
    this.querySelector('[data-pct]').textContent = isFail ? '—' : pct;
    this.querySelector('[data-state]').textContent = STATE_LABELS[state] || state;
    this.className = 'bms-dali' + (isOn ? ' st-on' : '') + (isFail ? ' st-fail' : '');
    this.setAttribute('value', String(cct));
  }
}

defineWidget('bms-dali-driver', BmsDaliDriver);
