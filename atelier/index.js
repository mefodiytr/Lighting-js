/**
 * Atelier BMS — public entry.
 * Importing this file auto-registers all accents and (later) widgets.
 * CSS must be loaded separately:
 *   <link rel="stylesheet" href="atelier/chrome/index.css">
 *   <link rel="stylesheet" href="atelier/accents/core.css">
 */

import './accents/index.js';
import './primitives/index.js';
import './domains/index.js';
import './composers/index.js';
import './mnemonics/index.js';

export { BmsElement } from './core/bms-element.js';
export { defineWidget, registerAccent, resolveAccent, listWidgets, listAccents } from './core/registry.js';
export { setTheme, getTheme, listThemes, setAccent, getAccent, restoreFromStorage } from './core/theme-bus.js';
export { makeDragger, makeLongPress } from './core/drag-engine.js';
export { tokens, z } from './core/tokens.js';
