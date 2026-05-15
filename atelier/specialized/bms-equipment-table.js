import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

const STATUS_FILTERS = [
  { id: 'all',      label: 'Все' },
  { id: 'ok',       label: 'Норма' },
  { id: 'warning',  label: 'Внимание' },
  { id: 'alarm',    label: 'Тревога' },
  { id: 'offline',  label: 'Offline' },
];

/**
 * Sortable, filterable equipment table.
 * Attrs: label, columns (JSON [{key, label, type?, align?}]),
 *   items (JSON array), filter, sort (key), sort-dir (asc|desc)
 */
export class BmsEquipmentTable extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'columns', 'items', 'filter', 'sort', 'sort-dir'];
  }

  _columns() { try { return JSON.parse(this.str('columns', '[]')); } catch { return []; } }
  _items()   { try { return JSON.parse(this.str('items', '[]')); } catch { return []; } }

  render() {
    if (!this._init) {
      this.classList.add('bms-eqtable');
      this.innerHTML = `
        <div class="bms-eqtable-head">
          <div>
            <h3 class="bms-h2" data-label>Список оборудования</h3>
            <span class="bms-caption" data-count></span>
          </div>
          <div class="bms-eqtable-filters" data-filters></div>
        </div>
        <table class="bms-eqtable-table">
          <thead data-head></thead>
          <tbody data-body></tbody>
        </table>`;
      const filters = this.querySelector('[data-filters]');
      for (const f of STATUS_FILTERS) {
        const b = document.createElement('button');
        b.className = 'bms-eqtable-filter';
        b.dataset.id = f.id;
        b.textContent = f.label;
        b.addEventListener('click', () => this.setAttribute('filter', f.id));
        filters.append(b);
      }
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const cols = this._columns();
    const items = this._items();
    const filter = this.str('filter', 'all');
    const sortKey = this.str('sort', '');
    const sortDir = this.str('sort-dir', 'asc');

    this.querySelector('[data-label]').textContent = this.str('label', 'Список оборудования');
    for (const b of this.querySelectorAll('[data-filters] button')) {
      b.classList.toggle('is-active', b.dataset.id === filter);
    }

    let rows = items.filter((it) => filter === 'all' || it.status === filter);
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortKey] ?? '';
        const bv = b[sortKey] ?? '';
        if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
        return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }
    this.querySelector('[data-count]').textContent = `${rows.length} из ${items.length} единиц`;

    const head = this.querySelector('[data-head]');
    head.innerHTML = '';
    const tr = document.createElement('tr');
    tr.innerHTML = `<th>статус</th>` + cols.map((c) =>
      `<th class="${c.key === sortKey ? 'is-sorted' : ''}" data-key="${c.key}">${c.label}${c.key === sortKey ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}</th>`
    ).join('');
    head.append(tr);
    for (const th of tr.querySelectorAll('th[data-key]')) {
      th.addEventListener('click', () => {
        const key = th.dataset.key;
        if (sortKey === key) {
          this.setAttribute('sort-dir', sortDir === 'asc' ? 'desc' : 'asc');
        } else {
          this.setAttribute('sort', key);
          this.setAttribute('sort-dir', 'asc');
        }
      });
    }

    const body = this.querySelector('[data-body]');
    body.innerHTML = '';
    for (const it of rows) {
      const r = document.createElement('tr');
      const dotCell = `<td><bms-status-dot status="${it.status || 'unknown'}"></bms-status-dot></td>`;
      const cells = cols.map((c) => {
        const val = it[c.key];
        const cls = c.type === 'number' || c.type === 'mono' ? 'mono' : '';
        return `<td class="${cls}">${val ?? '—'}</td>`;
      }).join('');
      r.innerHTML = dotCell + cells;
      r.addEventListener('click', () => this.emit('row-click', { item: it }));
      body.append(r);
    }
  }
}

defineWidget('bms-equipment-table', BmsEquipmentTable);
