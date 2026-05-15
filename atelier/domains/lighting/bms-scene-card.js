import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * Scene card — click to activate, shows accent gradient preview.
 * Attrs: name, brightness (0-100), cct (1800-6500), active (bool), fade-ms
 */
export class BmsSceneCard extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'name', 'brightness', 'cct', 'active', 'fade-ms'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-scene');
      this.setAttribute('accent', 'lighting-cct');
      this.setAttribute('role', 'button');
      this.setAttribute('tabindex', '0');
      this.innerHTML = `
        <div class="bms-scene-preview"></div>
        <div class="bms-row bms-between">
          <span class="bms-scene-name" data-name></span>
          <span class="bms-scene-caption" data-caption></span>
        </div>`;
      const activate = () => this.activate();
      this.addEventListener('click', activate);
      this.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
      });
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  activate() {
    this.setAttribute('active', '');
    this.emit('activate', {
      name: this.str('name'),
      brightness: this.num('brightness', 80),
      cct: this.num('cct', 3200),
      fadeMs: this.num('fade-ms', 800),
    });
  }

  _reflect() {
    const b = this.num('brightness', 80);
    const cct = this.num('cct', 3200);
    this.setAttribute('value', String(cct));
    this.querySelector('[data-name]').textContent = this.str('name', 'Сцена');
    this.querySelector('[data-caption]').textContent = `${b}% · ${cct}K`;
    this.classList.toggle('is-active', this.bool('active'));
  }
}

defineWidget('bms-scene-card', BmsSceneCard);
