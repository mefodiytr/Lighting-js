import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

const STYLE = `
  :host { display: inline-block; width: 200px; height: 60px; }
  svg { width: 100%; height: 100%; display: block; overflow: visible; }
  .area { fill: rgb(var(--cr) var(--cg) var(--cb) / 0.18); }
  .line {
    fill: none;
    stroke: rgb(var(--cr) var(--cg) var(--cb));
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-linecap: round;
    filter: drop-shadow(0 0 4px rgb(var(--cr) var(--cg) var(--cb) / 0.6));
  }
  .dot {
    fill: rgb(var(--cr) var(--cg) var(--cb));
    filter: drop-shadow(0 0 6px rgb(var(--cr) var(--cg) var(--cb) / 0.7));
  }
`;

export class BmsSparkline extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'data', 'min', 'max'];
  }

  _data() {
    try { return JSON.parse(this.str('data', '[]')); } catch { return []; }
  }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <svg viewBox="0 0 200 60" preserveAspectRatio="none">
          <path class="area" />
          <path class="line" />
          <circle class="dot" r="3" />
        </svg>`;
      this._init = true;
    }
    const data = this._data();
    if (!data.length) return;
    const min = this.hasAttribute('min') ? this.num('min') : Math.min(...data);
    const max = this.hasAttribute('max') ? this.num('max') : Math.max(...data);
    const range = Math.max(1e-6, max - min);
    const w = 200, h = 60;
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1 || 1)) * w;
      const y = h - ((v - min) / range) * h;
      return [x, y];
    });
    const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
    const area = `${line} L ${w} ${h} L 0 ${h} Z`;
    this.$('.line').setAttribute('d', line);
    this.$('.area').setAttribute('d', area);
    const last = pts[pts.length - 1];
    this.$('.dot').setAttribute('cx', last[0].toFixed(2));
    this.$('.dot').setAttribute('cy', last[1].toFixed(2));
  }

  update() { this.render(); }
}

defineWidget('bms-sparkline', BmsSparkline);
