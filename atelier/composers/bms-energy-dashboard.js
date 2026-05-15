import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

/**
 * Energy dashboard — energy flow + load bars + battery + PV gauge + sparkline.
 * Attrs: grid, load, pv, battery, soc, pv-trend (JSON array), load-trend (JSON array)
 */
export class BmsEnergyDashboard extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes,
      'grid', 'load', 'pv', 'battery', 'soc', 'pv-trend', 'load-trend'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-dash');
      this.innerHTML = `
        <header class="bms-dash-header">
          <h1 class="bms-room-title" style="font-size: 26px;">Энергетика</h1>
          <span class="bms-mono bms-muted" data-now></span>
        </header>

        <bms-energy-flow data-flow></bms-energy-flow>

        <div class="bms-dash-grid">
          <div style="display: grid; gap: 12px;">
            <bms-load-bar label="Ввод A" data-load-a threshold-warn="80" threshold-alarm="95" nominal="120"></bms-load-bar>
            <bms-load-bar label="Ввод B" data-load-b threshold-warn="80" threshold-alarm="95" nominal="120"></bms-load-bar>
            <div class="bms-card">
              <div class="bms-caption">Тренд потребления (15 мин)</div>
              <bms-sparkline data-load-spark accent="power-load" style="width: 100%; height: 56px; margin-top: 8px;"></bms-sparkline>
            </div>
          </div>
          <bms-battery-soc data-batt></bms-battery-soc>
          <div class="bms-card">
            <div class="bms-caption">Солнечные панели</div>
            <bms-gauge-ro data-pv-gauge min="0" max="100" unit="kW" accent="pv-generation" style="display: block; margin: 8px auto;"></bms-gauge-ro>
            <bms-sparkline data-pv-spark accent="pv-generation" style="width: 100%; height: 56px; margin-top: 8px;"></bms-sparkline>
          </div>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const grid = this.num('grid', 0);
    const load = this.num('load', 0);
    const pv = this.num('pv', 0);
    const battery = this.num('battery', 0);
    const soc = this.num('soc', 0);

    const flow = this.querySelector('[data-flow]');
    flow.setAttribute('grid', String(grid));
    flow.setAttribute('load', String(load));
    flow.setAttribute('pv', String(pv));
    flow.setAttribute('battery', String(battery));

    // Distribute load across A/B for the demo
    const loadA = Math.round((load * 0.55) * 10) / 10;
    const loadB = Math.round((load * 0.45) * 10) / 10;
    const lA = this.querySelector('[data-load-a]');
    lA.setAttribute('value', String((loadA / 120) * 100));
    lA.setAttribute('nominal', '120');
    const lB = this.querySelector('[data-load-b]');
    lB.setAttribute('value', String((loadB / 120) * 100));
    lB.setAttribute('nominal', '120');

    const batt = this.querySelector('[data-batt]');
    batt.setAttribute('level', String(soc));
    batt.setAttribute('charging', battery > 0.1 ? 'in' : battery < -0.1 ? 'out' : 'idle');
    batt.setAttribute('power', String(Math.abs(battery)));

    const gauge = this.querySelector('[data-pv-gauge]');
    gauge.setAttribute('value', String(pv));
    gauge.setAttribute('label', `${pv.toFixed(1)} kW`);

    const pvSpark = this.querySelector('[data-pv-spark]');
    pvSpark.setAttribute('data', this.str('pv-trend', '[]'));

    const loadSpark = this.querySelector('[data-load-spark]');
    loadSpark.setAttribute('data', this.str('load-trend', '[]'));

    const now = new Date();
    this.querySelector('[data-now]').textContent =
      now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  }
}

defineWidget('bms-energy-dashboard', BmsEnergyDashboard);
