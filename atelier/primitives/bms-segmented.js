import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

const STYLE = `
  :host {
    display: inline-block;
    font-family: var(--bms-font);
    color: var(--bms-text);
    user-select: none;
  }
  :host([disabled]) { opacity: 0.4; pointer-events: none; }
  .row {
    display: inline-flex;
    padding: 4px;
    border-radius: var(--bms-radius-md);
    background: var(--bms-surface-2);
    border: 1px solid var(--bms-border);
    position: relative;
  }
  button {
    position: relative;
    padding: 8px 14px;
    border: 0;
    background: transparent;
    color: var(--bms-text-muted);
    font: inherit;
    font-size: 13px;
    border-radius: calc(var(--bms-radius-md) - 4px);
    cursor: pointer;
    transition: color var(--bms-norm) var(--bms-ease);
  }
  button:hover { color: var(--bms-text); }
  button[aria-pressed="true"] {
    color: var(--bms-text);
    background: linear-gradient(180deg,
      rgb(var(--cr) var(--cg) var(--cb) / 0.22) 0%,
      rgb(var(--dr) var(--dg) var(--db) / 0.18) 100%);
    box-shadow:
      0 0 0 1px rgb(var(--cr) var(--cg) var(--cb) / 0.35),
      0 4px 12px rgb(var(--cr) var(--cg) var(--cb) / 0.2);
  }
`;

export class BmsSegmented extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() { return [...super.observedAttributes, 'options']; }

  /** @returns {Array<{value:string,label:string}>} */
  _options() {
    const raw = this.str('options', '[]');
    try {
      const arr = JSON.parse(raw);
      return arr.map((o) => typeof o === 'string' ? { value: o, label: o } : o);
    } catch {
      return [];
    }
  }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style><div class="row" role="tablist"></div>`;
      this._init = true;
    }
    const row = this.$('.row');
    row.innerHTML = '';
    const current = this.str('value');
    for (const opt of this._options()) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = opt.label;
      b.setAttribute('aria-pressed', String(opt.value === current));
      b.addEventListener('click', () => {
        if (this.bool('disabled')) return;
        this.setAttribute('value', opt.value);
        this.emit('change', { value: opt.value });
        this.render();
      });
      row.append(b);
    }
  }

  update() { this.render(); }
}

defineWidget('bms-segmented', BmsSegmented);
