import { BmsElement } from '../../core/bms-element.js';
import { defineWidget } from '../../core/registry.js';

const STYLE = `
  :host { display: inline-block; width: 56px; height: 64px; color: var(--bms-text); }
  svg { width: 100%; height: 100%; display: block; }
  .body {
    fill: var(--bms-surface-2);
    stroke: var(--bms-border);
    stroke-width: 1.5;
  }
  :host([running]) .body {
    stroke: rgb(var(--cr) var(--cg) var(--cb));
    filter: drop-shadow(0 0 5px rgb(var(--cr) var(--cg) var(--cb) / 0.5));
  }
  .impeller {
    transform-origin: 28px 28px;
    fill: var(--bms-text);
    opacity: 0.5;
  }
  :host([running]) .impeller {
    opacity: 1;
    animation: bms-pump-spin linear infinite;
    animation-duration: var(--pump-duration, 1s);
  }
  @keyframes bms-pump-spin { to { transform: rotate(360deg); } }
  .port { fill: var(--bms-surface); stroke: var(--bms-border); stroke-width: 1.5; }
  .label {
    font-size: 9px;
    fill: var(--bms-text-muted);
    text-anchor: middle;
    font-family: var(--bms-font-mono);
  }
`;

export class BmsPumpIcon extends BmsElement {
  static init = { dom: 'shadow' };
  static get observedAttributes() {
    return [...super.observedAttributes, 'running', 'speed', 'label'];
  }

  render() {
    if (!this._init) {
      this._root.innerHTML = `<style>${STYLE}</style>
        <svg viewBox="0 0 56 64">
          <rect class="port" x="2" y="24" width="8" height="8" />
          <rect class="port" x="46" y="24" width="8" height="8" />
          <circle class="body" cx="28" cy="28" r="18" />
          <g class="impeller">
            <ellipse cx="28" cy="18" rx="3.5" ry="9" />
            <ellipse cx="28" cy="38" rx="3.5" ry="9" />
            <ellipse cx="18" cy="28" rx="9" ry="3.5" />
            <ellipse cx="38" cy="28" rx="9" ry="3.5" />
            <circle cx="28" cy="28" r="3" />
          </g>
          <text class="label" x="28" y="60" data-label></text>
        </svg>`;
      this._init = true;
    }
    this._reflect();
  }

  update() { this._reflect(); }

  _reflect() {
    const speed = this.num('speed', this.bool('running') ? 100 : 0);
    if (speed > 0) this.setAttribute('running', '');
    else this.removeAttribute('running');
    const duration = speed > 0 ? Math.max(0.3, 1.8 - 1.5 * (speed / 100)) : 0;
    this.style.setProperty('--pump-duration', `${duration}s`);
    this.$('[data-label]').textContent = this.str('label', speed > 0 ? 'ON' : 'OFF');
  }
}

defineWidget('bms-pump-icon', BmsPumpIcon);
