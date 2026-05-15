import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * AHU with heat recovery — compact tile (smaller than full mnemonic).
 * Attrs: label, supply (°C), return (°C), outside (°C), flow, recovery (η %), status
 */
export class BmsAhuRecovery extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'supply', 'return', 'outside', 'flow', 'recovery', 'status'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'hvac-temperature');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption">приточка с рекуперацией</span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>

        <div class="bms-ahu-grid">
          <div class="bms-ahu-stat">
            <div class="num"><span data-supply>—</span>°C</div>
            <div class="lbl">приток</div>
          </div>
          <div class="bms-ahu-stat">
            <div class="num"><span data-outside>—</span>°C</div>
            <div class="lbl">снаружи</div>
          </div>
          <div class="bms-ahu-stat">
            <div class="num"><span data-flow>—</span></div>
            <div class="lbl">м³/ч</div>
          </div>
          <div class="bms-ahu-stat">
            <div class="num"><span data-rec>—</span>%</div>
            <div class="lbl">η рекуп.</div>
          </div>
        </div>

        <bms-heat-exchanger data-hx></bms-heat-exchanger>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const sup = this.num('supply', 0);
    const ret = this.num('return', 0);
    const out = this.num('outside', 0);
    const flow = this.num('flow', 0);
    const rec = this.num('recovery', 0);
    this.querySelector('[data-label]').textContent = this.str('label', 'Приточка');
    this.querySelector('[data-supply]').textContent = sup.toFixed(1);
    this.querySelector('[data-outside]').textContent = out.toFixed(1);
    this.querySelector('[data-flow]').textContent = Math.round(flow);
    this.querySelector('[data-rec]').textContent = Math.round(rec);
    this.querySelector('[data-hx]').setAttribute('efficiency', String(Math.round(rec)));
    const status = this.str('status', flow > 0 ? 'ok' : 'offline');
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', status);
    dot.setAttribute('label', status === 'ok' ? 'работает' : 'выкл');
    this.classList.toggle('is-active', flow > 0);
    this.setAttribute('value', String(sup));
  }
}

defineWidget('bms-ahu-recovery', BmsAhuRecovery);
