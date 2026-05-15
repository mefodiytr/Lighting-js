import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Load bar with thresholds — visualizes 0..100% load with warning/alarm markers.
 * Attrs: label, value (0-100), threshold-warn, threshold-alarm, unit (default %), nominal (kW)
 */
export class BmsLoadBar extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'threshold-warn', 'threshold-alarm', 'nominal', 'unit'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-load');
      this.setAttribute('accent', 'power-load');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-mono bms-h2" data-value>0</span>
        </div>
        <div class="bms-load-bar">
          <div class="bms-load-bar-fill" data-fill></div>
          <div class="bms-load-bar-threshold" data-warn></div>
          <div class="bms-load-bar-threshold" data-alarm></div>
        </div>
        <div class="bms-load-stats">
          <span class="bms-muted">0</span>
          <span class="bms-muted" data-nominal></span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const v = this.num('value', 0);
    const unit = this.str('unit', '%');
    const nom = this.num('nominal', 100);
    const warn = this.num('threshold-warn', 70);
    const alarm = this.num('threshold-alarm', 90);
    this.querySelector('[data-label]').textContent = this.str('label', 'Нагрузка');
    this.querySelector('[data-value]').textContent = `${Math.round(v)}${unit}`;
    this.querySelector('[data-fill]').style.width = `${v}%`;
    this.querySelector('[data-warn]').style.left = `${warn}%`;
    this.querySelector('[data-alarm]').style.left = `${alarm}%`;
    this.querySelector('[data-nominal]').textContent = nom ? `${nom} kW` : '';
    this.setAttribute('value', String(v));
    this.classList.toggle('is-active', v > 0);
  }
}

defineWidget('bms-load-bar', BmsLoadBar);
