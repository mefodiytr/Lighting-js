import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

const STYLE = `
  :host {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: var(--bms-font);
    color: var(--bms-text);
    user-select: none;
  }
  :host([disabled]) { opacity: 0.4; pointer-events: none; }
  .label { font-size: 14px; }
  .track {
    position: relative;
    width: 56px;
    height: 32px;
    border-radius: 999px;
    background: var(--bms-surface-2);
    border: 1px solid var(--bms-border);
    cursor: pointer;
    transition: background var(--bms-norm) var(--bms-ease),
                box-shadow var(--bms-norm) var(--bms-ease),
                --cr var(--bms-norm) var(--bms-ease),
                --cg var(--bms-norm) var(--bms-ease),
                --cb var(--bms-norm) var(--bms-ease);
  }
  :host([checked]) .track {
    background:
      radial-gradient(120% 90% at 50% 50%,
        rgb(var(--cr) var(--cg) var(--cb) / 0.85) 0%,
        rgb(var(--dr) var(--dg) var(--db) / 0.65) 100%);
    box-shadow:
      inset 0 1px 2px rgb(var(--lr) var(--lg) var(--lb) / 0.35),
      0 8px 24px rgb(var(--cr) var(--cg) var(--cb) / 0.35);
  }
  .thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: linear-gradient(180deg, #ffffff 0%, #e6e2d8 100%);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.6);
    transition: left var(--bms-norm) var(--bms-ease),
                background var(--bms-norm) var(--bms-ease);
  }
  :host([checked]) .thumb {
    left: 27px;
    background: linear-gradient(180deg,
      rgb(var(--lr) var(--lg) var(--lb)) 0%,
      rgb(var(--cr) var(--cg) var(--cb)) 100%);
  }
`;

export class BmsGlassSwitch extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() { return [...super.observedAttributes, 'checked']; }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <label class="label"></label>
        <div class="track" part="track"><div class="thumb"></div></div>`;
      this.$('.track').addEventListener('click', () => this.toggle());
      this._init = true;
    }
    this.$('.label').textContent = this.str('label');
    this.$('.label').style.display = this.str('label') ? '' : 'none';
  }

  toggle() {
    if (this.bool('disabled')) return;
    const next = !this.bool('checked');
    if (next) this.setAttribute('checked', ''); else this.removeAttribute('checked');
    this.emit('change', { checked: next });
  }
}

defineWidget('bms-glass-switch', BmsGlassSwitch);
