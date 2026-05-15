import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

/**
 * Chiller cycle mnemonic — refrigeration loop visualization.
 * Compressor → Condenser → Expansion valve → Evaporator → back to compressor
 * Attrs: name, tag, load, cop, mode (cooling/standby/fault), in-temp, out-temp,
 *   cond-in, cond-out, valve-position, pump-state
 */
export class BmsChillerMnemonic extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'name', 'tag', 'load', 'cop', 'mode',
      'in-temp', 'out-temp', 'cond-in', 'cond-out', 'valve-position', 'pump-state'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-mimic');
      this.setAttribute('accent', 'power-load');
      this.innerHTML = `
        <header class="bms-mimic-head">
          <div>
            <h3 class="bms-mimic-title" data-name>Холодильная установка</h3>
            <div class="bms-caption" data-tag></div>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </header>

        <div class="bms-mimic-stage">
          <svg viewBox="0 0 540 280" style="width: 100%; max-width: 540px; display: block; margin: 0 auto;" xmlns="http://www.w3.org/2000/svg">
            <!-- Condenser (top) -->
            <rect x="120" y="20" width="300" height="60" rx="6"
              fill="var(--bms-surface-2)" stroke="rgb(255,130,80)" stroke-width="2" data-cond-rect />
            <text x="270" y="46" text-anchor="middle" font-family="var(--bms-font)" font-size="12" fill="var(--bms-text)">Конденсатор</text>
            <text x="270" y="64" text-anchor="middle" font-family="var(--bms-font-mono)" font-size="11" fill="var(--bms-text-muted)" data-cond-temp>—</text>

            <!-- Evaporator (bottom) -->
            <rect x="120" y="200" width="300" height="60" rx="6"
              fill="var(--bms-surface-2)" stroke="rgb(100,200,230)" stroke-width="2" data-evap-rect />
            <text x="270" y="226" text-anchor="middle" font-family="var(--bms-font)" font-size="12" fill="var(--bms-text)">Испаритель</text>
            <text x="270" y="244" text-anchor="middle" font-family="var(--bms-font-mono)" font-size="11" fill="var(--bms-text-muted)" data-evap-temp>—</text>

            <!-- Right side pipes + expansion valve -->
            <path d="M 420 80 L 460 80 L 460 200 L 420 200" stroke="rgb(180,200,220)" stroke-width="3" fill="none" stroke-linecap="round" data-r-pipe />
            <circle cx="460" cy="140" r="14" fill="var(--bms-surface)" stroke="var(--bms-text)" stroke-width="1.5" data-valve-c />
            <path d="M 454 134 L 466 146 M 466 134 L 454 146" stroke="var(--bms-text)" stroke-width="1.5" data-valve-x />
            <text x="492" y="144" font-family="var(--bms-font-mono)" font-size="10" fill="var(--bms-text-muted)">TXV</text>

            <!-- Left side pipes + compressor -->
            <path d="M 120 200 L 80 200 L 80 80 L 120 80" stroke="rgb(180,200,220)" stroke-width="3" fill="none" stroke-linecap="round" data-l-pipe />
            <circle cx="80" cy="140" r="22" fill="var(--bms-surface)" stroke="var(--bms-text)" stroke-width="1.5" data-comp-c />
            <circle cx="80" cy="140" r="14" fill="var(--bms-surface-2)" data-comp-c2 />
            <text x="80" y="144" text-anchor="middle" font-family="var(--bms-font-mono)" font-size="11" fill="var(--bms-text)" font-weight="600">C</text>
            <text x="44" y="144" text-anchor="end" font-family="var(--bms-font-mono)" font-size="10" fill="var(--bms-text-muted)">компр.</text>

            <!-- Flow arrows on pipes -->
            <g data-flow-arrows opacity="0">
              <path d="M 90 140 L 86 134 M 90 140 L 86 146" stroke="rgb(var(--cr) var(--cg) var(--cb))" stroke-width="2" stroke-linecap="round" />
              <path d="M 270 84 L 264 80 M 270 84 L 264 88" stroke="rgb(255,130,80)" stroke-width="2" stroke-linecap="round" />
              <path d="M 462 144 L 458 140 M 462 144 L 458 148" stroke="rgb(180,200,220)" stroke-width="2" stroke-linecap="round" />
              <path d="M 270 256 L 276 252 M 270 256 L 276 260" stroke="rgb(100,200,230)" stroke-width="2" stroke-linecap="round" />
            </g>
          </svg>
        </div>

        <div class="bms-mimic-stats" data-stats></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const load = this.num('load', 0);
    const cop = this.str('cop', '—');
    const mode = this.str('mode', 'standby');
    const inT = this.str('in-temp', '—');
    const outT = this.str('out-temp', '—');
    const condIn = this.str('cond-in', '—');
    const condOut = this.str('cond-out', '—');

    this.querySelector('[data-name]').textContent = this.str('name', 'Чиллер');
    this.querySelector('[data-tag]').textContent  = this.str('tag', '');
    this.querySelector('[data-evap-temp]').textContent = `вход ${inT}°C → выход ${outT}°C`;
    this.querySelector('[data-cond-temp]').textContent = `вход ${condIn}°C → выход ${condOut}°C`;

    const active = mode === 'cooling';
    const status = mode === 'fault' ? 'critical' : active ? 'ok' : 'offline';
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', status);
    dot.setAttribute('label', mode);
    if (active) dot.setAttribute('pulsing', ''); else dot.removeAttribute('pulsing');

    // animate flow arrows only when cooling
    this.querySelector('[data-flow-arrows]').setAttribute('opacity', active ? '1' : '0.2');

    // highlight cycle elements
    const tone = (active ? '1' : '0.45');
    for (const sel of ['[data-cond-rect]', '[data-evap-rect]', '[data-r-pipe]', '[data-l-pipe]', '[data-comp-c]', '[data-comp-c2]', '[data-valve-c]', '[data-valve-x]']) {
      const el = this.querySelector(sel);
      if (el) el.setAttribute('opacity', tone);
    }
    this.setAttribute('value', String(load));

    const stats = this.querySelector('[data-stats]');
    stats.innerHTML = '';
    const items = [
      ['Нагрузка',     `${load} %`],
      ['COP',          cop],
      ['Контур охл.',  `${inT} → ${outT} °C`],
      ['Контур конд.', `${condIn} → ${condOut} °C`],
      ['Режим',        mode],
    ];
    for (const [l, v] of items) {
      const cell = document.createElement('div');
      cell.className = 'bms-mimic-stat';
      cell.innerHTML = `<div class="l">${l}</div><div class="v">${v}</div>`;
      stats.append(cell);
    }
  }
}

defineWidget('bms-chiller-mnemonic', BmsChillerMnemonic);
