/**
 * @typedef {'horizontal'|'vertical'|'radial'} DragAxis
 *
 * @typedef {Object} DragOptions
 * @property {DragAxis} axis
 * @property {HTMLElement} [trackEl]                 - bounding element; defaults to target
 * @property {(p: number, e: PointerEvent) => void} onDrag   - p ∈ [0, 1]
 * @property {(p: number, e: PointerEvent) => void} [onStart]
 * @property {(p: number, e: PointerEvent) => void} [onEnd]
 * @property {boolean} [invertY=false]
 *
 * @typedef {Object} LongPressOptions
 * @property {number} [duration=600]
 * @property {() => void} onTrigger
 * @property {() => void} [onCancel]
 */

function clamp01(n) { return Math.max(0, Math.min(1, n)); }

/**
 * Generic pointer-driven dragger.
 * @param {HTMLElement} target
 * @param {DragOptions} opts
 * @returns {() => void} dispose
 */
export function makeDragger(target, opts) {
  const axis = opts.axis;
  const track = () => opts.trackEl || target;
  let active = false;
  let rect = null;

  function progress(e) {
    rect = rect || track().getBoundingClientRect();
    if (axis === 'horizontal') {
      return clamp01((e.clientX - rect.left) / rect.width);
    }
    if (axis === 'vertical') {
      const raw = (e.clientY - rect.top) / rect.height;
      return clamp01(opts.invertY ? raw : 1 - raw);
    }
    // radial: 0 at top (12 o'clock), clockwise
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx) + Math.PI / 2;
    const norm = ((angle + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2);
    return clamp01(norm);
  }

  function down(e) {
    if (e.button !== undefined && e.button !== 0) return;
    active = true;
    rect = track().getBoundingClientRect();
    try { target.setPointerCapture(e.pointerId); } catch {}
    const p = progress(e);
    opts.onStart?.(p, e);
    opts.onDrag(p, e);
    e.preventDefault();
  }
  function move(e) {
    if (!active) return;
    opts.onDrag(progress(e), e);
  }
  function up(e) {
    if (!active) return;
    active = false;
    const p = progress(e);
    try { target.releasePointerCapture(e.pointerId); } catch {}
    opts.onEnd?.(p, e);
    rect = null;
  }

  target.addEventListener('pointerdown', down);
  target.addEventListener('pointermove', move);
  target.addEventListener('pointerup', up);
  target.addEventListener('pointercancel', up);

  return () => {
    target.removeEventListener('pointerdown', down);
    target.removeEventListener('pointermove', move);
    target.removeEventListener('pointerup', up);
    target.removeEventListener('pointercancel', up);
  };
}

/**
 * @param {HTMLElement} target
 * @param {LongPressOptions} opts
 * @returns {() => void} dispose
 */
export function makeLongPress(target, opts) {
  const duration = opts.duration ?? 600;
  let timer = null;

  function down() {
    timer = setTimeout(() => { timer = null; opts.onTrigger(); }, duration);
  }
  function cancel() {
    if (timer != null) { clearTimeout(timer); timer = null; opts.onCancel?.(); }
  }

  target.addEventListener('pointerdown', down);
  target.addEventListener('pointerup', cancel);
  target.addEventListener('pointercancel', cancel);
  target.addEventListener('pointerleave', cancel);

  return () => {
    cancel();
    target.removeEventListener('pointerdown', down);
    target.removeEventListener('pointerup', cancel);
    target.removeEventListener('pointercancel', cancel);
    target.removeEventListener('pointerleave', cancel);
  };
}
