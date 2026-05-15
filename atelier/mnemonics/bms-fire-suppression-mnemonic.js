import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

/**
 * Fire suppression system mnemonic — water tank + jockey pump + main pump +
 * distribution to sprinkler zones.
 * Attrs: name, tag, tank-level (0-100), jockey-running, main-running,
 *   system-pressure (bar), zones (JSON [{id, label, state}]), alarm
 */
export class BmsFireSuppressionMnemonic extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'name', 'tag', 'tank-level',
      'jockey-running', 'main-running', 'system-pressure', 'zones', 'alarm', 'status'];
  }

  _zones() {
    try { return JSON.parse(this.str('zones', '[]')); } catch { return []; }
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-mimic');
      this.setAttribute('accent', 'alarm-level');
      this.innerHTML = `
        <header class="bms-mimic-head">
          <div>
            <h3 class="bms-mimic-title" data-name>Система пожаротушения</h3>
            <div class="bms-caption" data-tag></div>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </header>

        <div class="bms-mimic-stage">
          <div style="display: grid; grid-template-columns: auto auto auto 1fr; gap: 20px; align-items: center;">
            <div style="text-align: center;">
              <bms-tank-icon data-tank style="width: 70px; height: 100px;"></bms-tank-icon>
              <div class="bms-caption" style="margin-top: 4px;">резервуар</div>
            </div>
            <div style="text-align: center;">
              <bms-pump-icon data-jockey label="ЖН"></bms-pump-icon>
              <div class="bms-caption">жокей-насос</div>
            </div>
            <div style="text-align: center;">
              <bms-pump-icon data-main label="ОН"></bms-pump-icon>
              <div class="bms-caption">основной</div>
            </div>
            <div style="text-align: center;">
              <bms-sensor-pip kind="p" data-pres unit=" bar"></bms-sensor-pip>
              <div class="bms-caption" style="margin-top: 4px;">давление</div>
            </div>
          </div>
        </div>

        <div data-zones-wrap>
          <div class="bms-caption" style="margin: 16px 0 8px;">зоны спринклеров</div>
          <div data-zones style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 6px;"></div>
        </div>

        <div class="bms-mimic-stats" data-stats></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const tank = this.num('tank-level', 0);
    const jockey = this.bool('jockey-running');
    const main = this.bool('main-running');
    const pres = this.num('system-pressure', 0);
    const alarm = this.bool('alarm');
    const zones = this._zones();
    this.querySelector('[data-name]').textContent = this.str('name', 'Пожаротушение');
    this.querySelector('[data-tag]').textContent = this.str('tag', '');

    this.querySelector('[data-tank]').setAttribute('level', String(tank));
    this.querySelector('[data-tank]').setAttribute('label', `${tank}%`);
    this.querySelector('[data-jockey]').setAttribute('speed', jockey ? '40' : '0');
    this.querySelector('[data-main]').setAttribute('speed', main ? '100' : '0');
    this.querySelector('[data-pres]').setAttribute('value', pres.toFixed(1));

    const zEl = this.querySelector('[data-zones]');
    zEl.innerHTML = '';
    let active = 0;
    for (const z of zones) {
      const cell = document.createElement('div');
      const s = z.state || 'idle';
      if (s === 'active') active++;
      const colors = {
        idle:    { bg: 'var(--bms-surface-2)', fg: 'var(--bms-text-muted)' },
        armed:   { bg: 'rgb(110, 210, 140 / 0.15)', fg: 'rgb(110, 210, 140)' },
        active:  { bg: 'rgb(240, 70, 60 / 0.15)', fg: 'rgb(240, 70, 60)' },
        fault:   { bg: 'rgb(255, 200, 110 / 0.15)', fg: 'rgb(255, 200, 110)' },
      };
      const c = colors[s] || colors.idle;
      cell.style.cssText = `padding: 8px 10px; background: ${c.bg}; color: ${c.fg}; border-radius: var(--bms-radius-sm); font-size: 12px;`;
      cell.innerHTML = `<div style="font-weight: 600;">${z.label || z.id}</div><div class="bms-mono" style="font-size: 10px; margin-top: 2px;">${s}</div>`;
      zEl.append(cell);
    }

    const status = alarm ? 'critical' : main ? 'warning' : 'ok';
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', status);
    if (alarm) dot.setAttribute('pulsing', ''); else dot.removeAttribute('pulsing');
    dot.setAttribute('label', alarm ? 'СРАБАТЫВАНИЕ' : main ? 'основной активен' : 'в готовности');
    this.setAttribute('value', alarm ? '3' : main ? '1' : '0');

    const stats = this.querySelector('[data-stats]');
    stats.innerHTML = '';
    const items = [
      ['Резерв воды',     `${tank} %`],
      ['Давление',        `${pres.toFixed(2)} bar`],
      ['Зон в готовности', `${zones.length - active} / ${zones.length}`],
      ['Активных',        active > 0 ? `${active} ⚠` : '0'],
    ];
    for (const [l, v] of items) {
      const cell = document.createElement('div');
      cell.className = 'bms-mimic-stat';
      cell.innerHTML = `<div class="l">${l}</div><div class="v">${v}</div>`;
      stats.append(cell);
    }
  }
}

defineWidget('bms-fire-suppression-mnemonic', BmsFireSuppressionMnemonic);
