import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const TYPE_ICONS = {
  smoke:           '☁',
  heat:            '🔥',
  combined:        '◉',
  co:              'CO',
  manual:          '✋',
  'sprinkler-flow': '💧',
  beam:            '↔',
};

const STATE_LABELS = {
  normal:   'норма',
  alarm:    'тревога',
  fault:    'неисправность',
  dirty:    'требует очистки',
  disabled: 'отключён',
};

/**
 * Fire detector — single sensor row.
 * Attrs: label, kind (smoke/heat/combined/co/manual/sprinkler-flow/beam),
 *   state (normal/alarm/fault/dirty/disabled), address (e.g. "1.12")
 */
export class BmsFireDetector extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'kind', 'state', 'address'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-detector');
      this.innerHTML = `
        <div class="bms-detector-icon" data-icon></div>
        <div>
          <div class="bms-h2" data-label></div>
          <div class="bms-caption"><span data-kind></span> · <span data-state></span></div>
        </div>
        <div class="bms-mono bms-muted" style="font-size: 12px;" data-addr></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const kind = this.str('kind', 'smoke');
    const state = this.str('state', 'normal');
    this.querySelector('[data-icon]').textContent = TYPE_ICONS[kind] || '?';
    this.querySelector('[data-label]').textContent = this.str('label', 'Датчик');
    this.querySelector('[data-kind]').textContent = kind === 'sprinkler-flow' ? 'спринклер' : kind;
    this.querySelector('[data-state]').textContent = STATE_LABELS[state] || state;
    this.querySelector('[data-addr]').textContent = this.str('address', '');
    this.className = `bms-detector st-${state}`;
  }
}

defineWidget('bms-fire-detector', BmsFireDetector);
