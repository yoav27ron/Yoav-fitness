// ====== PROGRESS + DASHBOARD + ACHIEVEMENTS + EVENTS ======
import { getDayKey, DAY_NAMES, MONTH_NAMES, showToast } from './store.js';

// ── STATE ──
let weights = [];
let workoutLog = {};
let foodLog = {};
let waterLog = {};
let checks = {};
let currentEventMode = null;
let achievements = [];

// ── EVENT MODES ──
export const EVENT_MODES = [
  { id:'normal', icon:'🏠', title:'שגרה רגילה', desc:'תוכנית מלאה — אימונים + תזונה + מים', color:'var(--gold)' },
  { id:'wedding', icon:'💍', title:'אירוע / חתונה', desc:'יום אחד חופשי. חזרה לשגרה מחר.', color:'var(--purple)' },
  { id:'vacation', icon:'✈️', title:'חופשה', desc:'אימון מינימלי + תזונה מרוחקת. שמור על הבסיס.', color:'var(--blue)' },
  { id:'sick', icon:'🤒', title:'מחלה / שיקום', desc:'מנוחה מלאה. שתיית מים מוגברת.', color:'var(--red)' },
  { id:'travel', icon:'🏨', title:'נסיעת עסקים', desc:'אימוני גוף בחדר. תזונה נכונה גם בחוץ.', color:'var(--cyan)' },
  { id:'ramadan', icon:'🌙', title:'צום / רמדאן', desc:'התאמת שעות האכילה ואימונים.', color:'var(--orange)' },
];

// ── ACHIEVEMENTS ──
const ACHIEVEMENT_DEFS = [
  { id:'first_workout', icon:'🏅', name:'אימון ראשון', desc:'השלמת את האימון הראשון שלך', check: (d) => Object.values(d.workoutLog||{}).flat().length >= 1 },
  { id:'week1', icon:'🗓️', name:'שבוע ראשון', desc:'7 ימים רצופים עם אכילה מתועדת', check: (d) => checkConsecutiveDays(d.foodLog, 7) },
  { id:'workouts_5', icon:'💪', name:'5 אימונים', desc:'השלמת 5 אימונים', check: (d) => Object.values(d.workoutLog||{}).flat().length >= 5 },
  { id:'workouts_10', icon:'🔟', name:'10 אימונים', desc:'השלמת 10 אימונים', check: (d) => Object.values(d.workoutLog||{}).flat().length >= 10 },
  { id:'water_goal', icon:'💧', name:'ים של מים', desc:'הגעת ליעד המים יום אחד', check: (d) => Object.values(d.waterLog||{}).some(v=>v>=10) },
  { id:'lost_2kg', icon:'⚖️', name:'-2 ק"ג', desc:'ירדת 2 ק"ג מההתחלה', check: (d) => d.weights?.length>=2 && (d.weights[0].weight - d.weights[d.weights.length-1].weight) >= 2 },
  { id:'lost_5kg', icon:'🏆', name:'-5 ק"ג', desc:'ירדת 5 ק"ג מההתחלה', check: (d) => d.weights?.length>=2 && (d.weights[0].weight - d.weights[d.weights.length-1].weight) >= 5 },
  { id:'lost_10kg', icon:'🌟', name:'-10 ק"ג', desc:'ירדת 10 ק"ג — מחצית הדרך!', check: (d) => d.weights?.length>=2 && (d.weights[0].weight - d.weights[d.weights.length-1].weight) >= 10 },
  { id:'reach_goal', icon:'🎯', name:'הגעת ל-80!', desc:'הגעת ליעד המשקל שלך', check: (d) => d.weights?.some(w=>w.weight<=80) },
  { id:'streak_3', icon:'🔥', name:'3 ימי ריצה', desc:'3 ימי ריצה רצופים', check: (d) => checkWorkoutStreak(d.workoutLog, 'run', 3) },
  { id:'run_5k', icon:'🏃', name:'5 ק"מ ריצה', desc:'רצת 5 ק"מ ברצף', check: (d) => Object.values(d.workoutLog||{}).flat().some(l=>l.sportType==='run'&&(l.distance||0)>=5) },
];

