import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const KIND_LETTER = {
  temperature: 'T', t: 'T',
  flow: 'F',        f: 'F',
  pressure: 'P',    p: 'P',
  humidity: 'H',    h: 'H',
  co2: 'Q',         q: 'Q',
  quality: 'Q',
};

const STYLE = `
  :host {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--bms-font-mono);
    color: var(--bms-text);
    font-size: 11px;
  }
  .badge {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgb(var(--cr) var(--cg) var(--cb) / 0.18);
    border: 1.5px solid rgb(var(--cr) var(--cg) var(--cb));
    color: rgb(var(--lr) var(--lg) var(--lb));
    display: grid;
    place-items: center;
    font-weight: 600;
    font-size: 11px;
    box-shadow: 0 0 8px rgb(var(--cr) var(--cg) var(--cb) / 0.4);
  }
  :host([alarm]) .badge {
    animation: bms-sensor-alarm 1s ease-in-out infinite;
  }
  @keyframes bms-sensor-alarm {
    50% { box-shadow: 0 0 18px rgb(var(--cr) var(--cg) var(--cb) / 0.9); }
  }
  .value { white-space: nowrap; }
  .unit  { color: var(--bms-text-muted); margin-left: 2px; }
`;

export class BmsSensorPip extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'kind', 'unit', 'alarm'];
  }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <span class="badge" data-letter></span>
        <span class="value">
          <span data-value>—</span><span class="unit" data-unit></span>
        </span>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const kind = this.str('kind', 'temperature').toLowerCase();
    this.$('[data-letter]').textContent = KIND_LETTER[kind] || kind[0]?.toUpperCase() || '?';
    this.$('[data-value]').textContent = this.str('value', '—');
    this.$('[data-unit]').textContent = this.str('unit', '');
  }
}

defineWidget('bms-sensor-pip', BmsSensorPip);
