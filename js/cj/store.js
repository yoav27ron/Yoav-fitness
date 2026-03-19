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
}