function checkConsecutiveDays(log, n) {
  let count = 0, max = 0;
  for (let i = 0; i < 60; i++) {
    const key = getDayKey(-i);
    if ((log||{})[key]?.length > 0) count++; else count = 0;
    max = Math.max(max, count);
  }
  return max >= n;
}

function checkWorkoutStreak(log, sport, n) {
  let count = 0;
  for (let i = 0; i < 30; i++) {
    const key = getDayKey(-i);
    if ((log||{})[key]?.some(l=>l.sportType===sport)) count++; else count = 0;
    if (count >= n) return true;
  }
  return false;
}

// ── INIT ──
export async function initProgress() {
  const { get: sg, subscribe, getDayStats, getWeekStats } = await import('./store.js');
  const refresh = () => {
    weights      = sg('weights')     || [];
    workoutLog   = sg('workoutLog')  || {};
    foodLog      = sg('foodLog')     || {};
    currentEventMode = sg('eventMode') || 'normal';
    achievements = sg('achievements')|| [];
    waterLog = {};
    const daily  = sg('daily') || {};
    Object.entries(daily).forEach(([date, d]) => { if (d.water) waterLog[date] = d.water; });
  };
  refresh();
  subscribe('*', (key) => {
    if (['weights','workoutLog','foodLog','daily','eventMode'].includes(key)) {
      refresh();
      if (document.getElementById('dashboard')?.classList.contains('active')) renderDashboard();
    }
  });
  checkAchievements();
  renderDashboard();
  renderCalendar();
  renderProgressSection();
  renderAchievements();
  renderEventModes();
}

// ── DASHBOARD ──
function renderDashboard() {
  const el = document.getElementById('dashboardContent');
  if (!el) return;

  const todayKey = getDayKey(0);
  const todayMeals = foodLog[todayKey] || [];
  const todayCal = todayMeals.reduce((a,m)=>a+m.cal,0);
  const todayProt = todayMeals.reduce((a,m)=>a+m.prot,0);
  const todayWater = waterLog[todayKey] || 0;
  const todayWorkouts = (workoutLog[todayKey]||[]).length;
  const currentWeight = weights.length > 0 ? weights[weights.length-1].weight : 100;
  const lost = +(100 - currentWeight).toFixed(1);
  const remaining = +(currentWeight - 80).toFixed(1);
  const weekWorkouts = getWeekKeys().reduce((a,k)=>a+(workoutLog[k]||[]).length,0);

  const calPct = Math.min((todayCal/1900)*100,100);
  const waterPct = Math.min((todayWater/10)*100,100);
  const weightPct = Math.min((lost/20)*100,100);

  el.innerHTML = `
    <!-- Current mode banner -->
    ${currentEventMode !== 'normal' ? (() => {
      const m = EVENT_MODES.find(e=>e.id===currentEventMode);
      return `<div style="background:rgba(245,166,35,0.08);border:1px solid rgba(245,166,35,0.25);border-radius:12px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;gap:10px;">
        <span style="font-size:24px;">${m?.icon}</span>
        <div><div style="font-weight:600;">מצב: ${m?.title}</div><div style="font-size:12px;color:var(--muted2);">${m?.desc}</div></div>
        <button onclick="window.progress.setEventMode('normal')" style="margin-right:auto;background:transparent;border:none;color:var(--muted2);cursor:pointer;font-size:12px;">חזור לשגרה ✕</button>
      </div>`;
    })() : ''}

    <!-- KPI Grid -->
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px;">
      ${kpiCard('🔥','קלוריות היום',todayCal,'/ 1,900',calPct,'var(--gold)')}
      ${kpiCard('💧','מים היום',todayWater,'/ 10 כוסות',waterPct,'var(--blue)')}
      ${kpiCard('💪','אימונים השבוע',weekWorkouts,'אימונים',(weekWorkouts/4)*100,'var(--purple)')}
      ${kpiCard('⚖️','ירדת',lost,'ק"ג מ-100',weightPct,'var(--green)')}
    </div>

    <!-- Goal progress -->
    <div class="card" style="margin-bottom:14px;">
      <div class="card-body">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div style="font-weight:700;">🎯 דרך ל-80 ק"ג</div>
          <div style="font-size:13px;color:var(--gold);font-weight:700;">${currentWeight} ק"ג</div>
        </div>
        <div style="height:10px;background:rgba(255,255,255,0.08);border-radius:100px;overflow:hidden;margin-bottom:8px;">
          <div style="height:100%;width:${weightPct}%;background:linear-gradient(90deg,var(--gold2),var(--gold));border-radius:100px;transition:width 0.8s;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted2);">
          <span>נשארו ${remaining} ק"ג</span>
          <span>${weightPct.toFixed(0)}% מהדרך</span>
          <span style="color:var(--green);">${predictGoalDate()}</span>
        </div>
      </div>
    </div>

    <!-- Today summary -->
    <div class="card">
      <div class="card-head"><div class="card-icon">📋</div><div><div class="card-title">סיכום היום</div><div class="card-meta">מה בוצע ומה נשאר</div></div></div>
      <div class="card-body">
        ${summaryRow('ארוחות',todayMeals.length+' ארוחות · '+todayCal+' קל\'',todayCal>0)}
        ${summaryRow('מים',todayWater+' כוסות',todayWater>=8)}
        ${summaryRow('אימון',todayWorkouts>0?'✓ בוצע':'לא בוצע עדיין',todayWorkouts>0)}
        ${summaryRow('חלבון',todayProt+'g',todayProt>=100)}
      </div>
    </div>
  `;
}

