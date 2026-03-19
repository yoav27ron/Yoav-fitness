// ====== TRAINING MODULE ======
import { saveData, loadData, DAY_NAMES, getDayKey, formatTime, showToast } from './storage.js';

// ── SPORT TYPES ──
export const SPORT_TYPES = [
  // כוח
  { id:'strength_legs', name:'רגליים', icon:'🦵', cat:'כוח', met:5 },
  { id:'strength_upper', name:'פלג עליון', icon:'💪', cat:'כוח', met:5 },
  { id:'strength_full', name:'כל הגוף', icon:'🏋️', cat:'כוח', met:6 },
  { id:'calisthenics', name:'קליסטניקס', icon:'🤸', cat:'כוח', met:5 },
  // קרדיו
  { id:'walk', name:'הליכה', icon:'🚶', cat:'קרדיו', met:3.5 },
  { id:'run', name:'ריצה', icon:'🏃', cat:'קרדיו', met:9 },
  { id:'run_intervals', name:'ריצת אינטרוול', icon:'⚡', cat:'קרדיו', met:11 },
  { id:'swim', name:'שחייה', icon:'🏊', cat:'קרדיו', met:8 },
  { id:'bike_road', name:'אופני כביש', icon:'🚴', cat:'קרדיו', met:10 },
  { id:'bike_mtb', name:'אופני שטח', icon:'🚵', cat:'קרדיו', met:11 },
  { id:'bike_stationary', name:'אופני כושר', icon:'🚲', cat:'קרדיו', met:7 },
  { id:'hiit', name:'HIIT', icon:'🔥', cat:'קרדיו', met:12 },
  { id:'jump_rope', name:'חבל קפיצה', icon:'🪢', cat:'קרדיו', met:10 },
  { id:'rowing', name:'חתירה', icon:'🚣', cat:'קרדיו', met:8 },
  // גמישות ושיקום
  { id:'yoga', name:'יוגה', icon:'🧘', cat:'גמישות', met:3 },
  { id:'stretch', name:'מתיחות', icon:'🤾', cat:'גמישות', met:2.5 },
  { id:'pilates', name:'פילאטיס', icon:'🎯', cat:'גמישות', met:4 },
  // קבוצתי / אחר
  { id:'football', name:'כדורגל', icon:'⚽', cat:'קבוצתי', met:9 },
  { id:'basketball', name:'כדורסל', icon:'🏀', cat:'קבוצתי', met:8 },
  { id:'tennis', name:'טניס', icon:'🎾', cat:'קבוצתי', met:7 },
  { id:'boxing', name:'אגרוף/קיקבוקס', icon:'🥊', cat:'קבוצתי', met:9 },
  { id:'martial_arts', name:'אומנויות לחימה', icon:'🥋', cat:'קבוצתי', met:8 },
  { id:'dance', name:'ריקוד', icon:'💃', cat:'קבוצתי', met:5 },
  { id:'other', name:'אחר', icon:'🏅', cat:'אחר', met:5 },
];

// ── DEFAULT WORKOUTS ──
export const DEFAULT_WORKOUTS = [
  {
    id:'w1', name:'אימון א׳ — רגליים + גב + בטן', sportType:'strength_legs',
    days:[1], duration:40, notes:'מנוחה 60–90 שנ׳ בין סטים',
    exercises:[
      {name:'סקוואט בגוף',sets:3,reps:10,note:'ברכיים לא עוברות אצבעות',yt:'https://youtube.com/watch?v=YaXPRqUwItQ'},
      {name:'לאנג׳ במקום',sets:3,reps:'8 כ"ר',note:'כל רגל',yt:'https://youtube.com/watch?v=QOVaHwm-Q6U'},
      {name:'גשר אגן',sets:3,reps:12,note:'מחזק גב תחתון',yt:'https://youtube.com/watch?v=wPM8icPu6H8'},
      {name:'הרמת עקבים',sets:3,reps:15,note:'',yt:'https://youtube.com/watch?v=-M4-G8p1fCI'},
      {name:'פלאנק',sets:3,reps:'20"',note:'גב ישר, בטן מכווצת',yt:'https://youtube.com/watch?v=pSHjTRCQxIw'},
      {name:'מתיחות ארבע ראשי',sets:2,reps:'30"',note:'חובה!',yt:''},
    ]
  },
  {
    id:'w2', name:'אימון ב׳ — פלג עליון + בטן', sportType:'strength_upper',
    days:[4], duration:40, notes:'מנוחה 60–90 שנ׳ בין סטים',
    exercises:[
      {name:'שכיבות סמיכה',sets:3,reps:8,note:'על ברכיים אם קשה',yt:'https://youtube.com/watch?v=IODxDxX7oi4'},
      {name:'Dips על ספסל',sets:3,reps:8,note:'ירידה איטית',yt:'https://youtube.com/watch?v=6kALZikXxLc'},
      {name:'Superman',sets:3,reps:10,note:'החזק 2 שנ׳',yt:'https://youtube.com/watch?v=cc6UVRS7PW4'},
      {name:'קראנץ׳',sets:3,reps:12,note:'בטן עובדת',yt:'https://youtube.com/watch?v=Xyd_fa5zoEU'},
      {name:'Mountain Climbers',sets:3,reps:'20"',note:'קצב מתון',yt:'https://youtube.com/watch?v=nmwgirgXLYM'},
      {name:'מתיחות צוואר',sets:4,reps:'20"',note:'4 כיוונים',yt:''},
    ]
  },
  {
    id:'w3', name:'הליכה', sportType:'walk',
    days:[0,3], duration:30, notes:'גב ישר, קצב נוח',
    exercises:[]
  }
];

