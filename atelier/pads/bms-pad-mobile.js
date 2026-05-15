import { BmsPadBase } from './_pad-base.js';
import { defineWidget } from '../core/registry.js';
import { makeDragger } from '../core/drag-engine.js';

const R = 78;
const C = 2 * Math.PI * R * 0.75; // 270° arc

/**
 * Mobile pad — SmartThings/Home-app style with circular dimmer + scene chips.
 */
export class BmsPadMobile extends BmsPadBase {
  render() {
    if (!this._init) {
      this.classList.add('bms-pad-mobile');
      this.innerHTML = `
        <div class="head">
          <div class="hero-icon" data-icon>💡</div>
          <div class="room" data-room>—</div>
          <div class="state-label" data-state>—</div>
        </div>
        <div class="dimmer-wrap" data-dim>
          <svg viewBox="0 0 200 200">
            <defs>
              <linearGradient id="bmsPadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffd4a0"/>
                <stop offset="100%" stop-color="#ff8c40"/>
              </linearGradient>
            </defs>
            <path class="dim-ring" d="M 35 145 A ${R} ${R} 0 1 1 165 145" />
            <path class="dim-fill" d="M 35 145 A ${R} ${R} 0 1 1 165 145"
              stroke-dasharray="${C}" stroke-dashoffset="${C}" data-fill />
          </svg>
          <div class="dim-text">
            <div>
              <div class="v" data-v>0</div>
              <div class="sub" data-sub>—</div>
            </div>
          </div>
        </div>
        <div class="chips" data-chips></div>`;
      this.querySelector('[data-icon]').addEventListener('click', () => this.togglePower());
      const dim = this.querySelector('[data-dim]');
      this.track(makeDragger(dim, {
        axis: 'radial', trackEl: dim,
        onDrag: (p) => {
          // Map 0..1 → -135°..+135° (the 270° arc). p=0.5 should equal 50%
          // Native radial: 0 at top, going clockwise. Map full circle to 0..100, ignore the gap.
          this.setBrightness(p * 100);
        },
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
    this.querySelector('[data-room]').textContent = this.str('room', 'Комната');
    this.querySelector('[data-state]').textContent = power
      ? `${active || 'актив'} · ${cct}K`
      : 'выключено';
    this.querySelector('[data-v]').textContent = power ? Math.round(br) : '0';
    this.querySelector('[data-sub]').textContent = power ? `${cct}K` : 'OFF';
    this.style.setProperty('--icon-glow', power ? (0.4 + 0.5 * br / 100).toFixed(2) : '0');
    this.querySelector('[data-fill]').style.strokeDashoffset = String(C * (1 - (power ? br / 100 : 0)));
    const chips = this.querySelector('[data-chips]');
    chips.innerHTML = '';
    for (const s of this.scenes().slice(0, 6)) {
      const b = document.createElement('button');
      b.className = 'chip' + (s.id === active ? ' is-active' : '');
      b.textContent = s.label;
      b.addEventListener('click', () => this.activateScene(s.id));
      chips.append(b);
    }
  }
}

defineWidget('bms-pad-mobile', BmsPadMobile);
