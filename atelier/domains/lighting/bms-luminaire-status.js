import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Luminaire service status — hours of operation, temperature, power, output.
 * Attrs: label, hours, max-hours, temperature (°C), max-temp, power (W),
 *   lumens, lumens-rated, mode (running/standby/service/fault)
 */
export class BmsLuminaireStatus extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'hours', 'max-hours', 'temperature', 'max-temp',
      'power', 'lumens', 'lumens-rated', 'mode'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'power-load');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <bms-status-dot data-state></bms-status-dot>
        </div>
        <div class="bms-lum-stats">
          <div class="bms-lum-stat"><div class="l">мощность</div><div class="v"><span data-power>0</span> W</div></div>
          <div class="bms-lum-stat"><div class="l">яркость</div><div class="v"><span data-lum>0</span> lm</div></div>
          <div class="bms-lum-stat"><div class="l">t° драйвера</div><div class="v"><span data-temp>0</span>°C</div></div>
          <div class="bms-lum-stat"><div class="l">наработка</div><div class="v"><span data-hours>0</span> ч</div></div>
        </div>
        <div>
          <div class="bms-row bms-between bms-caption">
            <span>ресурс</span>
            <span><span class="bms-mono bms-text" data-life-pct>0</span>%</span>
          </div>
          <div class="bms-lum-life" style="margin-top: 4px;">
            <div class="bms-lum-life-fill" data-life-fill></div>
          </div>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const hours = this.num('hours', 0);
    const maxH = this.num('max-hours', 50000);
    const temp = this.num('temperature', 0);
    const maxT = this.num('max-temp', 85);
    const power = this.num('power', 0);
    const lum = this.num('lumens', 0);
    const mode = this.str('mode', 'running');
    const lifePct = Math.max(0, Math.min(100, (hours / maxH) * 100));
    this.querySelector('[data-label]').textContent = this.str('label', 'Светильник');
    this.querySelector('[data-power]').textContent = power.toFixed(1);
    this.querySelector('[data-lum]').textContent = lum.toLocaleString('ru-RU');
    this.querySelector('[data-temp]').textContent = temp.toFixed(0);
    this.querySelector('[data-hours]').textContent = hours.toLocaleString('ru-RU');
    this.querySelector('[data-life-pct]').textContent = lifePct.toFixed(0);
    this.querySelector('[data-life-fill]').style.width = `${lifePct}%`;
    const dot = this.querySelector('[data-state]');
    const isOverTemp = temp > maxT;
    const status = mode === 'fault' || isOverTemp ? 'alarm'
                 : lifePct > 90 ? 'warning'
                 : mode === 'running' ? 'ok' : 'offline';
    dot.setAttribute('status', status);
    dot.setAttribute('label', mode === 'fault' ? 'авария' : isOverTemp ? 'перегрев' : lifePct > 90 ? 'выработан ресурс' : mode);
    this.classList.toggle('is-active', mode === 'running');
    this.setAttribute('value', String(lifePct));
  }
}

defineWidget('bms-luminaire-status', BmsLuminaireStatus);
