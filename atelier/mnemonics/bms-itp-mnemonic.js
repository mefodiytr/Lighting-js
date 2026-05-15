import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

/**
 * ИТП (Individual Thermal Substation) mnemonic — 3-loop layout:
 *  primary network → heat exchanger → heating/DHW/ventilation loops.
 * Attrs: name, tag, primary-supply, primary-return, dhw-temp, heating-supply,
 *   heating-return, pump-heating, pump-dhw, valve-heating, valve-dhw, status
 */
export class BmsItpMnemonic extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'name', 'tag',
      'primary-supply', 'primary-return', 'dhw-temp',
      'heating-supply', 'heating-return',
      'pump-heating', 'pump-dhw', 'valve-heating', 'valve-dhw', 'status'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-mimic');
      this.setAttribute('accent', 'hvac-temperature');
      this.innerHTML = `
        <header class="bms-mimic-head">
          <div>
            <h3 class="bms-mimic-title" data-name>Индивидуальный тепловой пункт</h3>
            <div class="bms-caption" data-tag></div>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </header>

        <div class="bms-mimic-stage">
          <div style="display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: center;">

            <!-- Primary network labels -->
            <div style="display: grid; gap: 16px;">
              <bms-sensor-pip kind="t" data-t-pri-sup unit="°C"></bms-sensor-pip>
              <bms-sensor-pip kind="t" data-t-pri-ret unit="°C"></bms-sensor-pip>
            </div>

            <!-- Heat exchanger + loops -->
            <div style="display: grid; gap: 18px; align-items: center; padding: 0 8px;">
              <div style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                <span class="bms-caption">подача</span>
                <bms-heat-exchanger data-hx label="ТО-1"></bms-heat-exchanger>
                <span class="bms-caption">отопление →</span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px; justify-content: center;">
                <bms-pump-icon data-p-heat label="ЦН-1"></bms-pump-icon>
                <bms-valve-icon data-v-heat label="V1"></bms-valve-icon>
                <bms-sensor-pip kind="t" data-t-heat-sup unit="°C"></bms-sensor-pip>
              </div>
              <div style="display: flex; align-items: center; gap: 12px; justify-content: center;">
                <bms-pump-icon data-p-dhw label="ЦН-2"></bms-pump-icon>
                <bms-valve-icon data-v-dhw label="V2"></bms-valve-icon>
                <bms-sensor-pip kind="t" data-t-dhw unit="°C"></bms-sensor-pip>
                <span class="bms-caption">ГВС</span>
              </div>
            </div>

            <!-- Right column: return labels -->
            <div style="display: grid; gap: 16px; justify-items: end;">
              <bms-sensor-pip kind="t" data-t-heat-ret unit="°C"></bms-sensor-pip>
              <bms-caption>обратка</bms-caption>
            </div>

          </div>
        </div>

        <div class="bms-mimic-stats" data-stats></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const priSup = this.num('primary-supply', 0);
    const priRet = this.num('primary-return', 0);
    const heatSup = this.num('heating-supply', 0);
    const heatRet = this.num('heating-return', 0);
    const dhw     = this.num('dhw-temp', 0);

    this.querySelector('[data-name]').textContent = this.str('name', 'ИТП');
    this.querySelector('[data-tag]').textContent  = this.str('tag', '');

    this.querySelector('[data-t-pri-sup]').setAttribute('value', `${priSup.toFixed(0)}`);
    this.querySelector('[data-t-pri-ret]').setAttribute('value', `${priRet.toFixed(0)}`);
    this.querySelector('[data-t-heat-sup]').setAttribute('value', `${heatSup.toFixed(0)}`);
    this.querySelector('[data-t-heat-ret]').setAttribute('value', `${heatRet.toFixed(0)}`);
    this.querySelector('[data-t-dhw]').setAttribute('value', `${dhw.toFixed(0)}`);

    const eff = (priSup > 0 && priRet > 0 && heatSup > 0)
      ? Math.max(0, Math.min(100, ((heatSup - heatRet) / Math.max(1, (priSup - heatRet))) * 100))
      : 0;
    this.querySelector('[data-hx]').setAttribute('efficiency', String(Math.round(eff)));

    this.querySelector('[data-p-heat]').setAttribute('speed', this.str('pump-heating', '0'));
    this.querySelector('[data-p-dhw]').setAttribute('speed', this.str('pump-dhw', '0'));
    this.querySelector('[data-v-heat]').setAttribute('position', this.str('valve-heating', '0'));
    this.querySelector('[data-v-dhw]').setAttribute('position', this.str('valve-dhw', '0'));

    const status = this.str('status', 'ok');
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', status);
    dot.setAttribute('label', status === 'ok' ? 'работает' : 'внимание');

    const stats = this.querySelector('[data-stats]');
    stats.innerHTML = '';
    const items = [
      ['Сеть подача',  `${priSup.toFixed(0)} °C`],
      ['Сеть обратка', `${priRet.toFixed(0)} °C`],
      ['Отопление',     `${heatSup.toFixed(0)} → ${heatRet.toFixed(0)} °C`],
      ['ГВС',           `${dhw.toFixed(0)} °C`],
      ['η ТО-1',        `${Math.round(eff)} %`],
    ];
    for (const [l, v] of items) {
      const cell = document.createElement('div');
      cell.className = 'bms-mimic-stat';
      cell.innerHTML = `<div class="l">${l}</div><div class="v">${v}</div>`;
      stats.append(cell);
    }
  }
}

defineWidget('bms-itp-mnemonic', BmsItpMnemonic);
