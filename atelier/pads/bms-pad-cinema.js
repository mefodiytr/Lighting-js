import { BmsPadBase } from './_pad-base.js';
import { defineWidget } from '../core/registry.js';
import { makeDragger } from '../core/drag-engine.js';

/**
 * Cinema pad — premium glass, vertical pill (Apple TV-remote inspired).
 * Pad-area drag controls brightness (top=100, bottom=0).
 */
export class BmsPadCinema extends BmsPadBase {
  render() {
    if (!this._init) {
      this.classList.add('bms-pad-cinema');
      this.innerHTML = `
        <div class="head">
          <div class="power" data-power>⏻</div>
          <div class="room" data-room>—</div>
        </div>
        <div class="pad-area" data-pad>
          <div class="v" data-v>0</div>
        </div>
        <div class="cct-bar">
          <div class="cct-track">
            <div class="cct-thumb" data-cct-thumb></div>
          </div>
          <div class="cct-label">
            <span>1800K</span>
            <span data-cct>3200K</span>
            <span>6500K</span>
          </div>
        </div>
        <div class="scenes" data-scenes></div>`;
      this.querySelector('[data-power]').addEventListener('click', () => this.togglePower());
      const pad = this.querySelector('[data-pad]');
      this.track(makeDragger(pad, {
        axis: 'vertical', trackEl: pad,
        onDrag: (p) => this.setBrightness(p * 100),
      }));
      const track = this.querySelector('.cct-track');
      this.track(makeDragger(track, {
        axis: 'horizontal', trackEl: track,
        onDrag: (p) => this.setCct(1800 + p * 4700),
      }));
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
    this.classList.toggle('is-on', power);
    this.querySelector('[data-room]').textContent = this.str('room', 'Комната');
    this.querySelector('[data-v]').textContent = power ? Math.round(br) : '—';
    this.querySelector('[data-pad]').style.setProperty('--halo', power ? (0.15 + 0.35 * br / 100).toFixed(2) : '0');
    const cctPct = (cct - 1800) / 4700;
    this.querySelector('[data-cct-thumb]').style.left = `${cctPct * 100}%`;
    this.querySelector('[data-cct]').textContent = `${Math.round(cct)}K`;
    const scenes = this.querySelector('[data-scenes]');
    scenes.innerHTML = '';
    for (const s of this.scenes().slice(0, 6)) {
      const b = document.createElement('button');
      b.className = 'scene' + (s.id === active ? ' is-active' : '');
      b.textContent = s.label;
      b.addEventListener('click', () => this.activateScene(s.id));
      scenes.append(b);
    }
  }
}

defineWidget('bms-pad-cinema', BmsPadCinema);