function kpiCard(icon, label, value, sub, pct, color) {
  return `<div class="card" style="padding:0;">
    <div class="card-body">
      <div style="font-size:11px;color:var(--muted2);margin-bottom:4px;">${icon} ${label}</div>
      <div style="font-size:26px;font-weight:900;color:${color};line-height:1;">${value}</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:8px;">${sub}</div>
      <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:100px;overflow:hidden;">
        <div style="height:100%;width:${Math.min(pct,100)}%;background:${color};border-radius:100px;"></div>
      </div>
    </div>
  </div>`;
}

function summaryRow(label, value, done) {
  return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
    <div style="width:20px;height:20px;border-radius:5px;background:${done?'rgba(52,211,153,0.2)':'rgba(255,255,255,0.05)'};display:flex;align-items:center;justify-content:center;font-size:12px;">${done?'✓':''}</div>
    <div style="font-size:13px;color:var(--muted2);width:80px;">${label}</div>
    <div style="font-size:13px;font-weight:600;color:${done?'var(--text)':'var(--muted2)'};">${value}</div>
  </div>`;
}

function predictGoalDate() {
  if (weights.length < 2) return 'עדכן משקל לחיזוי';
  const current = weights[weights.length-1].weight;
  if (current <= 80) return '🎉 הגעת ליעד!';
  const first = weights[0].weight;
  const days = Math.max(1, Math.floor((new Date(weights[weights.length-1].date?.split('/').reverse().join('-')||Date.now()) - new Date(weights[0].date?.split('/').reverse().join('-')||Date.now())) / (1000*60*60*24)));
  const ratePerDay = (first - current) / days;
  if (ratePerDay <= 0) return 'שמור על הכיוון 💪';
  const daysLeft = Math.ceil((current - 80) / ratePerDay);
  const goalDate = new Date();
  goalDate.setDate(goalDate.getDate() + daysLeft);
  return `יעד: ${goalDate.getDate()} ${MONTH_NAMES[goalDate.getMonth()]} ${goalDate.getFullYear()}`;
}

// ── CALENDAR ──
function renderCalendar(year, month) {
  const el = document.getElementById('calendarContent');
  if (!el) return;
  const now = new Date();
  const y   = year  ?? now.getFullYear();
  const m   = month ?? now.getMonth();
  const firstDay    = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m+1, 0).getDate();
  const todayStr    = getDayKey(0);
  const daily       = window.store?.get('daily') || {};

  const cells = [];
  for (let i=0; i<firstDay; i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) {
    const dateStr = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayData = daily[dateStr] || {};
    const checks  = dayData.checks || {};
    const done    = Object.values(checks).filter(v=>v==='done').length;
    const total   = 10;
    const score   = Math.round((done/total)*100);
    const hasW    = (workoutLog[dateStr]||[]).length > 0;
    const meals   = (foodLog[dateStr]||[]).length;
    const water   = dayData.water || 0;
    const waterOk = water >= 8;
    const hasSomeActivity = done > 0 || hasW || meals > 0;
    // Color based on score
    const bgColor = !hasSomeActivity ? 'transparent'
      : score >= 70 ? 'rgba(52,211,153,0.15)'
      : score >= 40 ? 'rgba(245,166,35,0.12)'
      : 'rgba(248,113,113,0.08)';
    cells.push({ d, dateStr, hasW, meals, water, waterOk, done, score, isToday: dateStr===todayStr, bgColor });
  }

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <button onclick="window.progress.navCal(${y},${m},-1)" class="btn btn-ghost" style="padding:6px 12px;font-size:14px;">◀</button>
      <div style="font-weight:700;font-size:16px;">${MONTH_NAMES[m]} ${y}</div>
      <button onclick="window.progress.navCal(${y},${m},1)" class="btn btn-ghost" style="padding:6px 12px;font-size:14px;">▶</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:6px;">
      ${DAY_NAMES.map(d=>`<div style="text-align:center;font-size:9px;color:var(--muted2);padding:3px 0;">${d.substring(0,1)}</div>`).join('')}
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:14px;">
      ${cells.map(cell => !cell ? '<div></div>' : `
        <div onclick="window.progress.showDayDetail('${cell.dateStr}')"
          style="aspect-ratio:1;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;border:1.5px solid ${cell.isToday?'var(--gold)':'transparent'};background:${cell.bgColor};cursor:pointer;padding:2px;">
          <div style="font-size:11px;font-weight:${cell.isToday?'700':'400'};color:${cell.isToday?'var(--gold)':cell.score>=70&&cell.done>0?'var(--green)':'var(--text)'};">${cell.d}</div>
          ${cell.done>0 ? `<div style="font-size:9px;font-weight:700;color:${cell.score>=70?'var(--green)':cell.score>=40?'var(--gold)':'var(--red)'};">${cell.score}%</div>` : ''}
          <div style="display:flex;gap:1px;margin-top:1px;">
            ${cell.hasW   ? '<div style="width:3px;height:3px;border-radius:50%;background:var(--gold);"></div>' :''}
            ${cell.meals>0? '<div style="width:3px;height:3px;border-radius:50%;background:var(--green);"></div>':''}
            ${cell.waterOk? '<div style="width:3px;height:3px;border-radius:50%;background:var(--blue);"></div>' :''}
          </div>
        </div>`).join('')}
    </div>

    <!-- Stats summary -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;">
      ${_monthStats(y, m, daily)}
    </div>

    <!-- Legend -->
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--muted2);"><div style="width:10px;height:10px;border-radius:3px;background:rgba(52,211,153,0.2);"></div>70%+ מצוין</div>
      <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--muted2);"><div style="width:10px;height:10px;border-radius:3px;background:rgba(245,166,35,0.15);"></div>40-70% טוב</div>
      <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--muted2);"><div style="width:10px;height:10px;border-radius:3px;background:rgba(248,113,113,0.1);"></div>מתחת 40%</div>
    </div>

    <!-- Day detail panel -->
    <div id="dayDetailPanel"></div>
  `;
}

