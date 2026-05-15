import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const MODE_LABELS = {
  normal:    'Нормальный режим',
  test:      'Самодиагностика',
  emergency: 'АВАРИЙНЫЙ РЕЖИМ',
  fault:     'Неисправность',
};

/**
 * Emergency lighting panel — central inverter / dispersed-battery system.
 * Attrs: label, mode (normal/test/emergency/fault), battery-soc (0-100),
 *   battery-autonomy-min, test-due (date str), lamps-total, lamps-fail
 */
export class BmsEmergencyLighting extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'mode', 'battery-soc',
      'battery-autonomy-min', 'test-due', 'lamps-total', 'lamps-fail'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-emer');
      this.setAttribute('accent', 'alarm-level');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <bms-status-dot data-state></bms-status-dot>
        </div>

        <div class="bms-emer-state" data-state-box>
          <div class="bms-h2" data-mode>—</div>
          <div class="bms-caption bms-mono" style="margin-top: 4px;">
            АКБ <span class="bms-text" data-soc>0</span>% · автоном.: <span class="bms-text" data-auto>0</span> мин
          </div>
        </div>

        <div class="bms-pump-kpis">
          <div class="bms-pump-kpi"><div class="l">светильников</div><div class="v"><span data-total>0</span></div></div>
          <div class="bms-pump-kpi"><div class="l">неисправно</div><div class="v"><span data-fail>0</span></div></div>
        </div>
        <div class="bms-caption">
          след. тест: <span class="bms-mono bms-text" data-test>—</span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const mode = this.str('mode', 'normal');
    const soc = this.num('battery-soc', 0);
    const auto = this.num('battery-autonomy-min', 0);
    const total = this.num('lamps-total', 0);
    const fail = this.num('lamps-fail', 0);
    this.className = `bms-card bms-emer st-${mode}`;
    this.querySelector('[data-label]').textContent = this.str('label', 'Аварийное освещение');
    this.querySelector('[data-mode]').textContent = MODE_LABELS[mode] || mode;
    this.querySelector('[data-soc]').textContent = Math.round(soc);
    this.querySelector('[data-auto]').textContent = auto;
    this.querySelector('[data-total]').textContent = total;
    this.querySelector('[data-fail]').textContent = fail;
    this.querySelector('[data-test]').textContent = this.str('test-due', '—');
    const dot = this.querySelector('[data-state]');
    const status = mode === 'fault' ? 'alarm' : mode === 'emergency' ? 'critical' : mode === 'test' ? 'warning' : 'ok';
    dot.setAttribute('status', status);
    if (mode === 'emergency' || mode === 'fault') dot.setAttribute('pulsing', '');
    else dot.removeAttribute('pulsing');
    dot.setAttribute('label', mode);
    this.setAttribute('value', mode === 'emergency' ? '3' : mode === 'fault' ? '2' : '0');
  }
}

defineWidget('bms-emergency-lighting', BmsEmergencyLighting);
