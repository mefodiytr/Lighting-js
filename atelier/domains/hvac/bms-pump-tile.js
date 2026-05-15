import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Detailed pump tile — speed, flow, pressure, hours, electric power, mode.
 * Attrs: label, mode (auto/manual/stopped/fault), speed (0-100), flow (m³/h),
 *   pressure (kPa), hours, electric-power (kW), status
 */
export class BmsPumpTile extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'mode', 'speed', 'flow', 'pressure', 'hours', 'electric-power', 'status'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-pump-tile');
      this.setAttribute('accent', 'hvac-temperature');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <bms-status-dot data-state></bms-status-dot>
        </div>

        <div class="bms-pump-hero">
          <bms-pump-icon data-icon></bms-pump-icon>
          <div class="bms-col" style="gap: 4px;">
            <div class="bms-mono" style="font-size: 28px; font-weight: 600; letter-spacing: -0.02em;">
              <span data-speed>0</span><span class="bms-muted" style="font-size: 14px; margin-left: 4px;">%</span>
            </div>
            <div class="bms-caption" data-mode>—</div>
          </div>
        </div>

        <div class="bms-pump-kpis">
          <div class="bms-pump-kpi"><div class="l">расход</div><div class="v"><span data-flow>0</span> м³/ч</div></div>
          <div class="bms-pump-kpi"><div class="l">давление</div><div class="v"><span data-press>0</span> kPa</div></div>
          <div class="bms-pump-kpi"><div class="l">мощность</div><div class="v"><span data-power>0</span> kW</div></div>
          <div class="bms-pump-kpi"><div class="l">наработка</div><div class="v"><span data-hours>0</span> ч</div></div>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const mode = this.str('mode', 'auto');
    const speed = this.num('speed', 0);
    const flow = this.num('flow', 0);
    const press = this.num('pressure', 0);
    const hours = this.num('hours', 0);
    const power = this.num('electric-power', 0);
    this.querySelector('[data-label]').textContent = this.str('label', 'Насос');
    this.querySelector('[data-speed]').textContent = Math.round(speed);
    this.querySelector('[data-flow]').textContent = flow.toFixed(1);
    this.querySelector('[data-press]').textContent = Math.round(press);
    this.querySelector('[data-hours]').textContent = hours.toLocaleString('ru-RU');
    this.querySelector('[data-power]').textContent = power.toFixed(1);
    this.querySelector('[data-mode]').textContent =
      mode === 'auto'    ? `автоматический режим · ${speed}%` :
      mode === 'manual'  ? `ручной режим · ${speed}%` :
      mode === 'fault'   ? 'авария' :
                            'остановлен';
    this.querySelector('[data-icon]').setAttribute('speed', String(speed));
    if (this._props.accent) this.querySelector('[data-icon]').setAttribute('accent', this._props.accent);
    const status = this.str('status', mode === 'fault' ? 'alarm' : speed > 0 ? 'ok' : 'offline');
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', status);
    dot.setAttribute('label', mode);
    this.classList.toggle('is-active', speed > 0 && mode !== 'fault');
    this.setAttribute('value', String(speed));
  }
}

defineWidget('bms-pump-tile', BmsPumpTile);
