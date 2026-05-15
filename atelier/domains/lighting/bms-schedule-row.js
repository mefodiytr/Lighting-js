import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Schedule row — 24 hourly cells with brightness 0-100.
 * Attrs: label, hours (JSON array length 24, values 0-100)
 */
export class BmsScheduleRow extends BmsElement {
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
      this.classList.add('bms-card', 'bms-schedule');
      this.setAttribute('accent', 'lighting-cct');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-caption" data-summary></span>
        </div>
        <div class="bms-schedule-head">
          <span>0</span><span>6</span><span>12</span><span>18</span><span>24</span>
        </div>
        <div class="bms-schedule-row" data-row></div>`;
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
      cell.className = 'bms-schedule-cell';
      const v = Math.max(0, Math.min(100, hours[i] || 0));
      cell.style.opacity = String(0.15 + (v / 100) * 0.85);
      cell.title = `${i}:00 — ${v}%`;
      row.append(cell);
    }
    this.querySelector('[data-label]').textContent = this.str('label', 'Расписание');
    const active = hours.filter((v) => v > 0).length;
    this.querySelector('[data-summary]').textContent = `${active}ч активно`;
    this.classList.add('is-active');
  }
}

defineWidget('bms-schedule-row', BmsScheduleRow);
