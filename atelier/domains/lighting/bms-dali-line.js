import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * DALI bus / line diagnostic — 64-cell topology grid + voltage + fault counts.
 * Attrs: label, line-id, voltage (V), drivers (JSON array of 64 booleans/objects),
 *   capacity (max devices, default 64)
 */
export class BmsDaliLine extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'line-id', 'voltage', 'drivers', 'capacity'];
  }

  _drivers() {
    try {
      const d = JSON.parse(this.str('drivers', '[]'));
      if (Array.isArray(d)) return d;
    } catch {}
    return [];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-dali-bus');
      this.setAttribute('accent', 'lighting-cct');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption">DALI line <span data-line>—</span></span>
          </div>
          <span class="bms-pill" data-bus>—</span>
        </div>
        <div class="bms-dali-bus-stats">
          <div class="bms-dali-bus-stat"><div class="v" data-total>0</div><div class="l">всего</div></div>
          <div class="bms-dali-bus-stat st-ok"><div class="v" data-on>0</div><div class="l">включено</div></div>
          <div class="bms-dali-bus-stat"><div class="v" data-off>0</div><div class="l">выключено</div></div>
          <div class="bms-dali-bus-stat st-fault"><div class="v" data-fault>0</div><div class="l">авария</div></div>
        </div>
        <div class="bms-dali-bus-grid" data-grid></div>
        <div class="bms-row bms-between bms-mono bms-muted" style="font-size: 11px;">
          <span>U шины: <span class="bms-text" data-volt>—</span> V</span>
          <span><span class="bms-text" data-cap>—</span> устройств вместимость</span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const drivers = this._drivers();
    const cap = this.num('capacity', 64);
    const volt = this.num('voltage', 16);
    let on = 0, off = 0, fault = 0;
    for (const d of drivers) {
      const s = d?.state ?? (d ? 'ok' : 'off');
      const level = d?.level ?? (typeof d === 'number' ? d : 0);
      if (s === 'lamp-fail' || s === 'driver-fail' || s === 'disconnected') fault++;
      else if (level > 0) on++;
      else off++;
    }
    this.querySelector('[data-label]').textContent = this.str('label', 'Линия DALI');
    this.querySelector('[data-line]').textContent = this.str('line-id', 'L1');
    this.querySelector('[data-total]').textContent = drivers.length;
    this.querySelector('[data-on]').textContent = on;
    this.querySelector('[data-off]').textContent = off;
    this.querySelector('[data-fault]').textContent = fault;
    this.querySelector('[data-volt]').textContent = volt.toFixed(1);
    this.querySelector('[data-cap]').textContent = cap;
    const bus = this.querySelector('[data-bus]');
    bus.textContent = volt >= 13 ? 'OK' : 'низкое напряжение';
    bus.classList.toggle('is-active', volt >= 13);
    const grid = this.querySelector('[data-grid]');
    grid.innerHTML = '';
    for (let i = 0; i < cap; i++) {
      const d = drivers[i];
      const cell = document.createElement('div');
      cell.className = 'bms-dali-bus-cell';
      if (!d) cell.classList.add('is-empty');
      else {
        const s = d?.state ?? 'ok';
        const level = d?.level ?? (typeof d === 'number' ? d : 0);
        if (s === 'lamp-fail' || s === 'driver-fail' || s === 'disconnected') cell.classList.add('is-fault');
        else if (level > 0) cell.classList.add('is-on');
        else cell.classList.add('is-off');
      }
      cell.title = `A${i.toString().padStart(2,'0')}`;
      grid.append(cell);
    }
    this.classList.toggle('is-active', on > 0);
  }
}

defineWidget('bms-dali-line', BmsDaliLine);
