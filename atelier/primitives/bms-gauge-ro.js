import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

const STYLE = `
  :host {
    display: inline-block;
    font-family: var(--bms-font);
    color: var(--bms-text);
  }
  .root {
    position: relative;
    width: 160px;
    height: 100px;
  }
  svg { width: 100%; height: 100%; display: block; }
  .arc-bg {
    fill: none;
    stroke: var(--bms-divider);
    stroke-width: 10;
    stroke-linecap: round;
  }
  .arc-fill {
    fill: none;
    stroke: rgb(var(--cr) var(--cg) var(--cb));
    stroke-width: 10;
    stroke-linecap: round;
    filter: drop-shadow(0 0 8px rgb(var(--cr) var(--cg) var(--cb) / 0.55));
    transition: stroke-dashoffset var(--bms-norm) var(--bms-ease);
  }
  .needle {
    stroke: var(--bms-text);
    stroke-width: 2;
    stroke-linecap: round;
    transform-origin: 80px 80px;
    transition: transform var(--bms-norm) var(--bms-ease);
  }
  .pivot { fill: var(--bms-text); }
  .center {
    position: absolute;
    inset: 50% 0 0 0;
    text-align: center;
    transform: translateY(-30%);
  }
  .value { font-family: var(--bms-font-mono); font-size: 24px; font-weight: 600; }
  .label { font-size: 11px; color: var(--bms-text-muted); margin-top: 2px; }
`;

const ARC_R = 60;
const ARC_LEN = Math.PI * ARC_R;

function describeArc(p) {
  const angle = -Math.PI + p * Math.PI;
  const x = 80 + ARC_R * Math.cos(angle);
  const y = 80 + ARC_R * Math.sin(angle);
  return { x, y };
}

export class BmsGaugeRo extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'min', 'max', 'unit'];
  }

  render() {
    if (!this._init) {
      const start = describeArc(0);
      const end = describeArc(1);
      this._root.innerHTML = `<style>${STYLE}</style>
        <div class="root">
          <svg viewBox="0 0 160 100">
            <path class="arc-bg" d="M ${start.x} ${start.y} A ${ARC_R} ${ARC_R} 0 0 1 ${end.x} ${end.y}" />
            <path class="arc-fill" d="M ${start.x} ${start.y} A ${ARC_R} ${ARC_R} 0 0 1 ${end.x} ${end.y}"
              stroke-dasharray="${ARC_LEN}" stroke-dashoffset="${ARC_LEN}" />
            <line class="needle" x1="80" y1="80" x2="80" y2="28" />
            <circle class="pivot" cx="80" cy="80" r="4" />
          </svg>
          <div class="center">
            <div class="value"></div>
            <div class="label"></div>
          </div>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    if (!this._init) return;
    const min = this.num('min', 0), max = this.num('max', 100);
    const v = this.num('value', min);
    const p = Math.max(0, Math.min(1, (v - min) / Math.max(1e-6, (max - min))));
    this.$('.arc-fill').style.strokeDashoffset = String(ARC_LEN * (1 - p));
    this.$('.needle').style.transform = `rotate(${-90 + p * 180}deg)`;
    const display = Number.isInteger(v) ? v : Number(v.toFixed(1));
    this.$('.value').textContent = `${display}${this.str('unit')}`;
    this.$('.label').textContent = this.str('label');
  }
}

defineWidget('bms-gauge-ro', BmsGaugeRo);
