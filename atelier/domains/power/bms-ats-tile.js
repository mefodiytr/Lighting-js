import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Automatic Transfer Switch (АВР) — shows which source is feeding the load.
 * Attrs: label, active (main/reserve/off), main-volt, reserve-volt,
 *   main-status (ok/fault/missing), reserve-status, last-switch (time str), mode (auto/manual)
 */
export class BmsAtsTile extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'active', 'main-volt', 'reserve-volt',
      'main-status', 'reserve-status', 'last-switch', 'mode'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'power-load');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption">АВР · режим <span class="bms-text" data-mode>—</span></span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>

        <div class="bms-ats-sources">
          <div class="bms-ats-source" data-main-box>
            <div class="name">основной ввод</div>
            <div class="v"><span data-main-v>0</span> V</div>
            <div class="bms-caption bms-mono" data-main-s>—</div>
          </div>
          <div class="bms-ats-switch" data-switch>⇆</div>
          <div class="bms-ats-source" data-res-box>
            <div class="name">резервный ввод</div>
            <div class="v"><span data-res-v>0</span> V</div>
            <div class="bms-caption bms-mono" data-res-s>—</div>
          </div>
        </div>

        <div class="bms-row bms-between bms-caption">
          <span>последнее переключение</span>
          <span class="bms-mono bms-text" data-last>—</span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const active = this.str('active', 'main');
    const mainStatus = this.str('main-status', 'ok');
    const resStatus = this.str('reserve-status', 'ok');
    this.querySelector('[data-label]').textContent = this.str('label', 'АВР');
    this.querySelector('[data-mode]').textContent = this.str('mode', 'auto');
    this.querySelector('[data-main-v]').textContent = this.num('main-volt', 0).toFixed(0);
    this.querySelector('[data-res-v]').textContent = this.num('reserve-volt', 0).toFixed(0);
    this.querySelector('[data-main-s]').textContent = mainStatus;
    this.querySelector('[data-res-s]').textContent = resStatus;
    this.querySelector('[data-last]').textContent = this.str('last-switch', '—');
    const mainBox = this.querySelector('[data-main-box]');
    const resBox = this.querySelector('[data-res-box]');
    mainBox.classList.toggle('is-active', active === 'main');
    mainBox.classList.toggle('is-fault', mainStatus === 'fault' || mainStatus === 'missing');
    resBox.classList.toggle('is-active', active === 'reserve');
    resBox.classList.toggle('is-fault', resStatus === 'fault' || resStatus === 'missing');
    this.querySelector('[data-switch]').textContent = active === 'reserve' ? '→' : active === 'off' ? '×' : '←';
    const dot = this.querySelector('[data-state]');
    const status = active === 'off' ? 'offline'
                 : active === 'reserve' ? 'warning'
                 : mainStatus === 'ok' ? 'ok' : 'warning';
    dot.setAttribute('status', status);
    dot.setAttribute('label', active);
    this.classList.toggle('is-active', active !== 'off');
    this.setAttribute('value', active === 'reserve' ? '1' : '0');
  }
}

defineWidget('bms-ats-tile', BmsAtsTile);
