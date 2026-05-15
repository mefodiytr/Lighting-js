import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Valve control — position slider 0-100% + state indicator.
 * Attrs: label, position (0-100), state (open/closed/transit/fault), accent
 */
export class BmsValveControl extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'position', 'state'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-valve');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-pill" data-state></span>
        </div>
        <svg class="bms-valve-svg" viewBox="0 0 200 64" aria-hidden="true">
          <rect x="0" y="26" width="200" height="12" fill="var(--bms-surface-2)" stroke="var(--bms-border)" />
          <rect x="0" y="26" width="0" height="12" fill="rgb(var(--cr) var(--cg) var(--cb))"
            style="filter: drop-shadow(0 0 8px rgb(var(--cr) var(--cg) var(--cb) / 0.6));" data-flow />
          <g transform="translate(100, 32)" data-rotor>
            <circle r="18" fill="var(--bms-surface)" stroke="var(--bms-border)" stroke-width="1.5" />
            <line x1="-12" y1="0" x2="12" y2="0" stroke="var(--bms-text)" stroke-width="3" stroke-linecap="round" data-handle />
          </g>
        </svg>
        <bms-horizontal-slider data-slider min="0" max="100" step="1" unit="%" label="положение"></bms-horizontal-slider>
        <div class="bms-valve-state bms-muted" data-pos></div>`;
      this.querySelector('[data-slider]').addEventListener('change', (e) => {
        this.setAttribute('position', String(e.detail.value));
        this.emit('position-change', { position: e.detail.value });
      });
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const pos = this.num('position', 0);
    const state = this.str('state', pos > 0 ? 'open' : 'closed');
    this.querySelector('[data-label]').textContent = this.str('label', 'Клапан');
    this.querySelector('[data-pos]').textContent = `${pos}%`;
    const pill = this.querySelector('[data-state]');
    pill.textContent = state;
    pill.classList.toggle('is-active', state === 'open' || state === 'transit');
    this.querySelector('[data-flow]').setAttribute('width', String(pos * 2));
    const angle = (pos / 100) * 90;
    this.querySelector('[data-handle]').setAttribute('transform', `rotate(${angle})`);
    const slider = this.querySelector('[data-slider]');
    slider.setAttribute('value', String(pos));
    if (this._props.accent) slider.setAttribute('accent', this._props.accent);
    this.classList.toggle('is-active', state === 'open' || state === 'transit');
  }
}

defineWidget('bms-valve-control', BmsValveControl);
