import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';
import { makeDragger } from '../core/drag-engine.js';

const STYLE = `
  :host {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-family: var(--bms-font);
    color: var(--bms-text);
    user-select: none;
  }
  :host([disabled]) { opacity: 0.4; pointer-events: none; }
  .knob {
    position: relative;
    width: 140px;
    height: 140px;
    cursor: grab;
    touch-action: none;
  }
  .knob:active { cursor: grabbing; }
  svg { width: 100%; height: 100%; display: block; }
  .ring-bg { fill: none; stroke: var(--bms-divider); stroke-width: 10; }
  .ring-fill {
    fill: none;
    stroke: rgb(var(--cr) var(--cg) var(--cb));
    stroke-width: 10;
    stroke-linecap: round;
    filter: drop-shadow(0 0 8px rgb(var(--cr) var(--cg) var(--cb) / 0.6));
    transition: stroke-dashoffset var(--bms-fast) var(--bms-ease);
  }
  .center {
    position: absolute;
    inset: 22px;
    border-radius: 50%;
    background:
      radial-gradient(120% 100% at 50% 0%, rgb(var(--lr) var(--lg) var(--lb) / 0.25) 0%, transparent 60%),
      linear-gradient(180deg, var(--bms-surface-2) 0%, var(--bms-surface) 100%);
    border: 1px solid var(--bms-border);
    box-shadow: inset 0 1px 0 rgb(var(--lr) var(--lg) var(--lb) / 0.15), 0 8px 24px rgba(0, 0, 0, 0.3);
    display: grid;
    place-items: center;
  }
  .value-text {
    font-family: var(--bms-font-mono);
    font-size: 22px;
    font-weight: 600;
    text-align: center;
  }
  .unit-text {
    font-size: 11px;
    color: var(--bms-text-muted);
  }
  .label { font-size: 12px; color: var(--bms-text-muted); }
`;

const R = 60;
const C = 2 * Math.PI * R;

export class BmsRadialKnob extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'min', 'max', 'step', 'unit'];
  }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <div class="knob" part="knob">
          <svg viewBox="0 0 140 140">
            <circle class="ring-bg" cx="70" cy="70" r="${R}" />
            <circle class="ring-fill" cx="70" cy="70" r="${R}"
              stroke-dasharray="${C}" stroke-dashoffset="${C}"
              transform="rotate(-90 70 70)" />
          </svg>
          <div class="center">
            <div>
              <div class="value-text"></div>
              <div class="unit-text"></div>
            </div>
          </div>
        </div>
        <div class="label"></div>`;
      const knob = this.$('.knob');
      this.track(makeDragger(knob, {
        axis: 'radial',
        trackEl: knob,
        onDrag: (p) => this._applyProgress(p),
      }));
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _applyProgress(p) {
    const min = this.num('min', 0), max = this.num('max', 100);
    const step = this.num('step', 1);
    let v = min + p * (max - min);
    if (step > 0) v = Math.round(v / step) * step;
    v = Math.max(min, Math.min(max, v));
    this.setValue(v);
    this._reflect();
  }

  _reflect() {
    if (!this._init) return;
    const min = this.num('min', 0), max = this.num('max', 100);
    const v = this.num('value', (min + max) / 2);
    const p = (v - min) / Math.max(1e-6, (max - min));
    this.$('.ring-fill').style.strokeDashoffset = String(C * (1 - p));
    const display = Number.isInteger(v) ? v : Number(v.toFixed(1));
    this.$('.value-text').textContent = display;
    this.$('.unit-text').textContent = this.str('unit');
    this.$('.label').textContent = this.str('label');
  }
}

defineWidget('bms-radial-knob', BmsRadialKnob);
