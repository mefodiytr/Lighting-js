import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

const LEVELS = [
  { id: 'all',     label: 'Все' },
  { id: 'error',   label: 'Errors' },
  { id: 'warning', label: 'Warnings' },
  { id: 'info',    label: 'Info' },
  { id: 'debug',   label: 'Debug' },
];

const PAGE = 50;

/**
 * Paginated event log viewer with search + level filter.
 * Attrs: events (JSON array of {time, level, source, message}), level, search
 */
export class BmsLogViewer extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'events', 'level', 'search'];
  }

  _events() {
    try { return JSON.parse(this.str('events', '[]')); } catch { return []; }
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-log');
      this._page = 0;
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label>Журнал событий</h3>
          <span class="bms-caption" data-count></span>
        </div>
        <div class="bms-log-controls">
          <input class="bms-log-search" type="text" placeholder="поиск по тексту…" data-search />
          <div data-levels style="display: flex; gap: 4px;"></div>
        </div>
        <div class="bms-log-list" data-list></div>
        <div class="bms-log-pagination" data-pag></div>`;
      const levels = this.querySelector('[data-levels]');
      for (const l of LEVELS) {
        const b = document.createElement('button');
        b.className = 'bms-log-level';
        b.dataset.id = l.id;
        b.textContent = l.label;
        b.addEventListener('click', () => {
          this._page = 0;
          this.setAttribute('level', l.id);
        });
        levels.append(b);
      }
      const search = this.querySelector('[data-search]');
      search.addEventListener('input', () => {
        this._page = 0;
        this.setAttribute('search', search.value);
      });
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const all = this._events();
    const level = this.str('level', 'all');
    const search = this.str('search', '').toLowerCase();
    const filtered = all.filter((e) => {
      if (level !== 'all' && e.level !== level) return false;
      if (search && !(`${e.message} ${e.source || ''}`.toLowerCase().includes(search))) return false;
      return true;
    });
    this.querySelector('[data-label]').textContent = this.str('label', 'Журнал событий');
    this.querySelector('[data-count]').textContent = `${filtered.length} из ${all.length}`;
    for (const b of this.querySelectorAll('[data-levels] button')) {
      b.classList.toggle('is-active', b.dataset.id === level);
    }
    const list = this.querySelector('[data-list]');
    list.innerHTML = '';
    const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
    if (this._page >= pages) this._page = pages - 1;
    const slice = filtered.slice(this._page * PAGE, (this._page + 1) * PAGE);
    for (const e of slice) {
      const row = document.createElement('div');
      row.className = `bms-log-row lvl-${e.level || 'info'}`;
      row.innerHTML = `<span class="time">${e.time || ''}</span>
        <span class="src">${e.source || '—'}</span>
        <span class="msg">${escapeHtml(e.message || '')}</span>`;
      list.append(row);
    }
    if (!slice.length) {
      const empty = document.createElement('div');
      empty.style.cssText = 'padding: 24px; text-align: center; color: var(--bms-text-muted); font-family: var(--bms-font);';
      empty.textContent = 'Нет записей по фильтру';
      list.append(empty);
    }
    const pag = this.querySelector('[data-pag]');
    pag.innerHTML = `
      <button data-prev ${this._page === 0 ? 'disabled' : ''}>← пред</button>
      <span>страница ${this._page + 1} из ${pages}</span>
      <button data-next ${this._page >= pages - 1 ? 'disabled' : ''}>след →</button>`;
    pag.querySelector('[data-prev]').addEventListener('click', () => { this._page--; this._reflect(); });
    pag.querySelector('[data-next]').addEventListener('click', () => { this._page++; this._reflect(); });
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]);
}

defineWidget('bms-log-viewer', BmsLogViewer);
