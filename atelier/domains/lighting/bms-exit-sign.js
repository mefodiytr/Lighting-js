import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const ARROWS = {
  left:     '←',
  right:    '→',
  up:       '↑',
  down:     '↓',
  dead_end: '×',
};

/**
 * Illuminated EXIT sign — direction arrow + state.
 * Attrs: label, direction (left/right/up/down/dead_end), state (on/off/maintenance),
 *   location
 */
export class BmsExitSign extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'direction', 'state', 'location'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-exit');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption" data-loc></span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>
        <div class="bms-exit-shape">
          <div class="bms-exit-sign-box">
            <span data-arrow>→</span>
            <span>EXIT</span>
          </div>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const dir = this.str('direction', 'right');
    const state = this.str('state', 'on');
    this.className = `bms-card bms-exit st-${state}`;
    this.querySelector('[data-label]').textContent = this.str('label', 'Табло EXIT');
    this.querySelector('[data-loc]').textContent = this.str('location', '');
    this.querySelector('[data-arrow]').textContent = ARROWS[dir] || ARROWS.right;
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', state === 'on' ? 'ok' : state === 'maintenance' ? 'warning' : 'offline');
    dot.setAttribute('label', state);
    this.classList.toggle('is-active', state === 'on');
  }
}

defineWidget('bms-exit-sign', BmsExitSign);
