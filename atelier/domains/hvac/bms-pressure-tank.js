import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Pressure expansion tank — pressure level visualization + pre-charge reference.
 * Attrs: label, pressure (bar), pre-charge (bar), max-pressure, status
 */
export class BmsPressureTank extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'pressure', 'pre-charge', 'max-pressure', 'status'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'power-load');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <bms-status-dot data-state></bms-status-dot>
        </div>

        <svg class="bms-tank-svg" viewBox="0 0 140 200" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="20" width="60" height="160" rx="20" fill="var(--bms-surface-2)" stroke="var(--bms-border)" stroke-width="2" />
          <rect x="44" y="180" width="52" height="0" rx="0" fill="rgb(var(--cr) var(--cg) var(--cb))" data-level
            style="filter: drop-shadow(0 0 8px rgb(var(--cr) var(--cg) var(--cb) / 0.55));" />
          <line x1="36" y1="100" x2="104" y2="100" stroke="var(--bms-text-faint)" stroke-width="1" stroke-dasharray="3 3" data-precharge-line />
          <text x="110" y="104" font-size="9" fill="var(--bms-text-muted)" font-family="var(--bms-font-mono)">P0</text>
          <text x="70" y="14" text-anchor="middle" font-size="10" fill="var(--bms-text-muted)" font-family="var(--bms-font-mono)">бак</text>
        </svg>

        <div class="bms-row bms-between bms-mono" style="font-size: 13px;">
          <span><span class="bms-muted">P</span> <span data-press>0</span> bar</span>
          <span><span class="bms-muted">P0</span> <span data-pre>0</span> bar</span>
          <span><span class="bms-muted">P max</span> <span data-max>0</span> bar</span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const press = this.num('pressure', 0);
    const pre = this.num('pre-charge', 1.5);
    const max = this.num('max-pressure', 6);
    const ratio = Math.max(0, Math.min(1, press / max));
    this.querySelector('[data-label]').textContent = this.str('label', 'Расширительный бак');
    this.querySelector('[data-press]').textContent = press.toFixed(2);
    this.querySelector('[data-pre]').textContent = pre.toFixed(2);
    this.querySelector('[data-max]').textContent = max.toFixed(2);
    const level = this.querySelector('[data-level]');
    const h = 160 * ratio;
    level.setAttribute('height', String(h));
    level.setAttribute('y', String(20 + 160 - h));
    // precharge line position
    const pcY = 20 + 160 - (pre / max) * 160;
    const pcLine = this.querySelector('[data-precharge-line]');
    pcLine.setAttribute('y1', String(pcY));
    pcLine.setAttribute('y2', String(pcY));
    const status = this.str('status', press < pre ? 'warning' : press > max ? 'alarm' : 'ok');
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', status);
    dot.setAttribute('label', status === 'ok' ? 'норма' : status === 'warning' ? 'давление низкое' : 'давление высокое');
    this.classList.toggle('is-active', press > 0);
    this.setAttribute('value', String((press / max) * 100));
  }
}

defineWidget('bms-pressure-tank', BmsPressureTank);
