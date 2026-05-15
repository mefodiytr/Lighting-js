import { BmsPadBase } from './_pad-base.js';
import { defineWidget } from '../core/registry.js';

/**
 * HUD pad — aviation/sci-fi phosphor green terminal.
 * Bar-graph scene preview, ▼▲ CCT controls.
 */
export class BmsPadHud extends BmsPadBase {
  render() {
    if (!this._init) {
      this.classList.add('bms-pad-hud');
      this.innerHTML = `
        <div class="head">
          <span class="status" data-status>—</span>
          <span data-cct>—</span>
        </div>
        <div class="hero">
          <div class="v" data-v>0</div>
          <div class="label" data-room>—</div>
        </div>
        <div class="cct-row">
          <button class="cct-btn" data-cct-d>▼</button>
          <div class="cct-value">CCT <span data-cct-val>3200</span> K</div>
          <button class="cct-btn" data-cct-u>▲</button>
        </div>
        <div class="scenes" data-scenes></div>`;
      this.querySelector('[data-cct-u]').addEventListener('click', () =>
        this.setCct(this.num('cct', 3200) + 200));
      this.querySelector('[data-cct-d]').addEventListener('click', () =>
        this.setCct(this.num('cct', 3200) - 200));
      this.querySelector('.hero').addEventListener('click', () => this.togglePower());
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const power = this.bool('power');
    const br = this.num('brightness', 50);
    const cct = this.num('cct', 3200);
    const active = this.str('active-scene', '');
    const code = this.str('room', 'ROOM').toUpperCase().replace(/\s+/g, '-');
    this.querySelector('[data-status]').textContent = power ? `${code} · ACTIVE` : `${code} · STDBY`;
    this.querySelector('[data-cct]').textContent = `${Math.round(cct)}K`;
    this.querySelector('[data-cct-val]').textContent = Math.round(cct);
    this.querySelector('[data-v]').textContent = power ? Math.round(br) : '——';
    this.querySelector('[data-room]').textContent = `BRIGHTNESS · ${this.str('room', 'ROOM')}`;
    const scenes = this.querySelector('[data-scenes]');
    scenes.innerHTML = '';
    for (const s of this.scenes().slice(0, 5)) {
      const row = document.createElement('div');
      row.className = 'scene-row' + (s.id === active ? ' is-active' : '');
      const pct = s.brightness ?? 0;
      row.innerHTML = `
        <span class="name">&gt; ${s.label}</span>
        <div class="scene-bar"><div class="scene-bar-fill" style="width: ${pct}%"></div></div>
        <span class="scene-pct">${pct}%</span>`;
      row.addEventListener('click', () => this.activateScene(s.id));
      scenes.append(row);
    }
  }
}

defineWidget('bms-pad-hud', BmsPadHud);
