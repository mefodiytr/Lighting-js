import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Sun tracker — arc with sun position based on time + recommendation.
 * Attrs: label, hour (0-24, fractional), elevation (0-90°), azimuth (0-360°),
 *   recommended-position (0-100%)
 */
export class BmsSunTracker extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'hour', 'elevation', 'azimuth', 'recommended-position'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-sun-tracker');
      this.setAttribute('accent', 'lighting-cct');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-mono" data-time></span>
        </div>
        <div class="bms-sun-arc">
          <svg viewBox="0 0 300 120">
            <path d="M 10 110 A 140 140 0 0 1 290 110"
              fill="none" stroke="var(--bms-border)" stroke-width="1.5" stroke-dasharray="4 6" />
            <line x1="10" y1="110" x2="290" y2="110" stroke="var(--bms-text-faint)" stroke-width="1" />
            <circle class="bms-sun-dot" r="10" data-sun cx="150" cy="50" />
          </svg>
        </div>
        <div class="bms-row bms-between" style="font-size: 12px;">
          <span class="bms-muted">высота <span class="bms-mono bms-text" data-elev>—</span>°</span>
          <span class="bms-muted">азимут <span class="bms-mono bms-text" data-azim>—</span>°</span>
          <span class="bms-muted">рек. позиция <span class="bms-mono bms-text" data-rec>—</span>%</span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const hour = this.num('hour', 12);
    const elev = this.num('elevation', 0);
    const azim = this.num('azimuth', 180);
    const rec = this.num('recommended-position', 50);
    this.querySelector('[data-label]').textContent = this.str('label', 'Положение солнца');
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    this.querySelector('[data-time]').textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    this.querySelector('[data-elev]').textContent = elev.toFixed(0);
    this.querySelector('[data-azim]').textContent = azim.toFixed(0);
    this.querySelector('[data-rec]').textContent = rec.toFixed(0);
    // map hour 6-18 to x 10-290, elevation 0-90 to y 110-(110 - 100 * sin)
    const t = Math.max(0, Math.min(1, (hour - 6) / 12));
    const cx = 10 + t * 280;
    const cy = 110 - Math.sin(t * Math.PI) * 90;
    const sun = this.querySelector('[data-sun]');
    sun.setAttribute('cx', cx.toFixed(1));
    sun.setAttribute('cy', cy.toFixed(1));
    this.setAttribute('value', String(rec));
    this.classList.toggle('is-active', elev > 0);
  }
}

defineWidget('bms-sun-tracker', BmsSunTracker);
