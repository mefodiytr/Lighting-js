import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const STATE_LABELS = {
  armed:     { icon: '🔒', label: 'Под охраной',   status: 'ok' },
  disarmed:  { icon: '🔓', label: 'Снято с охраны', status: 'offline' },
  violated:  { icon: '⚠',  label: 'НАРУШЕНИЕ',     status: 'critical' },
  troubled:  { icon: '⚙',  label: 'Неисправность',  status: 'warning' },
  exit:      { icon: '⇣',  label: 'Время на выход', status: 'warning' },
};

/**
 * Security intrusion zone — armed/disarmed/violated + sensor list.
 * Attrs: label, state, last-event, sensors (JSON [{id, label, kind, violated?}])
 */
export class BmsIntrusionZone extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'state', 'last-event', 'sensors'];
  }

  _sensors() {
    try { return JSON.parse(this.str('sensors', '[]')); } catch { return []; }
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-intrusion');
      this.setAttribute('accent', 'alarm-level');
      this.innerHTML = `
        <div class="bms-intrusion-header">
          <div class="bms-intrusion-shield" data-icon>—</div>
          <div class="bms-grow">
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption" data-state-label></span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>
        <div class="bms-row bms-between bms-caption">
          <span>последнее событие</span>
          <span class="bms-mono bms-text" data-last>—</span>
        </div>
        <div class="bms-intrusion-sensors" data-sensors></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const state = this.str('state', 'disarmed');
    const info = STATE_LABELS[state] || STATE_LABELS.disarmed;
    this.className = `bms-card bms-intrusion st-${state}`;
    this.querySelector('[data-label]').textContent = this.str('label', 'Зона охраны');
    this.querySelector('[data-state-label]').textContent = info.label;
    this.querySelector('[data-icon]').textContent = info.icon;
    this.querySelector('[data-last]').textContent = this.str('last-event', '—');
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', info.status);
    dot.setAttribute('label', info.label);
    if (state === 'violated') dot.setAttribute('pulsing', '');
    else dot.removeAttribute('pulsing');

    const sensors = this.querySelector('[data-sensors]');
    sensors.innerHTML = '';
    for (const s of this._sensors()) {
      const row = document.createElement('div');
      row.className = 'bms-intrusion-sensor' + (s.violated ? ' is-violated' : '');
      row.innerHTML = `
        <span style="font-family: var(--bms-font-mono); color: var(--bms-text-muted); font-size: 11px;">${s.kind || 'pir'}</span>
        <span class="name">${s.label || s.id}</span>
        <span class="state">${s.violated ? 'нарушен' : 'покой'}</span>`;
      sensors.append(row);
    }
    const sevValue = state === 'violated' ? 3 : state === 'troubled' ? 1 : 0;
    this.setAttribute('value', String(sevValue));
  }
}

defineWidget('bms-intrusion-zone', BmsIntrusionZone);
