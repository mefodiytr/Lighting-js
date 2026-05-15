import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const STATE_ICONS  = { closed: '|', open: '/', tripped: '⚠' };
const TRIP_REASONS = {
  overload:    'перегрузка',
  short:       'короткое замыкание',
  ground:      'замыкание на землю',
  thermal:     'термический',
  undervoltage:'недонапряжение',
};

/**
 * Single circuit breaker tile.
 * Attrs: label, state (closed/open/tripped), current (A), rating (A),
 *   trip-reason, position (test/connected/disconnected), phase, ip-grade
 */
export class BmsBreakerTile extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'state', 'current', 'rating',
      'trip-reason', 'position', 'phase'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-breaker');
      this.setAttribute('accent', 'power-load');
      this.innerHTML = `
        <div class="bms-row" style="gap: 14px;">
          <div class="bms-breaker-icon" data-icon>|</div>
          <div class="bms-grow">
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption bms-mono"><span data-rating>—</span> A · <span data-phase>—</span></span>
          </div>
        </div>

        <div>
          <div class="bms-row bms-between bms-caption">
            <span>ток</span>
            <span><span class="bms-mono bms-text" data-current>0</span> A</span>
          </div>
          <div class="bms-breaker-bar" style="margin-top: 4px;">
            <div class="bms-breaker-bar-fill" data-bar></div>
          </div>
        </div>

        <div class="bms-row bms-between" style="font-size: 12px;">
          <span class="bms-caption">положение: <span class="bms-text bms-mono" data-pos>—</span></span>
          <span class="bms-pill" data-state>—</span>
        </div>

        <div data-trip-wrap class="bms-caption" style="display: none; padding: 8px; background: rgb(240, 70, 60, 0.08); border-radius: var(--bms-radius-sm); border-left: 3px solid rgb(240, 70, 60); color: rgb(240, 70, 60);">
          сработал: <span data-trip-text>—</span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const state = this.str('state', 'open');
    const current = this.num('current', 0);
    const rating = this.num('rating', 100);
    const reason = this.str('trip-reason', '');
    const ratio = Math.min(1, current / Math.max(1, rating));
    this.className = `bms-card bms-breaker st-${state}`;
    this.querySelector('[data-label]').textContent = this.str('label', 'Автомат');
    this.querySelector('[data-icon]').textContent = STATE_ICONS[state] || '?';
    this.querySelector('[data-rating]').textContent = rating;
    this.querySelector('[data-phase]').textContent = this.str('phase', '—');
    this.querySelector('[data-current]').textContent = current.toFixed(1);
    this.querySelector('[data-bar]').style.width = `${(ratio * 100).toFixed(0)}%`;
    this.querySelector('[data-pos]').textContent = this.str('position', 'connected');
    const pill = this.querySelector('[data-state]');
    pill.textContent = state;
    pill.classList.toggle('is-active', state === 'closed');
    const tripWrap = this.querySelector('[data-trip-wrap]');
    if (state === 'tripped' && reason) {
      tripWrap.style.display = '';
      this.querySelector('[data-trip-text]').textContent = TRIP_REASONS[reason] || reason;
    } else {
      tripWrap.style.display = 'none';
    }
    this.setAttribute('value', String(ratio * 100));
  }
}

defineWidget('bms-breaker-tile', BmsBreakerTile);
