import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const STYLE = `
  :host {
    display: inline-block;
    width: 64px;
    height: 64px;
    color: var(--bms-text);
  }
  svg { width: 100%; height: 100%; display: block; }
  .housing {
    fill: var(--bms-surface-2);
    stroke: var(--bms-border);
    stroke-width: 1.5;
  }
  :host([running]) .housing {
    stroke: rgb(var(--cr) var(--cg) var(--cb));
    filter: drop-shadow(0 0 6px rgb(var(--cr) var(--cg) var(--cb) / 0.5));
  }
  .blades {
    fill: var(--bms-text);
    transform-origin: 32px 32px;
    transition: opacity var(--bms-norm) var(--bms-ease);
    opacity: 0.5;
  }
  :host([running]) .blades {
    opacity: 1;
    animation: bms-fan-spin linear infinite;
    animation-duration: var(--fan-duration, 2s);
  }
  @keyframes bms-fan-spin { to { transform: rotate(360deg); } }
  .label {
    font-size: 9px;
    fill: var(--bms-text-muted);
    text-anchor: middle;
    font-family: var(--bms-font-mono);
  }
`;

export class BmsFanIcon extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'speed', 'running', 'label'];
  }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <svg viewBox="0 0 64 64">
          <circle class="housing" cx="32" cy="32" r="26" />
          <g class="blades">
            <path d="M 32 32 Q 32 12, 24 14 Q 18 22, 32 32 Z" />
            <path d="M 32 32 Q 50 22, 50 30 Q 44 42, 32 32 Z" />
            <path d="M 32 32 Q 24 50, 18 44 Q 16 32, 32 32 Z" />
            <circle cx="32" cy="32" r="4" />
          </g>
          <text class="label" x="32" y="60" data-label></text>
        </svg>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const speed = Math.max(0, Math.min(100, this.num('speed', 0)));
    if (speed > 0) this.setAttribute('running', '');
    else this.removeAttribute('running');
    const duration = speed > 0 ? (3.5 - 3 * (speed / 100)) : 0;
    this.style.setProperty('--fan-duration', `${duration}s`);
    this.$('[data-label]').textContent = this.str('label', speed > 0 ? `${speed}%` : 'OFF');
  }
}

defineWidget('bms-fan-icon', BmsFanIcon);
