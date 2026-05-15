import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * DALI group — bulk control of multiple drivers in one group address.
 * Attrs: label, group-id (0-15), level (0-100), cct, members (count or JSON),
 *   on (bool)
 */
export class BmsDaliGroup extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'group-id', 'level', 'cct', 'members', 'on'];
  }

  _memberCount() {
    try {
      const m = JSON.parse(this.str('members', ''));
      if (Array.isArray(m)) return m.length;
    } catch {}
    return this.num('members', 0);
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card');
      this.setAttribute('accent', 'lighting-cct');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption">DALI group <span data-gid>—</span> · <span data-count>0</span> устройств</span>
          </div>
          <bms-glass-switch data-switch accent="lighting-cct"></bms-glass-switch>
        </div>
        <bms-horizontal-slider data-level label="Уровень группы" min="0" max="100" step="1" unit="%" accent="lighting-cct"></bms-horizontal-slider>
        <bms-horizontal-slider data-cct label="Температура группы" min="1800" max="6500" step="100" unit="K" accent="lighting-cct"></bms-horizontal-slider>`;
      this.querySelector('[data-switch]').addEventListener('change', (e) => {
        if (e.detail.checked) this.setAttribute('on', ''); else this.removeAttribute('on');
        this.emit('toggle', { on: e.detail.checked });
      });
      this.querySelector('[data-level]').addEventListener('change', (e) => {
        this.setAttribute('level', String(e.detail.value));
        this.emit('level-change', { level: e.detail.value });
      });
      this.querySelector('[data-cct]').addEventListener('change', (e) => {
        this.setAttribute('cct', String(e.detail.value));
        this.emit('cct-change', { cct: e.detail.value });
      });
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const gid = this.num('group-id', 0);
    const lvl = this.num('level', 0);
    const cct = this.num('cct', 3200);
    const on = this.bool('on');
    this.querySelector('[data-label]').textContent = this.str('label', 'Группа DALI');
    this.querySelector('[data-gid]').textContent = `G${gid}`;
    this.querySelector('[data-count]').textContent = this._memberCount();
    this.querySelector('[data-level]').setAttribute('value', String(lvl));
    this.querySelector('[data-cct]').setAttribute('value', String(cct));
    const sw = this.querySelector('[data-switch]');
    if (on) sw.setAttribute('checked', ''); else sw.removeAttribute('checked');
    sw.setAttribute('value', String(cct));
    this.classList.toggle('is-active', on && lvl > 0);
    this.setAttribute('value', String(cct));
  }
}

defineWidget('bms-dali-group', BmsDaliGroup);
