import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Battery SOC indicator — visual battery shape + level + charging arrows.
 * Attrs: label, level (0-100), charging ('in'|'out'|'idle'), power (kW), eta (minutes)
 */
export class BmsBatterySoc extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'level', 'charging', 'power', 'eta'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-battery');
      this.setAttribute('accent', 'battery-soc');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-mono bms-h2" data-level>0%</span>
        </div>
        <div class="bms-battery-shape">
          <div class="bms-battery-body"><div class="bms-battery-level" data-fill></div></div>
          <div class="bms-battery-tip"></div>
        </div>
        <div class="bms-row bms-between" style="font-size: 12px;">
          <span class="bms-muted" data-direction>—</span>
          <span class="bms-mono" data-eta></span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const lvl = this.num('level', 0);
    const charging = this.str('charging', 'idle');
    const power = this.num('power', 0);
    const eta = this.num('eta', 0);
    this.querySelector('[data-label]').textContent = this.str('label', 'Аккумулятор');
    this.querySelector('[data-level]').textContent = `${Math.round(lvl)}%`;
    this.querySelector('[data-fill]').style.width = `${Math.max(2, lvl)}%`;
    const dirEl = this.querySelector('[data-direction]');
    if (charging === 'in')       dirEl.textContent = `↓ заряд ${power.toFixed(1)} kW`;
    else if (charging === 'out') dirEl.textContent = `↑ разряд ${power.toFixed(1)} kW`;
    else                          dirEl.textContent = 'в режиме ожидания';
    this.querySelector('[data-eta]').textContent = eta > 0
      ? `≈${Math.floor(eta / 60)}ч${eta % 60 ? ' ' + (eta % 60) + 'м' : ''}`
      : '';
    this.setAttribute('value', String(lvl));
    this.classList.toggle('is-charging', charging === 'in');
    this.classList.toggle('is-active', charging !== 'idle');
  }
}

defineWidget('bms-battery-soc', BmsBatterySoc);
