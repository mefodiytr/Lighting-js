import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

const COLORS = {
  ok:      { glow: '110, 210, 140', deep: '60, 160, 90' },
  warning: { glow: '255, 200, 110', deep: '220, 160, 70' },
  alarm:   { glow: '255, 130, 70',  deep: '220, 90, 40' },
  critical:{ glow: '240, 70, 60',   deep: '200, 40, 35' },
  offline: { glow: '130, 140, 150', deep: '80, 90, 100' },
  unknown: { glow: '130, 140, 150', deep: '80, 90, 100' },
};

const STYLE = `
  :host {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--bms-font);
    color: var(--bms-text);
    font-size: 13px;
  }
  .dot {
    position: relative;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgb(var(--dot-r) var(--dot-g) var(--dot-b));
    box-shadow: 0 0 8px rgb(var(--dot-r) var(--dot-g) var(--dot-b) / 0.7);
  }
  :host([pulsing]) .dot::after {
    content: "";
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: rgb(var(--dot-r) var(--dot-g) var(--dot-b) / 0.45);
    animation: pulse 1.4s ease-out infinite;
  }
  @keyframes pulse {
    0%   { transform: scale(1);   opacity: 0.7; }
    100% { transform: scale(2.2); opacity: 0; }
  }
`;

export class BmsStatusDot extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'status', 'pulsing'];
  }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <span class="dot"></span>
        <span class="label"></span>`;
      this._init = true;
    }
    const status = this.str('status', 'unknown');
    const c = COLORS[status] || COLORS.unknown;
    const [r, g, b] = c.glow.split(',').map((s) => s.trim());
    this.style.setProperty('--dot-r', r);
    this.style.setProperty('--dot-g', g);
    this.style.setProperty('--dot-b', b);
    this.$('.label').textContent = this.str('label');
  }

  update() { this.render(); }
}

defineWidget('bms-status-dot', BmsStatusDot);
