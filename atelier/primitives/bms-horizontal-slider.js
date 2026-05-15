import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';
import { makeDragger } from '../core/drag-engine.js';

const STYLE = `
  :host {
    display: inline-block;
    width: 240px;
    font-family: var(--bms-font);
    color: var(--bms-text);
    user-select: none;
  }
  :host([disabled]) { opacity: 0.4; pointer-events: none; }
  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    font-size: 12px;
  }
  .label { color: var(--bms-text-muted); }
  .value { font-family: var(--bms-font-mono); }
  .track {
    position: relative;
    height: 8px;
    border-radius: 999px;
    background: var(--bms-surface-2);
    border: 1px solid var(--bms-border);
    cursor: pointer;
    touch-action: none;
  }
  .fill {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    border-radius: 999px;
    background: linear-gradient(90deg,
      rgb(var(--dr) var(--dg) var(--db)) 0%,
      rgb(var(--cr) var(--cg) var(--cb)) 100%);
    box-shadow: 0 0 16px rgb(var(--cr) var(--cg) var(--cb) / 0.5);
    pointer-events: none;
  }
  .thumb {
    position: absolute;
    top: 50%;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: linear-gradient(180deg, rgb(var(--lr) var(--lg) var(--lb)) 0%, rgb(var(--cr) var(--cg) var(--cb)) 100%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35), 0 0 0 2px var(--bms-bg);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
`;

export class BmsHorizontalSlider extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'min', 'max', 'step', 'unit'];
  }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <div class="row">
          <span class="label"></span>
          <span class="value"></span>
        </div>
        <div class="track" part="track">
          <div class="fill"></div>
          <div class="thumb"></div>
        </div>`;
      const track = this.$('.track');
      this.track(makeDragger(track, {
        axis: 'horizontal',
        trackEl: track,
        onDrag: (p) => this._applyProgress(p),
      }));
      this._init = true;
    }
    this._reflect();
  }

  update(name, value) {
    if (name === 'value' || name === 'min' || name === 'max' || name === 'unit' || name === 'label') {
      this._reflect();
    } else {
      super.update(name, value);
    }
  }

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
    const min = this.num('min', 0), max = this.num('max', 100), v = this.num('value', (min + max) / 2);
    const p = (v - min) / Math.max(1e-6, (max - min));
    this.$('.fill').style.width = (p * 100) + '%';
    this.$('.thumb').style.left = (p * 100) + '%';
    this.$('.label').textContent = this.str('label');
    const unit = this.str('unit');
    const display = Number.isInteger(v) ? v : Number(v.toFixed(1));
    this.$('.value').textContent = `${display}${unit}`;
  }
}

defineWidget('bms-horizontal-slider', BmsHorizontalSlider);
