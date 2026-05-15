import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

/**
 * AHU (приточно-вытяжная установка) mnemonic diagram.
 * Attrs: name, supply-flow, return-flow, supply-temp, outside-temp, return-temp,
 *        filter-state, recuperator-eff, cool-coil, heat-coil, fan-speed, return-fan-speed
 */
export class BmsAhuMnemonic extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'name', 'tag',
      'supply-flow', 'return-flow', 'supply-temp', 'outside-temp', 'return-temp',
      'filter-state', 'recuperator-eff', 'cool-coil', 'heat-coil',
      'fan-speed', 'return-fan-speed'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-mimic');
      this.setAttribute('accent', 'hvac-temperature');
      this.innerHTML = `
        <header class="bms-mimic-head">
          <div>
            <h3 class="bms-mimic-title" data-name>Приточно-вытяжная установка</h3>
            <div class="bms-caption" data-tag></div>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </header>

        <div class="bms-mimic-stage">
          <div class="bms-mimic-grid" style="grid-template-columns: auto 36px auto 30px auto 30px auto 30px auto 30px auto 30px auto; grid-template-rows: auto auto; gap: 0 4px; row-gap: 80px;">
            <!-- Supply row -->
            <bms-sensor-pip kind="t" data-t-out style="grid-column:1; grid-row:1; justify-self:start;"></bms-sensor-pip>
            <bms-duct-segment data-d1 direction="lr" style="grid-column:2; grid-row:1; width:36px;"></bms-duct-segment>
            <bms-filter-icon data-f-supply style="grid-column:3; grid-row:1;"></bms-filter-icon>
            <bms-duct-segment data-d2 direction="lr" style="grid-column:4; grid-row:1; width:30px;"></bms-duct-segment>
            <bms-heat-exchanger data-hx style="grid-column:5; grid-row:1;"></bms-heat-exchanger>
            <bms-duct-segment data-d3 direction="lr" style="grid-column:6; grid-row:1; width:30px;"></bms-duct-segment>
            <bms-coil-icon data-cool mode="cooling" style="grid-column:7; grid-row:1;"></bms-coil-icon>
            <bms-duct-segment data-d4 direction="lr" style="grid-column:8; grid-row:1; width:30px;"></bms-duct-segment>
            <bms-coil-icon data-heat mode="heating" style="grid-column:9; grid-row:1;"></bms-coil-icon>
            <bms-duct-segment data-d5 direction="lr" style="grid-column:10; grid-row:1; width:30px;"></bms-duct-segment>
            <bms-fan-icon data-fan style="grid-column:11; grid-row:1;"></bms-fan-icon>
            <bms-duct-segment data-d6 direction="lr" style="grid-column:12; grid-row:1; width:30px;"></bms-duct-segment>
            <bms-sensor-pip kind="t" data-t-sup style="grid-column:13; grid-row:1; justify-self:end;"></bms-sensor-pip>

            <!-- Return row -->
            <bms-sensor-pip kind="q" data-q-ret style="grid-column:1; grid-row:2; justify-self:start;"></bms-sensor-pip>
            <bms-duct-segment data-r1 direction="rl" style="grid-column:2; grid-row:2; width:36px;"></bms-duct-segment>
            <bms-filter-icon data-f-return style="grid-column:3; grid-row:2;"></bms-filter-icon>
            <bms-duct-segment data-r2 direction="rl" style="grid-column:4 / span 7; grid-row:2; width:100%;"></bms-duct-segment>
            <bms-fan-icon data-rfan style="grid-column:11; grid-row:2;"></bms-fan-icon>
            <bms-duct-segment data-r3 direction="rl" style="grid-column:12; grid-row:2; width:30px;"></bms-duct-segment>
            <bms-sensor-pip kind="t" data-t-ret style="grid-column:13; grid-row:2; justify-self:end;"></bms-sensor-pip>
          </div>
        </div>

        <div class="bms-mimic-stats" data-stats></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    this.querySelector('[data-name]').textContent = this.str('name', 'Приточно-вытяжная установка');
    this.querySelector('[data-tag]').textContent  = this.str('tag', '');

    const supFlow = this.num('supply-flow', 0);
    const retFlow = this.num('return-flow', 0);
    const supT = this.num('supply-temp', 22);
    const retT = this.num('return-temp', 24);
    const outT = this.num('outside-temp', 5);
    const filterState = this.str('filter-state', 'ok');
    const eff = this.num('recuperator-eff', 0);
    const coolMode = this.str('cool-coil', 'off');
    const heatMode = this.str('heat-coil', 'off');
    const fanSpd = this.num('fan-speed', 0);
    const retFanSpd = this.num('return-fan-speed', fanSpd);

    // sensors
    this.querySelector('[data-t-out]').setAttribute('value', `${outT.toFixed(1)}`);
    this.querySelector('[data-t-out]').setAttribute('unit', '°C');
    this.querySelector('[data-t-sup]').setAttribute('value', `${supT.toFixed(1)}`);
    this.querySelector('[data-t-sup]').setAttribute('unit', '°C');
    this.querySelector('[data-t-ret]').setAttribute('value', `${retT.toFixed(1)}`);
    this.querySelector('[data-t-ret]').setAttribute('unit', '°C');
    this.querySelector('[data-q-ret]').setAttribute('value', String(this.num('return-co2', 720)));
    this.querySelector('[data-q-ret]').setAttribute('unit', ' ppm');

    // ducts — set flow + direction for supply
    for (const d of ['d1', 'd2', 'd3', 'd4', 'd5', 'd6']) {
      const el = this.querySelector(`[data-${d}]`);
      el.setAttribute('flow', String(supFlow / 50));
      el.setAttribute('direction', 'lr');
    }
    for (const d of ['r1', 'r2', 'r3']) {
      const el = this.querySelector(`[data-${d}]`);
      el.setAttribute('flow', String(retFlow / 50));
      el.setAttribute('direction', 'rl');
    }

    this.querySelector('[data-f-supply]').setAttribute('state', filterState);
    this.querySelector('[data-f-return]').setAttribute('state', filterState);
    this.querySelector('[data-hx]').setAttribute('efficiency', String(eff));
    this.querySelector('[data-cool]').setAttribute('mode', coolMode);
    this.querySelector('[data-heat]').setAttribute('mode', heatMode);
    this.querySelector('[data-fan]').setAttribute('speed', String(fanSpd));
    this.querySelector('[data-rfan]').setAttribute('speed', String(retFanSpd));

    // overall status
    const dot = this.querySelector('[data-state]');
    const status = filterState === 'replace' ? 'alarm' : (filterState === 'warning' ? 'warning' : 'ok');
    dot.setAttribute('status', status);
    dot.setAttribute('label', status === 'ok' ? 'работает' : 'внимание');

    // stats panel
    const stats = this.querySelector('[data-stats]');
    stats.innerHTML = '';
    const items = [
      ['Приток',     `${supFlow} м³/ч`],
      ['Вытяжка',    `${retFlow} м³/ч`],
      ['Δt приточка', `${(supT - outT).toFixed(1)} °C`],
      ['η рекуп.',   `${Math.round(eff)} %`],
      ['Скорость вентиляторов', `${fanSpd}%`],
    ];
    for (const [l, v] of items) {
      const cell = document.createElement('div');
      cell.className = 'bms-mimic-stat';
      cell.innerHTML = `<div class="l">${l}</div><div class="v">${v}</div>`;
      stats.append(cell);
    }
  }
}

defineWidget('bms-ahu-mnemonic', BmsAhuMnemonic);
