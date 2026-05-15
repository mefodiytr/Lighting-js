import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Energy flow — 4-node bento: Grid, Load, PV, Battery with active glow.
 * Attrs: grid (kW, signed: + import, − export), load (kW), pv (kW), battery (kW, signed)
 */
export class BmsEnergyFlow extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'grid', 'load', 'pv', 'battery'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-flow');
      this.setAttribute('accent', 'pv-generation');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label>Энергетический баланс</h3>
          <span class="bms-caption" data-time></span>
        </div>
        <div class="bms-flow-grid">
          <div class="bms-flow-node" data-node="grid">
            <div class="icon">⚡</div>
            <div class="num"><span data-v>0.0</span> kW</div>
            <div class="lbl" data-l>Сеть</div>
          </div>
          <div class="bms-flow-node" data-node="pv">
            <div class="icon">☀</div>
            <div class="num"><span data-v>0.0</span> kW</div>
            <div class="lbl">Солнечные панели</div>
          </div>
          <div class="bms-flow-node" data-node="battery">
            <div class="icon">▮</div>
            <div class="num"><span data-v>0.0</span> kW</div>
            <div class="lbl" data-l>Аккумулятор</div>
          </div>
          <div class="bms-flow-node" data-node="load">
            <div class="icon">▤</div>
            <div class="num"><span data-v>0.0</span> kW</div>
            <div class="lbl">Нагрузка</div>
          </div>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const grid = this.num('grid', 0);
    const load = this.num('load', 0);
    const pv   = this.num('pv', 0);
    const batt = this.num('battery', 0);
    this._set('grid', grid, grid >= 0 ? 'Из сети' : 'В сеть');
    this._set('load', load);
    this._set('pv',   pv);
    this._set('battery', batt, batt >= 0 ? 'Заряжается' : batt < 0 ? 'Разряжается' : 'Ожидание');
    const now = new Date();
    this.querySelector('[data-time]').textContent =
      now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    this.classList.add('is-active');
    this.setAttribute('value', String(Math.abs(pv)));
  }

  _set(node, value, label) {
    const el = this.querySelector(`[data-node="${node}"]`);
    if (!el) return;
    el.querySelector('[data-v]').textContent = Math.abs(value).toFixed(1);
    if (label !== undefined) {
      const l = el.querySelector('[data-l]');
      if (l) l.textContent = label;
    }
    el.style.borderColor = Math.abs(value) > 0.1
      ? 'rgb(var(--cr) var(--cg) var(--cb) / 0.55)'
      : 'var(--bms-border)';
  }
}

defineWidget('bms-energy-flow', BmsEnergyFlow);
