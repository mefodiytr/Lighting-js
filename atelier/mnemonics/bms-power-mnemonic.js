import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

/**
 * Power distribution mnemonic — substation transformer → main switchboard →
 * ATS → distribution panels, with generator backup.
 * Attrs: name, tag, main-volt, gen-running, ats-source (main/gen/off),
 *   tp-load (0-100), panels (JSON [{id, label, load, state}]), alarm
 */
export class BmsPowerMnemonic extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'name', 'tag', 'main-volt',
      'gen-running', 'ats-source', 'tp-load', 'panels', 'status'];
  }

  _panels() {
    try { return JSON.parse(this.str('panels', '[]')); } catch { return []; }
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-mimic');
      this.setAttribute('accent', 'power-load');
      this.innerHTML = `
        <header class="bms-mimic-head">
          <div>
            <h3 class="bms-mimic-title" data-name>Распределение электроэнергии</h3>
            <div class="bms-caption" data-tag></div>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </header>

        <div class="bms-mimic-stage">
          <svg viewBox="0 0 800 280" style="width: 100%; display: block;" data-svg></svg>
        </div>

        <div class="bms-mimic-stats" data-stats></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const mainVolt = this.num('main-volt', 0);
    const genRun = this.bool('gen-running');
    const atsSrc = this.str('ats-source', 'main');
    const tpLoad = this.num('tp-load', 0);
    const panels = this._panels();
    this.querySelector('[data-name]').textContent = this.str('name', 'Электрика');
    this.querySelector('[data-tag]').textContent = this.str('tag', '');

    const W = 800;
    let svg = '';
    // Grid input (left)
    svg += `<text x="30" y="40" font-family="var(--bms-font-mono)" font-size="11" fill="var(--bms-text-muted)">сеть 10 кВ</text>`;
    svg += `<rect x="20" y="50" width="40" height="40" fill="var(--bms-surface-2)" stroke="${mainVolt > 0 ? 'rgb(110, 210, 140)' : 'rgb(240, 70, 60)'}" stroke-width="2" />`;
    svg += `<text x="40" y="76" text-anchor="middle" font-family="var(--bms-font-mono)" font-size="12" fill="var(--bms-text)">${mainVolt > 0 ? '~' : '×'}</text>`;
    svg += `<text x="40" y="106" text-anchor="middle" font-family="var(--bms-font-mono)" font-size="11" fill="var(--bms-text-muted)">${mainVolt} V</text>`;

    // Transformer (center-left)
    const trafoX = 160;
    svg += `<line x1="60" y1="70" x2="${trafoX}" y2="70" stroke="${mainVolt > 0 ? 'rgb(var(--cr) var(--cg) var(--cb))' : 'var(--bms-text-faint)'}" stroke-width="3" />`;
    svg += `<circle cx="${trafoX + 12}" cy="70" r="14" fill="var(--bms-surface)" stroke="var(--bms-text)" stroke-width="1.5" />`;
    svg += `<circle cx="${trafoX + 28}" cy="70" r="14" fill="var(--bms-surface)" stroke="var(--bms-text)" stroke-width="1.5" />`;
    svg += `<text x="${trafoX + 20}" y="50" text-anchor="middle" font-family="var(--bms-font-mono)" font-size="10" fill="var(--bms-text-muted)">TP-101</text>`;
    svg += `<text x="${trafoX + 20}" y="100" text-anchor="middle" font-family="var(--bms-font-mono)" font-size="11" fill="var(--bms-text)">${Math.round(tpLoad)}%</text>`;

    // Generator (bottom-left)
    const genX = 160, genY = 200;
    svg += `<rect x="${genX}" y="${genY - 24}" width="80" height="48" fill="var(--bms-surface-2)" stroke="${genRun ? 'rgb(110, 210, 140)' : 'var(--bms-border)'}" stroke-width="2" />`;
    svg += `<text x="${genX + 40}" y="${genY + 4}" text-anchor="middle" font-family="var(--bms-font-mono)" font-size="16" font-weight="700" fill="${genRun ? 'rgb(110, 210, 140)' : 'var(--bms-text-muted)'}">ДГУ</text>`;
    svg += `<text x="${genX + 40}" y="${genY - 30}" text-anchor="middle" font-family="var(--bms-font-mono)" font-size="11" fill="var(--bms-text-muted)">резерв</text>`;

    // ATS (center)
    const atsX = 360;
    svg += `<line x1="${trafoX + 42}" y1="70" x2="${atsX}" y2="70" stroke="${atsSrc === 'main' ? 'rgb(var(--cr) var(--cg) var(--cb))' : 'var(--bms-text-faint)'}" stroke-width="3" />`;
    svg += `<line x1="${genX + 80}" y1="${genY}" x2="${atsX}" y2="${genY}" stroke="${genRun && atsSrc === 'gen' ? 'rgb(var(--cr) var(--cg) var(--cb))' : 'var(--bms-text-faint)'}" stroke-width="3" />`;
    svg += `<line x1="${atsX}" y1="${genY}" x2="${atsX}" y2="70" stroke="${atsSrc === 'gen' ? 'rgb(var(--cr) var(--cg) var(--cb))' : 'var(--bms-text-faint)'}" stroke-width="3" />`;
    svg += `<rect x="${atsX - 10}" y="${atsSrc === 'main' ? 60 : 130}" width="80" height="20" fill="var(--bms-surface-2)" stroke="rgb(var(--cr) var(--cg) var(--cb))" stroke-width="1.5" />`;
    svg += `<text x="${atsX + 30}" y="${atsSrc === 'main' ? 74 : 144}" text-anchor="middle" font-family="var(--bms-font-mono)" font-size="11" font-weight="700" fill="var(--bms-text)">АВР · ${atsSrc}</text>`;

    // Main switchboard (right of ATS)
    const sbX = 500;
    const sbY = atsSrc === 'main' ? 70 : 140;
    svg += `<line x1="${atsX + 70}" y1="${sbY}" x2="${sbX}" y2="${sbY}" stroke="rgb(var(--cr) var(--cg) var(--cb))" stroke-width="3" />`;
    svg += `<line x1="${sbX}" y1="${sbY}" x2="${sbX}" y2="50" stroke="rgb(var(--cr) var(--cg) var(--cb))" stroke-width="3" />`;
    svg += `<line x1="${sbX}" y1="${sbY}" x2="${sbX}" y2="${Math.max(sbY, 200)}" stroke="rgb(var(--cr) var(--cg) var(--cb))" stroke-width="3" />`;
    svg += `<text x="${sbX + 8}" y="40" font-family="var(--bms-font-mono)" font-size="11" fill="var(--bms-text-muted)">ГРЩ</text>`;

    // Panels (right side)
    const pY0 = 40;
    panels.forEach((p, i) => {
      const x = sbX + 60;
      const y = pY0 + i * 50;
      const active = p.state === 'closed';
      svg += `<line x1="${sbX}" y1="${y + 16}" x2="${x}" y2="${y + 16}" stroke="${active ? 'rgb(var(--cr) var(--cg) var(--cb))' : 'var(--bms-text-faint)'}" stroke-width="2" />`;
      svg += `<rect x="${x}" y="${y}" width="220" height="32" rx="2" fill="var(--bms-surface)" stroke="${active ? 'rgb(var(--cr) var(--cg) var(--cb) / 0.5)' : 'var(--bms-border)'}" stroke-width="1.5" />`;
      svg += `<text x="${x + 10}" y="${y + 14}" font-family="var(--bms-font)" font-size="12" font-weight="600" fill="var(--bms-text)">${p.label || p.id}</text>`;
      svg += `<text x="${x + 10}" y="${y + 28}" font-family="var(--bms-font-mono)" font-size="11" fill="var(--bms-text-muted)">${p.load || 0}% · ${p.state || 'open'}</text>`;
    });

    this.querySelector('[data-svg]').innerHTML = svg;

    const status = this.str('status', atsSrc === 'off' ? 'critical' : atsSrc === 'gen' ? 'warning' : 'ok');
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', status);
    dot.setAttribute('label', atsSrc === 'gen' ? 'на ДГУ' : atsSrc === 'main' ? 'от сети' : 'нет питания');
    this.setAttribute('value', String(tpLoad));

    const stats = this.querySelector('[data-stats]');
    stats.innerHTML = '';
    const items = [
      ['Источник',  atsSrc === 'main' ? 'сеть' : atsSrc === 'gen' ? 'ДГУ' : 'нет'],
      ['ТП нагрузка', `${Math.round(tpLoad)} %`],
      ['ДГУ',         genRun ? 'работает' : 'резерв'],
      ['Щитов',      `${panels.filter(p => p.state === 'closed').length} / ${panels.length}`],
    ];
    for (const [l, v] of items) {
      const cell = document.createElement('div');
      cell.className = 'bms-mimic-stat';
      cell.innerHTML = `<div class="l">${l}</div><div class="v">${v}</div>`;
      stats.append(cell);
    }
  }
}

defineWidget('bms-power-mnemonic', BmsPowerMnemonic);
