import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const MODES = [
  { id: 'online',  label: 'Online' },
  { id: 'battery', label: 'Battery' },
  { id: 'bypass',  label: 'Bypass' },
  { id: 'fault',   label: 'Fault' },
];

/**
 * UPS (Uninterruptible Power Supply) tile.
 * Attrs: label, mode (online/battery/bypass/fault), load-percent,
 *   battery-soc (0-100), autonomy-min, input-volt, output-volt, temp
 */
export class BmsUpsTile extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'mode', 'load-percent', 'battery-soc',
      'autonomy-min', 'input-volt', 'output-volt', 'temp'];
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

        <div class="bms-ups-mode-row" data-modes></div>

        <div class="bms-ups-flow">
          <div style="text-align: center;">
            <div class="bms-caption">вход</div>
            <div class="bms-mono" style="font-size: 18px; font-weight: 600;"><span data-vin>0</span> V</div>
          </div>
          <div class="arr">⚡</div>
          <div style="text-align: center;">
            <div class="bms-caption">выход</div>
            <div class="bms-mono" style="font-size: 18px; font-weight: 600;"><span data-vout>0</span> V</div>
          </div>
        </div>

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
          <div class="bms-pump-kpi"><div class="l">АКБ</div><div class="v"><span data-soc>0</span>%</div></div>
          <div class="bms-pump-kpi"><div class="l">автономия</div><div class="v"><span data-auto>0</span> мин</div></div>
          <div class="bms-pump-kpi"><div class="l">t° блока</div><div class="v"><span data-temp>0</span>°C</div></div>
        </div>`;
      const modesRow = this.querySelector('[data-modes]');
      for (const m of MODES) {
        const c = document.createElement('div');
        c.className = 'bms-ups-mode-cell';
        c.dataset.id = m.id;
        c.textContent = m.label;
        modesRow.append(c);
      }
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const mode = this.str('mode', 'online');
    const load = this.num('load-percent', 0);
    const soc = this.num('battery-soc', 0);
    this.querySelector('[data-label]').textContent = this.str('label', 'ИБП');
    for (const c of this.querySelectorAll('[data-modes] div')) {
      c.classList.toggle('is-active', c.dataset.id === mode);
    }
    this.querySelector('[data-vin]').textContent = this.num('input-volt', 230).toFixed(0);
    this.querySelector('[data-vout]').textContent = this.num('output-volt', 230).toFixed(0);
    this.querySelector('[data-load]').textContent = Math.round(load);
    this.querySelector('[data-load-fill]').style.width = `${load}%`;
    this.querySelector('[data-soc]').textContent = Math.round(soc);
    this.querySelector('[data-auto]').textContent = this.num('autonomy-min', 0);
    this.querySelector('[data-temp]').textContent = this.num('temp', 0).toFixed(0);
    const dot = this.querySelector('[data-state]');
    const status = mode === 'fault' ? 'critical' : mode === 'battery' ? 'warning' : mode === 'bypass' ? 'warning' : 'ok';
    dot.setAttribute('status', status);
    if (mode === 'battery' || mode === 'fault') dot.setAttribute('pulsing', '');
    else dot.removeAttribute('pulsing');
    dot.setAttribute('label', mode);
    this.classList.toggle('is-active', mode === 'online');
    this.setAttribute('value', String(load));
  }
}

defineWidget('bms-ups-tile', BmsUpsTile);
