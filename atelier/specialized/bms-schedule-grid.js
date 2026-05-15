import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

/**
 * 7-day × 24-hour schedule heatmap.
 * Attrs: label, grid (JSON 2D array [7][24] of 0-100 values), unit
 */
export class BmsScheduleGrid extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'grid', 'unit'];
  }

  _grid() {
    try {
      const g = JSON.parse(this.str('grid', '[]'));
      if (Array.isArray(g) && g.length === 7 && g.every((r) => Array.isArray(r) && r.length === 24)) return g;
    } catch {}
    return new Array(7).fill(null).map(() => new Array(24).fill(0));
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-sched-grid');
      this.setAttribute('accent', 'lighting-cct');
      this.innerHTML = `
        <div class="bms-sched-day" style="grid-column: 1; grid-row: 1;"></div>
        <div class="bms-sched-head" data-head></div>
        <div class="bms-sched-rows" data-rows></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const grid = this._grid();
    const head = this.querySelector('[data-head]');
    head.innerHTML = '';
    for (let h = 0; h < 24; h += 1) {
      const s = document.createElement('span');
      s.textContent = h % 3 === 0 ? h : '';
      head.append(s);
    }
    const rows = this.querySelector('[data-rows]');
    rows.innerHTML = '';
    const unit = this.str('unit', '%');
    for (let d = 0; d < 7; d++) {
      const dayLabel = document.createElement('div');
      dayLabel.className = 'bms-sched-day';
      dayLabel.textContent = DAYS[d];
      rows.append(dayLabel);
      const row = document.createElement('div');
      row.className = 'bms-sched-row';
      for (let h = 0; h < 24; h++) {
        const v = Math.max(0, Math.min(100, grid[d][h] || 0));
        const cell = document.createElement('div');
        cell.className = 'bms-sched-cell';
        cell.style.setProperty('--cell-op', (v / 100).toFixed(2));
        cell.title = `${DAYS[d]} ${h.toString().padStart(2, '0')}:00 — ${v}${unit}`;
        cell.addEventListener('click', () => this.emit('cell-click', { day: d, hour: h, value: v }));
        row.append(cell);
      }
      rows.append(row);
    }
  }
}

defineWidget('bms-schedule-grid', BmsScheduleGrid);
