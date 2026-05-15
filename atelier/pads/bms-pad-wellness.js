import { BmsPadBase } from './_pad-base.js';
import { defineWidget } from '../core/registry.js';

/**
 * Wellness pad — Lutron seeTouch hospitality style.
 * Vertical scene buttons with LED indicators + ↑/↓ dimmer at bottom.
 */
export class BmsPadWellness extends BmsPadBase {
  render() {
    if (!this._init) {
      this.classList.add('bms-pad-wellness');
      this.innerHTML = `
        <div class="head">
          <div class="room" data-room>—</div>
        </div>
        <div class="scene-list" data-scenes></div>
        <div class="dimmer">
          <button class="dim-btn up" data-up>↑</button>
          <div class="dim-value" data-pct>—</div>
          <button class="dim-btn down" data-down>↓</button>
        </div>`;
      this.querySelector('[data-up]').addEventListener('click', () =>
        this.setBrightness(this.num('brightness', 50) + 5));
      this.querySelector('[data-down]').addEventListener('click', () =>
        this.setBrightness(this.num('brightness', 50) - 5));
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const power = this.bool('power');
    const br = this.num('brightness', 50);
    const active = this.str('active-scene', '');
    this.querySelector('[data-room]').textContent = this.str('room', 'Комната');
    this.querySelector('[data-pct]').textContent = power ? `${Math.round(br)} %` : 'OFF';
    const list = this.querySelector('[data-scenes]');
    list.innerHTML = '';
    const masterRow = document.createElement('button');
    masterRow.className = 'scene' + (power ? ' is-active' : '');
    masterRow.innerHTML = `<span class="led"></span><span>Master</span>`;
    masterRow.addEventListener('click', () => this.togglePower());
    list.append(masterRow);
    for (const s of this.scenes().slice(0, 5)) {
      const b = document.createElement('button');
      b.className = 'scene' + (s.id === active && power ? ' is-active' : '');
      b.innerHTML = `<span class="led"></span><span>${s.label}</span>`;
      b.addEventListener('click', () => this.activateScene(s.id));
      list.append(b);
    }
  }
}

defineWidget('bms-pad-wellness', BmsPadWellness);
