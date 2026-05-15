import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const STATE_LABELS = {
  normal:    { label: 'НОРМА',         status: 'ok' },
  'pre-alarm': { label: 'ПРЕ-ТРЕВОГА', status: 'warning' },
  alarm:     { label: 'ПОЖАР',         status: 'critical' },
  fault:     { label: 'НЕИСПРАВНОСТЬ', status: 'warning' },
  test:      { label: 'ТЕСТ',          status: 'offline' },
};

/**
 * Fire alarm zone tile.
 * Attrs: label, state (normal/pre-alarm/alarm/fault/test),
 *   detector-count, active-detectors, last-alarm (ISO or time str)
 */
export class BmsFireZone extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'state', 'detector-count', 'active-detectors', 'last-alarm'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-fire-zone');
      this.setAttribute('accent', 'alarm-level');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption">пожарная зона</span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>

        <div class="bms-fire-zone-status" data-status>
          <div class="bms-row bms-between">
            <div class="bms-fire-zone-num" data-state-label>—</div>
            <div class="bms-caption" data-last-alarm></div>
          </div>
          <div class="bms-mono bms-muted" style="font-size: 12px; margin-top: 4px;">
            <span data-active>0</span> / <span data-total>0</span> детекторов активно
          </div>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const state = this.str('state', 'normal');
    const info = STATE_LABELS[state] || STATE_LABELS.normal;
    this.querySelector('[data-label]').textContent = this.str('label', 'Зона пожарной сигнализации');
    this.querySelector('[data-status]').className = `bms-fire-zone-status st-${state}`;
    this.querySelector('[data-state-label]').textContent = info.label;
    this.querySelector('[data-active]').textContent = this.num('active-detectors', 0);
    this.querySelector('[data-total]').textContent = this.num('detector-count', 0);
    const lastA = this.str('last-alarm', '');
    this.querySelector('[data-last-alarm]').textContent = lastA ? `последняя тревога: ${lastA}` : '';
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', info.status);
    dot.setAttribute('label', info.label);
    if (state === 'alarm') dot.setAttribute('pulsing', ''); else dot.removeAttribute('pulsing');
    const sevValue = { normal: 0, 'pre-alarm': 1, alarm: 3, fault: 1, test: 0 }[state] || 0;
    this.setAttribute('value', String(sevValue));
    this.classList.toggle('is-active', state === 'alarm' || state === 'pre-alarm');
  }
}

defineWidget('bms-fire-zone', BmsFireZone);
