import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const MODES = ['off', 'auto', 'heat', 'cool'];
const FAN_OPTIONS = ['1', '2', '3', '4', '5', 'auto'];

/**
 * Fan coil unit tile — interactive: mode + fan + setpoint editable.
 * Attrs: label, mode, setpoint, actual, fan, status, accent='hvac-temperature'
 */
export class BmsFcuTile extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'mode', 'setpoint', 'actual', 'fan', 'status'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-fcu');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <bms-status-dot></bms-status-dot>
          <span class="bms-caption" data-room></span>
        </div>
        <div class="bms-fcu-temp">
          <span class="actual"></span>
          <span class="setpoint">уставка <span data-sp></span>°C</span>
        </div>
        <bms-segmented data-mode></bms-segmented>
        <div class="bms-row bms-between">
          <span class="bms-caption">Скорость</span>
          <bms-segmented data-fan></bms-segmented>
        </div>`;
      this.querySelector('[data-mode]').setAttribute('options', JSON.stringify(MODES));
      this.querySelector('[data-fan]').setAttribute('options', JSON.stringify(FAN_OPTIONS));
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
    const status = this.str('status', 'ok');
    const mode = this.str('mode', 'auto');
    const sp = this.num('setpoint', 22);
    const actual = this.num('actual', sp);
    this.querySelector('bms-status-dot').setAttribute('status', status);
    this.querySelector('[data-room]').textContent = this.str('label');
    this.querySelector('.actual').textContent = `${actual.toFixed(1)}°C`;
    this.querySelector('[data-sp]').textContent = sp.toFixed(1);
    this.querySelector('[data-mode]').setAttribute('value', mode);
    this.querySelector('[data-fan]').setAttribute('value', this.str('fan', 'auto'));
    this.classList.toggle('is-active', mode !== 'off' && status === 'ok');
    // pass accent down to children that visualize current temp
    if (this._props.accent) {
      for (const ch of this.querySelectorAll('bms-segmented')) {
        ch.setAttribute('accent', this._props.accent);
        ch.setAttribute('value-for-accent', String(sp));
      }
    }
  }
}

defineWidget('bms-fcu-tile', BmsFcuTile);
