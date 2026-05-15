import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Shade group — list of shades with aggregated position + group commands.
 * Attrs: label, shades (JSON [{id, label, position}])
 */
export class BmsShadeGroup extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'shades'];
  }

  _shades() {
    try { return JSON.parse(this.str('shades', '[]')); } catch { return []; }
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'shades-position');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption" data-summary></span>
          </div>
          <div class="bms-row" style="gap: 8px;">
            <button class="bms-pill" data-up>↑ Поднять</button>
            <button class="bms-pill" data-down>↓ Опустить</button>
          </div>
        </div>
        <div class="bms-shade-group-list" data-list></div>`;
      this.querySelector('[data-up]').addEventListener('click', () => this._command(100));
      this.querySelector('[data-down]').addEventListener('click', () => this._command(0));
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _command(pos) {
    const shades = this._shades().map((s) => ({ ...s, position: pos }));
    this.setAttribute('shades', JSON.stringify(shades));
    this.emit('group-command', { position: pos });
  }

  _reflect() {
    const shades = this._shades();
    const avg = shades.length ? Math.round(shades.reduce((a, s) => a + (s.position || 0), 0) / shades.length) : 0;
    this.querySelector('[data-label]').textContent = this.str('label', 'Группа штор');
    this.querySelector('[data-summary]').textContent = `${shades.length} штор · средняя ${avg}%`;
    const list = this.querySelector('[data-list]');
    list.innerHTML = '';
    for (const s of shades) {
      const row = document.createElement('div');
      row.className = 'bms-shade-group-row';
      row.innerHTML = `
        <span>${s.label || s.id}</span>
        <div class="bms-shade-group-mini"><div class="fill" style="width: ${s.position}%"></div></div>
        <span class="bms-mono" style="font-size: 12px;">${s.position}%</span>`;
      list.append(row);
    }
    this.setAttribute('value', String(avg));
    this.classList.toggle('is-active', avg > 0);
  }
}

defineWidget('bms-shade-group', BmsShadeGroup);
