import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const STYLE = `
  :host { display: inline-block; width: 60px; height: 64px; color: var(--bms-text); }
  svg { width: 100%; height: 100%; display: block; }
  .frame {
    fill: var(--bms-surface-2);
    stroke: var(--state-color, var(--bms-border));
    stroke-width: 1.5;
    transition: stroke var(--bms-norm) var(--bms-ease);
  }
  .pleat {
    fill: none;
    stroke: var(--state-color, var(--bms-text-faint));
    stroke-width: 1.5;
    opacity: 0.7;
  }
  :host([state="replace"]) .frame {
    filter: drop-shadow(0 0 6px var(--state-color));
    animation: bms-filter-blink 1.4s ease-in-out infinite;
  }
  @keyframes bms-filter-blink { 50% { opacity: 0.6; } }
  .label {
    font-size: 9px;
    fill: var(--bms-text-muted);
    text-anchor: middle;
    font-family: var(--bms-font-mono);
  }
`;

const STATE_COLOR = {
  ok:      'rgb(110, 210, 140)',
  warning: 'rgb(255, 200, 110)',
  replace: 'rgb(255, 130, 70)',
};

export class BmsFilterIcon extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'state', 'clogged', 'label'];
  }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <svg viewBox="0 0 60 64">
          <rect class="frame" x="6" y="8" width="48" height="46" rx="2" />
          <path class="pleat" d="M 10 12 L 14 16 L 10 20 L 14 24 L 10 28 L 14 32 L 10 36 L 14 40 L 10 44 L 14 48 L 10 52" />
          <path class="pleat" d="M 18 12 L 22 16 L 18 20 L 22 24 L 18 28 L 22 32 L 18 36 L 22 40 L 18 44 L 22 48 L 18 52" />
          <path class="pleat" d="M 26 12 L 30 16 L 26 20 L 30 24 L 26 28 L 30 32 L 26 36 L 30 40 L 26 44 L 30 48 L 26 52" />
          <path class="pleat" d="M 34 12 L 38 16 L 34 20 L 38 24 L 34 28 L 38 32 L 34 36 L 38 40 L 34 44 L 38 48 L 34 52" />
          <path class="pleat" d="M 42 12 L 46 16 L 42 20 L 46 24 L 42 28 L 46 32 L 42 36 L 46 40 L 42 44 L 46 48 L 42 52" />
          <text class="label" x="30" y="62" data-label></text>
        </svg>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const state = this.str('state', 'ok');
    const clog = this.num('clogged', 0);
    this.style.setProperty('--state-color', STATE_COLOR[state] || STATE_COLOR.ok);
    this.setAttribute('state', state);
    this.$('[data-label]').textContent = this.str('label', clog ? `${clog}%` : state);
  }
}

defineWidget('bms-filter-icon', BmsFilterIcon);