function _monthStats(y, m, daily) {
  let activeDays=0, totalScore=0, workoutDays=0;
  const daysInMonth = new Date(y, m+1, 0).getDate();
  for (let d=1; d<=daysInMonth; d++) {
    const dateStr = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayData = daily[dateStr] || {};
    const checks  = dayData.checks || {};
    const done    = Object.values(checks).filter(v=>v==='done').length;
    if (done > 0) { activeDays++; totalScore += Math.round((done/10)*100); }
    if ((workoutLog[dateStr]||[]).length > 0) workoutDays++;
  }
  const avgScore = activeDays > 0 ? Math.round(totalScore/activeDays) : 0;
  return [
    ['📅', 'ימים פעילים', activeDays],
    ['💪', 'אימונים', workoutDays],
    ['⭐', 'ציון ממוצע', avgScore+'%'],
  ].map(([icon, label, val]) => `
    <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px;text-align:center;">
      <div style="font-size:18px;">${icon}</div>
      <div style="font-size:18px;font-weight:800;color:var(--gold);">${val}</div>
      <div style="font-size:10px;color:var(--muted2);">${label}</div>
    </div>`).join('');
}

export function navCal(y, m, dir) {
  let nm = m + dir, ny = y;
  if (nm < 0) { nm = 11; ny--; }
  if (nm > 11) { nm = 0; ny++; }
  renderCalendar(ny, nm);
}

