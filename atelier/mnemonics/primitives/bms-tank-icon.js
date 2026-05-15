import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const STYLE = `
  :host { display: inline-block; width: 60px; height: 80px; color: var(--bms-text); }
  svg { width: 100%; height: 100%; display: block; }
  .shell {
    fill: var(--bms-surface-2);
    stroke: var(--bms-border);
    stroke-width: 1.5;
  }
  .level {
    fill: rgb(var(--cr) var(--cg) var(--cb));
    filter: drop-shadow(0 0 6px rgb(var(--cr) var(--cg) var(--cb) / 0.5));
    transition: y var(--bms-norm) var(--bms-ease),
                height var(--bms-norm) var(--bms-ease);
  }
  .level-line {
    stroke: rgb(var(--lr) var(--lg) var(--lb));
    stroke-width: 1;
    opacity: 0.6;
  }
  .label {
    font-size: 9px;
    fill: var(--bms-text-muted);
    text-anchor: middle;
    font-family: var(--bms-font-mono);
  }
`;

/**
 * Tank with fluid level (fuel, water, condensate, oil).
 * Attrs: label, level (0-100), shape (rect/cylinder), low-threshold, high-threshold
 */
export class BmsTankIcon extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'level', 'shape', 'low-threshold', 'high-threshold'];
  }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <svg viewBox="0 0 60 80">
          <rect class="shell" x="6" y="8" width="48" height="60" rx="3" data-shell />
          <rect class="level" x="8" y="66" width="44" height="0" data-level />
          <line class="level-line" x1="8" y1="68" x2="52" y2="68" data-low-line stroke-dasharray="2 3" />
          <line class="level-line" x1="8" y1="14" x2="52" y2="14" data-high-line stroke-dasharray="2 3" />
          <text class="label" x="30" y="78" data-label></text>
        </svg>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const level = Math.max(0, Math.min(100, this.num('level', 0)));
    const shape = this.str('shape', 'rect');
    const low = this.num('low-threshold', 15);
    const high = this.num('high-threshold', 90);
    const lvl = this.$('[data-level]');
    const h = (level / 100) * 58;
    lvl.setAttribute('height', String(h));
    lvl.setAttribute('y', String(68 - h));
    if (shape === 'cylinder') {
      this.$('[data-shell]').setAttribute('rx', '24');
    }
    this.$('[data-low-line]').setAttribute('y1', String(68 - (low / 100) * 58));
    this.$('[data-low-line]').setAttribute('y2', String(68 - (low / 100) * 58));
    this.$('[data-high-line]').setAttribute('y1', String(68 - (high / 100) * 58));
    this.$('[data-high-line]').setAttribute('y2', String(68 - (high / 100) * 58));
    this.$('[data-label]').textContent = this.str('label', `${Math.round(level)}%`);
  }
}

defineWidget('bms-tank-icon', BmsTankIcon);
