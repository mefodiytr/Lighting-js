import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

/**
 * Equipment detail page — hero metric + stats + sparkline.
 * Attrs: name, tag, status, value, unit, mode, accent, stats (JSON array of {label,value,unit})
 */
export class BmsEquipmentDetail extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'name', 'tag', 'status', 'unit', 'mode', 'stats', 'trend'];
  }

  _stats() {
    try { return JSON.parse(this.str('stats', '[]')); } catch { return []; }
  }
  _trend() {
    try { return JSON.parse(this.str('trend', '[]')); } catch { return []; }
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-equip');
      this.innerHTML = `
        <header class="bms-equip-header">
          <h1 class="bms-equip-name" data-name>—</h1>
          <span class="bms-equip-tag" data-tag>—</span>
          <span style="margin-left: auto;">
            <bms-status-dot data-status></bms-status-dot>
          </span>
        </header>

        <div class="bms-equip-hero" data-hero>
          <div>
            <div class="bms-caption" data-mode-label>Текущая нагрузка</div>
            <div class="bms-equip-load"><span data-value>0</span><span class="unit" data-unit></span></div>
            <div style="margin-top: 24px;">
              <bms-sparkline data-spark style="width: 100%; height: 60px;"></bms-sparkline>
            </div>
          </div>
          <div style="display: grid; gap: 12px; align-content: center;">
            <bms-gauge-ro data-gauge min="0" max="100" unit="%"></bms-gauge-ro>
          </div>
        </div>

        <div class="bms-equip-stats" data-stats></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    this.querySelector('[data-name]').textContent = this.str('name', 'Оборудование');
    this.querySelector('[data-tag]').textContent  = this.str('tag', '');
    const status = this.str('status', 'ok');
    const dot = this.querySelector('[data-status]');
    dot.setAttribute('status', status);
    dot.setAttribute('label', this.str('mode', status));

    const v = this.num('value', 0);
    this.querySelector('[data-value]').textContent = Number.isInteger(v) ? v : v.toFixed(1);
    this.querySelector('[data-unit]').textContent = this.str('unit', '%');

    const acc = this._props.accent || 'power-load';
    const hero = this.querySelector('[data-hero]');
    hero.setAttribute('accent', acc);
    hero.setAttribute('value', String(v));
    hero.classList.toggle('is-active', status === 'ok');

    const gauge = this.querySelector('[data-gauge]');
    gauge.setAttribute('value', String(v));
    gauge.setAttribute('accent', acc);

    const spark = this.querySelector('[data-spark]');
    spark.setAttribute('data', JSON.stringify(this._trend()));
    spark.setAttribute('accent', acc);

    const stats = this.querySelector('[data-stats]');
    stats.innerHTML = '';
    for (const s of this._stats()) {
      const cell = document.createElement('div');
      cell.className = 'bms-card';
      cell.innerHTML = `
        <div class="bms-caption">${s.label}</div>
        <div class="bms-mono" style="font-size: 22px; font-weight: 600; margin-top: 4px;">
          ${s.value}<span class="bms-muted" style="font-size: 13px; margin-left: 4px;">${s.unit || ''}</span>
        </div>`;
      stats.append(cell);
    }
  }
}

defineWidget('bms-equipment-detail', BmsEquipmentDetail);
