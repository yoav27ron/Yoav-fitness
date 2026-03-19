<<<<<<< HEAD
// ====== YOAV FIT — CENTRAL STORE v3 ======
const FB_KEY = 'yoavFitV3';
let _state = {};
let _ready = false;
const _subs = {};

export function subscribe(key, fn) {
  if (!_subs[key]) _subs[key] = [];
  _subs[key].push(fn);
  return () => { _subs[key] = _subs[key].filter(f => f !== fn); };
}
function _emit(key) {
  (_subs[key]||[]).forEach(fn=>{try{fn(_state[key]);}catch(e){}});
  (_subs['*']||[]).forEach(fn=>{try{fn(key,_state[key]);}catch(e){}});
}
function _load(){try{return JSON.parse(localStorage.getItem(FB_KEY)||'{}');}catch{return {};}}
function _save(){try{localStorage.setItem(FB_KEY,JSON.stringify(_state));}catch(e){}}
async function _fbPush(key){
  if(!window._db||!window._fbops)return;
  try{const{doc,setDoc}=window._fbops;await setDoc(doc(window._db,'yoav',key),{v:JSON.stringify(_state[key]),ts:Date.now()});}
  catch(e){console.warn('FB push:',e.message);}
}

export async function initStore(){
  if(_ready)return _state;
  _state=_load();
  if(window._db&&window._fbops){
    try{
      const{doc,getDoc}=window._fbops;
      const keys=['daily','foodLog','workoutLog','weights','workouts','notifSchedule','eventMode','achievements','favoriteMeals'];
      await Promise.all(keys.map(async k=>{
        const snap=await getDoc(doc(window._db,'yoav',k));
        if(snap.exists())_state[k]=JSON.parse(snap.data().v);
      }));
      _save();
    }catch(e){console.warn('FB init failed, using local');}
  }
  _ready=true;
  console.log('✅ Store ready, keys:',Object.keys(_state).join(', '));
  return _state;
}

export function get(key){return _state[key];}
export async function set(key,value){_state[key]=value;_save();_emit(key);await _fbPush(key);}

export function getDayKey(offset=0){const d=new Date();d.setDate(d.getDate()+(offset||0));return d.toISOString().split('T')[0];}
export function getDay(date){return _state.daily?.[date||getDayKey(0)]||{checks:{},water:0};}

export async function setCheck(date,taskId,status){
  if(!_state.daily)_state.daily={};
  if(!_state.daily[date])_state.daily[date]={checks:{},water:0};
  _state.daily[date].checks[taskId]=status;
  _save();_emit('daily');_emit('checks');await _fbPush('daily');
}
export async function setWater(date,count){
  if(!_state.daily)_state.daily={};
  if(!_state.daily[date])_state.daily[date]={checks:{},water:0};
  _state.daily[date].water=count;
  _save();_emit('daily');_emit('water');await _fbPush('daily');
}

export function getFoodLog(date){return _state.foodLog?.[date||getDayKey(0)]||[];}
export async function addMeal(date,meal){
  if(!_state.foodLog)_state.foodLog={};
  if(!_state.foodLog[date])_state.foodLog[date]=[];
  _state.foodLog[date].push(meal);_save();_emit('foodLog');await _fbPush('foodLog');
}
export async function deleteMeal(date,idx){
  if(!_state.foodLog?.[date])return;
  _state.foodLog[date].splice(idx,1);_save();_emit('foodLog');await _fbPush('foodLog');
}

export function getWorkoutLog(date){return _state.workoutLog?.[date||getDayKey(0)]||[];}
export async function addWorkoutSession(date,session){
  if(!_state.workoutLog)_state.workoutLog={};
  if(!_state.workoutLog[date])_state.workoutLog[date]=[];
  _state.workoutLog[date].push(session);_save();_emit('workoutLog');await _fbPush('workoutLog');
}

export async function addWeight(entry){
  if(!_state.weights)_state.weights=[];
  _state.weights.push(entry);_save();_emit('weights');await _fbPush('weights');
}
export function getCurrentWeight(){const w=_state.weights||[];return w.length>0?w[w.length-1].weight:100;}
export function getWeightLost(){return Math.max(0,+(100-getCurrentWeight()).toFixed(1));}

export async function toggleFavoriteMeal(meal){
  if(!_state.favoriteMeals)_state.favoriteMeals=[];
  const idx=_state.favoriteMeals.findIndex(m=>m.name===meal.name);
  if(idx>=0)_state.favoriteMeals.splice(idx,1);
  else _state.favoriteMeals.push({...meal,savedAt:Date.now()});
  _save();_emit('favoriteMeals');await _fbPush('favoriteMeals');
  return idx<0;
}
export function isFavoriteMeal(name){return(_state.favoriteMeals||[]).some(m=>m.name===name);}

export function getDayStats(date){
  const d=date||getDayKey(0);
  const meals=getFoodLog(d);
  const day=getDay(d);
  const checks=day.checks||{};
  const checksDone=Object.values(checks).filter(v=>v==='done').length;
  return{
    cal:meals.reduce((a,m)=>a+(m.cal||0),0),
    prot:meals.reduce((a,m)=>a+(m.prot||0),0),
    carb:meals.reduce((a,m)=>a+(m.carb||0),0),
    fat:meals.reduce((a,m)=>a+(m.fat||0),0),
    mealCount:meals.length,
    water:day.water||0,
    workoutCount:getWorkoutLog(d).length,
    checksDone,checksTotal:10,
    score:Math.round((checksDone/10)*100),
  };
}
export function getWeekStats(){
  return Array.from({length:7},(_,i)=>({date:getDayKey(i-6),...getDayStats(getDayKey(i-6))}));
}

export const DAY_NAMES=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
export const MONTH_NAMES=['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
export function getDayLabel(offset=0){
  const d=new Date();d.setDate(d.getDate()+(offset||0));
  if(offset===0)return`היום — ${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
  if(offset===-1)return`אתמול — ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
  return`${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}
export function formatTime(secs){
  const h=Math.floor(secs/3600),m=Math.floor((secs%3600)/60),s=secs%60;
  if(h>0)return`${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
export function showToast(msg,duration=2800){
  const t=document.getElementById('toast');
  if(!t)return;
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),duration);
}

// ── Alcohol ──────────────────────────────────────────
export function getAlcoholLog(date) {
  return _state.alcoholLog?.[date || getDayKey(0)] || [];
}
export async function addDrink(date, drink) {
  if (!_state.alcoholLog) _state.alcoholLog = {};
  if (!_state.alcoholLog[date]) _state.alcoholLog[date] = [];
  _state.alcoholLog[date].push(drink);
  _save(); _emit('alcoholLog'); await _fbPush('alcoholLog');
}
export async function removeDrink(date, idx) {
  if (!_state.alcoholLog?.[date]) return;
  _state.alcoholLog[date].splice(idx, 1);
  _save(); _emit('alcoholLog'); await _fbPush('alcoholLog');
}
export function getWeekAlcohol() {
  return Array.from({length:7}, (_,i) => {
    const d = getDayKey(i-6);
    const drinks = getAlcoholLog(d);
    return { date:d, drinks:drinks.length, units:drinks.reduce((a,dr)=>a+(dr.units||0),0), cal:drinks.reduce((a,dr)=>a+(dr.cal||0),0) };
  });
=======
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
>>>>>>> 9ca5fe4d518301481d2f7befb8e2642dedcab3f6
}
