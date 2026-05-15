import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const STYLE = `
  :host { display: inline-block; width: 56px; height: 56px; color: var(--bms-text); }
  svg { width: 100%; height: 100%; display: block; }
  .body {
    fill: var(--bms-surface-2);
    stroke: var(--bms-border);
    stroke-width: 1.5;
  }
  :host([running]) .body {
    stroke: rgb(var(--cr) var(--cg) var(--cb));
    filter: drop-shadow(0 0 6px rgb(var(--cr) var(--cg) var(--cb) / 0.5));
  }
  .letter {
    font-family: var(--bms-font-mono);
    font-size: 22px;
    font-weight: 700;
    text-anchor: middle;
    dominant-baseline: middle;
    fill: var(--bms-text);
  }
  :host([running]) .letter { fill: rgb(var(--cr) var(--cg) var(--cb)); }
  .shaft {
    stroke: var(--bms-text);
    stroke-width: 2;
    stroke-linecap: round;
  }
  .label {
    font-size: 9px;
    fill: var(--bms-text-muted);
    text-anchor: middle;
    font-family: var(--bms-font-mono);
  }
`;

/**
 * Electric motor icon (IEC symbol — M in circle).
 * Attrs: label, running, fault
 */
export class BmsMotorIcon extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'running', 'fault', 'kw'];
  }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <svg viewBox="0 0 56 56">
          <line class="shaft" x1="46" y1="28" x2="54" y2="28" />
          <circle class="body" cx="26" cy="28" r="20" />
          <text class="letter" x="26" y="29">M</text>
          <text class="label" x="28" y="54" data-label></text>
        </svg>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const running = this.bool('running');
    const fault = this.bool('fault');
    if (running) this.setAttribute('running', ''); else this.removeAttribute('running');
    const kw = this.str('kw', '');
    this.$('[data-label]').textContent = this.str('label', kw ? `${kw} kW` : (running ? 'ON' : 'OFF'));
  }
}

defineWidget('bms-motor-icon', BmsMotorIcon);
