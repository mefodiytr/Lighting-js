import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const STYLE = `
  :host { display: inline-block; width: 100px; height: 80px; color: var(--bms-text); }
  svg { width: 100%; height: 100%; display: block; }
  .frame {
    fill: var(--bms-surface-2);
    stroke: var(--bms-border);
    stroke-width: 1.5;
  }
  .channel-hot {
    stroke: rgb(255, 130, 80);
    stroke-width: 3;
    fill: none;
    stroke-linecap: round;
    opacity: 0.55;
    transition: opacity var(--bms-norm) var(--bms-ease);
  }
  .channel-cold {
    stroke: rgb(100, 200, 230);
    stroke-width: 3;
    fill: none;
    stroke-linecap: round;
    opacity: 0.55;
    transition: opacity var(--bms-norm) var(--bms-ease);
  }
  :host([active]) .channel-hot,
  :host([active]) .channel-cold {
    opacity: 1;
    stroke-dasharray: 6 6;
    animation: bms-hx-march linear infinite;
    animation-duration: 1.8s;
  }
  :host([active]) .channel-cold { animation-direction: reverse; }
  @keyframes bms-hx-march { to { stroke-dashoffset: -24; } }
  .label {
    font-size: 9px;
    fill: var(--bms-text-muted);
    text-anchor: middle;
    font-family: var(--bms-font-mono);
  }
  .eff {
    font-size: 11px;
    fill: rgb(var(--cr) var(--cg) var(--cb));
    text-anchor: middle;
    font-family: var(--bms-font-mono);
    font-weight: 600;
  }
`;

export class BmsHeatExchanger extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'efficiency', 'active', 'label'];
  }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <svg viewBox="0 0 100 80">
          <rect class="frame" x="6" y="14" width="88" height="52" rx="3" />
          <path class="channel-hot"  d="M 0 24 L 30 24 L 70 56 L 100 56" />
          <path class="channel-cold" d="M 0 56 L 30 56 L 70 24 L 100 24" />
          <text class="eff"   x="50" y="44" data-eff></text>
          <text class="label" x="50" y="76" data-label></text>
        </svg>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const eff = this.num('efficiency', 0);
    if (eff > 0) this.setAttribute('active', '');
    else this.removeAttribute('active');
    this.$('[data-eff]').textContent = eff > 0 ? `η ${Math.round(eff)}%` : '';
    this.$('[data-label]').textContent = this.str('label', 'рекуператор');
  }
}

defineWidget('bms-heat-exchanger', BmsHeatExchanger);
