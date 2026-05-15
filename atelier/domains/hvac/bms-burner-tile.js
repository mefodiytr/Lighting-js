import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Burner (горелка) tile — stage indicator + modulation + ignition status.
 * Attrs: label, stage (off/ignite/low/high), modulation (0-100), fault, hours,
 *   flame-current (µA), status
 */
export class BmsBurnerTile extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'stage', 'modulation', 'fault', 'hours', 'flame-current', 'status'];
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

        <div class="bms-burner-stages" data-stages>
          <div class="bms-burner-stage" data-s="0"></div>
          <div class="bms-burner-stage" data-s="1"></div>
          <div class="bms-burner-stage" data-s="2"></div>
          <div class="bms-burner-stage" data-s="3"></div>
          <div class="bms-burner-stage" data-s="4"></div>
        </div>

        <div class="bms-row bms-between" style="font-size: 12px;">
          <span class="bms-caption">этап: <span class="bms-text" data-stage>—</span></span>
          <span class="bms-caption">модуляция: <span class="bms-mono bms-text" data-mod>0</span>%</span>
        </div>

        <div class="bms-pump-kpis">
          <div class="bms-pump-kpi"><div class="l">ток ионизации</div><div class="v"><span data-flame>0</span> µA</div></div>
          <div class="bms-pump-kpi"><div class="l">наработка</div><div class="v"><span data-hours>0</span> ч</div></div>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const stage = this.str('stage', 'off');
    const mod = this.num('modulation', 0);
    const fault = this.str('fault', '');
    const STAGES = { off: 0, ignite: 1, low: 2, high: 4 };
    const lit = STAGES[stage] ?? Math.ceil((mod / 100) * 5);
    this.querySelector('[data-label]').textContent = this.str('label', 'Горелка');
    this.querySelector('[data-stage]').textContent = stage;
    this.querySelector('[data-mod]').textContent = Math.round(mod);
    this.querySelector('[data-flame]').textContent = this.str('flame-current', '0');
    this.querySelector('[data-hours]').textContent = this.num('hours', 0).toLocaleString('ru-RU');
    for (const cell of this.querySelectorAll('.bms-burner-stage')) {
      const idx = Number(cell.dataset.s);
      cell.classList.toggle('is-on', idx < lit);
      cell.style.height = `${30 + idx * 14}%`;
    }
    const running = stage !== 'off' && !fault;
    const status = fault ? 'critical' : running ? 'ok' : 'offline';
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', status);
    if (fault) dot.setAttribute('pulsing', ''); else dot.removeAttribute('pulsing');
    dot.setAttribute('label', fault || stage);
    this.classList.toggle('is-active', running);
    this.setAttribute('value', String(mod));
  }
}

defineWidget('bms-burner-tile', BmsBurnerTile);
