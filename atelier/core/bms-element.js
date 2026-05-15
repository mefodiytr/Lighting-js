import { resolveAccent } from './registry.js';

/**
 * @typedef {Object} BmsInit
 * @property {'shadow'|'light'} [dom='shadow']
 *
 * @typedef {Object} NumericRange
 * @property {number} min
 * @property {number} max
 * @property {number} [step]
 */

const COMMON_ATTRS = ['accent', 'value', 'disabled', 'label', 'theme'];

/**
 * Base class for all <bms-*> Web Components.
 * Subclasses set static `init = { dom: 'light' }` to opt out of Shadow DOM.
 * Subclasses define `observedAttributes` and implement `render()`.
 */
export class BmsElement extends HTMLElement {
  /** @type {BmsInit} */
  static init = { dom: 'shadow' };

  /** Subclasses should merge with COMMON_ATTRS. */
  static get observedAttributes() { return COMMON_ATTRS; }

  constructor() {
    super();
    /** @type {BmsInit} */
    const init = /** @type {any} */ (this.constructor).init || { dom: 'shadow' };
    this._dom = init.dom;
    this._root = this._dom === 'shadow' ? this.attachShadow({ mode: 'open' }) : this;
    /** @type {Record<string, any>} */
    this._props = {};
    this._mounted = false;
    this._disposers = [];
  }

  connectedCallback() {
    const klass = /** @type {any} */ (this.constructor);
    for (const attr of klass.observedAttributes || []) {
      if (this.hasAttribute(attr)) this._props[attr] = this.getAttribute(attr);
    }
    this._applyAccent();
    this.render();
    this._mounted = true;
    this.afterMount?.();
  }

  disconnectedCallback() {
    for (const d of this._disposers) { try { d(); } catch {} }
    this._disposers = [];
    this._mounted = false;
    this.afterUnmount?.();
  }

  attributeChangedCallback(name, _old, value) {
    this._props[name] = value;
    if (!this._mounted) return;
    if (name === 'accent' || name === 'value') this._applyAccent();
    this.update(name, value);
  }

  _applyAccent() {
    const id = this._props.accent;
    if (!id) return;
    const accent = resolveAccent(id);
    if (!accent) return;
    const raw = this._props.value;
    const v = raw == null ? (accent.range[0] + accent.range[1]) / 2 : Number(raw);
    const vars = accent.cssVars(v);
    for (const [k, val] of Object.entries(vars)) {
      this.style.setProperty(k, String(val));
    }
  }

  /** Update accent CSS vars + re-render. Subclasses override `update()` for fine-grain DOM updates. */
  update(_name, _value) { this.render(); }

  /** Emit a CustomEvent that bubbles + composes through shadow boundaries. */
  emit(type, detail) {
    this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
  }

  /** Track disposers to be cleaned up on disconnect. */
  track(dispose) { this._disposers.push(dispose); return dispose; }

  /** querySelector inside the render root (works for both shadow and light DOM). */
  $(sel) { return this._root.querySelector(sel); }
  $$(sel) { return Array.from(this._root.querySelectorAll(sel)); }

  /** Coerce attribute string to a number, falling back to def. */
  num(name, def = 0) {
    const v = this._props[name];
    if (v == null || v === '') return def;
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
  }
  bool(name) {
    const v = this._props[name];
    return v != null && v !== 'false' && v !== '0';
  }
  str(name, def = '') {
    const v = this._props[name];
    return v == null ? def : String(v);
  }

  /** Set value (controlled write) and emit `change`. */
  setValue(v) {
    this._props.value = v;
    this.setAttribute('value', String(v));
    this.emit('change', { value: v });
  }

  /** Subclasses implement: paint DOM into this._root. */
  render() {}
}
