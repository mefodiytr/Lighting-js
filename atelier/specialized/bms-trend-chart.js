import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

/**
 * Multi-trace time series chart.
 * Attrs: label, traces (JSON array of {label, color, data: [[t, v], ...]}),
 *   y-min, y-max, y-unit, x-format ('hour'|'day'|'index')
 */
export class BmsTrendChart extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'traces', 'y-min', 'y-max', 'y-unit', 'x-format'];
  }

  _traces() {
    try { return JSON.parse(this.str('traces', '[]')); } catch { return []; }
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-trend');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <div class="bms-trend-legend" data-legend></div>
        </div>
        <svg class="bms-trend-svg" viewBox="0 0 800 320" preserveAspectRatio="none" data-svg></svg>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    this.querySelector('[data-label]').textContent = this.str('label', 'Тренд');
    const traces = this._traces();
    if (!traces.length) return;

    // Determine extents
    const allXs = traces.flatMap((tr) => tr.data.map((d) => d[0]));
    const allYs = traces.flatMap((tr) => tr.data.map((d) => d[1]));
    const xMin = Math.min(...allXs), xMax = Math.max(...allXs);
    const yMin = this.hasAttribute('y-min') ? this.num('y-min') : Math.min(...allYs);
    const yMax = this.hasAttribute('y-max') ? this.num('y-max') : Math.max(...allYs);
    const yPad = (yMax - yMin) * 0.05 || 1;
    const yLo = yMin - yPad, yHi = yMax + yPad;

    const W = 800, H = 320, PAD_L = 48, PAD_R = 12, PAD_T = 12, PAD_B = 28;
    const plotW = W - PAD_L - PAD_R, plotH = H - PAD_T - PAD_B;

    const xToPx = (x) => PAD_L + ((x - xMin) / Math.max(1e-6, xMax - xMin)) * plotW;
    const yToPx = (y) => PAD_T + (1 - (y - yLo) / Math.max(1e-6, yHi - yLo)) * plotH;

    const svg = this.querySelector('[data-svg]');
    const unit = this.str('y-unit', '');
    const xfmt = this.str('x-format', 'index');

    // Build SVG content
    const grid = [];
    for (let i = 0; i <= 4; i++) {
      const y = PAD_T + (i / 4) * plotH;
      grid.push(`<line x1="${PAD_L}" y1="${y}" x2="${W - PAD_R}" y2="${y}" />`);
      const v = yHi - (i / 4) * (yHi - yLo);
      grid.push(`<text x="${PAD_L - 6}" y="${y + 3}" text-anchor="end">${v.toFixed(yHi - yLo < 10 ? 1 : 0)}${unit}</text>`);
    }
    const xTicks = [];
    for (let i = 0; i <= 6; i++) {
      const x = PAD_L + (i / 6) * plotW;
      const xVal = xMin + (i / 6) * (xMax - xMin);
      const lbl = xfmt === 'hour' ? `${Math.floor(xVal)}:00`
                : xfmt === 'day'  ? `${Math.floor(xVal)}д`
                : Math.round(xVal);
      xTicks.push(`<text x="${x}" y="${H - PAD_B + 16}" text-anchor="middle">${lbl}</text>`);
    }

    const paths = traces.map((tr) => {
      if (!tr.data.length) return '';
      const d = tr.data.map((pt, i) =>
        `${i === 0 ? 'M' : 'L'} ${xToPx(pt[0]).toFixed(2)} ${yToPx(pt[1]).toFixed(2)}`
      ).join(' ');
      const last = tr.data[tr.data.length - 1];
      const color = tr.color || 'currentColor';
      return `
        <path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"
          style="filter: drop-shadow(0 0 4px ${color});" />
        <circle cx="${xToPx(last[0]).toFixed(2)}" cy="${yToPx(last[1]).toFixed(2)}" r="3.5" fill="${color}"
          style="filter: drop-shadow(0 0 6px ${color});" />`;
    }).join('\n');

    svg.innerHTML = `
      <g class="bms-trend-grid">${grid.join('')}</g>
      <g class="bms-trend-axis">${xTicks.join('')}</g>
      <line x1="${PAD_L}" y1="${H - PAD_B}" x2="${W - PAD_R}" y2="${H - PAD_B}" stroke="var(--bms-border)" />
      <line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${H - PAD_B}" stroke="var(--bms-border)" />
      ${paths}`;

    // Legend
    const legend = this.querySelector('[data-legend]');
    legend.innerHTML = '';
    for (const tr of traces) {
      const sp = document.createElement('span');
      sp.innerHTML = `<span class="dot" style="background: ${tr.color}"></span>${tr.label}`;
      legend.append(sp);
    }
  }
}

defineWidget('bms-trend-chart', BmsTrendChart);
