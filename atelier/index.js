/**
 * Atelier BMS — public entry.
 * Importing this file auto-registers all widgets and side-effects (accent CSS, themes).
 */

export { BmsElement } from './core/bms-element.js';
export { defineWidget, registerAccent, resolveAccent, listWidgets, listAccents } from './core/registry.js';
export { setTheme, getTheme, listThemes, setAccent, getAccent, restoreFromStorage } from './core/theme-bus.js';
export { makeDragger, makeLongPress } from './core/drag-engine.js';
export { tokens, z } from './core/tokens.js';
