import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Boiler tile — supply/return temp, pressure, modulation %, fuel rate, status.
 * Attrs: label, mode (heating/idle/fault), supply, return, pressure (bar),
 *   modulation (0-100), fuel-rate, hours, status
 */
export class BmsBoilerTile extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'mode', 'supply', 'return',
      'pressure', 'modulation', 'fuel-rate', 'hours', 'status'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'hvac-temperature');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <bms-status-dot data-state></bms-status-dot>
        </div>

        <div class="bms-boiler-shape" data-shape>
          <div class="pipes">
            <div class="pipe supply"></div>
            <div class="pipe return"></div>
          </div>
          <div class="flame">🔥</div>
        </div>

        <div class="bms-row bms-between bms-mono" style="font-size: 13px;">
          <span><span class="bms-muted">подача</span> <span data-sup>—</span>°C</span>
          <span><span class="bms-muted">обратка</span> <span data-ret>—</span>°C</span>
        </div>

        <div>
          <div class="bms-row bms-between" style="font-size: 12px;">
            <span class="bms-caption">мощность</span>
            <span class="bms-mono"><span data-mod>0</span>%</span>
          </div>
          <div class="bms-meter" style="margin-top: 4px;">
            <div class="bms-meter-fill" data-mod-fill></div>
          </div>
        </div>

        <div class="bms-pump-kpis">
          <div class="bms-pump-kpi"><div class="l">давление</div><div class="v"><span data-press>0</span> bar</div></div>
          <div class="bms-pump-kpi"><div class="l">расход топлива</div><div class="v"><span data-fuel>0</span> м³/ч</div></div>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const mode = this.str('mode', 'idle');
    const sup = this.num('supply', 0);
    const ret = this.num('return', 0);
    const press = this.num('pressure', 0);
    const mod = this.num('modulation', 0);
    const fuel = this.num('fuel-rate', 0);
    this.querySelector('[data-label]').textContent = this.str('label', 'Котёл');
    this.querySelector('[data-sup]').textContent = sup.toFixed(1);
    this.querySelector('[data-ret]').textContent = ret.toFixed(1);
    this.querySelector('[data-press]').textContent = press.toFixed(2);
    this.querySelector('[data-mod]').textContent = Math.round(mod);
    this.querySelector('[data-fuel]').textContent = fuel.toFixed(2);
    this.querySelector('[data-mod-fill]').style.width = `${mod}%`;
    this.querySelector('[data-shape]').classList.toggle('is-running', mode === 'heating');
    const status = this.str('status', mode === 'fault' ? 'alarm' : mode === 'heating' ? 'ok' : 'offline');
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', status);
    if (mode === 'fault') dot.setAttribute('pulsing', ''); else dot.removeAttribute('pulsing');
    dot.setAttribute('label', mode === 'heating' ? 'работает' : mode === 'fault' ? 'авария' : 'покой');
    this.classList.toggle('is-active', mode === 'heating');
    this.setAttribute('value', String(sup));
  }
}

defineWidget('bms-boiler-tile', BmsBoilerTile);
