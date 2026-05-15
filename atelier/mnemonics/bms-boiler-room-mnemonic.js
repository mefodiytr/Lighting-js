import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

/**
 * Boiler room mnemonic — 2 boilers + 2 pumps + expansion tank + heat meter.
 * Attrs: name, tag, boiler-1, boiler-2 (each: load 0-100, supply, return),
 *   pump-1, pump-2 (each: speed 0-100, running, hours),
 *   tank-level, total-heat (Gcal)
 */
export class BmsBoilerRoomMnemonic extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'name', 'tag',
      'boiler-1-load', 'boiler-1-supply', 'boiler-1-return',
      'boiler-2-load', 'boiler-2-supply', 'boiler-2-return',
      'pump-1-speed', 'pump-2-speed',
      'tank-level', 'total-heat', 'status'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-mimic');
      this.setAttribute('accent', 'hvac-temperature');
      this.innerHTML = `
        <header class="bms-mimic-head">
          <div>
            <h3 class="bms-mimic-title" data-name>Котельная</h3>
            <div class="bms-caption" data-tag></div>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </header>

        <div class="bms-mimic-stage">
          <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 24px; align-items: center;">
            <!-- Boiler 1 -->
            <div style="text-align: center;">
              <div class="bms-caption">Котёл №1</div>
              <div style="font-size: 48px; line-height: 1;" data-flame-1>🔥</div>
              <div class="bms-mono" style="margin-top: 4px;"><span data-b1-sup>—</span>°C → <span data-b1-ret>—</span>°C</div>
              <div class="bms-caption bms-mono"><span data-b1-load>—</span>%</div>
            </div>
            <!-- Boiler 2 -->
            <div style="text-align: center;">
              <div class="bms-caption">Котёл №2</div>
              <div style="font-size: 48px; line-height: 1;" data-flame-2>🔥</div>
              <div class="bms-mono" style="margin-top: 4px;"><span data-b2-sup>—</span>°C → <span data-b2-ret>—</span>°C</div>
              <div class="bms-caption bms-mono"><span data-b2-load>—</span>%</div>
            </div>
            <!-- Expansion tank -->
            <bms-tank-icon data-tank shape="cylinder" style="width: 60px; height: 100px;"></bms-tank-icon>
          </div>

          <div class="bms-mimic-connector" style="margin: 16px 0;" data-conn1></div>

          <div style="display: grid; grid-template-columns: auto 1fr auto 1fr auto; gap: 12px; align-items: center;">
            <span class="bms-caption">→ потребители</span>
            <bms-pump-icon data-pump-1></bms-pump-icon>
            <bms-sensor-pip kind="t" data-sup-pip unit="°C"></bms-sensor-pip>
            <bms-pump-icon data-pump-2></bms-pump-icon>
            <span class="bms-caption">обратка ←</span>
          </div>
        </div>

        <div class="bms-mimic-stats" data-stats></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const b1Load = this.num('boiler-1-load', 0);
    const b2Load = this.num('boiler-2-load', 0);
    const b1Sup = this.num('boiler-1-supply', 0);
    const b1Ret = this.num('boiler-1-return', 0);
    const b2Sup = this.num('boiler-2-supply', 0);
    const b2Ret = this.num('boiler-2-return', 0);
    const p1Speed = this.num('pump-1-speed', 0);
    const p2Speed = this.num('pump-2-speed', 0);
    const tank = this.num('tank-level', 0);
    this.querySelector('[data-name]').textContent = this.str('name', 'Котельная');
    this.querySelector('[data-tag]').textContent = this.str('tag', '');

    this.querySelector('[data-flame-1]').style.opacity = b1Load > 0 ? '1' : '0.2';
    this.querySelector('[data-flame-2]').style.opacity = b2Load > 0 ? '1' : '0.2';
    this.querySelector('[data-b1-sup]').textContent = b1Sup.toFixed(0);
    this.querySelector('[data-b1-ret]').textContent = b1Ret.toFixed(0);
    this.querySelector('[data-b1-load]').textContent = Math.round(b1Load);
    this.querySelector('[data-b2-sup]').textContent = b2Sup.toFixed(0);
    this.querySelector('[data-b2-ret]').textContent = b2Ret.toFixed(0);
    this.querySelector('[data-b2-load]').textContent = Math.round(b2Load);

    this.querySelector('[data-tank]').setAttribute('level', String(tank));
    this.querySelector('[data-tank]').setAttribute('label', `бак ${tank}%`);
    this.querySelector('[data-pump-1]').setAttribute('speed', String(p1Speed));
    this.querySelector('[data-pump-1]').setAttribute('label', 'ЦН-1');
    this.querySelector('[data-pump-2]').setAttribute('speed', String(p2Speed));
    this.querySelector('[data-pump-2]').setAttribute('label', 'ЦН-2');

    const supT = Math.max(b1Sup, b2Sup);
    this.querySelector('[data-sup-pip]').setAttribute('value', supT.toFixed(0));
    this.querySelector('[data-conn1]').classList.toggle('is-flowing', p1Speed > 0 || p2Speed > 0);

    const totalLoad = (b1Load + b2Load) / 2;
    const status = this.str('status', totalLoad > 0 ? 'ok' : 'offline');
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', status);
    dot.setAttribute('label', status === 'ok' ? 'работает' : 'выкл');
    this.setAttribute('value', String(supT));

    const stats = this.querySelector('[data-stats]');
    stats.innerHTML = '';
    const items = [
      ['Сумм. нагрузка',  `${Math.round(totalLoad)} %`],
      ['Подача T',        `${supT.toFixed(0)} °C`],
      ['Бак',             `${tank} %`],
      ['Q (общ)',         `${this.num('total-heat', 0).toLocaleString('ru-RU')} Gcal`],
    ];
    for (const [l, v] of items) {
      const cell = document.createElement('div');
      cell.className = 'bms-mimic-stat';
      cell.innerHTML = `<div class="l">${l}</div><div class="v">${v}</div>`;
      stats.append(cell);
    }
  }
}

defineWidget('bms-boiler-room-mnemonic', BmsBoilerRoomMnemonic);
