import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const KIND_LABEL = {
  pir:        'PIR (ИК)',
  microwave:  'микроволновой',
  ultrasonic: 'ультразвуковой',
  pir_us:     'двойной (PIR+US)',
};

/**
 * Occupancy / motion sensor.
 * Attrs: label, kind (pir/microwave/ultrasonic/pir_us), occupied (bool),
 *   last-motion (time str), sensitivity (1-10), hold-time (seconds)
 */
export class BmsOccupancySensor extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'kind', 'occupied', 'last-motion', 'sensitivity', 'hold-time'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-occ');
      this.setAttribute('accent', 'alarm-level');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption" data-kind>—</span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>
        <div class="bms-occ-icon" data-icon>👤</div>
        <div class="bms-row bms-between bms-mono" style="font-size: 12px;">
          <span class="bms-muted">последнее движение</span>
          <span data-last>—</span>
        </div>
        <div class="bms-row bms-between bms-mono" style="font-size: 11px; color: var(--bms-text-muted);">
          <span>чувств. <span class="bms-text" data-sens>—</span>/10</span>
          <span>hold <span class="bms-text" data-hold>—</span> сек</span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const kind = this.str('kind', 'pir');
    const occupied = this.bool('occupied');
    this.querySelector('[data-label]').textContent = this.str('label', 'Датчик присутствия');
    this.querySelector('[data-kind]').textContent = KIND_LABEL[kind] || kind;
    this.querySelector('[data-icon]').textContent = occupied ? '👤' : '○';
    this.querySelector('[data-last]').textContent = this.str('last-motion', '—');
    this.querySelector('[data-sens]').textContent = this.num('sensitivity', 5);
    this.querySelector('[data-hold]').textContent = this.num('hold-time', 300);
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', occupied ? 'ok' : 'offline');
    dot.setAttribute('label', occupied ? 'присутствие' : 'свободно');
    this.classList.toggle('is-occupied', occupied);
    this.classList.toggle('is-active', occupied);
    this.setAttribute('value', occupied ? '1' : '0');
  }
}

defineWidget('bms-occupancy-sensor', BmsOccupancySensor);
