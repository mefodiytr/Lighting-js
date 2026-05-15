import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

/**
 * Pump room — 3-pump cascade (lead/lag/standby) feeding common header,
 * plus pressure tank + manifold output to consumers.
 * Attrs: name, tag, pumps (JSON [{id, label, speed, hours, state}]),
 *   tank-pressure (bar), header-pressure (bar), header-flow (m³/h), lead-id
 */
export class BmsPumpRoomMnemonic extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'name', 'tag',
      'pumps', 'tank-pressure', 'header-pressure', 'header-flow', 'lead-id', 'status'];
  }

  _pumps() {
    try { return JSON.parse(this.str('pumps', '[]')); } catch { return []; }
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-mimic');
      this.setAttribute('accent', 'hvac-temperature');
      this.innerHTML = `
        <header class="bms-mimic-head">
          <div>
            <h3 class="bms-mimic-title" data-name>Насосная</h3>
            <div class="bms-caption" data-tag></div>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </header>

        <div class="bms-mimic-stage">
          <div style="display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: center;">
            <div style="text-align: center;">
              <bms-tank-icon data-tank shape="cylinder" style="width: 80px; height: 110px;"></bms-tank-icon>
              <div class="bms-caption bms-mono">Расш. бак · <span data-tp>0</span> bar</div>
            </div>
            <div data-pumps style="display: grid; gap: 8px;"></div>
            <div style="text-align: center;">
              <bms-sensor-pip kind="p" data-hp unit=" bar"></bms-sensor-pip>
              <div class="bms-caption" style="margin-top: 4px;">общий коллектор</div>
              <bms-sensor-pip kind="f" data-hf unit=" м³/ч" style="margin-top: 4px;"></bms-sensor-pip>
            </div>
          </div>
        </div>

        <div class="bms-mimic-stats" data-stats></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const pumps = this._pumps();
    const lead = this.str('lead-id', pumps[0]?.id || '');
    const tankP = this.num('tank-pressure', 0);
    const hp = this.num('header-pressure', 0);
    const hf = this.num('header-flow', 0);
    this.querySelector('[data-name]').textContent = this.str('name', 'Насосная');
    this.querySelector('[data-tag]').textContent = this.str('tag', '');
    this.querySelector('[data-tank]').setAttribute('level', String(Math.min(100, (tankP / 6) * 100)));
    this.querySelector('[data-tank]').setAttribute('label', `${tankP.toFixed(2)} bar`);
    this.querySelector('[data-tp]').textContent = tankP.toFixed(2);
    this.querySelector('[data-hp]').setAttribute('value', hp.toFixed(2));
    this.querySelector('[data-hf]').setAttribute('value', Math.round(hf));

    const list = this.querySelector('[data-pumps]');
    list.innerHTML = '';
    let running = 0;
    for (const p of pumps) {
      const row = document.createElement('div');
      row.style.cssText = 'display: grid; grid-template-columns: auto auto 1fr auto; gap: 10px; align-items: center; padding: 6px 10px; background: var(--bms-surface-2); border-radius: var(--bms-radius-sm); border-left: 3px solid ' + (p.id === lead ? 'rgb(var(--cr) var(--cg) var(--cb))' : 'transparent') + ';';
      const isRun = (p.speed || 0) > 0 && p.state !== 'fault';
      if (isRun) running++;
      row.innerHTML = `
        <bms-pump-icon speed="${p.speed || 0}" style="width: 36px; height: 42px;"></bms-pump-icon>
        <div style="font-weight: 600; font-size: 13px;">${p.label || p.id}</div>
        <div class="bms-mono" style="font-size: 11px; color: var(--bms-text-muted);">${p.hours || 0} ч</div>
        <div class="bms-mono" style="font-size: 11px;">${p.id === lead ? 'lead' : isRun ? 'lag' : 'standby'}</div>`;
      list.append(row);
    }

    const status = this.str('status', running > 0 ? 'ok' : 'offline');
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', status);
    dot.setAttribute('label', `${running} / ${pumps.length}`);

    const stats = this.querySelector('[data-stats]');
    stats.innerHTML = '';
    const items = [
      ['В работе',       `${running} / ${pumps.length}`],
      ['P коллектор',    `${hp.toFixed(2)} bar`],
      ['Q коллектор',    `${Math.round(hf)} м³/ч`],
      ['P бак',          `${tankP.toFixed(2)} bar`],
    ];
    for (const [l, v] of items) {
      const cell = document.createElement('div');
      cell.className = 'bms-mimic-stat';
      cell.innerHTML = `<div class="l">${l}</div><div class="v">${v}</div>`;
      stats.append(cell);
    }
  }
}

defineWidget('bms-pump-room-mnemonic', BmsPumpRoomMnemonic);
