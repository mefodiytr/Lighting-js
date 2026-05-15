import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Energy meter with day/peak/night tariffs + instantaneous power.
 * Attrs: label, total-kwh, day-kwh, peak-kwh, night-kwh, tariff (day/peak/night),
 *   instant-kw, cost-rub (optional cumulative)
 */
export class BmsEnergyMeter extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'total-kwh', 'day-kwh', 'peak-kwh', 'night-kwh',
      'tariff', 'instant-kw', 'cost-rub'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'power-load');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption">текущий тариф: <span class="bms-text bms-mono" data-tariff>—</span></span>
          </div>
          <div style="text-align: right;">
            <div class="bms-caption">мгновенно</div>
            <div class="bms-mono" style="font-size: 22px; font-weight: 600; color: rgb(var(--cr) var(--cg) var(--cb));"><span data-now>0</span> kW</div>
          </div>
        </div>

        <div class="bms-heat-meter-hero">
          <div>
            <div class="bms-caption">накопленная энергия</div>
            <div class="v"><span data-total>0</span> <span class="bms-muted" style="font-size: 14px;">kWh</span></div>
          </div>
          <div style="text-align: right;" data-cost-wrap>
            <div class="bms-caption">сумма</div>
            <div class="bms-mono" style="font-size: 18px; font-weight: 600;"><span data-cost>0</span> ₽</div>
          </div>
        </div>

        <div class="bms-em-totals">
          <div class="bms-em-tariff" data-tariff-day>
            <div class="name">день</div>
            <div class="v"><span data-day>0</span> kWh</div>
          </div>
          <div class="bms-em-tariff" data-tariff-peak>
            <div class="name">пик</div>
            <div class="v"><span data-peak>0</span> kWh</div>
          </div>
          <div class="bms-em-tariff" data-tariff-night>
            <div class="name">ночь</div>
            <div class="v"><span data-night>0</span> kWh</div>
          </div>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const tariff = this.str('tariff', 'day');
    this.querySelector('[data-label]').textContent = this.str('label', 'Электросчётчик');
    this.querySelector('[data-tariff]').textContent = tariff;
    this.querySelector('[data-now]').textContent = this.num('instant-kw', 0).toFixed(1);
    this.querySelector('[data-total]').textContent = this.num('total-kwh', 0).toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
    this.querySelector('[data-day]').textContent = this.num('day-kwh', 0).toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
    this.querySelector('[data-peak]').textContent = this.num('peak-kwh', 0).toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
    this.querySelector('[data-night]').textContent = this.num('night-kwh', 0).toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
    const cost = this.str('cost-rub', '');
    const costWrap = this.querySelector('[data-cost-wrap]');
    if (cost) {
      costWrap.style.display = '';
      this.querySelector('[data-cost]').textContent = Number(cost).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      costWrap.style.display = 'none';
    }
    for (const t of ['day', 'peak', 'night']) {
      this.querySelector(`[data-tariff-${t}]`).classList.toggle('is-active', t === tariff);
    }
    this.classList.toggle('is-active', this.num('instant-kw', 0) > 0);
    this.setAttribute('value', String(this.num('instant-kw', 0)));
  }
}

defineWidget('bms-energy-meter', BmsEnergyMeter);
