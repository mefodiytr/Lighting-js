import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const MODES = ['off', 'auto', 'heat', 'cool', 'fan'];
const FAN_OPTS = ['low', 'med', 'high', 'auto'];

/**
 * 4-way ceiling cassette AC.
 * Attrs: label, mode, setpoint, actual, fan, status
 */
export class BmsAcCassette extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'mode', 'setpoint', 'actual', 'fan', 'status'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'hvac-temperature');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption">кассетный</span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>

        <div class="bms-ac-vis" data-vis>
          <div class="bms-ac-cassette-shape">
            <div class="bms-ac-cassette-vent"></div>
            <div class="bms-ac-cassette-vent"></div>
            <div class="bms-ac-cassette-vent"></div>
            <div class="bms-ac-cassette-vent"></div>
          </div>
        </div>

        <div class="bms-fcu-temp">
          <span class="actual" data-actual>—</span>
          <span class="setpoint">уставка <span data-sp>—</span>°C</span>
        </div>

        <bms-segmented data-mode></bms-segmented>
        <div class="bms-row bms-between">
          <span class="bms-caption">Скорость</span>
          <bms-segmented data-fan></bms-segmented>
        </div>`;
      this.querySelector('[data-mode]').setAttribute('options', JSON.stringify(MODES));
      this.querySelector('[data-fan]').setAttribute('options', JSON.stringify(FAN_OPTS));
      this.querySelector('[data-mode]').addEventListener('change', (e) => {
        this.setAttribute('mode', e.detail.value);
        this.emit('mode-change', { mode: e.detail.value });
      });
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const mode = this.str('mode', 'auto');
    const sp = this.num('setpoint', 22);
    const actual = this.num('actual', sp);
    const running = mode !== 'off';
    this.querySelector('[data-label]').textContent = this.str('label', 'Кассета');
    this.querySelector('[data-actual]').textContent = `${actual.toFixed(1)}°C`;
    this.querySelector('[data-sp]').textContent = sp.toFixed(1);
    this.querySelector('[data-mode]').setAttribute('value', mode);
    this.querySelector('[data-fan]').setAttribute('value', this.str('fan', 'auto'));
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', this.str('status', running ? 'ok' : 'offline'));
    dot.setAttribute('label', running ? mode : 'выкл');
    this.querySelector('[data-vis]').classList.toggle('is-running', running);
    this.classList.toggle('is-active', running);
    this.setAttribute('value', String(sp));
  }
}

defineWidget('bms-ac-cassette', BmsAcCassette);
