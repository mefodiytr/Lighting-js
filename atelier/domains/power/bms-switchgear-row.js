import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const STATE_ICONS = { closed: '╋', open: '╳', tripped: '⚠', test: '⚙' };

/**
 * Switchgear panel — busbar + list of breakers/feeders.
 * Attrs: label, bus-voltage (V), bus-current (A), breakers (JSON [{id, label, state, current, rating}])
 */
export class BmsSwitchgearRow extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'bus-voltage', 'bus-current', 'breakers'];
  }

  _breakers() {
    try { return JSON.parse(this.str('breakers', '[]')); } catch { return []; }
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-switchgear');
      this.setAttribute('accent', 'power-load');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-caption bms-mono"><span data-bv>0</span> V · <span data-bc>0</span> A</span>
        </div>
        <div class="bms-switchgear-bus"></div>
        <div data-list></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const breakers = this._breakers();
    this.querySelector('[data-label]').textContent = this.str('label', 'РУ');
    this.querySelector('[data-bv]').textContent = this.num('bus-voltage', 400).toFixed(0);
    this.querySelector('[data-bc]').textContent = this.num('bus-current', 0).toFixed(0);
    const list = this.querySelector('[data-list]');
    list.innerHTML = '';
    let anyTripped = false;
    for (const b of breakers) {
      if (b.state === 'tripped') anyTripped = true;
      const row = document.createElement('div');
      row.className = `bms-switchgear-row st-${b.state || 'open'}`;
      const ratio = b.rating ? Math.min(1, (b.current || 0) / b.rating) : 0;
      row.innerHTML = `
        <div class="state">${STATE_ICONS[b.state] || '?'}</div>
        <div>
          <div style="font-weight: 600; font-size: 13px;">${b.label || b.id}</div>
          <div class="bms-caption bms-mono">${b.current || 0} / ${b.rating || '—'} A</div>
        </div>
        <div style="width: 80px;">
          <div class="bms-meter"><div class="bms-meter-fill" style="width: ${(ratio * 100).toFixed(0)}%;"></div></div>
        </div>
        <div class="bms-mono" style="font-size: 11px; color: var(--bms-text-muted); width: 60px; text-align: right;">${b.state || 'open'}</div>`;
      list.append(row);
    }
    this.classList.toggle('is-active', breakers.some((b) => b.state === 'closed'));
    if (anyTripped) {
      const dot = document.createElement('span');
      // No status dot in header (handled by header span), so nothing else
    }
  }
}

defineWidget('bms-switchgear-row', BmsSwitchgearRow);
