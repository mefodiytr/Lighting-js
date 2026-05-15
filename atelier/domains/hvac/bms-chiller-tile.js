import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const MODE_LABELS = {
  cooling: 'охлаждение',
  standby: 'ожидание',
  fault:   'авария',
  off:     'выключен',
};

/**
 * Chiller tile — load %, COP, mode, in/out temperatures.
 * Attrs: label, load, cop, mode (cooling/standby/fault/off), in-temp, out-temp, status
 */
export class BmsChillerTile extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'load', 'cop', 'mode', 'in-temp', 'out-temp', 'status'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-chiller');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-pill" data-mode></span>
        </div>
        <div class="bms-chiller-main">
          <div>
            <div class="bms-chiller-load"><span data-load>0</span>%</div>
            <div class="bms-chiller-cop">COP <span data-cop>—</span></div>
          </div>
          <bms-gauge-ro data-gauge min="0" max="100" unit="%"></bms-gauge-ro>
        </div>
        <div class="bms-meter"><div class="bms-meter-fill" data-meter></div></div>
        <div class="bms-row bms-between bms-mono" style="font-size: 12px;">
          <span><span class="bms-muted">вход</span> <span data-in>—</span>°C</span>
          <span><span class="bms-muted">выход</span> <span data-out>—</span>°C</span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const load = this.num('load', 0);
    const mode = this.str('mode', 'standby');
    this.querySelector('[data-label]').textContent = this.str('label', 'Чиллер');
    this.querySelector('[data-load]').textContent = Math.round(load);
    this.querySelector('[data-cop]').textContent = this.str('cop', '—');
    this.querySelector('[data-mode]').textContent = MODE_LABELS[mode] || mode;
    this.querySelector('[data-mode]').classList.toggle('is-active', mode === 'cooling');
    this.querySelector('[data-in]').textContent = this.str('in-temp', '—');
    this.querySelector('[data-out]').textContent = this.str('out-temp', '—');
    this.querySelector('[data-meter]').style.width = `${load}%`;
    const g = this.querySelector('[data-gauge]');
    g.setAttribute('value', String(load));
    if (this._props.accent) g.setAttribute('accent', this._props.accent);
    this.classList.toggle('is-active', mode === 'cooling');
  }
}

defineWidget('bms-chiller-tile', BmsChillerTile);
