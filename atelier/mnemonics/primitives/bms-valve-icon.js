import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const STATE_COLOR = {
  open:    'rgb(var(--cr) var(--cg) var(--cb))',
  closed:  'var(--bms-text-faint)',
  transit: 'rgb(255, 200, 110)',
  fault:   'rgb(240, 70, 60)',
};

const STYLE = `
  :host { display: inline-block; width: 56px; height: 56px; color: var(--bms-text); }
  svg { width: 100%; height: 100%; display: block; }
  .body {
    fill: var(--bms-surface-2);
    stroke: var(--bms-border);
    stroke-width: 1.5;
  }
  .ports { fill: var(--bms-surface); stroke: var(--bms-border); stroke-width: 1.5; }
  .handle {
    stroke: var(--state-color, var(--bms-text));
    stroke-width: 3;
    stroke-linecap: round;
    transform-origin: 28px 28px;
    transition: transform var(--bms-norm) var(--bms-ease);
    filter: drop-shadow(0 0 4px var(--state-color, transparent));
  }
  :host([state="transit"]) .handle { animation: bms-valve-blink 1s ease-in-out infinite; }
  @keyframes bms-valve-blink { 50% { opacity: 0.4; } }
  .label {
    font-size: 9px;
    fill: var(--bms-text-muted);
    text-anchor: middle;
    font-family: var(--bms-font-mono);
  }
`;

export class BmsValveIcon extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'position', 'state', 'label'];
  }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <svg viewBox="0 0 56 56">
          <rect class="ports" x="2" y="22" width="52" height="12" />
          <circle class="body" cx="28" cy="28" r="11" />
          <line class="handle" x1="16" y1="28" x2="40" y2="28" data-handle />
          <text class="label" x="28" y="52" data-label></text>
        </svg>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const pos = Math.max(0, Math.min(100, this.num('position', 0)));
    const state = this.str('state', pos > 0 ? (pos === 100 ? 'open' : 'transit') : 'closed');
    this.style.setProperty('--state-color', STATE_COLOR[state] || STATE_COLOR.closed);
    const angle = (pos / 100) * 90;
    this.$('[data-handle]').style.transform = `rotate(${angle}deg)`;
    this.$('[data-label]').textContent = this.str('label', state === 'transit' ? `${pos}%` : state);
    this.setAttribute('state', state);
  }
}

defineWidget('bms-valve-icon', BmsValveIcon);
