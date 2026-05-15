import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

/**
 * CCTV camera tile — placeholder screen + overlay (rec/motion/online).
 * Attrs: label, kind (fixed/ptz/dome/360), online (bool), recording (bool),
 *   motion (bool), camera-id, fps, resolution
 */
export class BmsCameraTile extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'kind', 'online', 'recording', 'motion',
      'camera-id', 'fps', 'resolution'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-card', 'bms-cam');
      this.innerHTML = `
        <div class="bms-row bms-between">
          <div>
            <h3 class="bms-h2" data-label></h3>
            <span class="bms-caption"><span data-kind>—</span> · <span data-id>—</span></span>
          </div>
          <bms-status-dot data-state></bms-status-dot>
        </div>
        <div class="bms-cam-screen" data-screen>
          <div class="bms-cam-overlay">
            <div>
              <span class="bms-cam-rec" data-rec style="display:none;">REC</span>
            </div>
            <div>
              <span class="bms-cam-motion" data-motion style="display:none;">motion</span>
            </div>
          </div>
        </div>
        <div class="bms-row bms-between bms-mono bms-muted" style="font-size: 11px;">
          <span data-res>—</span>
          <span data-fps>—</span>
        </div>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const online = this.bool('online');
    const recording = this.bool('recording');
    const motion = this.bool('motion');
    this.querySelector('[data-label]').textContent = this.str('label', 'Камера');
    this.querySelector('[data-kind]').textContent = this.str('kind', 'fixed');
    this.querySelector('[data-id]').textContent = this.str('camera-id', '—');
    this.querySelector('[data-res]').textContent = this.str('resolution', '');
    const fps = this.str('fps', '');
    this.querySelector('[data-fps]').textContent = fps ? `${fps} fps` : '';
    const screen = this.querySelector('[data-screen]');
    screen.classList.toggle('is-online', online);
    screen.classList.toggle('is-offline', !online);
    this.querySelector('[data-rec]').style.display = (online && recording) ? '' : 'none';
    this.querySelector('[data-motion]').style.display = (online && motion) ? '' : 'none';
    const dot = this.querySelector('[data-state]');
    dot.setAttribute('status', online ? (motion ? 'warning' : 'ok') : 'offline');
    dot.setAttribute('label', online ? (recording ? 'rec' : 'live') : 'offline');
    this.classList.toggle('is-active', online);
  }
}

defineWidget('bms-camera-tile', BmsCameraTile);
