import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

const FILTERS = [
  { id: 'all',      label: 'Все' },
  { id: 'critical', label: 'Критичные' },
  { id: 'alarm',    label: 'Тревоги' },
  { id: 'warning',  label: 'Предупр.' },
  { id: 'unack',    label: 'Не подтв.' },
];

/**
 * Alarm console — filtered list of bms-alarm-row entries.
 * Attrs: filter (one of FILTERS ids), alarms (JSON array)
 *   alarm = { id, time, severity, location, message, ack? }
 */
export class BmsAlarmConsole extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'filter', 'alarms'];
  }

  _alarms() {
    try { return JSON.parse(this.str('alarms', '[]')); } catch { return []; }
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-console');
      this.innerHTML = `
        <header class="bms-console-header">
          <div>
            <h1 class="bms-room-title" style="font-size: 24px;">Журнал тревог</h1>
            <div class="bms-console-counter" data-counter></div>
          </div>
          <div class="bms-console-filters" data-filters></div>
        </header>
        <div class="bms-console-list" data-list></div>`;
      const filters = this.querySelector('[data-filters]');
      for (const f of FILTERS) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'bms-console-filter';
        b.dataset.id = f.id;
        b.textContent = f.label;
        b.addEventListener('click', () => {
          this.setAttribute('filter', f.id);
          this.emit('filter-change', { filter: f.id });
        });
        filters.append(b);
      }
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const filter = this.str('filter', 'all');
    for (const b of this.querySelectorAll('[data-filters] button')) {
      b.classList.toggle('is-active', b.dataset.id === filter);
    }
    const alarms = this._alarms();
    const filtered = alarms.filter((a) => {
      if (filter === 'all') return true;
      if (filter === 'unack') return !a.ack;
      return a.severity === filter;
    });
    this.querySelector('[data-counter]').textContent =
      `${filtered.length} из ${alarms.length} · фильтр: ${filter}`;
    const list = this.querySelector('[data-list]');
    list.innerHTML = '';
    if (!filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'bms-console-empty';
      empty.textContent = 'Нет записей по выбранному фильтру';
      list.append(empty);
      return;
    }
    for (const a of filtered) {
      const row = document.createElement('bms-alarm-row');
      row.setAttribute('severity', a.severity);
      row.setAttribute('time', a.time);
      row.setAttribute('location', a.location || '');
      row.setAttribute('message', a.message || '');
      if (a.ack) row.setAttribute('ack', '');
      row.addEventListener('acknowledge', () => this.emit('acknowledge', { id: a.id, time: a.time }));
      list.append(row);
    }
  }
}

defineWidget('bms-alarm-console', BmsAlarmConsole);
