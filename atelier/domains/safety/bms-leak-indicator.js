import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const STATE_LABELS = {
  dry:   { label: 'Сухо',     status: 'ok',       value: 0 },
  damp:  { label: 'Влажность', status: 'warning', value: 1 },
  wet:   { label: 'Протечка', status: 'alarm',    value: 2 },
  fault: { label: 'Датчик: авария', status: 'critical', value: 3 },
};

/**
 * Leak indicator — drop icon + state.
 * Attrs: location, state (dry/damp/wet/fault)
 */
export class BmsLeakIndicator extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'state'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-leak');
      this.setAttribute('accent', 'alarm-level');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <bms-status-dot data-state></bms-status-dot>
        </div>
        <div class="bms-leak-icon">
          <svg viewBox="0 0 56 56">
            <path d="M 28 6 C 18 22, 14 32, 14 38 A 14 14 0 0 0 42 38 C 42 32, 38 22, 28 6 Z"
              fill="rgb(var(--cr) var(--cg) var(--cb) / 0.25)"
              stroke="rgb(var(--cr) var(--cg) var(--cb))"
              stroke-width="1.5" />
          </svg>
        </div>
        <div class="bms-leak-state" data-text></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const state = this.str('state', 'dry');
    const info = STATE_LABELS[state] || STATE_LABELS.dry;
    this.querySelector('[data-label]').textContent = this.str('label', 'Датчик протечки');
    this.querySelector('[data-text]').textContent = info.label;
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', info.status);
    if (state === 'wet' || state === 'fault') dot.setAttribute('pulsing', '');
    else dot.removeAttribute('pulsing');
    this.classList.toggle('is-wet', state === 'wet' || state === 'damp');
    this.classList.toggle('is-active', state !== 'dry');
    this.setAttribute('value', String(info.value));
  }
}

defineWidget('bms-leak-indicator', BmsLeakIndicator);
