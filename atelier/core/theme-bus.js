const THEMES = ['boudoir', 'industrial', 'editorial', 'clinical', 'hud', 'ivory-day'];
const STORAGE_KEY = 'atelier:theme';
const ACCENT_KEY = 'atelier:accent';

/** @param {string} name */
export function setTheme(name) {
  if (!THEMES.includes(name)) return;
  document.documentElement.dataset.theme = name;
  try { localStorage.setItem(STORAGE_KEY, name); } catch {}
  dispatchEvent(new CustomEvent('atelier:theme-change', { detail: { theme: name } }));
}

export function getTheme() {
  return document.documentElement.dataset.theme || 'boudoir';
}

export function listThemes() {
  return [...THEMES];
}

/** @param {string} accentId */
export function setAccent(accentId) {
  document.documentElement.dataset.accent = accentId;
  try { localStorage.setItem(ACCENT_KEY, accentId); } catch {}
  dispatchEvent(new CustomEvent('atelier:accent-change', { detail: { accent: accentId } }));
}

export function getAccent() {
  return document.documentElement.dataset.accent || null;
}

export function restoreFromStorage() {
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    const a = localStorage.getItem(ACCENT_KEY);
    if (t) setTheme(t);
    if (a) setAccent(a);
  } catch {}
}
