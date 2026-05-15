import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

/**
 * Simplified psychrometric (d-x) chart: dry-bulb temperature vs humidity ratio.
 * Shows RH lines (20/40/60/80/100%), comfort zone, and plotted state points.
 * Attrs: points (JSON [{t (°C), rh (%), label, color?}]), comfort-zone (bool)
 */
export class BmsPsychrometricChart extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'points', 'comfort-zone'];
  }

  _points() { try { return JSON.parse(this.str('points', '[]')); } catch { return []; } }

  render() {
    if (!this._init) {
      this.classList.add('bms-psy');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label>d-x диаграмма</h3>
          <span class="bms-caption">температура · влагосодержание</span>
        </div>
        <svg class="bms-psy-svg" viewBox="0 0 720 420" data-svg></svg>
        <div class="bms-psy-legend" data-legend></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  // saturation pressure (kPa) for given T (°C), Magnus approximation
  _ps(t) { return 0.6108 * Math.exp((17.27 * t) / (t + 237.3)); }
  // humidity ratio (g/kg dry air) at given T, RH (%); atm = 101.325 kPa
  _w(t, rh) {
    const ps = this._ps(t);
    const pw = (rh / 100) * ps;
    return 1000 * 0.622 * pw / (101.325 - pw);
  }

  _reflect() {
    this.querySelector('[data-label]').textContent = this.str('label', 'd-x диаграмма');
    const svg = this.querySelector('[data-svg]');
    const W = 720, H = 420, PAD_L = 56, PAD_R = 24, PAD_T = 24, PAD_B = 48;
    const plotW = W - PAD_L - PAD_R, plotH = H - PAD_T - PAD_B;
    const tMin = 0, tMax = 40, wMin = 0, wMax = 30;
    const tx = (t) => PAD_L + ((t - tMin) / (tMax - tMin)) * plotW;
    const wy = (w) => PAD_T + (1 - (w - wMin) / (wMax - wMin)) * plotH;

    // RH lines (clipped to saturation)
    let rhLines = '';
    for (const rh of [20, 40, 60, 80, 100]) {
      let d = '';
      for (let t = tMin; t <= tMax; t += 1) {
        const w = Math.min(wMax, this._w(t, rh));
        d += (d ? ' L ' : 'M ') + `${tx(t).toFixed(1)} ${wy(w).toFixed(1)}`;
      }
      const cls = rh === 100 ? 'bms-psy-sat' : 'bms-psy-rh';
      rhLines += `<path class="${cls}" d="${d}" />`;
      // label
      const labelT = rh === 100 ? 32 : 38;
      const labelW = Math.min(wMax, this._w(labelT, rh));
      rhLines += `<text x="${tx(labelT) + 4}" y="${wy(labelW) - 2}" fill="${rh === 100 ? 'rgb(100,200,230)' : 'var(--bms-text-faint)'}" font-family="var(--bms-font-mono)" font-size="10">${rh}%</text>`;
    }

    // Comfort zone (~20-26°C, RH 30-60% — rough rectangle in w-t coords)
    let comfort = '';
    if (this.bool('comfort-zone') || !this.hasAttribute('comfort-zone')) {
      const c = [
        [20, this._w(20, 30)], [26, this._w(26, 30)],
        [26, this._w(26, 60)], [20, this._w(20, 60)],
      ];
      const d = c.map((p, i) => `${i === 0 ? 'M' : 'L'} ${tx(p[0]).toFixed(1)} ${wy(p[1]).toFixed(1)}`).join(' ') + ' Z';
      comfort = `<path class="bms-psy-comfort" d="${d}" />
        <text x="${tx(23)}" y="${wy(this._w(23, 45)) + 4}" text-anchor="middle" fill="rgb(110,210,140)" font-family="var(--bms-font)" font-size="10" font-weight="600">комфорт</text>`;
    }

    // Axis
    let axis = '';
    for (let t = tMin; t <= tMax; t += 5) {
      axis += `<line x1="${tx(t)}" y1="${PAD_T}" x2="${tx(t)}" y2="${H - PAD_B}" stroke="var(--bms-divider)" stroke-width="1" stroke-dasharray="1 4"/>`;
      axis += `<text x="${tx(t)}" y="${H - PAD_B + 16}" text-anchor="middle">${t}</text>`;
    }
    for (let w = 0; w <= wMax; w += 5) {
      axis += `<line x1="${PAD_L}" y1="${wy(w)}" x2="${W - PAD_R}" y2="${wy(w)}" stroke="var(--bms-divider)" stroke-width="1" stroke-dasharray="1 4"/>`;
      axis += `<text x="${PAD_L - 6}" y="${wy(w) + 3}" text-anchor="end">${w}</text>`;
    }
    axis += `<text x="${(PAD_L + W - PAD_R) / 2}" y="${H - 12}" text-anchor="middle" fill="var(--bms-text-muted)">температура, °C</text>`;
    axis += `<text x="14" y="${(PAD_T + H - PAD_B) / 2}" text-anchor="middle" transform="rotate(-90 14 ${(PAD_T + H - PAD_B) / 2})" fill="var(--bms-text-muted)">влагосодержание, г/кг с.в.</text>`;

    // Points
    const points = this._points();
    const ptsSvg = points.map((p) => {
      const w = this._w(p.t, p.rh);
      const color = p.color || 'rgb(255, 200, 110)';
      return `<g class="bms-psy-point">
        <circle cx="${tx(p.t).toFixed(1)}" cy="${wy(w).toFixed(1)}" r="6" fill="${color}" stroke="var(--bms-bg)" stroke-width="2" />
        <text x="${tx(p.t) + 10}" y="${wy(w) - 8}" fill="${color}" font-family="var(--bms-font)" font-size="11" font-weight="600">${p.label || ''}</text>
        <text x="${tx(p.t) + 10}" y="${wy(w) + 6}" fill="var(--bms-text-muted)" font-family="var(--bms-font-mono)" font-size="10">${p.t}°C · ${p.rh}%RH</text>
      </g>`;
    }).join('');

    svg.innerHTML = `<g class="bms-psy-axis">${axis}</g>${comfort}${rhLines}${ptsSvg}`;

    const legend = this.querySelector('[data-legend]');
    legend.innerHTML = points.map((p) =>
      `<span><span class="swatch" style="background:${p.color || 'rgb(255,200,110)'}"></span>${p.label || '—'}</span>`
    ).join('');
  }
}

defineWidget('bms-psychrometric-chart', BmsPsychrometricChart);
