// ====== CENTRAL DATA STORE ======
// Single source of truth — all modules read/write here
// Reactive — subscribers get notified on every change

import { getDayKey } from './storage.js';

const STORE_KEY = 'yoavFitV3';

// ── Default state ──
const DEFAULT_STATE = {
  // User
  profile: { name: 'יואב', age: 35, height: 176, startWeight: 100, goalWeight: 80 },

  // Daily data (keyed by date YYYY-MM-DD)
  daily: {},      // { [date]: { checks:{}, water:0, mood:null } }
  foodLog: {},    // { [date]: [meals] }
  workoutLog: {}, // { [date]: [sessions] }

  // Settings
  workouts: [],
  notifSchedule: [],
  eventMode: 'normal',
  achievements: [],

  // Persistent
  weights: [],
  favoriteMeals: [], // ← NEW: starred meals
};

// ── In-memory state ──
let _state = {};
let _loaded = false;

// ── Subscribers ──
const _listeners = {};

export function subscribe(key, fn) {
  if (!_listeners[key]) _listeners[key] = [];
  _listeners[key].push(fn);
  return () => { _listeners[key] = _listeners[key].filter(f => f !== fn); };
}

function _notify(key) {
  (_listeners[key] || []).forEach(fn => fn(_state[key]));
  (_listeners['*'] || []).forEach(fn => fn(key, _state[key]));
}

// ── Load / Save ──
function _loadLocal() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function _saveLocal() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(_state)); } catch {}
}

export async function initStore() {
  if (_loaded) return _state;

  // Load from localStorage first (instant)
  const local = _loadLocal();
  _state = { ...DEFAULT_STATE, ...local };

  // Then sync from Firebase if available
  if (window._db && window._fbops) {
    try {
      const { doc, getDoc } = window._fbops;
      const snap = await getDoc(doc(window._db, 'yoav', 'state'));
      if (snap.exists()) {
        const remote = JSON.parse(snap.data().v);
        // Merge remote over local
        _state = { ...DEFAULT_STATE, ...local, ...remote };
        _saveLocal();
      }
    } catch(e) { console.warn('Firebase load failed, using local'); }
  }

  _loaded = true;
  return _state;
}

// ── Get ──
export function get(key) {
  return _state[key];
}

export function getDay(date = getDayKey(0)) {
  return _state.daily?.[date] || { checks: {}, water: 0, mood: null };
}

export function getFoodLog(date = getDayKey(0)) {
  return _state.foodLog?.[date] || [];
}

export function getWorkoutLog(date = getDayKey(0)) {
  return _state.workoutLog?.[date] || [];
}

// ── Set ──
export async function set(key, value) {
  _state[key] = value;
  _saveLocal();
  _notify(key);
  await _pushFirebase(key, value);
}

export async function setDay(date, data) {
  if (!_state.daily) _state.daily = {};
  _state.daily[date] = { ...(_state.daily[date] || {}), ...data };
  _saveLocal();
  _notify('daily');
  await _pushFirebase('daily', _state.daily);
}

export async function setCheck(date, taskId, status) {
  if (!_state.daily) _state.daily = {};
  if (!_state.daily[date]) _state.daily[date] = { checks: {}, water: 0, mood: null };
  _state.daily[date].checks[taskId] = status;
  _saveLocal();
  _notify('daily');
  _notify('checks');
  await _pushFirebase('daily', _state.daily);
}

export async function setWater(date, count) {
  if (!_state.daily) _state.daily = {};
  if (!_state.daily[date]) _state.daily[date] = { checks: {}, water: 0, mood: null };
  _state.daily[date].water = count;
  _saveLocal();
  _notify('daily');
  _notify('water');
  await _pushFirebase('daily', _state.daily);
}

export async function addMeal(date, meal) {
  if (!_state.foodLog) _state.foodLog = {};
  if (!_state.foodLog[date]) _state.foodLog[date] = [];
  _state.foodLog[date].push(meal);
  _saveLocal();
  _notify('foodLog');
  await _pushFirebase('foodLog', _state.foodLog);
}

export async function deleteMeal(date, idx) {
  if (!_state.foodLog?.[date]) return;
  _state.foodLog[date].splice(idx, 1);
  _saveLocal();
  _notify('foodLog');
  await _pushFirebase('foodLog', _state.foodLog);
}

export async function addWorkoutSession(date, session) {
  if (!_state.workoutLog) _state.workoutLog = {};
  if (!_state.workoutLog[date]) _state.workoutLog[date] = [];
  _state.workoutLog[date].push(session);
  _saveLocal();
  _notify('workoutLog');
  await _pushFirebase('workoutLog', _state.workoutLog);
}

// ── Favorite Meals ──
export async function toggleFavoriteMeal(meal) {
  if (!_state.favoriteMeals) _state.favoriteMeals = [];
  const idx = _state.favoriteMeals.findIndex(m => m.name === meal.name);
  if (idx >= 0) {
    _state.favoriteMeals.splice(idx, 1);
  } else {
    _state.favoriteMeals.push({ ...meal, savedAt: Date.now() });
  }
  _saveLocal();
  _notify('favoriteMeals');
  await _pushFirebase('favoriteMeals', _state.favoriteMeals);
  return idx < 0; // true = added, false = removed
}

export function isFavoriteMeal(mealName) {
  return (_state.favoriteMeals || []).some(m => m.name === mealName);
}

// ── Weight ──
export async function addWeight(entry) {
  if (!_state.weights) _state.weights = [];
  _state.weights.push(entry);
  _saveLocal();
  _notify('weights');
  await _pushFirebase('weights', _state.weights);
}

// ── Firebase sync ──
async function _pushFirebase(key, value) {
  if (!window._db || !window._fbops) return;
  try {
    const { doc, setDoc } = window._fbops;
    await setDoc(doc(window._db, 'yoav', key), { v: JSON.stringify(value), ts: Date.now() });
  } catch(e) { console.warn('Firebase push failed:', e.message); }
}

// ── Computed / Stats ──
export function getDayStats(date = getDayKey(0)) {
  const meals = getFoodLog(date);
  const workouts = getWorkoutLog(date);
  const dayData = getDay(date);
  const checks = dayData.checks || {};
  const checkCount = Object.values(checks).filter(v => v === 'done').length;

  return {
    cal: meals.reduce((a, m) => a + (m.cal || 0), 0),
    prot: meals.reduce((a, m) => a + (m.prot || 0), 0),
    carb: meals.reduce((a, m) => a + (m.carb || 0), 0),
    fat: meals.reduce((a, m) => a + (m.fat || 0), 0),
    mealCount: meals.length,
    water: dayData.water || 0,
    workoutCount: workouts.length,
    workoutMinutes: workouts.reduce((a, w) => a + (w.duration || 0), 0),
    checksDone: checkCount,
    checksTotal: 10,
    score: Math.round((checkCount / 10) * 100),
  };
}

export function getWeekStats() {
  return Array.from({ length: 7 }, (_, i) => {
    const date = getDayKey(-i);
    return { date, ...getDayStats(date) };
  }).reverse();
}

export function getCurrentWeight() {
  const w = _state.weights || [];
  return w.length > 0 ? w[w.length - 1].weight : 100;
}

export function getWeightLost() {
  const profile = _state.profile || DEFAULT_STATE.profile;
  return +(profile.startWeight - getCurrentWeight()).toFixed(1);
}
