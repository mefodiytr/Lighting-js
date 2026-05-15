/**
 * @typedef {Object} Tokens
 * @property {number} fast      - duration ms for micro-interactions
 * @property {number} normal    - duration ms for default transitions
 * @property {number} slow      - duration ms for staged animations
 * @property {string} ease      - standard easing curve
 * @property {number} longPressMs
 * @property {number} dragSnapPx
 */

/** @type {Tokens} */
export const tokens = {
  fast: 120,
  normal: 240,
  slow: 480,
  ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  longPressMs: 600,
  dragSnapPx: 4,
};

export const z = {
  toast: 100,
  popover: 200,
  modal: 300,
};
