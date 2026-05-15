import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * VAV (Variable Air Volume) terminal box.
 * Attrs: label, mode (heating/cooling/idle), setpoint, actual,
 *   damper-position (0-100), flow (m³/h), flow-setpoint, reheat (0-100)
 */
export class BmsVavTile extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'mode', 'setpoint', 'actual',
      'damper-position', 'flow', 'flow-setpoint', 'reheat'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'hvac-temperature');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption">VAV-бокс</span>
          </div>
          <span class="bms-pill" data-mode></span>
        </div>

        <div class="bms-fcu-temp">
          <span class="actual" data-actual>—</span>
          <span class="setpoint">уставка <span data-sp>—</span>°C</span>
        </div>

        <div class="bms-vav-grid">
          <div class="bms-vav-cell"><div class="l">расход</div><div class="v"><span data-flow>0</span> м³/ч</div></div>
          <div class="bms-vav-cell"><div class="l">уставка расхода</div><div class="v"><span data-fsp>0</span> м³/ч</div></div>
        </div>

        <div>
          <div class="bms-row bms-between" style="font-size: 12px;">
            <span class="bms-caption">положение заслонки</span>
            <span class="bms-mono" data-damper>0%</span>
          </div>
          <div class="bms-meter" style="margin-top: 4px;">
            <div class="bms-meter-fill" data-damper-fill></div>
          </div>
        </div>

        <div data-reheat-wrap style="display:none;">
          <div class="bms-row bms-between" style="font-size: 12px;">
            <span class="bms-caption">догрев</span>
            <span class="bms-mono" data-reheat>0%</span>
          </div>
          <div class="bms-meter" style="margin-top: 4px;">
            <div class="bms-meter-fill" data-reheat-fill style="background: linear-gradient(90deg, rgb(220,160,90), rgb(255,130,80));"></div>
          </div>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const mode = this.str('mode', 'idle');
    const sp = this.num('setpoint', 22);
    const actual = this.num('actual', sp);
    const damper = this.num('damper-position', 0);
    const flow = this.num('flow', 0);
    const fsp = this.num('flow-setpoint', 0);
    const reheat = this.num('reheat', 0);
    this.querySelector('[data-label]').textContent = this.str('label', 'VAV');
    this.querySelector('[data-actual]').textContent = `${actual.toFixed(1)}°C`;
    this.querySelector('[data-sp]').textContent = sp.toFixed(1);
    this.querySelector('[data-flow]').textContent = Math.round(flow);
    this.querySelector('[data-fsp]').textContent = Math.round(fsp);
    this.querySelector('[data-damper]').textContent = `${Math.round(damper)}%`;
    this.querySelector('[data-damper-fill]').style.width = `${damper}%`;
    const rh = this.querySelector('[data-reheat-wrap]');
    if (reheat > 0 || mode === 'heating') {
      rh.style.display = '';
      this.querySelector('[data-reheat]').textContent = `${Math.round(reheat)}%`;
      this.querySelector('[data-reheat-fill]').style.width = `${reheat}%`;
    } else {
      rh.style.display = 'none';
    }
    const pill = this.querySelector('[data-mode]');
    pill.textContent = mode === 'heating' ? 'нагрев' : mode === 'cooling' ? 'охлаждение' : 'покой';
    pill.classList.toggle('is-active', mode !== 'idle');
    this.classList.toggle('is-active', mode !== 'idle');
    this.setAttribute('value', String(sp));
  }
}

defineWidget('bms-vav-tile', BmsVavTile);
