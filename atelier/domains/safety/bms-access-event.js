import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const ICONS = { entry: '→', exit: '←', denied: '×' };

/**
 * Access control event row.
 * Attrs: kind (entry/exit/denied), who, where, time, card-id
 */
export class BmsAccessEvent extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'kind', 'who', 'where', 'time', 'card-id'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-access');
      this.innerHTML = `
        <div class="kind-icon" data-icon></div>
        <div>
          <div class="who" data-who></div>
          <div class="meta"><span data-where></span> · <span data-card></span></div>
        </div>
        <div class="stamp" data-time></div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const kind = this.str('kind', 'entry');
    this.className = `bms-access kind-${kind}`;
    this.querySelector('[data-icon]').textContent = ICONS[kind] || '•';
    this.querySelector('[data-who]').textContent = this.str('who', '—');
    this.querySelector('[data-where]').textContent = this.str('where', '—');
    this.querySelector('[data-card]').textContent = this.str('card-id', '—');
    this.querySelector('[data-time]').textContent = this.str('time', '—');
  }
}

defineWidget('bms-access-event', BmsAccessEvent);