// ── STATE ──
let workouts = [];
let workoutLog = {};
let editingId = null;
let liveSession = null; // { workoutId, startTime, sets: [], timerInterval }

export async function initTraining() {
  workouts = await loadData('workouts', DEFAULT_WORKOUTS);
  workoutLog = await loadData('workoutLog', {});
  renderTrainingSection();
}

// ── RENDER MAIN SECTION ──
function renderTrainingSection() {
  const el = document.getElementById('trainingContent');
  if (!el) return;

  // Week overview
  const dayData = Array(7).fill(null).map(() => ({label:'מנוחה',icon:'😴',type:'rest'}));
  workouts.forEach(w => {
    const sp = SPORT_TYPES.find(s => s.id === w.sportType) || {icon:'💪'};
    w.days.forEach(d => {
      dayData[d] = {label:w.name.split('—')[0].trim().substring(0,8), icon:sp.icon, type: sp.cat==='קרדיו'?'walk':'workout'};
    });
  });

  el.innerHTML = `
    <div class="training-week" style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:20px;">
      ${dayData.map((d,i) => `
        <div class="tw-day ${d.type}" style="background:var(--card);border:1px solid ${d.type==='workout'?'rgba(245,166,35,0.3)':d.type==='walk'?'rgba(96,165,250,0.25)':'var(--border)'};border-radius:10px;padding:10px 6px;text-align:center;">
          <div style="font-size:10px;color:var(--muted2);margin-bottom:4px;">${DAY_NAMES[i]}</div>
          <div style="font-size:18px;margin-bottom:3px;">${d.icon}</div>
          <div style="font-size:10px;font-weight:600;color:${d.type==='workout'?'var(--gold)':d.type==='walk'?'var(--blue)':'var(--muted)'};">${d.label}</div>
        </div>`).join('')}
    </div>

    <div class="info-box"><strong>✏️ כל אימון ניתן לעריכה</strong> — לחץ "ערוך" לשינוי תרגילים, ימים, משך. לחץ "התחל" לאימון חי עם טיימר ומעקב סטים.</div>

    ${workouts.map(w => renderWorkoutCard(w)).join('')}

    <button onclick="window.training.openWorkoutEditor(null)" class="btn btn-ghost btn-full" style="margin-top:8px;border:1px dashed rgba(245,166,35,0.35);color:var(--gold);">
      + הוסף אימון חדש
    </button>

    <div class="divider"></div>
    <div class="sec-title" style="font-size:16px;margin-bottom:6px;">📊 היסטוריית אימונים</div>
    ${renderWorkoutHistory()}
  `;
}

