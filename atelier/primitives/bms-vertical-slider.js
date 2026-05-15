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
  .value { font-family: var(--bms-font-mono); font-size: 13px; font-weight: 600; }
  .label { font-size: 11px; color: var(--bms-text-muted); }
  .track {
    position: relative;
    width: 36px;
    height: 180px;
    border-radius: var(--bms-radius-md);
    background: var(--bms-surface-2);
    border: 1px solid var(--bms-border);
    overflow: hidden;
    cursor: pointer;
    touch-action: none;
  }
  .fill {
    position: absolute;
    left: 0; right: 0; bottom: 0;
    background: linear-gradient(0deg,
      rgb(var(--dr) var(--dg) var(--db)) 0%,
      rgb(var(--cr) var(--cg) var(--cb)) 100%);
    box-shadow: 0 0 24px rgb(var(--cr) var(--cg) var(--cb) / 0.55);
    pointer-events: none;
  }
  .thumb {
    position: absolute;
    left: 4px; right: 4px;
    height: 6px;
    background: linear-gradient(180deg, rgb(var(--lr) var(--lg) var(--lb)) 0%, rgb(var(--cr) var(--cg) var(--cb)) 100%);
    border-radius: 3px;
    transform: translateY(50%);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    pointer-events: none;
  }
`;

export class BmsVerticalSlider extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'min', 'max', 'step', 'unit'];
  }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <div class="value"></div>
        <div class="track" part="track">
          <div class="fill"></div>
          <div class="thumb"></div>
        </div>
        <div class="label"></div>`;
      const track = this.$('.track');
      this.track(makeDragger(track, {
        axis: 'vertical',
        trackEl: track,
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
    const min = this.num('min', 0), max = this.num('max', 100), v = this.num('value', (min + max) / 2);
    const p = (v - min) / Math.max(1e-6, (max - min));
    this.$('.fill').style.height = (p * 100) + '%';
    this.$('.thumb').style.bottom = (p * 100) + '%';
    this.$('.label').textContent = this.str('label');
    const display = Number.isInteger(v) ? v : Number(v.toFixed(1));
    this.$('.value').textContent = `${display}${this.str('unit')}`;
  }
}

defineWidget('bms-vertical-slider', BmsVerticalSlider);
