import { BmsPadBase } from './_pad-base.js';
import { defineWidget } from '../core/registry.js';

/**
 * Industrial pad — Crestron-style brutalist 3×4 button grid.
 */
export class BmsPadIndustrial extends BmsPadBase {
  render() {
    if (!this._init) {
      this.classList.add('bms-pad-industrial');
      this.innerHTML = `
        <div class="head">
          <span data-room>—</span>
          <span class="room-num" data-meta>—</span>
        </div>
        <div class="grid" data-grid></div>
        <div class="footer">
          <span>DIM</span>
          <div class="meter"><div class="meter-fill" data-meter></div></div>
          <span class="bms-mono" data-pct>0%</span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const power = this.bool('power');
    const br = this.num('brightness', 50);
    const active = this.str('active-scene', '');
    this.querySelector('[data-room]').textContent = this.str('room', 'ROOM');
    this.querySelector('[data-meta]').textContent = `${Math.round(br)}% · ${this.num('cct', 3200)}K`;
    this.querySelector('[data-meter]').style.width = power ? `${br}%` : '0%';
    this.querySelector('[data-pct]').textContent = `${power ? Math.round(br) : 0}%`;
    const scenes = this.scenes().slice(0, 6);
    const grid = this.querySelector('[data-grid]');
    grid.innerHTML = '';
    const cells = [
      { label: 'POWER', sub: power ? 'ON' : 'OFF', active: power, action: () => this.togglePower() },
      { label: 'UP',    sub: '+5%', action: () => this.setBrightness(br + 5) },
      { label: 'DOWN',  sub: '-5%', action: () => this.setBrightness(br - 5) },
      ...scenes.map((s, i) => ({
        label: `SC ${i + 1}`,
        sub: s.label.toUpperCase(),
        active: s.id === active,
        action: () => this.activateScene(s.id),
      })),
    ];
    while (cells.length < 12) cells.push({ label: '', sub: '', action: null });
    for (const c of cells.slice(0, 12)) {
      const b = document.createElement('button');
      b.className = 'btn' + (c.active ? ' is-active' : '');
      b.innerHTML = `<div>${c.label}</div><div class="num">${c.sub}</div>`;
      if (c.action) b.addEventListener('click', c.action);
      else b.disabled = true;
      grid.append(b);
    }
  }
}

defineWidget('bms-pad-industrial', BmsPadIndustrial);