function renderWorkoutCard(w) {
  const sp = SPORT_TYPES.find(s => s.id === w.sportType) || {icon:'💪',cat:'כוח'};
  const todayKey = getDayKey(0);
  const donedToday = (workoutLog[todayKey] || []).some(l => l.workoutId === w.id);

  return `
    <div class="card" id="wcard_${w.id}">
      <div class="card-head" style="justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="card-icon">${sp.icon}</div>
          <div>
            <div class="card-title">${w.name}</div>
            <div class="card-meta">${w.days.map(d=>DAY_NAMES[d]).join(' + ')} | ${w.duration} דקות | ${sp.cat}</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${donedToday ? '<span style="font-size:11px;color:var(--green);background:rgba(52,211,153,0.1);border-radius:6px;padding:4px 8px;font-weight:600;">✓ בוצע היום</span>' : ''}
          <button onclick="window.training.startLiveWorkout('${w.id}')" class="btn btn-primary" style="padding:7px 14px;font-size:12px;">▶ התחל</button>
          <button onclick="window.training.openWorkoutEditor('${w.id}')" class="btn btn-ghost" style="padding:7px 12px;font-size:12px;">✏️ ערוך</button>
        </div>
      </div>
      ${w.exercises.length > 0 ? `
      <div class="card-body" style="padding:12px 18px;">
        ${w.exercises.map((ex,i) => `
          <div style="display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
            <div style="width:26px;height:26px;border-radius:6px;background:rgba(245,166,35,0.1);color:var(--gold);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${i+1}</div>
            <div style="flex:1;">
              <div style="font-size:13px;font-weight:600;">${ex.name}</div>
              ${ex.note?`<div style="font-size:11px;color:var(--muted2);">${ex.note}</div>`:''}
              ${ex.yt?`<a href="${ex.yt}" target="_blank" style="display:inline-flex;align-items:center;gap:3px;font-size:10px;color:var(--red);background:rgba(248,113,113,0.1);border-radius:4px;padding:2px 6px;margin-top:3px;text-decoration:none;border:1px solid rgba(248,113,113,0.2);">▶ יוטיוב</a>`:''}
            </div>
            <div style="font-size:13px;font-weight:700;color:var(--gold);flex-shrink:0;">${ex.sets}×${ex.reps}</div>
          </div>`).join('')}
        ${w.notes?`<div class="info-box" style="margin-top:10px;"><strong>💡</strong> ${w.notes}</div>`:''}
      </div>` : ''}
    </div>`;
}

function renderWorkoutHistory() {
  const last7 = Array.from({length:7},(_,i)=>getDayKey(-i));
  const entries = [];
  last7.forEach(key => {
    (workoutLog[key]||[]).forEach(l => entries.push({...l, date:key}));
  });
  if (entries.length === 0) return '<div style="font-size:13px;color:var(--muted2);">עדיין לא תיעדת אימונים.</div>';
  return entries.map(e => {
    const w = workouts.find(x => x.id === e.workoutId);
    const sp = SPORT_TYPES.find(s => s.id === e.sportType);
    const d = new Date(e.date);
    return `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px 16px;margin-bottom:8px;display:flex;align-items:center;gap:12px;">
        <div style="font-size:24px;">${sp?.icon||'💪'}</div>
        <div style="flex:1;">
          <div style="font-weight:600;font-size:14px;">${e.name||w?.name||'אימון'}</div>
          <div style="font-size:11px;color:var(--muted2);">${d.getDate()}/${d.getMonth()+1} · ${e.duration}′ · ${e.calories||0} קל׳</div>
        </div>
        ${e.distance?`<div style="font-size:14px;font-weight:700;color:var(--blue);">${e.distance}km</div>`:''}
      </div>`;
  }).join('');
}

// ── LIVE WORKOUT ──
export function startLiveWorkout(workoutId) {
  const w = workouts.find(x => x.id === workoutId);
  if (!w) return;
  const sp = SPORT_TYPES.find(s => s.id === w.sportType) || {icon:'💪'};

  liveSession = { workoutId, name:w.name, sportType:w.sportType, startTime:Date.now(), sets:[], exerciseIndex:0, elapsed:0 };

  const modal = document.getElementById('liveWorkoutModal');
  if (!modal) return;

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';

  renderLiveModal(w, sp);
  startTimer();
}