export function showDayDetail(dateStr) {
  const panel = document.getElementById('dayDetailPanel');
  if (!panel) return;
  const d       = new Date(dateStr);
  const label   = `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
  const sessions= workoutLog[dateStr] || [];
  const meals   = foodLog[dateStr]    || [];
  const daily   = window.store?.get('daily') || {};
  const dayData = daily[dateStr]      || {};
  const water   = dayData.water       || 0;
  const checks  = dayData.checks      || {};
  const done    = Object.values(checks).filter(v=>v==='done').length;
  const totCal  = meals.reduce((a,m)=>a+(m.cal||0),0);

  const TASK_NAMES = {
    morning_water:'💧 מים בקימה', meal1:'🍳 ארוחת בוקר', water_mid:'💧 מים בוקר',
    snack:'🍌 חטיף', workout:'💪 אימון', meal2:'🥩 ארוחת צהריים',
    water_aft:'💧 מים אחה"צ', meal3:'🍽️ ארוחת ערב', snack_eve:'🍎 חטיף ערב', water_night:'💧 מים לפני שינה'
  };

  panel.innerHTML = `
    <div style="background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;">
      <div style="padding:13px 16px;background:rgba(255,255,255,0.03);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
        <div style="font-weight:700;font-size:15px;">${label}</div>
        <button onclick="document.getElementById('dayDetailPanel').innerHTML=''" style="background:none;border:none;color:var(--muted2);font-size:14px;cursor:pointer;">✕</button>
      </div>
      <div style="padding:13px 16px;">
        <!-- Stats row -->
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
          <div style="background:rgba(245,166,35,0.08);border:1px solid rgba(245,166,35,0.2);border-radius:9px;padding:7px 12px;text-align:center;flex:1;min-width:70px;">
            <div style="font-size:16px;font-weight:800;color:var(--gold);">${Math.round((done/10)*100)}%</div>
            <div style="font-size:10px;color:var(--muted2);">ציון יומי</div>
          </div>
          <div style="background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);border-radius:9px;padding:7px 12px;text-align:center;flex:1;min-width:70px;">
            <div style="font-size:16px;font-weight:800;color:var(--green);">${totCal}</div>
            <div style="font-size:10px;color:var(--muted2);">קל׳</div>
          </div>
          <div style="background:rgba(96,165,250,0.08);border:1px solid rgba(96,165,250,0.2);border-radius:9px;padding:7px 12px;text-align:center;flex:1;min-width:70px;">
            <div style="font-size:16px;font-weight:800;color:var(--blue);">${water}</div>
            <div style="font-size:10px;color:var(--muted2);">כוסות</div>
          </div>
        </div>

        <!-- Tasks -->
        ${done > 0 ? `
        <div style="margin-bottom:12px;">
          <div style="font-size:12px;font-weight:700;color:var(--muted2);margin-bottom:6px;">משימות (${done}/10)</div>
          <div style="display:flex;flex-direction:column;gap:4px;">
            ${Object.entries(checks).map(([id,status]) => `
              <div style="display:flex;align-items:center;gap:8px;padding:5px 8px;background:rgba(255,255,255,0.03);border-radius:7px;">
                <span style="font-size:14px;">${status==='done'?'✅':status==='skipped'?'❌':'⏰'}</span>
                <span style="font-size:12px;color:var(--muted2);">${TASK_NAMES[id]||id}</span>
              </div>`).join('')}
          </div>
        </div>` : ''}

        <!-- Workouts -->
        ${sessions.length > 0 ? `
        <div style="margin-bottom:10px;">
          <div style="font-size:12px;font-weight:700;color:var(--muted2);margin-bottom:5px;">אימונים</div>
          ${sessions.map(s=>`<div style="font-size:13px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04);">💪 ${s.name||'אימון'} · ${s.duration||0} דק׳ · ${s.calories||0} קל׳</div>`).join('')}
        </div>` : ''}

        <!-- Meals -->
        ${meals.length > 0 ? `
        <div>
          <div style="font-size:12px;font-weight:700;color:var(--muted2);margin-bottom:5px;">ארוחות</div>
          ${meals.map(m=>`<div style="font-size:13px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04);">🍽️ ${m.name} · ${m.cal} קל׳</div>`).join('')}
        </div>` : ''}

        ${done===0&&sessions.length===0&&meals.length===0 ? '<div style="font-size:13px;color:var(--muted2);text-align:center;padding:8px;">אין נתונים ליום זה</div>' : ''}
      </div>
    </div>`;

  // Scroll to panel
  setTimeout(() => panel.scrollIntoView({behavior:'smooth', block:'nearest'}), 100);
}

// ── WEIGHT PROGRESS ──
function renderProgressSection() {
  const el = document.getElementById('progressContent');
  if (!el) return;
  el.innerHTML = `
    <!-- Weight entry -->
    <div class="card" style="margin-bottom:14px;">
      <div class="card-head"><div class="card-icon">⚖️</div><div><div class="card-title">עדכון משקל שבועי</div><div class="card-meta">בוקר, לפני אוכל, אחרי שירותים</div></div></div>
      <div class="card-body">
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
          <input type="number" id="weightInput" placeholder="100" min="60" max="150" step="0.1" class="input" style="width:110px;font-size:22px;font-weight:700;text-align:center;"/>
          <span style="font-size:16px;color:var(--muted2);">ק"ג</span>
          <button onclick="window.progress.updateWeight()" class="btn btn-primary">עדכן</button>
        </div>
        <div id="weightFeedback" style="margin-top:10px;font-size:13px;color:var(--muted2);"></div>
      </div>
    </div>

    <!-- Weight chart -->
    <div class="card" style="margin-bottom:14px;">
      <div class="card-head"><div class="card-icon">📊</div><div><div class="card-title">גרף משקל</div></div></div>
      <div class="card-body">
        ${renderWeightChart()}
      </div>
    </div>

    <!-- History -->
    <div class="card">
      <div class="card-head"><div class="card-icon">📋</div><div><div class="card-title">היסטוריה</div></div></div>
      <div class="card-body" id="weightList">
        ${renderWeightList()}
      </div>
    </div>`;
}

function renderWeightChart() {
  if (weights.length < 2) return '<div style="font-size:13px;color:var(--muted2);">עדכן לפחות 2 שקילות לראות גרף</div>';
  const last10 = weights.slice(-10);
  const min = Math.min(...last10.map(w=>w.weight)) - 1;
  const max = Math.max(...last10.map(w=>w.weight)) + 1;
  const W=320, H=80, pad=30;
  const pts = last10.map((w,i) => {
    const x = pad + (i/(last10.length-1))*(W-pad*2);
    const y = H - pad - ((w.weight-min)/(max-min))*(H-pad*2);
    return {x,y,w};
  });
  const path = pts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="overflow:visible;">
    <path d="${path}" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    ${pts.map(p=>`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="var(--gold)"/>`).join('')}
    ${pts.map(p=>`<text x="${p.x.toFixed(1)}" y="${(p.y-8).toFixed(1)}" text-anchor="middle" style="font-size:10px;fill:var(--muted2);">${p.w.weight}</text>`).join('')}
    <line x1="${pad}" y1="${H-pad}" x2="${W-pad}" y2="${H-pad}" stroke="var(--border)" stroke-width="0.5"/>
  </svg>`;
}

