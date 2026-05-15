import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const SEV_LABELS = {
  warning:  'предупреждение',
  alarm:    'тревога',
  critical: 'критично',
  info:     'инфо',
};

/**
 * Alarm row — single row in an alarm console.
 * Attrs: severity (info/warning/alarm/critical), time, location, message, ack (bool)
 */
export class BmsAlarmRow extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'severity', 'time', 'location', 'message', 'ack'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-alarm');
      this.setAttribute('accent', 'alarm-level');
      this.innerHTML = `
        <span class="time" data-time></span>
        <div>
          <div class="msg" data-msg></div>
          <div class="loc" data-loc></div>
        </div>
        <span class="bms-pill" data-sev></span>
        <button class="ack-btn" data-ack>Подтвердить</button>`;
      this.querySelector('[data-ack]').addEventListener('click', () => {
        this.setAttribute('ack', '');
        this.emit('acknowledge', { time: this.str('time') });
      });
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const sev = this.str('severity', 'info');
    this.className = `bms-alarm sev-${sev}` + (this.bool('ack') ? ' is-ack' : '');
    this.querySelector('[data-time]').textContent = this.str('time', '—');
    this.querySelector('[data-msg]').textContent = this.str('message', '');
    this.querySelector('[data-loc]').textContent = this.str('location', '');
    const pill = this.querySelector('[data-sev]');
    pill.textContent = SEV_LABELS[sev] || sev;
    pill.classList.toggle('is-active', sev !== 'info');
    const sevToValue = { info: 0, warning: 1, alarm: 2, critical: 3 };
    this.setAttribute('value', String(sevToValue[sev] ?? 0));
  }
}

defineWidget('bms-alarm-row', BmsAlarmRow);
