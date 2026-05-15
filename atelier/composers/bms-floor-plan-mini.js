import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

const STATUS_COLOR = {
  ok:       'rgb(110, 210, 140)',
  warning:  'rgb(255, 200, 110)',
  alarm:    'rgb(255, 130, 70)',
  critical: 'rgb(240, 70, 60)',
  offline:  'rgb(130, 140, 150)',
};

/**
 * Mini floor plan with status hotspots.
 * Attrs: label
 * Hotspots passed via `hotspots` attr as JSON array of {id, x%, y%, label, status}
 */
export class BmsFloorPlanMini extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'hotspots', 'floor'];
  }

  _hotspots() {
    try { return JSON.parse(this.str('hotspots', '[]')); } catch { return []; }
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-floor');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-caption" data-floor></span>
        </div>
        <svg viewBox="0 0 600 360" data-svg></svg>
        <div class="bms-floor-legend">
          <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:rgb(110,210,140);margin-right:4px;"></span>норма</span>
          <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:rgb(255,200,110);margin-right:4px;"></span>предупреждение</span>
          <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:rgb(240,70,60);margin-right:4px;"></span>авария</span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    this.querySelector('[data-label]').textContent = this.str('label', 'План этажа');
    this.querySelector('[data-floor]').textContent = this.str('floor', '');
    const svg = this.querySelector('[data-svg]');
    svg.innerHTML = `
      <rect x="10" y="10" width="580" height="340" fill="var(--bms-surface-2)" stroke="var(--bms-border)" stroke-width="2" />
      <line x1="200" y1="10" x2="200" y2="350" stroke="var(--bms-border)" stroke-width="1.5" />
      <line x1="400" y1="10" x2="400" y2="350" stroke="var(--bms-border)" stroke-width="1.5" />
      <line x1="10" y1="180" x2="590" y2="180" stroke="var(--bms-border)" stroke-width="1.5" />
      <text x="105" y="100" fill="var(--bms-text-faint)" font-family="var(--bms-font)" font-size="11" text-anchor="middle">Кабинеты A</text>
      <text x="300" y="100" fill="var(--bms-text-faint)" font-family="var(--bms-font)" font-size="11" text-anchor="middle">Open space</text>
      <text x="495" y="100" fill="var(--bms-text-faint)" font-family="var(--bms-font)" font-size="11" text-anchor="middle">Серверная</text>
      <text x="105" y="270" fill="var(--bms-text-faint)" font-family="var(--bms-font)" font-size="11" text-anchor="middle">Переговорки</text>
      <text x="300" y="270" fill="var(--bms-text-faint)" font-family="var(--bms-font)" font-size="11" text-anchor="middle">Кафе</text>
      <text x="495" y="270" fill="var(--bms-text-faint)" font-family="var(--bms-font)" font-size="11" text-anchor="middle">ИТП</text>`;
    for (const h of this._hotspots()) {
      const x = (h.x / 100) * 600;
      const y = (h.y / 100) * 360;
      const color = STATUS_COLOR[h.status] || STATUS_COLOR.offline;
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'bms-floor-hotspot');
      g.innerHTML = `
        <circle cx="${x}" cy="${y}" r="9" fill="${color}" opacity="0.25" />
        <circle cx="${x}" cy="${y}" r="5" fill="${color}"
          style="filter: drop-shadow(0 0 6px ${color});" />
        <text x="${x + 12}" y="${y + 4}" fill="var(--bms-text)" font-family="var(--bms-font)" font-size="11">${h.label}</text>`;
      g.addEventListener('click', () => this.emit('hotspot-click', h));
      svg.append(g);
    }
  }
}

defineWidget('bms-floor-plan-mini', BmsFloorPlanMini);
