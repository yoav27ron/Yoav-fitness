// ====== ALCOHOL TRACKER MODULE ======
import { getDayKey, getDayLabel, DAY_NAMES, MONTH_NAMES, showToast } from './store.js';

const S = () => window.store;

// ── DRINK DATABASE ──
export const DRINKS = [
  // ספירט
  { id:'vodka_shot',    cat:'ספירט',    name:'וודקה שוט',      icon:'🥃', ml:40,  abv:40, units:1.3, cal:92,  desc:'שוט אחד 40ml' },
  { id:'gin_shot',      cat:'ספירט',    name:'ג'ין שוט',       icon:'🥃', ml:40,  abv:40, units:1.3, cal:92,  desc:'שוט אחד 40ml' },
  { id:'whiskey_shot',  cat:'ספירט',    name:'וויסקי שוט',     icon:'🥃', ml:40,  abv:40, units:1.3, cal:98,  desc:'שוט אחד 40ml' },
  { id:'arak_shot',     cat:'ספירט',    name:'ערק שוט',        icon:'🥃', ml:40,  abv:40, units:1.3, cal:92,  desc:'שוט אחד 40ml' },
  { id:'tequila_shot',  cat:'ספירט',    name:'טקילה שוט',      icon:'🥃', ml:40,  abv:38, units:1.2, cal:96,  desc:'שוט אחד 40ml' },
  { id:'rum_shot',      cat:'ספירט',    name:'רום שוט',        icon:'🥃', ml:40,  abv:40, units:1.3, cal:92,  desc:'שוט אחד 40ml' },
  { id:'vodka_drink',   cat:'דרינק',    name:'וודקה + שתייה קלה',icon:'🍹',ml:250, abv:8,  units:1.6, cal:180, desc:'כוס מלאה' },
  { id:'gin_tonic',     cat:'דרינק',    name:'ג'ין טוניק',     icon:'🍹', ml:250, abv:8,  units:1.6, cal:170, desc:'כוס מלאה' },
  { id:'whiskey_coke',  cat:'דרינק',    name:'וויסקי קולה',    icon:'🍹', ml:250, abv:8,  units:1.6, cal:195, desc:'כוס מלאה' },
  { id:'vodka_redbull', cat:'דרינק',    name:'וודקה רד בול',   icon:'🍹', ml:300, abv:6,  units:1.4, cal:230, desc:'קיין אחד' },
  { id:'mojito',        cat:'קוקטייל',  name:'מוחיטו',         icon:'🍸', ml:250, abv:10, units:2.0, cal:220, desc:'כוס מלאה' },
  { id:'margarita',     cat:'קוקטייל',  name:'מרגריטה',        icon:'🍸', ml:200, abv:13, units:2.1, cal:200, desc:'כוס קוקטייל' },
  { id:'long_island',   cat:'קוקטייל',  name:'לונג איילנד',    icon:'🍸', ml:300, abv:22, units:5.3, cal:380, desc:'כוס מלאה — חזק!' },
  { id:'cosmopolitan',  cat:'קוקטייל',  name:'קוסמופוליטן',    icon:'🍸', ml:200, abv:15, units:2.4, cal:210, desc:'כוס קוקטייל' },
  { id:'negroni',       cat:'קוקטייל',  name:'נגרוני',         icon:'🍸', ml:150, abv:24, units:2.9, cal:195, desc:'כוס קטנה' },
  { id:'beer_half',     cat:'בירה',     name:'בירה חצי',       icon:'🍺', ml:250, abv:5,  units:1.0, cal:115, desc:'חצי כוס / שוט' },
  { id:'beer_pint',     cat:'בירה',     name:'בירה פינט',      icon:'🍺', ml:500, abv:5,  units:2.0, cal:230, desc:'פינט שלם' },
  { id:'beer_bottle',   cat:'בירה',     name:'בירה בקבוק',     icon:'🍺', ml:330, abv:5,  units:1.3, cal:150, desc:'330ml' },
  { id:'beer_craft',    cat:'בירה',     name:'בירה קרפט/חזקה', icon:'🍺', ml:330, abv:7,  units:1.9, cal:200, desc:'330ml IPAניות' },
  { id:'wine_red',      cat:'יין',      name:'יין אדום כוס',   icon:'🍷', ml:150, abv:13, units:1.5, cal:125, desc:'כוס קטנה' },
  { id:'wine_white',    cat:'יין',      name:'יין לבן כוס',    icon:'🥂', ml:150, abv:12, units:1.4, cal:121, desc:'כוס קטנה' },
  { id:'wine_rose',     cat:'יין',      name:'יין רוזה כוס',   icon:'🥂', ml:150, abv:11, units:1.3, cal:118, desc:'כוס קטנה' },
  { id:'wine_sparkling',cat:'יין',      name:'שמפניה / קאוה',  icon:'🥂', ml:150, abv:12, units:1.4, cal:120, desc:'כוס קטנה' },
  { id:'wine_bottle',   cat:'יין',      name:'בקבוק יין',      icon:'🍷', ml:750, abv:13, units:7.5, cal:625, desc:'בקבוק שלם' },
  { id:'cider',         cat:'בירה',     name:'סיידר',          icon:'🍺', ml:330, abv:5,  units:1.3, cal:160, desc:'330ml' },
  { id:'caeser',        cat:'ספירט',    name:'צייסר',          icon:'🍹', ml:45,  abv:40, units:1.5, cal:110, desc:'מנה קטנה' },
  { id:'absinthe',      cat:'ספירט',    name:'אבסינת',         icon:'🥃', ml:30,  abv:70, units:1.7, cal:85,  desc:'30ml — חזק מאוד!' },
  { id:'custom',        cat:'אחר',      name:'שתייה מותאמת',   icon:'🍶', ml:0,   abv:0,  units:0,   cal:0,   desc:'הכנס בעצמך' },
];

const CATS = ['ספירט','דרינק','קוקטייל','בירה','יין','אחר'];

let _currentDate = null;

export function initAlcohol() {
  window.store?.subscribe?.('alcoholLog', () => {
    if (document.getElementById('alcoholContent')?.closest('.section.active')) renderAlcohol();
  });
}

export function renderAlcohol() {
  const el = document.getElementById('alcoholContent');
  if (!el) return;
  const today     = getDayKey(0);
  const dateStr   = _currentDate || today;
  const label     = dateStr === today ? 'היום' : getDayLabel();
  const log       = window.store?.getAlcohol?.(dateStr) || getAlcohol(dateStr);
  const weekData  = window.store?.getWeekAlcohol?.() || [];
  const totUnits  = +log.reduce((a,d)=>a+(d.units||0),0).toFixed(1);
  const totCal    = log.reduce((a,d)=>a+(d.cal||0),0);
  const riskColor = totUnits === 0 ? 'var(--green)' : totUnits <= 2 ? 'var(--gold)' : totUnits <= 4 ? 'var(--orange,#fb923c)' : 'var(--red)';
  const riskLabel = totUnits === 0 ? '✅ נקי' : totUnits <= 2 ? '⚠️ מתון' : totUnits <= 4 ? '🟠 גבוה' : '🔴 גבוה מאוד';

  el.innerHTML = `
    <!-- Day nav -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <button onclick="window.alcohol.changeAlcDay(-1)" class="btn btn-ghost" style="padding:6px 12px;">◀</button>
      <div style="font-weight:600;font-size:15px;">${getDayLabel(dateStr === today ? 0 : -1)}</div>
      <button onclick="window.alcohol.changeAlcDay(1)" class="btn btn-ghost" style="padding:6px 12px;${dateStr>=today?'opacity:0.3;pointer-events:none':''}">▶</button>
    </div>

    <!-- Summary card -->
    <div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:14px;">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center;">
        <div><div style="font-size:26px;font-weight:900;color:${riskColor};">${totUnits}</div><div style="font-size:11px;color:var(--muted2);">יחידות אלכוהול</div></div>
        <div><div style="font-size:26px;font-weight:900;color:var(--gold);">${totCal}</div><div style="font-size:11px;color:var(--muted2);">קלוריות</div></div>
        <div><div style="font-size:20px;font-weight:700;">${riskLabel}</div><div style="font-size:11px;color:var(--muted2);">רמת סיכון</div></div>
      </div>
      ${totUnits > 0 ? `
      <div style="margin-top:12px;padding:10px;background:rgba(255,255,255,0.03);border-radius:8px;font-size:12px;color:var(--muted2);line-height:1.7;">
        💡 ${totUnits <= 1 ? 'שתייה קלה — לא אמורה להשפיע על האימון מחר.' :
            totUnits <= 2 ? 'שתייה מתונה — שתה מים לפני השינה.' :
            totUnits <= 4 ? 'שתייה גבוהה — תשפיע על שינה, התאוששות ושריפת שומן.' :
            'שתייה כבדה — הגוף יתמקד בפינוי אלכוהול. דלג על האימון מחר אם יש.'}
      </div>` : ''}
    </div>

    <!-- Add drink button -->
    <button onclick="window.alcohol.openAddDrink()" class="btn btn-ghost btn-full" style="border:1px dashed rgba(245,166,35,0.35);color:var(--gold);margin-bottom:14px;padding:14px;">
      🍺 + הוסף שתייה
    </button>

    <!-- Today's drinks -->
    ${log.length === 0
      ? `<div style="text-align:center;padding:20px;color:var(--muted);font-size:13px;">לא תיעדת שתייה ${label} 👍</div>`
      : log.map((d,i) => `
        <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:11px 14px;margin-bottom:7px;display:flex;align-items:center;gap:10px;">
          <span style="font-size:22px;">${d.icon}</span>
          <div style="flex:1;">
            <div style="font-weight:600;font-size:14px;">${d.name}</div>
            <div style="font-size:11px;color:var(--muted2);">${d.time} · ${d.ml}ml · ${d.units} יחידות · ${d.cal} קל׳</div>
          </div>
          <button onclick="window.alcohol.removeDrink(${i})" class="btn btn-danger" style="padding:4px 8px;font-size:11px;">✕</button>
        </div>`).join('')}

    <!-- Weekly summary -->
    <div style="margin-top:16px;">
      <div style="font-size:14px;font-weight:700;margin-bottom:10px;">📊 שבוע אחרון</div>
      <div style="display:flex;align-items:flex-end;gap:4px;height:60px;margin-bottom:6px;">
        ${weekData.map(w => {
          const d = new Date(w.date);
          const pct = Math.min((w.units/8)*100,100);
          const col = w.units===0?'rgba(255,255,255,0.08)':w.units<=2?'var(--green)':w.units<=4?'var(--gold)':'var(--red)';
          return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;">
            <div style="width:100%;background:${col};border-radius:3px 3px 0 0;height:${Math.max(pct*0.6,2)}px;min-height:2px;"></div>
            <div style="font-size:9px;color:var(--muted2);">${['א','ב','ג','ד','ה','ו','ש'][d.getDay()]}</div>
          </div>`;
        }).join('')}
      </div>
      <div style="font-size:11px;color:var(--muted2);text-align:center;">
        שבוע: ${+weekData.reduce((a,w)=>a+(w.units||0),0).toFixed(1)} יחידות · ${weekData.reduce((a,w)=>a+(w.cal||0),0)} קל׳
      </div>
    </div>

    <!-- Add drink modal -->
    <div id="addDrinkModal" class="modal-overlay" style="display:none;">
      <div class="modal-box" style="max-width:500px;">
        <div class="modal-head">
          <div class="modal-title">🍺 הוסף שתייה</div>
          <button onclick="window.alcohol.closeAddDrink()" class="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <!-- Category filter -->
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
            ${['הכל',...CATS].map((c,i) => `<button onclick="window.alcohol.filterDrinks('${c}',this)" class="day-pill ${i===0?'active':''}">${c}</button>`).join('')}
          </div>
          <!-- Drinks grid -->
          <div id="drinksGrid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-bottom:14px;max-height:360px;overflow-y:auto;"></div>
          <!-- Custom drink -->
          <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:10px;padding:12px;">
            <div style="font-size:12px;color:var(--muted2);margin-bottom:8px;">✏️ שתייה מותאמת אישית</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div><label class="label">שם</label><input id="customDrinkName" class="input" placeholder="למשל: ערק" /></div>
              <div><label class="label">ml</label><input id="customDrinkMl" type="number" class="input" placeholder="250" /></div>
              <div><label class="label">% אלכוהול</label><input id="customDrinkAbv" type="number" class="input" placeholder="40" step="0.5"/></div>
              <div><label class="label">כמה כוסות</label><input id="customDrinkQty" type="number" class="input" placeholder="1" value="1"/></div>
            </div>
            <button onclick="window.alcohol.addCustomDrink()" class="btn btn-primary btn-full" style="margin-top:8px;font-size:13px;">+ הוסף מותאם</button>
          </div>
        </div>
      </div>
    </div>
  `;

  renderDrinksGrid('הכל');
}

function getAlcohol(date) {
  try {
    const state = JSON.parse(localStorage.getItem('yoavFitV3')||'{}');
    return state.alcoholLog?.[date] || [];
  } catch { return []; }
}

function renderDrinksGrid(cat) {
  const grid = document.getElementById('drinksGrid');
  if (!grid) return;
  const filtered = cat === 'הכל' ? DRINKS.filter(d=>d.id!=='custom') : DRINKS.filter(d=>d.cat===cat);
  grid.innerHTML = filtered.map(d => `
    <div onclick="window.alcohol.quickAddDrink('${d.id}')"
      style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px;cursor:pointer;transition:all 0.15s;"
      onmouseover="this.style.borderColor='rgba(245,166,35,0.4)'" onmouseout="this.style.borderColor='var(--border)'">
      <div style="font-size:20px;margin-bottom:4px;">${d.icon}</div>
      <div style="font-size:12px;font-weight:600;margin-bottom:2px;">${d.name}</div>
      <div style="font-size:10px;color:var(--muted2);">${d.units} יח׳ · ${d.cal} קל׳</div>
      <div style="font-size:10px;color:var(--muted);">${d.desc}</div>
    </div>`).join('');
}

export function filterDrinks(cat, btn) {
  document.querySelectorAll('#addDrinkModal .day-pill').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderDrinksGrid(cat);
}

export function openAddDrink() {
  document.getElementById('addDrinkModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
  renderDrinksGrid('הכל');
}
export function closeAddDrink() {
  document.getElementById('addDrinkModal').style.display = 'none';
  document.body.style.overflow = '';
}

export async function quickAddDrink(id) {
  const drink = DRINKS.find(d=>d.id===id);
  if (!drink) return;
  const { addDrink } = await import('./store.js');
  const now  = new Date();
  const time = now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0');
  const date = _currentDate || getDayKey(0);
  await addDrink(date, {...drink, time, qty:1});
  closeAddDrink();
  renderAlcohol();
  showToast(`✅ ${drink.icon} ${drink.name} נוסף`);
}

export async function addCustomDrink() {
  const name = document.getElementById('customDrinkName')?.value.trim();
  const ml   = parseFloat(document.getElementById('customDrinkMl')?.value)||0;
  const abv  = parseFloat(document.getElementById('customDrinkAbv')?.value)||0;
  const qty  = parseInt(document.getElementById('customDrinkQty')?.value)||1;
  if (!name) { showToast('❌ הכנס שם'); return; }
  const units = +((ml * abv * 0.008 * qty)).toFixed(1);
  const cal   = Math.round(ml * abv * 0.055 * qty);
  const { addDrink } = await import('./store.js');
  const now   = new Date();
  const time  = now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0');
  await addDrink(_currentDate||getDayKey(0), {id:'custom',cat:'אחר',name,icon:'🍶',ml:ml*qty,abv,units,cal,time,qty});
  closeAddDrink();
  renderAlcohol();
  showToast(`✅ ${name} נוסף`);
}

export async function removeDrink(idx) {
  const { removeDrink: rd } = await import('./store.js');
  await rd(_currentDate||getDayKey(0), idx);
  renderAlcohol();
  showToast('🗑️ הוסר');
}

export function changeAlcDay(dir) {
  const base = _currentDate || getDayKey(0);
  const d = new Date(base);
  d.setDate(d.getDate() + dir);
  const newKey = d.toISOString().split('T')[0];
  if (newKey <= getDayKey(0)) { _currentDate = newKey; renderAlcohol(); }
}
