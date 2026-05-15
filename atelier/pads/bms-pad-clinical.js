import { BmsPadBase } from './_pad-base.js';
import { defineWidget } from '../core/registry.js';

const TABS = [
  { id: 'light',   label: 'Свет' },
  { id: 'climate', label: 'Климат' },
  { id: 'shades',  label: 'Шторы' },
];
const CLIMATE_MODES = ['off', 'auto', 'heat', 'cool'];

/**
 * Clinical pad — tablet/medical console with tabs and big readout.
 */
export class BmsPadClinical extends BmsPadBase {
  static get observedAttributes() {
    return [...super.observedAttributes, 'tab', 'shades-position'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-pad-clinical');
      this.innerHTML = `
        <div class="head">
          <div class="room" data-room>—</div>
          <div class="meta" data-meta>—</div>
        </div>
        <div class="tabs" data-tabs></div>
        <div class="body" data-body></div>`;
      const tabs = this.querySelector('[data-tabs]');
      for (const t of TABS) {
        const b = document.createElement('button');
        b.className = 'tab';
        b.dataset.id = t.id;
        b.textContent = t.label;
        b.addEventListener('click', () => { this.setAttribute('tab', t.id); this.render(); });
        tabs.append(b);
      }
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const tab = this.str('tab', 'light');
    this.querySelector('[data-room]').textContent = this.str('room', 'Помещение');
    const br = this.num('brightness', 50);
    const sp = this.num('setpoint', 22);
    const sh = this.num('shades-position', 50);
    this.querySelector('[data-meta]').textContent =
      `BR ${br}% · SP ${sp.toFixed(1)}°C · SH ${sh}%`;
    for (const b of this.querySelectorAll('[data-tabs] button')) {
      b.classList.toggle('is-active', b.dataset.id === tab);
    }
    const body = this.querySelector('[data-body]');
    body.innerHTML = '';
    if (tab === 'light') body.append(this._lightView(br));
    else if (tab === 'climate') body.append(this._climateView(sp));
    else body.append(this._shadesView(sh));
  }

  _lightView(br) {
    const root = document.createElement('div');
    const cct = this.num('cct', 3200);
    root.innerHTML = `
      <div class="readout">
        <div class="actual">${Math.round(br)}<span class="unit">%</span></div>
        <div class="sp">${cct}K · ${this.bool('power') ? 'ON' : 'OFF'}</div>
      </div>
      <div class="controls-row">
        <button class="ctrl-btn" data-d>−</button>
        <button class="ctrl-btn" data-u>+</button>
      </div>
      <div class="mode-row">
        <button class="mode-btn" data-pw>${this.bool('power') ? 'OFF' : 'ON'}</button>
        <button class="mode-btn" data-cct-d>CCT−</button>
        <button class="mode-btn" data-cct-u>CCT+</button>
        <button class="mode-btn" data-auto>AUTO</button>
      </div>`;
    root.querySelector('[data-u]').onclick = () => this.setBrightness(br + 5);
    root.querySelector('[data-d]').onclick = () => this.setBrightness(br - 5);
    root.querySelector('[data-cct-u]').onclick = () => this.setCct(cct + 200);
    root.querySelector('[data-cct-d]').onclick = () => this.setCct(cct - 200);
    root.querySelector('[data-pw]').onclick = () => this.togglePower();
    return root;
  }

  _climateView(sp) {
    const mode = this.str('climate-mode', 'auto');
    const root = document.createElement('div');
    root.innerHTML = `
      <div class="readout">
        <div class="actual">${sp.toFixed(1)}<span class="unit">°C</span></div>
        <div class="sp">режим: ${mode}</div>
      </div>
      <div class="controls-row">
        <button class="ctrl-btn" data-d>−</button>
        <button class="ctrl-btn" data-u>+</button>
      </div>
      <div class="mode-row" data-modes></div>`;
    root.querySelector('[data-u]').onclick = () => this.setSetpoint(sp + 0.5);
    root.querySelector('[data-d]').onclick = () => this.setSetpoint(sp - 0.5);
    const modes = root.querySelector('[data-modes]');
    for (const m of CLIMATE_MODES) {
      const b = document.createElement('button');
      b.className = 'mode-btn' + (m === mode ? ' is-active' : '');
      b.textContent = m;
      b.onclick = () => this.setClimateMode(m);
      modes.append(b);
    }
    return root;
  }

  _shadesView(sh) {
    const root = document.createElement('div');
    root.innerHTML = `
      <div class="readout">
        <div class="actual">${sh}<span class="unit">%</span></div>
        <div class="sp">${sh === 0 ? 'закрыто' : sh === 100 ? 'открыто' : 'движение'}</div>
      </div>
      <div class="controls-row">
        <button class="ctrl-btn" data-d>−</button>
        <button class="ctrl-btn" data-u>+</button>
      </div>
      <div class="mode-row">
        <button class="mode-btn" data-c>CLOSE</button>
        <button class="mode-btn" data-h>50%</button>
        <button class="mode-btn" data-o>OPEN</button>
        <button class="mode-btn" data-s>STOP</button>
      </div>`;
    const set = (v) => {
      this.setAttribute('shades-position', String(v));
      this.emit('shades-change', { position: v });
      this.render();
    };
    root.querySelector('[data-u]').onclick = () => set(Math.min(100, sh + 10));
    root.querySelector('[data-d]').onclick = () => set(Math.max(0, sh - 10));
    root.querySelector('[data-c]').onclick = () => set(0);
    root.querySelector('[data-h]').onclick = () => set(50);
    root.querySelector('[data-o]').onclick = () => set(100);
    root.querySelector('[data-s]').onclick = () => this.emit('shades-stop');
    return root;
  }
}

defineWidget('bms-pad-clinical', BmsPadClinical);
