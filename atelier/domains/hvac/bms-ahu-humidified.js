import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * AHU with humidifier — supply/return + humidity control.
 * Attrs: label, supply (°C), return (°C), flow, humidity (% RH actual),
 *   humidity-setpoint, humidifier (off/idle/active), status
 */
export class BmsAhuHumidified extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'supply', 'return', 'flow',
      'humidity', 'humidity-setpoint', 'humidifier', 'status'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'humidity');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption">приточка с увлажнителем</span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>

        <div class="bms-ahu-grid">
          <div class="bms-ahu-stat">
            <div class="num"><span data-supply>—</span>°C</div>
            <div class="lbl">приток</div>
          </div>
          <div class="bms-ahu-stat">
            <div class="num"><span data-flow>—</span></div>
            <div class="lbl">м³/ч</div>
          </div>
        </div>

        <div class="bms-card" style="padding: 12px;">
          <div class="bms-caption">влажность приточного воздуха</div>
          <div class="bms-row bms-between" style="margin-top: 4px;">
            <span class="bms-mono" style="font-size: 22px; font-weight: 600;"><span data-hum>—</span>%</span>
            <span class="bms-caption">уставка <span class="bms-mono bms-text" data-hsp>—</span>%</span>
          </div>
          <div class="bms-meter" style="margin-top: 8px;">
            <div class="bms-meter-fill" data-hum-fill></div>
          </div>
          <div class="bms-row bms-between" style="margin-top: 8px; font-size: 11px;">
            <span class="bms-pill" data-humidifier></span>
          </div>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const sup = this.num('supply', 0);
    const flow = this.num('flow', 0);
    const hum = this.num('humidity', 0);
    const hsp = this.num('humidity-setpoint', 50);
    const humidifier = this.str('humidifier', 'off');
    this.querySelector('[data-label]').textContent = this.str('label', 'Приточка с увлажнением');
    this.querySelector('[data-supply]').textContent = sup.toFixed(1);
    this.querySelector('[data-flow]').textContent = Math.round(flow);
    this.querySelector('[data-hum]').textContent = hum.toFixed(0);
    this.querySelector('[data-hsp]').textContent = hsp;
    this.querySelector('[data-hum-fill]').style.width = `${Math.min(100, hum)}%`;
    const pill = this.querySelector('[data-humidifier]');
    pill.textContent = humidifier === 'active' ? 'увлажнитель: активен' :
                       humidifier === 'idle'   ? 'увлажнитель: ожидание' :
                                                  'увлажнитель: выкл';
    pill.classList.toggle('is-active', humidifier === 'active');
    const status = this.str('status', flow > 0 ? 'ok' : 'offline');
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', status);
    dot.setAttribute('label', status === 'ok' ? 'работает' : 'выкл');
    this.classList.toggle('is-active', flow > 0);
    this.setAttribute('value', String(hum));
  }
}

defineWidget('bms-ahu-humidified', BmsAhuHumidified);
