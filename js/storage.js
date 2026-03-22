// ====== STORAGE MODULE ======
// Firebase Firestore + localStorage fallback

const STORAGE_KEY = 'yoavFitV3';

export function getLocal(key, fallback = null) {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return d[key] !== undefined ? d[key] : fallback;
  } catch { return fallback; }
}

export function setLocal(key, value) {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    d[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
  } catch(e) { console.warn('localStorage error:', e); }
}

export async function saveData(key, value) {
  setLocal(key, value);
  if (window._db && window._fbops) {
    try {
      const { doc, setDoc } = window._fbops;
      await setDoc(doc(window._db, 'yoav', key), { v: JSON.stringify(value), ts: Date.now() });
    } catch(e) { console.warn('Firebase save failed:', e); }
  }
}

export async function loadData(key, fallback = null) {
  if (window._db && window._fbops) {
    try {
      const { doc, getDoc } = window._fbops;
      const snap = await getDoc(doc(window._db, 'yoav', key));
      if (snap.exists()) return JSON.parse(snap.data().v);
    } catch(e) { console.warn('Firebase load failed:', e); }
  }
  return getLocal(key, fallback);
}

// ── Date helpers ──
export function getDayKey(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

export function getWeekKeys() {
  return Array.from({length: 7}, (_, i) => getDayKey(i - 6)).reverse();
}

export function getMonthKeys() {
  return Array.from({length: 30}, (_, i) => getDayKey(i - 29)).reverse();
}

export const DAY_NAMES = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
export const MONTH_NAMES = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];

export function getDayLabel(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  if (offset === 0) return `היום — ${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
  if (offset === -1) return `אתמול — ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}

export function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

export function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}
