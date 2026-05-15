import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const MODES = ['off', 'auto', 'heat', 'cool'];

/**
 * Ducted split AC with external static pressure metric.
 * Attrs: label, mode, setpoint, actual, fan-percent (0-100), esp (Pa), status
 */
export class BmsAcDuct extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'mode', 'setpoint', 'actual', 'fan-percent', 'esp', 'status'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'hvac-temperature');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption">канальный</span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>

        <div class="bms-ac-vis" data-vis>
          <div class="bms-ac-duct-shape">
            <div class="bms-ac-duct-unit"></div>
            <div class="bms-ac-duct-pipe" data-flow>→ supply</div>
          </div>
        </div>

        <div class="bms-fcu-temp">
          <span class="actual" data-actual>—</span>
          <span class="setpoint">уставка <span data-sp>—</span>°C</span>
        </div>

        <bms-horizontal-slider data-fan label="Скорость" min="0" max="100" step="5" unit="%" accent="hvac-temperature"></bms-horizontal-slider>

        <div class="bms-row bms-between bms-mono" style="font-size: 12px;">
          <span class="bms-muted">ESP <span data-esp>—</span> Pa</span>
          <bms-segmented data-mode></bms-segmented>
        </div>`;
      this.querySelector('[data-mode]').setAttribute('options', JSON.stringify(MODES));
      this.querySelector('[data-mode]').addEventListener('change', (e) => {
        this.setAttribute('mode', e.detail.value);
      });
      this.querySelector('[data-fan]').addEventListener('change', (e) => {
        this.setAttribute('fan-percent', String(e.detail.value));
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
    const fan = this.num('fan-percent', 60);
    const running = mode !== 'off';
    this.querySelector('[data-label]').textContent = this.str('label', 'Канальный');
    this.querySelector('[data-actual]').textContent = `${actual.toFixed(1)}°C`;
    this.querySelector('[data-sp]').textContent = sp.toFixed(1);
    this.querySelector('[data-mode]').setAttribute('value', mode);
    this.querySelector('[data-fan]').setAttribute('value', String(fan));
    this.querySelector('[data-esp]').textContent = this.str('esp', '0');
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', this.str('status', running ? 'ok' : 'offline'));
    dot.setAttribute('label', running ? mode : 'выкл');
    this.querySelector('[data-vis]').classList.toggle('is-running', running);
    this.classList.toggle('is-active', running);
    this.setAttribute('value', String(sp));
  }
}

defineWidget('bms-ac-duct', BmsAcDuct);
