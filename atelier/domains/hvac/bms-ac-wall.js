import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const MODES = ['off', 'auto', 'heat', 'cool', 'fan', 'dry'];
const FAN_OPTS = ['1', '2', '3', '4', '5', 'auto'];

/**
 * Wall-mounted split AC.
 * Attrs: label, mode, setpoint (°C), actual (°C), fan, swing (bool), status
 */
export class BmsAcWall extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'mode', 'setpoint', 'actual', 'fan', 'swing', 'status'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'hvac-temperature');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption">настенный сплит</span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>

        <div class="bms-ac-vis" data-vis>
          <div class="bms-ac-wall-shape">
            <div class="bms-ac-wall-vents"></div>
          </div>
          <div class="bms-ac-flow"></div>
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
      this.querySelector('[data-fan]').addEventListener('change', (e) => {
        this.setAttribute('fan', e.detail.value);
        this.emit('fan-change', { fan: e.detail.value });
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
    this.querySelector('[data-label]').textContent = this.str('label', 'Сплит');
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

defineWidget('bms-ac-wall', BmsAcWall);
