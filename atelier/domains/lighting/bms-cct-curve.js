import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Daily CCT curve — 24-hour Human Centric Lighting schedule.
 * Shows current hour cursor and accent-coloured gradient along the curve.
 * Attrs: hours (JSON 24 values in K), current-cct (auto-detect time if absent),
 *   current-hour (override 0-24, can be fractional)
 */
export class BmsCctCurve extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'hours', 'current-cct', 'current-hour'];
  }

  _hours() {
    try {
      const arr = JSON.parse(this.str('hours', '[]'));
      if (Array.isArray(arr) && arr.length === 24) return arr;
    } catch {}
    return new Array(24).fill(3200);
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-cct-curve');
      this.setAttribute('accent', 'lighting-cct');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-mono"><span data-now>—</span> · <span data-cct>—</span> K</span>
        </div>
        <svg viewBox="0 0 720 200" data-svg></svg>
        <div class="bms-row bms-between bms-mono bms-muted" style="font-size: 11px;">
          <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const hours = this._hours();
    const W = 720, H = 200, PAD_T = 16, PAD_B = 32;
    const minK = 1800, maxK = 6500;
    const xAt = (h) => (h / 24) * W;
    const yAt = (k) => PAD_T + (1 - (k - minK) / (maxK - minK)) * (H - PAD_T - PAD_B);

    const now = this.hasAttribute('current-hour') ? this.num('current-hour', 12)
              : (() => { const d = new Date(); return d.getHours() + d.getMinutes() / 60; })();
    const currentCct = this.hasAttribute('current-cct') ? this.num('current-cct')
                     : this._interpolate(hours, now);
    this.querySelector('[data-label]').textContent = this.str('label', 'Кривая CCT (human-centric)');
    const hh = Math.floor(now).toString().padStart(2, '0');
    const mm = Math.round((now - Math.floor(now)) * 60).toString().padStart(2, '0');
    this.querySelector('[data-now]').textContent = `${hh}:${mm}`;
    this.querySelector('[data-cct]').textContent = Math.round(currentCct);
    this.setAttribute('value', String(Math.round(currentCct)));

    // Build path (interpolate every 0.5h for smoothness)
    const segments = [];
    for (let h = 0; h <= 24; h += 0.5) {
      const k = this._interpolate(hours, h);
      segments.push([xAt(h), yAt(k)]);
    }
    const path = segments.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

    // Y-axis labels
    let yAxis = '';
    for (const k of [2200, 3200, 4000, 5000, 6000]) {
      const y = yAt(k);
      yAxis += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="var(--bms-divider)" stroke-width="1" stroke-dasharray="2 4"/>`;
      yAxis += `<text x="6" y="${y - 2}" fill="var(--bms-text-muted)" font-family="var(--bms-font-mono)" font-size="10">${k}K</text>`;
    }

    const cursorX = xAt(now);
    const cursorY = yAt(currentCct);

    this.querySelector('[data-svg]').innerHTML = `
      ${yAxis}
      <path d="${path}" fill="none" stroke="rgb(var(--cr) var(--cg) var(--cb))" stroke-width="2.5"
        stroke-linejoin="round" stroke-linecap="round"
        style="filter: drop-shadow(0 0 6px rgb(var(--cr) var(--cg) var(--cb) / 0.6));" />
      <line x1="${cursorX}" y1="${PAD_T}" x2="${cursorX}" y2="${H - PAD_B}" stroke="var(--bms-text)" stroke-width="1.5" stroke-dasharray="3 3" />
      <circle cx="${cursorX}" cy="${cursorY}" r="6" fill="rgb(var(--cr) var(--cg) var(--cb))" stroke="var(--bms-bg)" stroke-width="2"
        style="filter: drop-shadow(0 0 8px rgb(var(--cr) var(--cg) var(--cb)));" />`;
  }

  _interpolate(hours, h) {
    const i = Math.floor(h) % 24;
    const next = (i + 1) % 24;
    const frac = h - Math.floor(h);
    return hours[i] + (hours[next] - hours[i]) * frac;
  }
}

defineWidget('bms-cct-curve', BmsCctCurve);