function renderLiveModal(w, sp) {
  const modal = document.getElementById('liveWorkoutModal');
  const isCardio = ['walk','run','swim','bike_road','bike_mtb','bike_stationary','run_intervals','rowing','jump_rope','hiit'].includes(w.sportType);

  modal.innerHTML = `
    <div class="modal-box" style="max-width:500px;">
      <div class="modal-head" style="background:rgba(245,166,35,0.05);">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:24px;">${sp.icon}</span>
          <div class="modal-title">${w.name}</div>
        </div>
        <button onclick="window.training.endWorkout()" class="btn btn-danger" style="padding:7px 14px;font-size:13px;">⏹ סיים</button>
      </div>
      <div style="padding:20px;text-align:center;">
        <!-- Timer -->
        <div style="position:relative;width:160px;height:160px;margin:0 auto 16px;">
          <svg width="160" height="160" style="transform:rotate(-90deg);">
            <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"/>
            <circle id="timerRing" cx="80" cy="80" r="70" fill="none" stroke="var(--gold)" stroke-width="8"
              stroke-linecap="round" stroke-dasharray="440" stroke-dashoffset="440"/>
          </svg>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
            <div id="liveTimerDisplay" class="live-timer" style="font-size:40px;">00:00</div>
            <div style="font-size:11px;color:var(--muted2);">זמן אימון</div>
          </div>
        </div>

        ${isCardio ? `
        <!-- Cardio inputs -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
          <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;">
            <div style="font-size:10px;color:var(--muted2);margin-bottom:4px;">מרחק (ק"מ)</div>
            <input id="liveDistance" type="number" step="0.1" min="0" value="0" class="input" style="text-align:center;font-size:20px;font-weight:700;padding:6px;"/>
          </div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;">
            <div style="font-size:10px;color:var(--muted2);margin-bottom:4px;">קצב (דקות/ק"מ)</div>
            <input id="livePace" type="text" placeholder="5:30" class="input" style="text-align:center;font-size:20px;font-weight:700;padding:6px;"/>
          </div>
        </div>` : `
        <!-- Strength exercises -->
        <div id="liveExercises" style="text-align:right;margin-bottom:16px;">
          ${w.exercises.map((ex,i) => `
            <div id="lexrow_${i}" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px 14px;margin-bottom:8px;opacity:${i===0?1:0.5};border-left:3px solid ${i===0?'var(--gold)':'transparent'};">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <div style="font-weight:600;font-size:14px;">${ex.name}</div>
                <div style="font-size:13px;color:var(--gold);">${ex.sets}×${ex.reps}</div>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;" id="setbtns_${i}">
                ${Array.from({length:Number(ex.sets)||3},(_,s) => `
                  <button onclick="window.training.markSet(${i},${s})" id="setbtn_${i}_${s}"
                    style="background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-family:Heebo,sans-serif;font-size:12px;color:var(--muted2);cursor:pointer;transition:all 0.2s;">
                    סט ${s+1}
                  </button>`).join('')}
              </div>
            </div>`).join('')}
        </div>`}

        <!-- Notes -->
        <textarea id="liveNotes" rows="2" placeholder="הערות לאימון זה..." class="input" style="resize:none;font-size:13px;"></textarea>

        <!-- Feeling -->
        <div style="margin-top:12px;">
          <div style="font-size:12px;color:var(--muted2);margin-bottom:8px;">איך הרגשת?</div>
          <div style="display:flex;gap:8px;justify-content:center;" id="feelingBtns">
            ${['😩 קשה','😐 בסדר','😊 טוב','🔥 מעולה'].map((f,i) => `
              <button onclick="window.training.setFeeling(${i},this)" style="background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:8px;padding:6px 10px;font-family:Heebo,sans-serif;font-size:12px;cursor:pointer;color:var(--text);">${f}</button>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

function startTimer() {
  if (liveSession.timerInterval) clearInterval(liveSession.timerInterval);
  liveSession.timerInterval = setInterval(() => {
    liveSession.elapsed = Math.floor((Date.now() - liveSession.startTime) / 1000);
    const disp = document.getElementById('liveTimerDisplay');
    if (disp) disp.textContent = formatTime(liveSession.elapsed);
    const ring = document.getElementById('timerRing');
    if (ring) {
      const target = (workouts.find(w=>w.id===liveSession.workoutId)?.duration||40)*60;
      const pct = Math.min(liveSession.elapsed/target, 1);
      ring.style.strokeDashoffset = 440 - (440 * pct);
    }
  }, 1000);
}

export function markSet(exerciseIndex, setIndex) {
  const btn = document.getElementById(`setbtn_${exerciseIndex}_${setIndex}`);
  if (!btn) return;
  const isDone = btn.style.background.includes('34d399');
  btn.style.background = isDone ? 'rgba(255,255,255,0.05)' : 'rgba(52,211,153,0.2)';
  btn.style.borderColor = isDone ? 'var(--border)' : 'rgba(52,211,153,0.5)';
  btn.style.color = isDone ? 'var(--muted2)' : 'var(--green)';
  if (!isDone) {
    const w = workouts.find(x => x.id === liveSession.workoutId);
    if (w && exerciseIndex < w.exercises.length - 1) {
      const nextRow = document.getElementById(`lexrow_${exerciseIndex+1}`);
      if (nextRow) { nextRow.style.opacity = '1'; nextRow.style.borderLeft = '3px solid var(--gold)'; }
    }
  }
}

export function setFeeling(val, btn) {
  document.querySelectorAll('#feelingBtns button').forEach(b => { b.style.background='rgba(255,255,255,0.05)'; b.style.borderColor='var(--border)'; });
  btn.style.background = 'rgba(245,166,35,0.2)';
  btn.style.borderColor = 'rgba(245,166,35,0.5)';
  liveSession.feeling = val;
}

export async function endWorkout() {
  if (!liveSession) return;
  clearInterval(liveSession.timerInterval);
  const w = workouts.find(x=>x.id===liveSession.workoutId);
  const sp = SPORT_TYPES.find(s=>s.id===liveSession.sportType)||{met:5};
  const durationMins = Math.round(liveSession.elapsed / 60);
  const calories = Math.round(sp.met * 100 * (durationMins / 60)); // weight 100kg
  const key = getDayKey(0);
  if (!workoutLog[key]) workoutLog[key] = [];
  workoutLog[key].push({
    workoutId: liveSession.workoutId,
    sportType: liveSession.sportType,
    name: w?.name || 'אימון',
    duration: durationMins || w?.duration || 0,
    distance: parseFloat(document.getElementById('liveDistance')?.value || 0) || undefined,
    calories,
    notes: document.getElementById('liveNotes')?.value || '',
    feeling: liveSession.feeling ?? 2,
    timestamp: Date.now()
  });
  await saveData('workoutLog', workoutLog);
  document.getElementById('liveWorkoutModal').style.display = 'none';
  document.body.style.overflow = '';
  liveSession = null;
  showToast(`✅ אימון הסתיים! ${durationMins} דקות · ${calories} קל׳ 🔥`);
  renderTrainingSection();
}

// ── WORKOUT EDITOR ──
export function openWorkoutEditor(id) {
  editingId = id;
  const w = id ? workouts.find(x=>x.id===id) : null;
  const modal = document.getElementById('workoutEditorModal');
  if (!modal) return;

  const cats = [...new Set(SPORT_TYPES.map(s=>s.cat))];

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-head">
        <div class="modal-title">${id?'✏️ עריכת אימון':'➕ אימון חדש'}</div>
        <button onclick="window.training.closeEditor()" class="modal-close">✕</button>
      </div>
      <div class="modal-body">
        <label class="label">שם האימון</label>
        <input id="weName" class="input" style="margin-bottom:14px;" placeholder="למשל: ריצת בוקר" value="${w?.name||''}"/>

        <label class="label">סוג ספורט</label>
        <div style="margin-bottom:14px;">
          ${cats.map(cat => `
            <div style="font-size:11px;color:var(--muted2);margin-bottom:6px;margin-top:10px;">${cat}</div>
            <div class="sport-grid">
              ${SPORT_TYPES.filter(s=>s.cat===cat).map(s=>`
                <button class="sport-btn ${w?.sportType===s.id?'active':''}" onclick="window.training.selectSport('${s.id}',this)">
                  <span class="sport-icon">${s.icon}</span>
                  <span class="sport-name">${s.name}</span>
                </button>`).join('')}
            </div>`).join('')}
        </div>

        <label class="label">ימי האימון</label>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">
          ${DAY_NAMES.map((d,i)=>`
            <button class="day-pill ${w?.days?.includes(i)?'active':''}" onclick="this.classList.toggle('active')" data-day="${i}">${d}</button>`).join('')}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
          <div>
            <label class="label">משך (דקות)</label>
            <input id="weDuration" type="number" class="input" value="${w?.duration||40}"/>
          </div>
          <div>
            <label class="label">עצימות</label>
            <select id="weIntensity" class="select">
              <option value="low" ${w?.intensity==='low'?'selected':''}>קלה</option>
              <option value="medium" ${!w?.intensity||w?.intensity==='medium'?'selected':''}>בינונית</option>
              <option value="high" ${w?.intensity==='high'?'selected':''}>גבוהה</option>
            </select>
          </div>
        </div>

        <label class="label">הערות</label>
        <textarea id="weNotes" class="input" rows="2" style="resize:none;margin-bottom:16px;">${w?.notes||''}</textarea>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <label class="label" style="margin:0;">תרגילים</label>
          <button onclick="window.training.addExRow()" class="btn btn-ghost" style="font-size:12px;padding:6px 12px;">+ הוסף תרגיל</button>
        </div>
        <div id="weExercises">
          ${(w?.exercises||[]).map(ex=>exRowHTML(ex)).join('')}
        </div>
      </div>
      <div class="modal-footer">
        ${id?`<button onclick="window.training.deleteWorkout()" class="btn btn-danger">🗑 מחק</button>`:''}
        <button onclick="window.training.closeEditor()" class="btn btn-ghost">ביטול</button>
        <button onclick="window.training.saveWorkout()" class="btn btn-primary">שמור ✓</button>
      </div>
    </div>`;
}

function exRowHTML(ex) {
  return `<div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:8px;">
    <div style="display:flex;gap:8px;margin-bottom:8px;">
      <input type="text" data-field="name" placeholder="שם התרגיל" value="${ex?.name||''}" class="input" style="flex:1;"/>
      <button onclick="this.closest('div[style]').remove()" class="btn btn-danger" style="padding:6px 10px;font-size:12px;">✕</button>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <div style="display:flex;align-items:center;gap:5px;"><span style="font-size:12px;color:var(--muted2);">סטים:</span><input type="number" data-field="sets" value="${ex?.sets||3}" min="1" max="10" class="input" style="width:55px;text-align:center;padding:6px 8px;"/></div>
      <div style="display:flex;align-items:center;gap:5px;"><span style="font-size:12px;color:var(--muted2);">חזרות:</span><input type="text" data-field="reps" value="${ex?.reps||10}" placeholder="10 / 30&quot;" class="input" style="width:70px;text-align:center;padding:6px 8px;"/></div>
      <div style="flex:1;min-width:120px;display:flex;align-items:center;gap:5px;"><span style="font-size:12px;color:var(--muted2);">הערה:</span><input type="text" data-field="note" value="${ex?.note||''}" class="input" style="flex:1;padding:6px 8px;"/></div>
    </div>
    <div style="margin-top:8px;display:flex;align-items:center;gap:5px;"><span style="font-size:12px;color:var(--muted2);">יוטיוב:</span><input type="url" data-field="yt" value="${ex?.yt||''}" placeholder="https://youtube.com/..." class="input" style="flex:1;font-size:12px;padding:6px 8px;"/></div>
  </div>`;
}

export function addExRow() {
  document.getElementById('weExercises').insertAdjacentHTML('beforeend', exRowHTML(null));
}

let selectedSport = null;
export function selectSport(id, btn) {
  selectedSport = id;
  document.querySelectorAll('.sport-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

export async function saveWorkout() {
  const name = document.getElementById('weName')?.value.trim();
  if (!name) { showToast('❌ הכנס שם לאימון'); return; }
  const sportType = selectedSport || document.querySelector('.sport-btn.active')?.dataset?.id || 'strength_full';
  const days = [];
  document.querySelectorAll('.day-pill.active').forEach(b => days.push(parseInt(b.dataset.day)));
  const exercises = [];
  document.querySelectorAll('#weExercises>div').forEach(row => {
    const get = f => row.querySelector(`[data-field="${f}"]`)?.value?.trim()||'';
    if(get('name')) exercises.push({name:get('name'),sets:parseInt(get('sets'))||3,reps:get('reps')||10,note:get('note'),yt:get('yt')});
  });
  const workout = {
    id: editingId||'w_'+Date.now(), name, sportType, days,
    duration: parseInt(document.getElementById('weDuration')?.value)||40,
    intensity: document.getElementById('weIntensity')?.value||'medium',
    notes: document.getElementById('weNotes')?.value?.trim()||'',
    exercises
  };
  workouts = editingId ? workouts.map(w=>w.id===editingId?workout:w) : [...workouts, workout];
  await saveData('workouts', workouts);
  closeEditor();
  renderTrainingSection();
  showToast('✅ אימון נשמר!');
}

export async function deleteWorkout() {
  if (!editingId) return;
  workouts = workouts.filter(w=>w.id!==editingId);
  await saveData('workouts', workouts);
  closeEditor();
  renderTrainingSection();
  showToast('🗑️ אימון נמחק');
}

export function closeEditor() {
  document.getElementById('workoutEditorModal').style.display='none';
  document.body.style.overflow='';
  selectedSport=null;
}
