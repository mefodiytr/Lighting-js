import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * ИТП (Individual Thermal Substation) summary — supply/return flow.
 * Attrs: label, supply-temp, return-temp, delta-p (kPa), pump-state (on/off/fault), status
 */
export class BmsItpSummary extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes,
      'supply-temp', 'return-temp', 'delta-p', 'pump-state', 'status'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-itp');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <bms-status-dot data-state></bms-status-dot>
        </div>
        <div class="bms-itp-flow">
          <div class="pipe">
            <div class="num"><span data-supply>—</span>°C</div>
            <div class="bms-caption">подача</div>
          </div>
          <div class="arrow">→</div>
          <div class="pipe">
            <div class="num"><span data-return>—</span>°C</div>
            <div class="bms-caption">обратка</div>
          </div>
        </div>
        <div class="bms-row bms-between">
          <span class="bms-caption">Перепад: <span class="bms-mono" data-dp>—</span> kPa</span>
          <bms-status-dot data-pump></bms-status-dot>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    this.querySelector('[data-label]').textContent = this.str('label', 'ИТП');
    this.querySelector('[data-supply]').textContent = this.str('supply-temp', '—');
    this.querySelector('[data-return]').textContent = this.str('return-temp', '—');
    this.querySelector('[data-dp]').textContent = this.str('delta-p', '—');
    const status = this.str('status', 'ok');
    this.querySelector('[data-state]').setAttribute('status', status);
    this.querySelector('[data-state]').setAttribute('label', status === 'ok' ? 'норма' : 'тревога');
    const pump = this.str('pump-state', 'on');
    const pumpStatus = pump === 'on' ? 'ok' : pump === 'fault' ? 'alarm' : 'offline';
    const pumpEl = this.querySelector('[data-pump]');
    pumpEl.setAttribute('status', pumpStatus);
    pumpEl.setAttribute('label', `Насос ${pump === 'on' ? 'работает' : pump === 'off' ? 'остановлен' : 'авария'}`);
    if (pump === 'on') pumpEl.setAttribute('pulsing', ''); else pumpEl.removeAttribute('pulsing');
    this.classList.toggle('is-active', status === 'ok' && pump === 'on');
  }
}

defineWidget('bms-itp-summary', BmsItpSummary);
