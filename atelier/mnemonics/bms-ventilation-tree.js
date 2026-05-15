import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

/**
 * Ventilation distribution tree — AHU trunk with branches to zones.
 * Attrs: name, ahu-flow (m³/h), supply-temp (°C),
 *   zones (JSON [{id, label, flow, damper, temp}])
 */
export class BmsVentilationTree extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'name', 'tag', 'ahu-flow', 'supply-temp', 'zones', 'status'];
  }

  _zones() {
    try { return JSON.parse(this.str('zones', '[]')); } catch { return []; }
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-mimic');
      this.setAttribute('accent', 'hvac-temperature');
      this.innerHTML = `
        <header class="bms-mimic-head">
          <div>
            <h3 class="bms-mimic-title" data-name>Дерево вентиляции</h3>
            <div class="bms-caption" data-tag></div>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </header>
        <div class="bms-mimic-stage">
          <svg viewBox="0 0 800 360" style="width:100%;display:block;" data-svg></svg>
        </div>
        <div class="bms-mimic-stats" data-stats></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const zones = this._zones();
    const flow = this.num('ahu-flow', 0);
    const sup = this.num('supply-temp', 0);
    this.querySelector('[data-name]').textContent = this.str('name', 'Вентиляция');
    this.querySelector('[data-tag]').textContent = this.str('tag', '');

    const W = 800, H = 360;
    const TRUNK_Y = 80;
    const trunkX1 = 80, trunkX2 = W - 80;
    const trunkLen = trunkX2 - trunkX1;

    let parts = `
      <text x="20" y="${TRUNK_Y + 5}" font-family="var(--bms-font-mono)" font-size="11" fill="var(--bms-text-muted)">АХУ</text>
      <rect x="60" y="${TRUNK_Y - 12}" width="14" height="24" fill="var(--bms-surface-2)" stroke="var(--bms-border)" stroke-width="1.5" />
      <rect x="${trunkX1}" y="${TRUNK_Y - 6}" width="${trunkLen}" height="12" fill="var(--bms-surface-2)" stroke="var(--bms-border)" />
      <path class="bms-evac-route" d="M ${trunkX1 + 8} ${TRUNK_Y} L ${trunkX2 - 8} ${TRUNK_Y}" stroke="rgb(var(--cr) var(--cg) var(--cb))" stroke-width="2" fill="none"
        stroke-dasharray="6 6" style="animation: bms-conn-march 1.5s linear infinite;" />
      <text x="${trunkX1 + 20}" y="${TRUNK_Y - 14}" font-family="var(--bms-font-mono)" font-size="11" fill="var(--bms-text)">приток ${Math.round(flow)} м³/ч · ${sup.toFixed(0)}°C</text>
    `;

    if (zones.length > 0) {
      const stepX = trunkLen / Math.max(1, zones.length);
      zones.forEach((z, i) => {
        const x = trunkX1 + stepX * (i + 0.5);
        const branchY = TRUNK_Y + 16;
        const zoneY = TRUNK_Y + 100;
        const damper = z.damper ?? 100;
        const damperPct = Math.max(0, Math.min(100, damper));
        const flowing = damperPct > 5;
        const damperColor = flowing ? 'rgb(var(--cr) var(--cg) var(--cb))' : 'var(--bms-text-faint)';
        // Branch line
        parts += `<line x1="${x}" y1="${branchY}" x2="${x}" y2="${zoneY - 20}"
          stroke="${flowing ? 'rgb(var(--cr) var(--cg) var(--cb))' : 'var(--bms-border)'}"
          stroke-width="3" stroke-linecap="round" ${flowing ? 'stroke-dasharray="4 4" style="animation: bms-conn-march 1.5s linear infinite;"' : ''} />`;
        // Damper indicator
        parts += `<circle cx="${x}" cy="${(branchY + zoneY) / 2}" r="9" fill="var(--bms-surface)" stroke="${damperColor}" stroke-width="2" />`;
        parts += `<line x1="${x - 5}" y1="${(branchY + zoneY) / 2}" x2="${x + 5}" y2="${(branchY + zoneY) / 2}"
          stroke="${damperColor}" stroke-width="2" stroke-linecap="round"
          transform="rotate(${(1 - damperPct / 100) * 90} ${x} ${(branchY + zoneY) / 2})" />`;
        // Zone box
        parts += `<rect x="${x - 50}" y="${zoneY - 20}" width="100" height="80" rx="4"
          fill="var(--bms-surface)" stroke="${flowing ? 'rgb(var(--cr) var(--cg) var(--cb) / 0.5)' : 'var(--bms-border)'}" stroke-width="1.5" />`;
        parts += `<text x="${x}" y="${zoneY}" text-anchor="middle" font-family="var(--bms-font)" font-size="12" font-weight="600" fill="var(--bms-text)">${z.label || z.id}</text>`;
        parts += `<text x="${x}" y="${zoneY + 18}" text-anchor="middle" font-family="var(--bms-font-mono)" font-size="11" fill="var(--bms-text-muted)">${Math.round(z.flow || 0)} м³/ч</text>`;
        parts += `<text x="${x}" y="${zoneY + 34}" text-anchor="middle" font-family="var(--bms-font-mono)" font-size="11" fill="var(--bms-text-muted)">${(z.temp || sup).toFixed(1)}°C</text>`;
        parts += `<text x="${x}" y="${zoneY + 50}" text-anchor="middle" font-family="var(--bms-font-mono)" font-size="10" fill="${flowing ? 'rgb(var(--cr) var(--cg) var(--cb))' : 'var(--bms-text-faint)'}">${damperPct}% damper</text>`;
      });
    }

    this.querySelector('[data-svg]').innerHTML = parts;

    const totalFlow = zones.reduce((a, z) => a + (z.flow || 0), 0);
    const status = this.str('status', flow > 0 ? 'ok' : 'offline');
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', status);
    dot.setAttribute('label', status === 'ok' ? 'работает' : 'выкл');

    const stats = this.querySelector('[data-stats]');
    stats.innerHTML = '';
    const items = [
      ['Приток (магистраль)', `${Math.round(flow)} м³/ч`],
      ['Сумма по зонам',      `${Math.round(totalFlow)} м³/ч`],
      ['Подача T',            `${sup.toFixed(1)} °C`],
      ['Зон',                 `${zones.length}`],
    ];
    for (const [l, v] of items) {
      const cell = document.createElement('div');
      cell.className = 'bms-mimic-stat';
      cell.innerHTML = `<div class="l">${l}</div><div class="v">${v}</div>`;
      stats.append(cell);
    }
  }
}

defineWidget('bms-ventilation-tree', BmsVentilationTree);
