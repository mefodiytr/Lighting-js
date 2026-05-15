import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const STYLE = `
  :host {
    display: inline-block;
    width: 120px;
    height: 36px;
    color: var(--bms-text);
  }
  svg { width: 100%; height: 100%; display: block; }
  .wall {
    fill: var(--bms-surface-2);
    stroke: var(--bms-border);
    stroke-width: 1.5;
  }
  .flow {
    fill: none;
    stroke: rgb(var(--cr) var(--cg) var(--cb));
    stroke-width: 2;
    stroke-dasharray: 6 8;
    stroke-linecap: round;
    opacity: 0;
    transition: opacity var(--bms-norm) var(--bms-ease);
  }
  :host([flowing]) .flow {
    opacity: 0.9;
    filter: drop-shadow(0 0 4px rgb(var(--cr) var(--cg) var(--cb) / 0.55));
    animation: bms-flow-march linear infinite;
    animation-duration: var(--flow-duration, 1.5s);
  }
  :host([direction="rl"]) .flow {
    animation-direction: reverse;
  }
  @keyframes bms-flow-march { to { stroke-dashoffset: -28; } }
  .label {
    font-size: 9px;
    fill: var(--bms-text-muted);
    font-family: var(--bms-font-mono);
  }
`;

export class BmsDuctSegment extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'flow', 'direction', 'label', 'flowing'];
  }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <svg viewBox="0 0 120 36">
          <rect class="wall" x="0" y="8" width="120" height="20" />
          <line class="flow" x1="4" y1="18" x2="116" y2="18" />
          <text class="label" x="6" y="6" data-label></text>
        </svg>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const flow = this.num('flow', 0);
    const flowing = flow > 0 || this.hasAttribute('flowing');
    if (flowing) this.setAttribute('flowing', ''); else this.removeAttribute('flowing');
    const speed = flow > 0 ? Math.max(0.4, 2 - 1.6 * Math.min(1, flow / 100)) : 1.5;
    this.style.setProperty('--flow-duration', `${speed}s`);
    this.$('[data-label]').textContent = this.str('label', '');
  }
}

defineWidget('bms-duct-segment', BmsDuctSegment);
