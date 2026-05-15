import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const SCALE_LOG_MIN = 10;     // ~10 lux (twilight)
const SCALE_LOG_MAX = 100000; // 100 000 lux (direct sun)

/**
 * Daylight sensor — measures ambient illuminance and recommends dimming.
 * Attrs: label, kind (indoor/outdoor), lux (current), target-lux,
 *   recommendation (0-100), saturated (bool)
 */
export class BmsDaylightSensor extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'kind', 'lux', 'target-lux', 'recommendation', 'saturated'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-daylight');
      this.setAttribute('accent', 'lighting-cct');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption" data-kind>—</span>
          </div>
          <span class="bms-mono bms-h2"><span data-lux>0</span> lx</span>
        </div>
        <div class="bms-daylight-bar">
          <div class="bms-daylight-target" data-target></div>
          <div class="bms-daylight-cursor" data-cursor></div>
        </div>
        <div class="bms-row bms-between bms-mono bms-muted" style="font-size: 11px;">
          <span>10</span><span>100</span><span>1k</span><span>10k</span><span>100k lx</span>
        </div>
        <div class="bms-row bms-between" style="font-size: 12px;">
          <span class="bms-muted">уставка <span class="bms-text bms-mono" data-tgt>0</span> lx</span>
          <span class="bms-muted">регулятор → <span class="bms-text bms-mono" data-rec>—</span>%</span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _logPct(lux) {
    if (lux <= 0) return 0;
    const v = (Math.log10(Math.max(SCALE_LOG_MIN, lux)) - Math.log10(SCALE_LOG_MIN)) /
              (Math.log10(SCALE_LOG_MAX) - Math.log10(SCALE_LOG_MIN));
    return Math.max(0, Math.min(1, v));
  }

  _reflect() {
    const kind = this.str('kind', 'indoor');
    const lux = this.num('lux', 0);
    const target = this.num('target-lux', 500);
    const rec = this.num('recommendation', 0);
    this.querySelector('[data-label]').textContent = this.str('label', 'Датчик освещённости');
    this.querySelector('[data-kind]').textContent = kind === 'outdoor' ? 'наружный' : 'внутренний';
    this.querySelector('[data-lux]').textContent = lux >= 10000 ? `${(lux/1000).toFixed(0)}k` :
                                                    lux >= 1000  ? `${(lux/1000).toFixed(1)}k` :
                                                    Math.round(lux);
    this.querySelector('[data-tgt]').textContent = target;
    this.querySelector('[data-rec]').textContent = Math.round(rec);
    this.querySelector('[data-cursor]').style.left = `${this._logPct(lux) * 100}%`;
    this.querySelector('[data-target]').style.left = `${this._logPct(target) * 100}%`;
    this.classList.toggle('is-active', lux > 0);
    this.setAttribute('value', String(lux));
  }
}

defineWidget('bms-daylight-sensor', BmsDaylightSensor);
