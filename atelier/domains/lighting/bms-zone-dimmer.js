import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Zone dimmer — brightness + CCT sliders, on/off switch.
 * Attrs: label, brightness (0-100), cct (1800-6500), on (bool)
 */
export class BmsZoneDimmer extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'brightness', 'cct', 'on'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-zone');
      this.setAttribute('accent', 'lighting-cct');
      this.innerHTML = `
        <div class="bms-zone-head">
          <div class="lamp"></div>
          <div class="bms-col bms-grow" style="gap: 2px;">
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption" data-state></span>
          </div>
          <bms-glass-switch data-switch accent="lighting-cct"></bms-glass-switch>
        </div>
        <bms-horizontal-slider data-bright label="Яркость" min="0" max="100" unit="%" accent="lighting-cct"></bms-horizontal-slider>
        <bms-horizontal-slider data-cct label="Температура" min="1800" max="6500" step="100" unit="K" accent="lighting-cct"></bms-horizontal-slider>`;
      this.querySelector('[data-switch]').addEventListener('change', (e) => {
        if (e.detail.checked) this.setAttribute('on', ''); else this.removeAttribute('on');
        this.emit('toggle', { on: e.detail.checked });
      });
      this.querySelector('[data-bright]').addEventListener('change', (e) => {
        this.setAttribute('brightness', String(e.detail.value));
        this.emit('brightness-change', { brightness: e.detail.value });
      });
      this.querySelector('[data-cct]').addEventListener('change', (e) => {
        this.setAttribute('cct', String(e.detail.value));
        this.emit('cct-change', { cct: e.detail.value });
      });
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const on = this.bool('on');
    const b = this.num('brightness', 80);
    const cct = this.num('cct', 3200);
    this.querySelector('[data-label]').textContent = this.str('label', 'Зона');
    this.querySelector('[data-state]').textContent = on
      ? `${b}% · ${cct}K`
      : 'выключено';
    const sw = this.querySelector('[data-switch]');
    if (on) sw.setAttribute('checked', ''); else sw.removeAttribute('checked');
    sw.setAttribute('value', String(cct));
    this.querySelector('[data-bright]').setAttribute('value', String(b));
    this.querySelector('[data-cct]').setAttribute('value', String(cct));
    this.lampStyle(cct);
    this.classList.toggle('is-off', !on);
    this.classList.toggle('is-active', on);
    // propagate cct as the accent value for live colour
    this.setAttribute('value', String(cct));
  }

  lampStyle(cct) {
    const lamp = this.querySelector('.lamp');
    if (!lamp) return;
    lamp.style.opacity = this.bool('on') ? String(0.3 + 0.7 * (this.num('brightness', 80) / 100)) : '0.2';
  }
}

defineWidget('bms-zone-dimmer', BmsZoneDimmer);
