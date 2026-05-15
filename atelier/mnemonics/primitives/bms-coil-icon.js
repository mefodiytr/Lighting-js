import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const STYLE = `
  :host { display: inline-block; width: 100px; height: 64px; color: var(--bms-text); }
  svg { width: 100%; height: 100%; display: block; }
  .frame {
    fill: var(--bms-surface-2);
    stroke: var(--bms-border);
    stroke-width: 1.5;
  }
  .coil {
    fill: none;
    stroke: var(--coil-color, var(--bms-text-faint));
    stroke-width: 2.5;
    stroke-linecap: round;
    transition: stroke var(--bms-norm) var(--bms-ease);
  }
  :host([active]) .coil {
    filter: drop-shadow(0 0 6px var(--coil-color, transparent));
  }
  .label {
    font-size: 9px;
    fill: var(--bms-text-muted);
    text-anchor: middle;
    font-family: var(--bms-font-mono);
  }
`;

const MODE_COLOR = {
  cooling: 'rgb(100, 200, 230)',
  heating: 'rgb(255, 130, 80)',
  off:     'var(--bms-text-faint)',
};

export class BmsCoilIcon extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'mode', 'active', 'label'];
  }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <svg viewBox="0 0 100 64">
          <rect class="frame" x="6" y="10" width="88" height="44" rx="3" />
          <path class="coil"
            d="M 14 18 Q 22 10, 30 18 Q 38 26, 30 34 Q 22 42, 30 50
               L 36 50 Q 44 42, 36 34 Q 28 26, 36 18 Q 44 10, 52 18
               L 58 18 Q 66 26, 58 34 Q 50 42, 58 50
               L 64 50 Q 72 42, 64 34 Q 56 26, 64 18
               L 86 18" />
          <text class="label" x="50" y="62" data-label></text>
        </svg>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const mode = this.str('mode', 'off');
    const color = MODE_COLOR[mode] || MODE_COLOR.off;
    this.style.setProperty('--coil-color', color);
    if (mode !== 'off') this.setAttribute('active', '');
    else this.removeAttribute('active');
    this.$('[data-label]').textContent = this.str('label',
      mode === 'cooling' ? 'охлаждение' : mode === 'heating' ? 'нагрев' : 'выкл');
  }
}

defineWidget('bms-coil-icon', BmsCoilIcon);
