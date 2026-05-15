import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Evacuation map — floor outline + exits + routes + alarm points.
 * Attrs: label, floor, exits (JSON [{x%, y%, label}]),
 *   routes (JSON [{points: [[x%,y%],...], blocked?}]),
 *   alarms (JSON [{x%, y%, label}])
 */
export class BmsEvacuationMap extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'floor', 'exits', 'routes', 'alarms'];
  }

  _parse(name) {
    try { return JSON.parse(this.str(name, '[]')); } catch { return []; }
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-evac');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-caption" data-floor></span>
        </div>
        <svg viewBox="0 0 800 460" data-svg></svg>
        <div class="bms-row" style="gap: 16px; font-size: 11px; color: var(--bms-text-muted);">
          <span><span style="display:inline-block;width:12px;height:3px;background:rgb(110,210,140);vertical-align:middle;margin-right:4px;"></span>безопасный путь</span>
          <span><span style="display:inline-block;width:12px;height:3px;background:rgb(240,70,60);vertical-align:middle;margin-right:4px;"></span>заблокирован</span>
          <span>● выход · ⚠ очаг</span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    this.querySelector('[data-label]').textContent = this.str('label', 'План эвакуации');
    this.querySelector('[data-floor]').textContent = this.str('floor', '');
    const W = 800, H = 460;
    const svg = this.querySelector('[data-svg]');
    const exits = this._parse('exits');
    const routes = this._parse('routes');
    const alarms = this._parse('alarms');
    const px = (p) => (p / 100) * W;
    const py = (p) => (p / 100) * H;

    const exitsSvg = exits.map((e) => `
      <g>
        <rect class="bms-evac-exit" x="${px(e.x) - 10}" y="${py(e.y) - 10}" width="20" height="20" rx="3" />
        <text x="${px(e.x)}" y="${py(e.y) + 4}" text-anchor="middle" fill="white" font-family="var(--bms-font-mono)" font-size="11" font-weight="700">→</text>
        <text x="${px(e.x)}" y="${py(e.y) + 32}" text-anchor="middle" fill="var(--bms-text)" font-family="var(--bms-font)" font-size="11">${e.label || 'выход'}</text>
      </g>`).join('');

    const routesSvg = routes.map((r) => {
      const points = (r.points || []).map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(p[0]).toFixed(1)} ${py(p[1]).toFixed(1)}`).join(' ');
      return `<path class="bms-evac-route ${r.blocked ? 'is-blocked' : ''}" d="${points}" />`;
    }).join('');

    const alarmsSvg = alarms.map((a) => `
      <g>
        <circle cx="${px(a.x)}" cy="${py(a.y)}" r="14" class="bms-evac-alarm-icon" />
        <text x="${px(a.x)}" y="${py(a.y) + 4}" text-anchor="middle" fill="white" font-family="var(--bms-font-mono)" font-size="14" font-weight="700">!</text>
        <text x="${px(a.x)}" y="${py(a.y) + 32}" text-anchor="middle" fill="rgb(240,70,60)" font-family="var(--bms-font)" font-size="11" font-weight="600">${a.label || 'очаг'}</text>
      </g>`).join('');

    svg.innerHTML = `
      <rect x="20" y="20" width="${W - 40}" height="${H - 40}" fill="var(--bms-surface-2)" stroke="var(--bms-border)" stroke-width="2" />
      <line x1="${W * 0.34}" y1="20" x2="${W * 0.34}" y2="${H - 20}" stroke="var(--bms-border)" stroke-width="1.5" />
      <line x1="${W * 0.66}" y1="20" x2="${W * 0.66}" y2="${H - 20}" stroke="var(--bms-border)" stroke-width="1.5" />
      <line x1="20" y1="${H * 0.5}" x2="${W - 20}" y2="${H * 0.5}" stroke="var(--bms-border)" stroke-width="1.5" />
      ${routesSvg}
      ${exitsSvg}
      ${alarmsSvg}`;
  }
}

defineWidget('bms-evacuation-map', BmsEvacuationMap);
