import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Photovoltaic array — strings grid + total output + irradiance.
 * Attrs: label, peak-kw, current-kw, irradiance (W/m²),
 *   strings (JSON array of {id, status, power}), inverter-temp, daily-kwh
 */
export class BmsPvArray extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'peak-kw', 'current-kw', 'irradiance',
      'strings', 'inverter-temp', 'daily-kwh'];
  }

  _strings() {
    try { return JSON.parse(this.str('strings', '[]')); } catch { return []; }
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'pv-generation');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption">PV массив</span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>

        <div class="bms-row" style="gap: 16px;">
          <div style="flex: 1;">
            <div class="bms-caption">текущая мощность</div>
            <div class="bms-mono" style="font-size: 28px; font-weight: 600; color: rgb(var(--cr) var(--cg) var(--cb));"><span data-cur>0</span> kW</div>
          </div>
          <div style="text-align: right;">
            <div class="bms-caption">пик / сегодня</div>
            <div class="bms-mono" style="font-size: 14px; font-weight: 600;"><span data-peak>0</span> kW</div>
            <div class="bms-mono" style="font-size: 12px; color: var(--bms-text-muted);"><span data-daily>0</span> kWh</div>
          </div>
        </div>

        <div>
          <div class="bms-row bms-between bms-caption">
            <span>инсоляция</span>
            <span><span class="bms-mono bms-text" data-irr>0</span> W/m²</span>
          </div>
          <div class="bms-meter" style="margin-top: 4px;">
            <div class="bms-meter-fill" data-irr-fill></div>
          </div>
        </div>

        <div>
          <div class="bms-caption" style="margin-bottom: 6px;">стринги</div>
          <div class="bms-pv-strings" data-strings></div>
        </div>

        <div class="bms-row bms-between bms-caption">
          <span>t° инвертора</span>
          <span class="bms-mono bms-text"><span data-itemp>0</span>°C</span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const cur = this.num('current-kw', 0);
    const peak = this.num('peak-kw', 0);
    const daily = this.num('daily-kwh', 0);
    const irr = this.num('irradiance', 0);
    this.querySelector('[data-label]').textContent = this.str('label', 'Солнечная установка');
    this.querySelector('[data-cur]').textContent = cur.toFixed(1);
    this.querySelector('[data-peak]').textContent = peak.toFixed(1);
    this.querySelector('[data-daily]').textContent = daily.toFixed(0);
    this.querySelector('[data-irr]').textContent = Math.round(irr);
    this.querySelector('[data-irr-fill]').style.width = `${Math.min(100, (irr / 1000) * 100)}%`;
    this.querySelector('[data-itemp]').textContent = this.num('inverter-temp', 0).toFixed(0);

    const strings = this._strings();
    const grid = this.querySelector('[data-strings]');
    grid.innerHTML = '';
    let faults = 0;
    for (const s of strings) {
      const cell = document.createElement('div');
      const status = s.status || 'good';
      cell.className = `bms-pv-string is-${status}`;
      if (status === 'fault') faults++;
      cell.title = `${s.id || ''} · ${s.power || 0} kW · ${status}`;
      cell.textContent = s.id || '';
      grid.append(cell);
    }
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', faults > 0 ? 'warning' : cur > 0 ? 'ok' : 'offline');
    dot.setAttribute('label', faults > 0 ? `${faults} строк аварийно` : cur > 0 ? 'генерация' : 'нет генерации');
    this.classList.toggle('is-active', cur > 0);
    this.setAttribute('value', String(cur));
  }
}

defineWidget('bms-pv-array', BmsPvArray);
