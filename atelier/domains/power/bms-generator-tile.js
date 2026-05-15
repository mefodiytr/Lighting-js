import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const MODE_LABELS = {
  off:      'выключен',
  auto:     'автомат',
  test:     'тестирование',
  running:  'работа',
  cooldown: 'охлаждение',
  fault:    'авария',
};

/**
 * Diesel/petrol generator (ДГУ) tile.
 * Attrs: label, mode, fuel-level (0-100), oil-pressure (bar), water-temp (°C),
 *   battery-volt, power-out (kW), runtime-h, frequency, status
 */
export class BmsGeneratorTile extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'mode', 'fuel-level', 'oil-pressure',
      'water-temp', 'battery-volt', 'power-out', 'runtime-h', 'frequency'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'power-load');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption">ДГУ · <span class="bms-text" data-mode>—</span></span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>

        <div class="bms-row" style="gap: 16px; align-items: baseline;">
          <div style="flex: 1;">
            <div class="bms-caption">генерация</div>
            <div class="bms-mono" style="font-size: 28px; font-weight: 600; color: rgb(var(--cr) var(--cg) var(--cb));"><span data-pout>0</span> kW</div>
          </div>
          <div style="text-align: right;">
            <div class="bms-caption">частота</div>
            <div class="bms-mono" style="font-size: 16px; font-weight: 600;"><span data-freq>0</span> Hz</div>
          </div>
        </div>

        <div>
          <div class="bms-row bms-between bms-caption">
            <span>топливо</span>
            <span><span class="bms-mono bms-text" data-fuel>0</span>%</span>
          </div>
          <div class="bms-gen-fuel" style="margin-top: 4px;">
            <div class="bms-gen-fuel-fill" data-fuel-fill></div>
          </div>
        </div>

        <div class="bms-gen-kpis">
          <div class="bms-gen-kpi"><div class="l">масло</div><div class="v"><span data-oil>0</span> bar</div></div>
          <div class="bms-gen-kpi"><div class="l">вода</div><div class="v"><span data-water>0</span>°C</div></div>
          <div class="bms-gen-kpi"><div class="l">U АКБ</div><div class="v"><span data-bvolt>0</span> V</div></div>
        </div>
        <div class="bms-caption">наработка: <span class="bms-mono bms-text" data-runtime>0</span> ч</div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const mode = this.str('mode', 'off');
    const fuel = this.num('fuel-level', 0);
    this.querySelector('[data-label]').textContent = this.str('label', 'ДГУ');
    this.querySelector('[data-mode]').textContent = MODE_LABELS[mode] || mode;
    this.querySelector('[data-pout]').textContent = this.num('power-out', 0).toFixed(1);
    this.querySelector('[data-freq]').textContent = this.num('frequency', 0).toFixed(1);
    this.querySelector('[data-fuel]').textContent = Math.round(fuel);
    this.querySelector('[data-fuel-fill]').style.width = `${fuel}%`;
    this.querySelector('[data-oil]').textContent = this.num('oil-pressure', 0).toFixed(2);
    this.querySelector('[data-water]').textContent = this.num('water-temp', 0).toFixed(0);
    this.querySelector('[data-bvolt]').textContent = this.num('battery-volt', 0).toFixed(1);
    this.querySelector('[data-runtime]').textContent = this.num('runtime-h', 0).toLocaleString('ru-RU');
    const dot = this.querySelector('[data-state]');
    const status = mode === 'fault' ? 'critical'
                 : mode === 'running' ? 'warning'
                 : mode === 'test' ? 'warning'
                 : mode === 'auto' ? 'ok' : 'offline';
    dot.setAttribute('status', status);
    if (mode === 'fault' || mode === 'running') dot.setAttribute('pulsing', '');
    else dot.removeAttribute('pulsing');
    dot.setAttribute('label', mode);
    this.classList.toggle('is-active', mode === 'running' || mode === 'test');
    this.setAttribute('value', String(this.num('power-out', 0)));
  }
}

defineWidget('bms-generator-tile', BmsGeneratorTile);
