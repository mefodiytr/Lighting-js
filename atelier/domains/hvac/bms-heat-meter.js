import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Heat meter (теплосчётчик) — cumulative energy + instantaneous power + temps.
 * Attrs: label, energy (Gcal or MWh, total), power-now (kW), flow (m³/h),
 *   supply (°C), return (°C), unit (Gcal/MWh)
 */
export class BmsHeatMeter extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'energy', 'power-now', 'flow', 'supply', 'return', 'unit'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'hvac-temperature');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-caption">теплосчётчик</span>
        </div>

        <div class="bms-heat-meter-hero">
          <div>
            <div class="bms-caption">накопленная энергия</div>
            <div class="v"><span data-energy>0</span> <span class="bms-muted" style="font-size: 14px;" data-unit>Gcal</span></div>
          </div>
          <div style="text-align: right;">
            <div class="bms-caption">мгновенная</div>
            <div class="bms-mono" style="font-size: 18px; font-weight: 600;"><span data-power>0</span> kW</div>
          </div>
        </div>

        <div class="bms-pump-kpis">
          <div class="bms-pump-kpi"><div class="l">подача</div><div class="v"><span data-sup>0</span>°C</div></div>
          <div class="bms-pump-kpi"><div class="l">обратка</div><div class="v"><span data-ret>0</span>°C</div></div>
          <div class="bms-pump-kpi"><div class="l">расход</div><div class="v"><span data-flow>0</span> м³/ч</div></div>
          <div class="bms-pump-kpi"><div class="l">Δt</div><div class="v"><span data-dt>0</span>°C</div></div>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const energy = this.num('energy', 0);
    const power = this.num('power-now', 0);
    const sup = this.num('supply', 0);
    const ret = this.num('return', 0);
    const flow = this.num('flow', 0);
    this.querySelector('[data-label]').textContent = this.str('label', 'Теплосчётчик');
    this.querySelector('[data-energy]').textContent = energy.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    this.querySelector('[data-unit]').textContent = this.str('unit', 'Gcal');
    this.querySelector('[data-power]').textContent = power.toFixed(1);
    this.querySelector('[data-sup]').textContent = sup.toFixed(1);
    this.querySelector('[data-ret]').textContent = ret.toFixed(1);
    this.querySelector('[data-flow]').textContent = flow.toFixed(1);
    this.querySelector('[data-dt]').textContent = (sup - ret).toFixed(1);
    this.classList.toggle('is-active', power > 0);
    this.setAttribute('value', String(sup));
  }
}

defineWidget('bms-heat-meter', BmsHeatMeter);
