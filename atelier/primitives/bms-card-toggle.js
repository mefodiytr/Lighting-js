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
  .card {
    position: relative;
    min-width: 180px;
    padding: 14px 16px;
    border-radius: var(--bms-radius-md);
    background: var(--bms-surface);
    border: 1px solid var(--bms-border);
    box-shadow: var(--bms-shadow-1);
    cursor: pointer;
    overflow: hidden;
    transition: transform var(--bms-fast) var(--bms-ease),
                box-shadow var(--bms-norm) var(--bms-ease),
                border-color var(--bms-norm) var(--bms-ease);
  }
  .card:hover { transform: translateY(-1px); }
  :host([checked]) .card {
    border-color: rgb(var(--cr) var(--cg) var(--cb) / 0.55);
    box-shadow:
      var(--bms-shadow-1),
      0 0 0 1px rgb(var(--cr) var(--cg) var(--cb) / 0.4),
      0 20px 48px rgb(var(--cr) var(--cg) var(--cb) / 0.22);
  }
  :host([checked]) .card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(120% 100% at 50% 0%,
      rgb(var(--cr) var(--cg) var(--cb) / 0.18) 0%,
      transparent 70%);
    pointer-events: none;
  }
  .row { display: flex; align-items: center; justify-content: space-between; gap: 12px; position: relative; }
  .meta { display: flex; flex-direction: column; gap: 2px; }
  .label { font-size: 13px; font-weight: 600; }
  .caption { font-size: 11px; color: var(--bms-text-muted); }
  .pip {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--bms-text-faint);
    transition: background var(--bms-norm) var(--bms-ease),
                box-shadow var(--bms-norm) var(--bms-ease);
  }
  :host([checked]) .pip {
    background: rgb(var(--cr) var(--cg) var(--cb));
    box-shadow: 0 0 12px rgb(var(--cr) var(--cg) var(--cb) / 0.8);
  }
`;

export class BmsCardToggle extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() { return [...super.observedAttributes, 'checked', 'caption']; }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <div class="card" part="card">
          <div class="row">
            <div class="meta">
              <div class="label"></div>
              <div class="caption"></div>
            </div>
            <div class="pip"></div>
          </div>
        </div>`;
      this.$('.card').addEventListener('click', () => this.toggle());
      this._init = true;
    }
    this.$('.label').textContent = this.str('label', '—');
    this.$('.caption').textContent = this.str('caption',
      this.bool('checked') ? 'включено' : 'выключено');
  }

  toggle() {
    if (this.bool('disabled')) return;
    const next = !this.bool('checked');
    if (next) this.setAttribute('checked', ''); else this.removeAttribute('checked');
    this.emit('change', { checked: next });
  }
}

defineWidget('bms-card-toggle', BmsCardToggle);