function renderWeightList() {
  if (weights.length === 0) return '<div style="font-size:13px;color:var(--muted2);">עוד לא עדכנת משקל.</div>';
  return weights.slice().reverse().map(w =>
    `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);">
      <span style="color:var(--muted2);font-size:12px;min-width:80px;">${w.date}</span>
      <span style="font-size:18px;font-weight:700;">${w.weight} ק"ג</span>
      ${w.diff!==0?`<span style="font-size:12px;color:${w.diff<0?'var(--green)':'var(--red)'};font-weight:600;">${w.diff>0?'+':''}${w.diff}</span>`:''}
    </div>`).join('');
}

export async function updateWeight() {
  const val = parseFloat(document.getElementById('weightInput')?.value);
  if (!val||val<60||val>150) { showToast('❌ משקל לא תקין'); return; }
  const entry = { weight:val, date:new Date().toLocaleDateString('he-IL'), diff: weights.length>0?+(val-weights[weights.length-1].weight).toFixed(1):0 };
  weights.push(entry);
  await saveData('weights', weights);
  renderProgressSection();
  updateHeroProgress(val);
  checkAchievements();
  const lost = +(100-val).toFixed(1);
  const fb = document.getElementById('weightFeedback');
  if (fb && lost>0) fb.innerHTML = `<span style="color:var(--green)">ירדת ${lost} ק"ג!</span> נשארו <strong>${+(val-80).toFixed(1)} ק"ג</strong> ליעד`;
  showToast('⚖️ משקל עודכן!');
}

