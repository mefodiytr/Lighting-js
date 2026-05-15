import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Pump cascade — list of pumps with lead/lag/standby states.
 * Attrs: label, pumps (JSON [{id, label, mode, speed, hours, fault?}]),
 *   strategy (rotation/duty-standby), lead-id
 */
export class BmsPumpCascade extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'pumps', 'strategy', 'lead-id'];
  }

  _pumps() {
    try { return JSON.parse(this.str('pumps', '[]')); } catch { return []; }
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'hvac-temperature');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption" data-strategy></span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>

        <div class="bms-cascade-list" data-list></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const pumps = this._pumps();
    const strategy = this.str('strategy', 'rotation');
    const leadId = this.str('lead-id', pumps[0]?.id || '');
    this.querySelector('[data-label]').textContent = this.str('label', 'Насосный каскад');
    this.querySelector('[data-strategy]').textContent =
      strategy === 'rotation' ? 'ротация по наработке' : 'основной/резервный';

    const list = this.querySelector('[data-list]');
    list.innerHTML = '';
    let runningCount = 0;
    let anyFault = false;
    for (const p of pumps) {
      const isLead = p.id === leadId;
      const isFault = !!p.fault;
      const isRunning = p.speed > 0 && !isFault;
      if (isRunning) runningCount++;
      if (isFault) anyFault = true;
      const row = document.createElement('div');
      row.className = 'bms-cascade-row' + (isLead ? ' is-lead' : '') + (isFault ? ' is-fault' : '');
      row.innerHTML = `
        <bms-pump-icon speed="${p.speed || 0}" style="width:36px; height:42px;"></bms-pump-icon>
        <div>
          <div class="name">${p.label || p.id}</div>
          <div class="meta">${p.hours?.toLocaleString?.('ru-RU') || p.hours || 0} ч · ${p.mode || 'auto'}</div>
        </div>
        <div class="meta">${p.speed || 0}%</div>
        <div class="badge">${isFault ? 'авария' : isLead ? 'lead' : isRunning ? 'lag' : 'standby'}</div>`;
      list.append(row);
    }
    const status = anyFault ? 'alarm' : runningCount > 0 ? 'ok' : 'offline';
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', status);
    dot.setAttribute('label', `${runningCount} / ${pumps.length}`);
    this.classList.toggle('is-active', runningCount > 0 && !anyFault);
  }
}

defineWidget('bms-pump-cascade', BmsPumpCascade);
