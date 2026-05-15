import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Power quality analyser — voltage/current THD, power factor, harmonics, dips/sags.
 * Attrs: label, voltage-thd (%), current-thd (%), power-factor,
 *   frequency, dips (count), sags (count), harmonics (JSON array of 12 %)
 */
export class BmsPowerQuality extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'voltage-thd', 'current-thd', 'power-factor',
      'frequency', 'dips', 'sags', 'harmonics'];
  }

  _harmonics() {
    try {
      const h = JSON.parse(this.str('harmonics', '[]'));
      if (Array.isArray(h)) return h;
    } catch {}
    return new Array(12).fill(0);
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'power-load');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <bms-status-dot data-state></bms-status-dot>
        </div>

        <div class="bms-pq-grid">
          <div class="bms-pq-gauge">
            <div class="v"><span data-vt>0</span><span style="font-size: 14px; color: var(--bms-text-muted);">%</span></div>
            <div class="l">THD напряжения</div>
          </div>
          <div class="bms-pq-gauge">
            <div class="v"><span data-it>0</span><span style="font-size: 14px; color: var(--bms-text-muted);">%</span></div>
            <div class="l">THD тока</div>
          </div>
          <div class="bms-pq-gauge">
            <div class="v"><span data-pf>0</span></div>
            <div class="l">cos φ</div>
          </div>
          <div class="bms-pq-gauge">
            <div class="v"><span data-freq>0</span><span style="font-size: 14px; color: var(--bms-text-muted);">Hz</span></div>
            <div class="l">частота</div>
          </div>
        </div>

        <div>
          <div class="bms-caption" style="margin-bottom: 6px;">спектр гармоник (1-я … 13-я)</div>
          <div class="bms-pq-bars" data-bars></div>
        </div>

        <div class="bms-row bms-between bms-caption">
          <span>провалы: <span class="bms-mono bms-text" data-dips>0</span></span>
          <span>выбросы: <span class="bms-mono bms-text" data-sags>0</span></span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const vthd = this.num('voltage-thd', 0);
    const ithd = this.num('current-thd', 0);
    const pf = this.num('power-factor', 0);
    this.querySelector('[data-label]').textContent = this.str('label', 'Анализатор качества');
    this.querySelector('[data-vt]').textContent = vthd.toFixed(1);
    this.querySelector('[data-it]').textContent = ithd.toFixed(1);
    this.querySelector('[data-pf]').textContent = pf.toFixed(2);
    this.querySelector('[data-freq]').textContent = this.num('frequency', 50).toFixed(2);
    this.querySelector('[data-dips]').textContent = this.num('dips', 0);
    this.querySelector('[data-sags]').textContent = this.num('sags', 0);

    const bars = this.querySelector('[data-bars]');
    bars.innerHTML = '';
    const h = this._harmonics();
    const maxH = Math.max(...h, 1);
    for (let i = 0; i < h.length; i++) {
      const bar = document.createElement('div');
      bar.className = 'bms-pq-bar';
      bar.style.height = `${(h[i] / maxH) * 100}%`;
      bar.dataset.h = (i * 2 + 1);  // 1, 3, 5, 7, ...
      bars.append(bar);
    }
    const dot = this.querySelector('[data-state]');
    const status = vthd > 8 || ithd > 15 || pf < 0.85 ? 'warning' : 'ok';
    dot.setAttribute('status', status);
    dot.setAttribute('label', status === 'ok' ? 'качество в норме' : 'отклонение');
    this.classList.toggle('is-active', true);
    this.setAttribute('value', String(vthd));
  }
}

defineWidget('bms-power-quality', BmsPowerQuality);
