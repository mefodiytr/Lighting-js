import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * VRF zone — master outdoor unit + N indoor units list.
 * Attrs: label, master-status, mode (heat/cool/standby), indoors (JSON [{id,label,setpoint,actual,running}])
 */
export class BmsVrfZone extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'master-status', 'mode', 'indoors'];
  }

  _indoors() {
    try { return JSON.parse(this.str('indoors', '[]')); } catch { return []; }
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'hvac-temperature');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption">VRF · мульти-сплит</span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>

        <div class="bms-vrf-master">
          <div>
            <div class="bms-caption">Наружный блок</div>
            <div class="bms-mono bms-h2" data-mode>—</div>
          </div>
          <div style="text-align: right;">
            <div class="bms-caption">внутренних</div>
            <div class="bms-mono bms-h2" data-count>0</div>
          </div>
        </div>

        <div class="bms-vrf-zones" data-zones></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const mode = this.str('mode', 'standby');
    const indoors = this._indoors();
    const running = indoors.filter((u) => u.running).length;
    const status = this.str('master-status', running > 0 ? 'ok' : 'offline');
    this.querySelector('[data-label]').textContent = this.str('label', 'VRF группа');
    this.querySelector('[data-mode]').textContent = mode;
    this.querySelector('[data-count]').textContent = `${running} / ${indoors.length}`;
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', status);
    dot.setAttribute('label', mode);
    const zones = this.querySelector('[data-zones]');
    zones.innerHTML = '';
    for (const u of indoors) {
      const cell = document.createElement('div');
      cell.className = 'bms-vrf-indoor' + (u.running ? ' is-running' : '');
      cell.innerHTML = `
        <div class="name">${u.label || u.id}</div>
        <div class="meta">${u.actual?.toFixed?.(1) ?? u.actual ?? '—'}°C → ${u.setpoint?.toFixed?.(1) ?? u.setpoint ?? '—'}°C</div>`;
      zones.append(cell);
    }
    this.classList.toggle('is-active', running > 0);
  }
}

defineWidget('bms-vrf-zone', BmsVrfZone);
