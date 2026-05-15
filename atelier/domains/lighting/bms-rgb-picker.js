import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';
import { resolveAccent } from '../../core/registry.js';

/**
 * RGB mood picker — 8 discrete presets from lighting-rgb accent.
 * Attrs: value (0-7 index), label
 */
export class BmsRgbPicker extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-rgb');
      this.setAttribute('accent', 'lighting-rgb');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <h3 class="bms-h2" data-label></h3>
          <span class="bms-caption" data-current></span>
        </div>
        <div class="bms-rgb-grid" data-grid></div>`;
      const grid = this.querySelector('[data-grid]');
      const accent = resolveAccent('lighting-rgb');
      for (const preset of accent.presets) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'bms-rgb-cell';
        cell.setAttribute('data-preset', String(preset.value));
        const vars = accent.cssVars(preset.value);
        for (const [k, v] of Object.entries(vars)) cell.style.setProperty(k, v);
        cell.innerHTML = `<span class="name">${preset.name}</span>`;
        cell.addEventListener('click', () => {
          this.setAttribute('value', String(preset.value));
          this.emit('change', { value: preset.value, name: preset.name });
        });
        grid.append(cell);
      }
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const val = this.num('value', 0);
    const accent = resolveAccent('lighting-rgb');
    const preset = accent.presets[Math.max(0, Math.min(7, Math.round(val)))];
    this.querySelector('[data-label]').textContent = this.str('label', 'Настроение');
    this.querySelector('[data-current]').textContent = preset?.name || '—';
    for (const cell of this.querySelectorAll('.bms-rgb-cell')) {
      cell.classList.toggle('is-active', Number(cell.dataset.preset) === Math.round(val));
    }
    this.classList.add('is-active');
  }
}

defineWidget('bms-rgb-picker', BmsRgbPicker);
