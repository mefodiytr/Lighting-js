import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const PHASES = [
  { id: 'l1', label: 'L1', color: 'rgb(240, 90, 80)' },
  { id: 'l2', label: 'L2', color: 'rgb(255, 200, 110)' },
  { id: 'l3', label: 'L3', color: 'rgb(120, 180, 220)' },
];

/**
 * 3-phase electrical meter.
 * Attrs: label, voltage-l1, voltage-l2, voltage-l3,
 *   current-l1, current-l2, current-l3,
 *   pf-l1, pf-l2, pf-l3, frequency, power-total (kW)
 */
export class BmsMeter3Phase extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes,
      'voltage-l1', 'voltage-l2', 'voltage-l3',
      'current-l1', 'current-l2', 'current-l3',
      'pf-l1', 'pf-l2', 'pf-l3',
      'frequency', 'power-total'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'power-load');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption">3-фазный счётчик · <span class="bms-mono bms-text" data-freq>—</span> Hz</span>
          </div>
          <div style="text-align: right;">
            <div class="bms-caption">общая</div>
            <div class="bms-mono" style="font-size: 20px; font-weight: 600;"><span data-tot>0</span> kW</div>
          </div>
        </div>
        <div class="bms-3ph" data-phases></div>`;
      const phRow = this.querySelector('[data-phases]');
      for (const ph of PHASES) {
        const col = document.createElement('div');
        col.className = 'bms-3ph-col';
        col.style.setProperty('--ph-color', ph.color);
        col.dataset.id = ph.id;
        col.innerHTML = `
          <div class="ph-name">${ph.label}</div>
          <div class="ph-row"><span>U</span><span class="v"><span data-v>0</span> V</span></div>
          <div class="ph-row"><span>I</span><span class="v"><span data-i>0</span> A</span></div>
          <div class="ph-row"><span>cos φ</span><span class="v"><span data-pf>0</span></span></div>`;
        phRow.append(col);
      }
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    this.querySelector('[data-label]').textContent = this.str('label', 'Счётчик 3-ф');
    this.querySelector('[data-freq]').textContent = this.num('frequency', 50).toFixed(2);
    this.querySelector('[data-tot]').textContent = this.num('power-total', 0).toFixed(1);
    for (const ph of PHASES) {
      const col = this.querySelector(`[data-id="${ph.id}"]`);
      col.querySelector('[data-v]').textContent = this.num(`voltage-${ph.id}`, 0).toFixed(0);
      col.querySelector('[data-i]').textContent = this.num(`current-${ph.id}`, 0).toFixed(1);
      col.querySelector('[data-pf]').textContent = this.num(`pf-${ph.id}`, 0).toFixed(2);
    }
    this.classList.toggle('is-active', this.num('power-total', 0) > 0);
    this.setAttribute('value', String(this.num('power-total', 0)));
  }
}

defineWidget('bms-meter-3phase', BmsMeter3Phase);
