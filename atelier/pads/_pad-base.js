import { BmsElement } from '../core/bms-element.js';

/**
 * Shared base for multifunctional control pads.
 * Manages: power/brightness/cct/setpoint/active-scene and scene activation.
 *
 * @typedef {Object} Scene
 * @property {string} id
 * @property {string} label
 * @property {number} [brightness]
 * @property {number} [cct]
 * @property {number} [setpoint]
 */
export class BmsPadBase extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'room', 'power',
      'brightness', 'cct', 'setpoint', 'climate-mode',
      'active-scene', 'scenes'];
  }

  /** @returns {Scene[]} */
  scenes() {
    try {
      const s = JSON.parse(this.str('scenes', '[]'));
      if (Array.isArray(s) && s.length) return s;
    } catch {}
    return [
      { id: 'morning', label: 'утро',  brightness: 80, cct: 4000 },
      { id: 'day',     label: 'день',  brightness: 100, cct: 5000 },
      { id: 'evening', label: 'вечер', brightness: 60, cct: 2700 },
      { id: 'cinema',  label: 'кино',  brightness: 20, cct: 2200 },
      { id: 'night',   label: 'ночь',  brightness: 5,  cct: 1800 },
    ];
  }

  togglePower() {
    const next = !this.bool('power');
    if (next) this.setAttribute('power', ''); else this.removeAttribute('power');
    this.emit('power-toggle', { power: next });
    this.render();
  }

  setBrightness(v) {
    const c = Math.max(0, Math.min(100, Math.round(v)));
    this.setAttribute('brightness', String(c));
    this.emit('brightness-change', { brightness: c });
    this.render();
  }

  setCct(v) {
    const c = Math.max(1800, Math.min(6500, Math.round(v)));
    this.setAttribute('cct', String(c));
    this.emit('cct-change', { cct: c });
    this.render();
  }

  setSetpoint(v) {
    const c = Math.max(16, Math.min(30, Number(v.toFixed ? v.toFixed(1) : v)));
    this.setAttribute('setpoint', String(c));
    this.emit('setpoint-change', { setpoint: c });
    this.render();
  }

  setClimateMode(mode) {
    this.setAttribute('climate-mode', mode);
    this.emit('climate-mode-change', { mode });
    this.render();
  }

  activateScene(id) {
    const s = this.scenes().find((x) => x.id === id);
    if (!s) return;
    this.setAttribute('active-scene', id);
    if (s.brightness != null) this.setAttribute('brightness', String(s.brightness));
    if (s.cct != null)        this.setAttribute('cct', String(s.cct));
    if (s.setpoint != null)   this.setAttribute('setpoint', String(s.setpoint));
    if (!this.bool('power'))  this.setAttribute('power', '');
    this.emit('scene-activate', { scene: s });
    this.render();
  }
}
