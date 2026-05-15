import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Three-way mixing valve — position 0 = port A→C, 100 = port B→C.
 * Shows mixing ratio with arrows + colour bands.
 * Attrs: label, position (0-100), a-label, b-label, c-label, state
 */
export class BmsThreeWayValve extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'position', 'a-label', 'b-label', 'c-label', 'state'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'hvac-temperature');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-pill" data-state></span>
        </div>

        <svg class="bms-tway-svg" viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
          <!-- Port A (top) -->
          <text x="60" y="14" text-anchor="middle" font-size="11" fill="var(--bms-text)" font-family="var(--bms-font-mono)" data-a-label>A</text>
          <rect x="50" y="18" width="20" height="30" fill="var(--bms-surface-2)" stroke="var(--bms-border)" />
          <line x1="60" y1="48" x2="60" y2="60" stroke="rgb(255,130,80)" stroke-width="6" stroke-linecap="round" data-a-arrow />

          <!-- Port B (top right) -->
          <text x="180" y="14" text-anchor="middle" font-size="11" fill="var(--bms-text)" font-family="var(--bms-font-mono)" data-b-label>B</text>
          <rect x="170" y="18" width="20" height="30" fill="var(--bms-surface-2)" stroke="var(--bms-border)" />
          <line x1="180" y1="48" x2="180" y2="60" stroke="rgb(120,180,220)" stroke-width="6" stroke-linecap="round" data-b-arrow />

          <!-- Valve body -->
          <circle cx="120" cy="64" r="22" fill="var(--bms-surface-2)" stroke="var(--bms-border)" stroke-width="1.5" />
          <path d="M 100 64 L 140 64 M 120 44 L 120 84" stroke="var(--bms-border)" stroke-width="1" stroke-dasharray="3 3" />
          <circle cx="120" cy="64" r="8" fill="var(--bms-text)" />

          <!-- Connection lines from A/B to valve -->
          <line x1="60" y1="60" x2="60" y2="64" stroke="rgb(255,130,80)" stroke-width="6" />
          <line x1="60" y1="64" x2="98" y2="64" stroke="rgb(255,130,80)" stroke-width="6" data-pipe-a opacity="0.5" />
          <line x1="180" y1="60" x2="180" y2="64" stroke="rgb(120,180,220)" stroke-width="6" />
          <line x1="180" y1="64" x2="142" y2="64" stroke="rgb(120,180,220)" stroke-width="6" data-pipe-b opacity="0.5" />

          <!-- Port C (bottom out) -->
          <line x1="120" y1="86" x2="120" y2="100" stroke="rgb(180,160,140)" stroke-width="6" data-pipe-c />
          <rect x="110" y="100" width="20" height="14" fill="var(--bms-surface-2)" stroke="var(--bms-border)" />
          <text x="120" y="118" text-anchor="middle" font-size="11" fill="var(--bms-text)" font-family="var(--bms-font-mono)" data-c-label>C →</text>
        </svg>

        <bms-horizontal-slider data-slider min="0" max="100" step="1" unit="%" label="смешивание B/(A+B)" accent="hvac-temperature"></bms-horizontal-slider>`;
      this.querySelector('[data-slider]').addEventListener('change', (e) => {
        this.setAttribute('position', String(e.detail.value));
        this.emit('position-change', { position: e.detail.value });
      });
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const pos = this.num('position', 0);
    this.querySelector('[data-label]').textContent = this.str('label', 'Трёхходовой клапан');
    this.querySelector('[data-a-label]').textContent = this.str('a-label', 'A');
    this.querySelector('[data-b-label]').textContent = this.str('b-label', 'B');
    this.querySelector('[data-c-label]').textContent = this.str('c-label', 'C →');
    this.querySelector('[data-slider]').setAttribute('value', String(pos));
    // pos 0 → A flow only, pos 100 → B flow only
    const aFrac = 1 - pos / 100;
    const bFrac = pos / 100;
    this.querySelector('[data-pipe-a]').setAttribute('opacity', (0.15 + 0.85 * aFrac).toFixed(2));
    this.querySelector('[data-pipe-b]').setAttribute('opacity', (0.15 + 0.85 * bFrac).toFixed(2));
    // mixed C color based on position
    const r = Math.round(255 * aFrac + 120 * bFrac);
    const g = Math.round(130 * aFrac + 180 * bFrac);
    const b = Math.round(80 * aFrac + 220 * bFrac);
    this.querySelector('[data-pipe-c]').setAttribute('stroke', `rgb(${r},${g},${b})`);

    const state = this.str('state', pos === 0 ? 'A→C' : pos === 100 ? 'B→C' : 'смешивание');
    const pill = this.querySelector('[data-state]');
    pill.textContent = state;
    pill.classList.toggle('is-active', true);
    this.classList.toggle('is-active', true);
    this.setAttribute('value', String(pos));
  }
}

defineWidget('bms-three-way-valve', BmsThreeWayValve);
