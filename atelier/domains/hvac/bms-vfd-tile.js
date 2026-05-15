import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Variable Frequency Drive (частотный преобразователь).
 * Attrs: label, freq (Hz), current (A), power (kW), running (bool),
 *   fault-code, dc-voltage, motor-temp, status
 */
export class BmsVfdTile extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'freq', 'current', 'power', 'running',
      'fault-code', 'dc-voltage', 'motor-temp', 'status'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'power-load');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption">частотный преобразователь</span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>

        <div class="bms-vfd-display" data-display>
          <div class="bms-vfd-rotor"></div>
          <div>
            <div class="freq"><span data-freq>0</span><span class="bms-muted" style="font-size: 16px; margin-left: 4px;">Hz</span></div>
            <div class="bms-caption" data-mode>—</div>
          </div>
        </div>

        <div class="bms-pump-kpis">
          <div class="bms-pump-kpi"><div class="l">ток</div><div class="v"><span data-current>0</span> A</div></div>
          <div class="bms-pump-kpi"><div class="l">мощность</div><div class="v"><span data-power>0</span> kW</div></div>
          <div class="bms-pump-kpi"><div class="l">U шины DC</div><div class="v"><span data-dc>0</span> V</div></div>
          <div class="bms-pump-kpi"><div class="l">t двигателя</div><div class="v"><span data-mt>0</span>°C</div></div>
        </div>

        <div class="bms-row" data-fault style="display:none; gap: 8px; padding: 8px 12px; background: rgb(240,70,60,0.12); border-radius: var(--bms-radius-sm); border-left: 3px solid rgb(240,70,60);">
          <span class="bms-mono" style="color: rgb(240,70,60); font-weight: 600;" data-fault-code></span>
          <span class="bms-caption" data-fault-text></span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const freq = this.num('freq', 0);
    const fault = this.str('fault-code', '');
    const running = freq > 0 && !fault;
    this.querySelector('[data-label]').textContent = this.str('label', 'VFD');
    this.querySelector('[data-freq]').textContent = freq.toFixed(1);
    this.querySelector('[data-current]').textContent = this.num('current', 0).toFixed(1);
    this.querySelector('[data-power]').textContent = this.num('power', 0).toFixed(1);
    this.querySelector('[data-dc]').textContent = Math.round(this.num('dc-voltage', 0));
    this.querySelector('[data-mt]').textContent = this.num('motor-temp', 0).toFixed(1);
    this.querySelector('[data-mode]').textContent = fault ? 'авария' : running ? 'работа' : 'останов';
    const display = this.querySelector('[data-display]');
    display.classList.toggle('is-stopped', !running);
    const dur = freq > 0 ? Math.max(0.2, 2.2 - 2 * (freq / 60)) : 0;
    display.style.setProperty('--vfd-duration', `${dur}s`);
    const faultEl = this.querySelector('[data-fault]');
    if (fault) {
      faultEl.style.display = '';
      this.querySelector('[data-fault-code]').textContent = fault;
      this.querySelector('[data-fault-text]').textContent = 'код ошибки';
    } else {
      faultEl.style.display = 'none';
    }
    const status = fault ? 'critical' : running ? 'ok' : 'offline';
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', status);
    if (fault) dot.setAttribute('pulsing', ''); else dot.removeAttribute('pulsing');
    dot.setAttribute('label', fault || (running ? 'работает' : 'останов'));
    this.classList.toggle('is-active', running);
    this.setAttribute('value', String((freq / 50) * 100));
  }
}

defineWidget('bms-vfd-tile', BmsVfdTile);
