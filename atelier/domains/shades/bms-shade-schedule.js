import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Shade schedule — 24-hour timeline showing planned open percentage per hour.
 * Attrs: label, hours (JSON array of 24 values 0-100)
 */
export class BmsShadeSchedule extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'hours'];
  }

  _hours() {
    try {
      const arr = JSON.parse(this.str('hours', '[]'));
      if (Array.isArray(arr) && arr.length === 24) return arr;
    } catch {}
    return new Array(24).fill(0);
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-shade-sched');
      this.setAttribute('accent', 'shades-position');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-caption" data-summary></span>
        </div>
        <div class="bms-schedule-head" style="display:flex; justify-content: space-between; font-size: 11px; color: var(--bms-text-muted); font-family: var(--bms-font-mono);">
          <span>0</span><span>6</span><span>12</span><span>18</span><span>24</span>
        </div>
        <div class="bms-shade-sched-row" data-row></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const hours = this._hours();
    const row = this.querySelector('[data-row]');
    row.innerHTML = '';
    for (let i = 0; i < 24; i++) {
      const cell = document.createElement('div');
      cell.className = 'bms-shade-sched-cell';
      const v = Math.max(0, Math.min(100, hours[i] || 0));
      cell.innerHTML = `<div class="b" style="height: ${v}%;"></div>`;
      cell.title = `${i}:00 — ${v}%`;
      row.append(cell);
    }
    const avg = Math.round(hours.reduce((a, b) => a + b, 0) / 24);
    this.querySelector('[data-label]').textContent = this.str('label', 'Расписание штор');
    this.querySelector('[data-summary]').textContent = `средняя ${avg}% за сутки`;
    this.setAttribute('value', String(avg));
    this.classList.add('is-active');
  }
}

defineWidget('bms-shade-schedule', BmsShadeSchedule);