function updateHeroProgress(w) {
  const pct = Math.min(Math.max(((100-w)/20)*100,0),100);
  const bar = document.getElementById('progressBar');
  const note = document.getElementById('progressNote');
  if (bar) bar.style.width = pct.toFixed(1)+'%';
  if (note) note.textContent = `ירדת ${(100-w).toFixed(1)} ק"ג מתוך 20 ליעד (${pct.toFixed(0)}%)`;
}

// ── ACHIEVEMENTS ──
function checkAchievements() {
  const data = { weights, workoutLog, foodLog, waterLog };
  let newUnlock = false;
  ACHIEVEMENT_DEFS.forEach(def => {
    if (!achievements.includes(def.id) && def.check(data)) {
      achievements.push(def.id);
      newUnlock = true;
      setTimeout(() => showToast(`🏆 הישג חדש: ${def.name}!`, 4000), 500);
    }
  });
  if (newUnlock) saveData('achievements', achievements);
}

function renderAchievements() {
  const el = document.getElementById('achievementsContent');
  if (!el) return;
  const unlocked = achievements.length;
  el.innerHTML = `
    <div style="font-size:13px;color:var(--muted2);margin-bottom:16px;">${unlocked} מתוך ${ACHIEVEMENT_DEFS.length} הישגים נפתחו</div>
    <div class="badge-grid">
      ${ACHIEVEMENT_DEFS.map(def => {
        const done = achievements.includes(def.id);
        return `<div class="badge-card ${done?'unlocked':'locked'}">
          <span class="badge-icon">${def.icon}</span>
          <div class="badge-name">${def.name}</div>
          <div class="badge-desc">${def.desc}</div>
        </div>`;
      }).join('')}
    </div>`;
}

// ── EVENT MODES ──
function renderEventModes() {
  const el = document.getElementById('eventModesContent');
  if (!el) return;
  el.innerHTML = `
    <div class="info-box">בחתונה? בחופשה? מחלה? המערכת מסתגלת ומציגה משימות מותאמות למצב שלך.</div>
    ${EVENT_MODES.map(m => `
      <div class="event-mode-card ${currentEventMode===m.id?'active':''}" onclick="window.progress.setEventMode('${m.id}')">
        <div class="event-icon">${m.icon}</div>
        <div class="event-info">
          <div class="event-title" style="color:${currentEventMode===m.id?'var(--gold)':''}">${m.title} ${currentEventMode===m.id?'✓':''}</div>
          <div class="event-desc">${m.desc}</div>
        </div>
      </div>`).join('')}`;
}

export async function setEventMode(id) {
  currentEventMode = id;
  const { set } = await import('./store.js');
  await set('eventMode', id);
  renderEventModes();
  renderDashboard();
  showToast(`✅ מצב: ${EVENT_MODES.find(m=>m.id===id)?.title}`);
}

export { renderDashboard, renderCalendar, checkAchievements };
