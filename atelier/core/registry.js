/**
 * @typedef {Object} AccentPreset
 * @property {number} value
 * @property {[number, number, number]} glow   - RGB triplet for primary glow
 * @property {[number, number, number]} deep   - deeper accent for shadows
 * @property {[number, number, number]} light  - light accent for highlights
 */

/**
 * @typedef {Object} Accent
 * @property {string} id
 * @property {string} name
 * @property {string} unit
 * @property {[number, number]} range
 * @property {AccentPreset[]} presets
 * @property {(value: number) => AccentPreset} interpolate
 * @property {(value: number) => Record<string, string|number>} cssVars
 */

const accentRegistry = new Map();
const widgetRegistry = new Map();

/** @param {Accent} accent */
export function registerAccent(accent) {
  accentRegistry.set(accent.id, accent);
}

/** @param {string} id @returns {Accent | undefined} */
export function resolveAccent(id) {
  return accentRegistry.get(id);
}

export function listAccents() {
  return Array.from(accentRegistry.values());
}

/**
 * Idempotent customElements.define wrapper.
 * @param {string} tag
 * @param {CustomElementConstructor} ElementClass
 */
export function defineWidget(tag, ElementClass) {
  if (customElements.get(tag)) return;
  customElements.define(tag, ElementClass);
  widgetRegistry.set(tag, ElementClass);
}

export function listWidgets() {
  return Array.from(widgetRegistry.keys());
}
