import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

const STYLE = `
  :host {
    display: inline-block;
    font-family: var(--bms-font);
    color: var(--bms-text);
  }
  .card {
    position: relative;
    min-width: 160px;
    padding: 16px 20px;
    border-radius: var(--bms-radius-md);
    background: var(--bms-surface);
    border: 1px solid var(--bms-border);
    box-shadow: var(--bms-shadow-1);
    overflow: hidden;
  }
  :host([accent]) .card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(120% 80% at 100% 0%,
      rgb(var(--cr) var(--cg) var(--cb) / 0.20) 0%,
      transparent 60%);
    pointer-events: none;
  }
  .label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--bms-text-muted);
    margin-bottom: 6px;
  }
  .row {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }
  .value {
    font-family: var(--bms-font-mono);
    font-size: 32px;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1;
    color: var(--bms-text);
  }
  :host([accent]) .value { color: rgb(var(--cr) var(--cg) var(--cb)); }
  .unit { font-size: 14px; color: var(--bms-text-muted); }
  .trend {
    margin-top: 6px;
    font-size: 12px;
    color: var(--bms-text-muted);
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .trend.up    { color: rgb(110, 210, 140); }
  .trend.down  { color: rgb(240, 110, 100); }
  .trend.flat  { color: var(--bms-text-muted); }
  .arrow { font-size: 14px; }
`;

const ARROWS = { up: '↑', down: '↓', flat: '→' };

export class BmsBigNumber extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'unit', 'trend', 'delta'];
  }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <div class="card">
          <div class="label"></div>
          <div class="row">
            <div class="value"></div>
            <div class="unit"></div>
          </div>
          <div class="trend">
            <span class="arrow"></span>
            <span class="delta-text"></span>
          </div>
        </div>`;
      this._init = true;
    }
    this.$('.label').textContent = this.str('label');
    const raw = this.str('value', '0');
    this.$('.value').textContent = raw;
    this.$('.unit').textContent = this.str('unit');
    const trend = this.str('trend');
    const trendEl = this.$('.trend');
    trendEl.className = 'trend ' + (trend || 'flat');
    this.$('.arrow').textContent = ARROWS[trend] || '';
    this.$('.delta-text').textContent = this.str('delta');
    trendEl.style.display = (trend || this.str('delta')) ? '' : 'none';
  }

  update() { this.render(); }
}

defineWidget('bms-big-number', BmsBigNumber);
