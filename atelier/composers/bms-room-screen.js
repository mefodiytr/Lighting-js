import { BmsElement } from '../core/bms-element.js';
import { defineWidget } from '../core/registry.js';

/**
 * Room screen — full-view composer combining lighting, climate, shades, scenes.
 * Attrs: room (label), occupancy (occupied/empty), active-scene
 */
export class BmsRoomScreen extends BmsElement {
  static init = { dom: 'light' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'room', 'occupancy', 'active-scene'];
  }

  render() {
    if (!this._init) {
      this.classList.add('bms-room');
      this.innerHTML = `
        <header class="bms-room-header">
          <div>
            <h1 class="bms-room-title" data-name>—</h1>
            <div class="bms-room-meta">
              <bms-status-dot data-occ></bms-status-dot>
              · сцена: <span data-scene>—</span>
            </div>
          </div>
          <div class="bms-row" style="gap: 12px;">
            <bms-big-number data-temp label="температура" unit="°C" accent="hvac-temperature"></bms-big-number>
            <bms-big-number data-co2 label="CO₂" unit=" ppm" accent="hvac-co2"></bms-big-number>
          </div>
        </header>

        <section class="bms-room-section">
          <div class="bms-room-section-label">Освещение</div>
          <div class="bms-room-grid">
            <bms-zone-dimmer label="Общий свет" brightness="80" cct="3200" on></bms-zone-dimmer>
            <bms-zone-dimmer label="Подсветка" brightness="40" cct="2700" on></bms-zone-dimmer>
            <bms-zone-dimmer label="Акценты" brightness="60" cct="2700" on></bms-zone-dimmer>
          </div>
        </section>

        <section class="bms-room-section">
          <div class="bms-room-section-label">Климат</div>
          <div class="bms-room-grid">
            <bms-fcu-tile label="Фанкойл" mode="auto" setpoint="22" actual="22.3" fan="auto" status="ok" accent="hvac-temperature"></bms-fcu-tile>
            <bms-valve-control label="Клапан радиатора" position="0" state="closed" accent="hvac-temperature"></bms-valve-control>
          </div>
        </section>

        <section class="bms-room-section">
          <div class="bms-room-section-label">Шторы</div>
          <div class="bms-room-grid">
            <bms-zone-dimmer label="Восточные окна" brightness="60" cct="3200" on></bms-zone-dimmer>
            <bms-zone-dimmer label="Южные окна" brightness="20" cct="3200" on></bms-zone-dimmer>
          </div>
        </section>

        <section class="bms-room-section">
          <div class="bms-room-section-label">Сцены</div>
          <div class="bms-room-scenes" data-scenes>
            <bms-scene-card name="Утро" brightness="80" cct="4000"></bms-scene-card>
            <bms-scene-card name="День" brightness="100" cct="5000"></bms-scene-card>
            <bms-scene-card name="Вечер" brightness="60" cct="2700" active></bms-scene-card>
            <bms-scene-card name="Кино" brightness="20" cct="2200"></bms-scene-card>
            <bms-scene-card name="Ночь" brightness="5" cct="1800"></bms-scene-card>
          </div>
        </section>`;
      this._init = true;
      this._wireScenes();
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _wireScenes() {
    this.querySelector('[data-scenes]').addEventListener('activate', (e) => {
      for (const card of this.querySelectorAll('bms-scene-card')) {
        if (card.getAttribute('name') === e.detail.name) card.setAttribute('active', '');
        else card.removeAttribute('active');
      }
      this.setAttribute('active-scene', e.detail.name);
      this.emit('scene-change', e.detail);
    });
  }

  _reflect() {
    this.querySelector('[data-name]').textContent = this.str('room', 'Комната');
    this.querySelector('[data-scene]').textContent = this.str('active-scene', '—');
    const occ = this.str('occupancy', 'empty');
    const occEl = this.querySelector('[data-occ]');
    occEl.setAttribute('status', occ === 'occupied' ? 'ok' : 'offline');
    occEl.setAttribute('label', occ === 'occupied' ? 'занято' : 'свободно');
    const temp = this.querySelector('[data-temp]');
    temp.setAttribute('value', this.str('temperature', '22.3'));
    temp.setAttribute('accent', 'hvac-temperature');
    const co2 = this.querySelector('[data-co2]');
    co2.setAttribute('value', this.str('co2', '720'));
    co2.setAttribute('accent', 'hvac-co2');
  }
}

defineWidget('bms-room-screen', BmsRoomScreen);
