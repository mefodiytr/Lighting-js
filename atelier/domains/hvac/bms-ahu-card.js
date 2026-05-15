import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const FILTER_STATUS = {
  ok:      { label: 'Фильтр OK',         status: 'ok' },
  warning: { label: 'Фильтр близко',     status: 'warning' },
  replace: { label: 'Требуется замена',   status: 'alarm' },
};

/**
 * AHU (приточная установка) — read-only состояние.
 * Attrs: label, supply (°C), return (°C), flow (m³/h), filter, co2 (ppm), status
 */
export class BmsAhuCard extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'supply', 'return', 'flow', 'filter', 'co2', 'status'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-ahu');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div class="bms-col" style="gap: 2px;">
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption" data-loc>AHU</span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>
        <div class="bms-ahu-grid">
          <div class="bms-ahu-stat">
            <div class="num" data-supply></div>
            <div class="lbl">Приток °C</div>
          </div>
          <div class="bms-ahu-stat">
            <div class="num" data-return></div>
            <div class="lbl">Вытяжка °C</div>
          </div>
          <div class="bms-ahu-stat">
            <div class="num" data-flow></div>
            <div class="lbl">Расход м³/ч</div>
          </div>
          <div class="bms-ahu-stat">
            <div class="num" data-co2></div>
            <div class="lbl">CO₂ ppm</div>
          </div>
        </div>
        <div class="bms-row bms-between">
          <bms-status-dot data-filter></bms-status-dot>
          <bms-sparkline data-spark accent="hvac-temperature" data-accent-value="22"
            data="[19.0,19.4,20.1,20.6,21.0,21.5,22.0,22.4,22.7,22.5,22.2,21.8,21.5,21.4,21.6]"
            style="width: 120px; height: 32px;"></bms-sparkline>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    this.querySelector('[data-label]').textContent = this.str('label', 'Приточка');
    this.querySelector('[data-supply]').textContent = this.num('supply', 0).toFixed(1);
    this.querySelector('[data-return]').textContent = this.num('return', 0).toFixed(1);
    this.querySelector('[data-flow]').textContent = Math.round(this.num('flow', 0));
    this.querySelector('[data-co2]').textContent = Math.round(this.num('co2', 0));
    this.querySelector('[data-state]').setAttribute('status', this.str('status', 'ok'));
    this.querySelector('[data-state]').setAttribute('label', this.str('status', 'ok') === 'ok' ? 'работает' : 'внимание');
    const fs = FILTER_STATUS[this.str('filter', 'ok')] || FILTER_STATUS.ok;
    this.querySelector('[data-filter]').setAttribute('status', fs.status);
    this.querySelector('[data-filter]').setAttribute('label', fs.label);
    this.classList.toggle('is-active', this.str('status', 'ok') === 'ok');
  }
}

defineWidget('bms-ahu-card', BmsAhuCard);
