import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Power transformer tile.
 * Attrs: label, primary-kv, secondary-kv, primary-current (A), load-percent,
 *   oil-temp, winding-temp, tap-position (-9 to +9), tap-max, status
 */
export class BmsTransformerTile extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'primary-kv', 'secondary-kv', 'primary-current',
      'load-percent', 'oil-temp', 'winding-temp', 'tap-position', 'tap-max', 'status'];
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

        <svg class="bms-trans-svg" viewBox="0 0 260 120" xmlns="http://www.w3.org/2000/svg">
          <text x="40" y="14" text-anchor="middle" font-size="11" fill="var(--bms-text-muted)" font-family="var(--bms-font-mono)" data-pri-lbl>HV</text>
          <line x1="40" y1="18" x2="40" y2="40" stroke="var(--bms-text)" stroke-width="2" />
          <path class="bms-trans-coil" d="M 30 40 Q 50 50, 30 60 Q 50 70, 30 80 Q 50 90, 30 100" />
          <path class="bms-trans-coil" d="M 50 40 Q 30 50, 50 60 Q 30 70, 50 80 Q 30 90, 50 100" />
          <line x1="120" y1="40" x2="120" y2="100" stroke="var(--bms-text-faint)" stroke-width="2" stroke-dasharray="3 3" />
          <path class="bms-trans-coil" d="M 200 40 Q 220 50, 200 60 Q 220 70, 200 80 Q 220 90, 200 100" />
          <path class="bms-trans-coil" d="M 220 40 Q 200 50, 220 60 Q 200 70, 220 80 Q 200 90, 220 100" />
          <line x1="210" y1="100" x2="210" y2="116" stroke="var(--bms-text)" stroke-width="2" />
          <text x="210" y="14" text-anchor="middle" font-size="11" fill="var(--bms-text-muted)" font-family="var(--bms-font-mono)" data-sec-lbl>LV</text>
          <text x="125" y="60" text-anchor="middle" font-size="9" fill="var(--bms-text-faint)" font-family="var(--bms-font-mono)">ATR</text>
          <text x="125" y="74" text-anchor="middle" font-size="9" fill="var(--bms-text-faint)" font-family="var(--bms-font-mono)" data-tap-text>±0</text>
        </svg>

        <div>
          <div class="bms-row bms-between bms-caption">
            <span>нагрузка</span>
            <span><span class="bms-mono bms-text" data-load>0</span>%</span>
          </div>
          <div class="bms-meter" style="margin-top: 4px;">
            <div class="bms-meter-fill" data-load-fill></div>
          </div>
        </div>

        <div class="bms-pump-kpis">
          <div class="bms-pump-kpi"><div class="l">ток первичный</div><div class="v"><span data-cur>0</span> A</div></div>
          <div class="bms-pump-kpi"><div class="l">t° масла</div><div class="v"><span data-oil>0</span>°C</div></div>
          <div class="bms-pump-kpi"><div class="l">t° обмотки</div><div class="v"><span data-wind>0</span>°C</div></div>
          <div class="bms-pump-kpi"><div class="l">отпайка</div><div class="v" data-tap>±0</div></div>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const load = this.num('load-percent', 0);
    const tap = this.num('tap-position', 0);
    const pri = this.num('primary-kv', 0);
    const sec = this.num('secondary-kv', 0);
    this.querySelector('[data-label]').textContent = this.str('label', 'Трансформатор');
    this.querySelector('[data-pri-lbl]').textContent = `${pri} кВ`;
    this.querySelector('[data-sec-lbl]').textContent = `${sec} кВ`;
    this.querySelector('[data-load]').textContent = Math.round(load);
    this.querySelector('[data-load-fill]').style.width = `${load}%`;
    this.querySelector('[data-cur]').textContent = this.num('primary-current', 0).toFixed(1);
    this.querySelector('[data-oil]').textContent = this.num('oil-temp', 0).toFixed(0);
    this.querySelector('[data-wind]').textContent = this.num('winding-temp', 0).toFixed(0);
    const tapStr = tap === 0 ? '±0' : (tap > 0 ? `+${tap}` : `${tap}`);
    this.querySelector('[data-tap]').textContent = tapStr;
    this.querySelector('[data-tap-text]').textContent = tapStr;
    const status = this.str('status', load > 90 ? 'warning' : load > 0 ? 'ok' : 'offline');
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', status);
    dot.setAttribute('label', status);
    this.classList.toggle('is-active', load > 0);
    this.setAttribute('value', String(load));
  }
}

defineWidget('bms-transformer-tile', BmsTransformerTile);
