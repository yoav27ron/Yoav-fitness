// ====== FOOD MODULE ======
import { saveData, loadData, getDayKey, getDayLabel, MONTH_NAMES, DAY_NAMES, showToast } from './storage.js';

let foodLog = {};
let currentDayOffset = 0;
let currentMealItems = [];
let pendingProduct = null;

export async function initFood() {
  foodLog = await loadData('foodLog', {});
  renderFoodLog();
}

// ── RENDER FOOD LOG ──
export function renderFoodLog() {
  const el = document.getElementById('foodContent');
  if (!el) return;
  const key = getDayKey(currentDayOffset);
  const label = getDayLabel(currentDayOffset);
  const dayMeals = foodLog[key] || [];
  let totCal=0, totP=0, totC=0, totF=0;
  dayMeals.forEach(m => { totCal+=m.cal; totP+=m.prot; totC+=m.carb; totF+=m.fat; });
  const calPct = Math.min((totCal/1900)*100,100);

  el.innerHTML = `
    <!-- Day nav -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
      <button onclick="window.food.changeDay(-1)" class="btn btn-ghost" style="padding:6px 12px;">◀</button>
      <div style="font-weight:600;font-size:15px;">${label}</div>
      <button onclick="window.food.changeDay(1)" class="btn btn-ghost" style="padding:6px 12px;${currentDayOffset>=0?'opacity:0.3;pointer-events:none':''}">▶</button>
    </div>

    <!-- Day totals -->
    <div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:14px;">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px;">
        <div style="text-align:center;"><div style="font-size:9px;color:var(--muted2);text-transform:uppercase;margin-bottom:2px;">קלוריות</div><div style="font-size:22px;font-weight:900;color:${totCal>2100?'var(--red)':'var(--gold)'};">${totCal}</div><div style="font-size:10px;color:var(--muted);">/ 1,900</div></div>
        <div style="text-align:center;"><div style="font-size:9px;color:var(--muted2);text-transform:uppercase;margin-bottom:2px;">חלבון</div><div style="font-size:22px;font-weight:900;color:var(--purple);">${totP}g</div><div style="font-size:10px;color:var(--muted);">יעד 130g</div></div>
        <div style="text-align:center;"><div style="font-size:9px;color:var(--muted2);text-transform:uppercase;margin-bottom:2px;">פחמימה</div><div style="font-size:22px;font-weight:900;color:var(--blue);">${totC}g</div><div style="font-size:10px;color:var(--muted);">יעד 180g</div></div>
        <div style="text-align:center;"><div style="font-size:9px;color:var(--muted2);text-transform:uppercase;margin-bottom:2px;">שומן</div><div style="font-size:22px;font-weight:900;color:var(--green);">${totF}g</div><div style="font-size:10px;color:var(--muted);">יעד 60g</div></div>
      </div>
      <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:100px;overflow:hidden;">
        <div style="height:100%;width:${calPct}%;background:${totCal>2100?'var(--red)':'linear-gradient(90deg,var(--gold2),var(--gold))'};border-radius:100px;transition:width 0.5s;"></div>
      </div>
    </div>

    <!-- Add meal button -->
    <button onclick="window.food.openAddMeal()" class="btn btn-ghost btn-full" style="border:1px dashed rgba(245,166,35,0.35);color:var(--gold);margin-bottom:14px;padding:14px;">
      📷 + הוסף ארוחה (חיפוש / צילום AI)
    </button>

    <!-- Meals list -->
    <div id="mealsList">
      ${dayMeals.length===0 ? `<div style="text-align:center;padding:24px;color:var(--muted);font-size:13px;">לא הוספת ארוחות ל${label}</div>` :
        dayMeals.map((meal,i) => `
          <div class="card" style="margin-bottom:10px;">
            <div class="card-head" style="justify-content:space-between;">
              <div>
                <div class="card-title">${meal.name}</div>
                <div class="card-meta">${meal.time} · ${meal.items.length} מוצרים</div>
              </div>
              <div style="display:flex;gap:8px;align-items:center;">
                <div style="text-align:center;"><div style="font-size:18px;font-weight:900;color:var(--gold);">${meal.cal}</div><div style="font-size:10px;color:var(--muted2);">קל׳</div></div>
                <div style="text-align:center;"><div style="font-size:14px;font-weight:700;color:var(--purple);">${meal.prot}g</div><div style="font-size:10px;color:var(--muted2);">חל׳</div></div>
                <button onclick="window.food.deleteMeal('${key}',${i})" class="btn btn-danger" style="padding:5px 9px;font-size:12px;">🗑</button>
              </div>
            </div>
            <div class="card-body" style="padding:10px 16px;">
              ${meal.items.map(it=>`
                <div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px;color:var(--muted2);border-bottom:1px solid rgba(255,255,255,0.03);">
                  <span>${it.name} <span style="opacity:0.6;">${it.qtyLabel}</span></span>
                  <span style="color:var(--text);">${it.cal} קל׳</span>
                </div>`).join('')}
            </div>
          </div>`).join('')}
    </div>

    <!-- Weekly summary -->
    <button onclick="window.food.toggleWeekly()" class="btn btn-ghost btn-full" style="margin-top:8px;">📊 סיכום שבועי</button>
    <div id="weeklySummary" style="display:none;margin-top:8px;">${renderWeekly()}</div>
  `;
}

export function changeDay(dir) {
  currentDayOffset += dir;
  if (currentDayOffset > 0) currentDayOffset = 0;
  renderFoodLog();
}

export function toggleWeekly() {
  const el = document.getElementById('weeklySummary');
  if (!el) return;
  el.style.display = el.style.display==='none' ? 'block' : 'none';
}

function renderWeekly() {
  let rows='', total=0;
  for (let i=-6;i<=0;i++) {
    const key=getDayKey(i);
    const meals=foodLog[key]||[];
    const cal=meals.reduce((a,m)=>a+m.cal,0);
    total+=cal;
    const pct=Math.min((cal/1900)*100,100);
    const d=new Date(); d.setDate(d.getDate()+i);
    rows+=`<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
      <div style="font-size:12px;color:var(--muted2);width:55px;">${DAY_NAMES[d.getDay()]}</div>
      <div style="flex:1;height:6px;background:rgba(255,255,255,0.06);border-radius:100px;overflow:hidden;"><div style="width:${pct}%;height:100%;background:${cal>2100?'var(--red)':'var(--gold)'};border-radius:100px;"></div></div>
      <div style="font-size:13px;font-weight:700;color:${cal===0?'var(--muted)':cal>2100?'var(--red)':'var(--gold)'};width:48px;text-align:left;">${cal||'—'}</div>
    </div>`;
  }
  return `<div class="card"><div class="card-body">${rows}<div style="margin-top:10px;font-size:12px;color:var(--muted2);">ממוצע: <strong style="color:var(--gold);">${Math.round(total/7)} קל׳</strong> | יעד: 1,900</div></div></div>`;
}

export async function deleteMeal(key, idx) {
  if (!foodLog[key]) return;
  foodLog[key].splice(idx,1);
  await saveData('foodLog', foodLog);
  renderFoodLog();
  showToast('🗑️ ארוחה נמחקה');
}

// ── ADD MEAL MODAL ──
export function openAddMeal() {
  currentMealItems = [];
  const modal = document.getElementById('addMealModal');
  if (!modal) return;
  modal.style.display='block';
  document.body.style.overflow='hidden';
  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-head">
        <div class="modal-title">🍽️ הוסף ארוחה</div>
        <button onclick="window.food.closeAddMeal()" class="modal-close">✕</button>
      </div>
      <div class="modal-body">
        <!-- Meal name -->
        <label class="label">שם הארוחה</label>
        <input id="mealNameInput" class="input" style="margin-bottom:8px;" placeholder="ארוחת בוקר, צלחת יוגורט..."/>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">
          ${['ארוחת בוקר','ארוחת צהריים','ארוחת ערב','חטיף','לפני אימון','אחרי אימון','צלחת יוגורט'].map(n=>
            `<button onclick="document.getElementById('mealNameInput').value='${n}'" style="background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:100px;padding:4px 12px;font-family:Heebo,sans-serif;font-size:12px;color:var(--muted2);cursor:pointer;">${n}</button>`
          ).join('')}
        </div>

        <!-- AI Photo option -->
        <div style="background:rgba(167,139,250,0.06);border:1px solid rgba(167,139,250,0.2);border-radius:12px;padding:12px 16px;margin-bottom:14px;">
          <div style="font-weight:600;font-size:14px;color:var(--purple);margin-bottom:6px;">📷 זיהוי קלוריות מצילום — AI</div>
          <div style="font-size:12px;color:var(--muted2);margin-bottom:10px;">צלם את הארוחה שלך ו-AI יזהה את המרכיבים ויחשב קלוריות</div>
          <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
            <input type="file" id="foodPhotoInput" accept="image/*" capture="environment" style="display:none;" onchange="window.food.analyzePhoto(this)"/>
            <button onclick="document.getElementById('foodPhotoInput').click()" class="btn" style="background:rgba(167,139,250,0.15);border:1px solid rgba(167,139,250,0.3);color:var(--purple);padding:8px 16px;font-size:13px;">📷 צלם / בחר תמונה</button>
            <span id="photoStatus" style="font-size:12px;color:var(--muted2);"></span>
          </label>
          <div id="aiResults" style="margin-top:10px;"></div>
        </div>

        <!-- Search -->
        <label class="label">🔍 חיפוש מוצרים</label>
        <div style="display:flex;gap:8px;margin-bottom:8px;">
          <input id="productSearch" class="input" style="flex:1;" placeholder="גרנולה תלמה, יוגורט, בננה..."
            onkeydown="if(event.key==='Enter') window.food.searchProduct()"/>
          <button onclick="window.food.searchProduct()" class="btn btn-primary" style="padding:10px 14px;font-size:13px;">חפש</button>
        </div>

        <!-- Quick add -->
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
          ${[
            ['יוגורט 3%',150,90,8,10,3,'כוס'],['בננה',120,105,1,27,0,'יחידה'],
            ['תפוח',180,95,0,25,0,'יחידה'],['אגס',150,100,1,26,0,'יחידה'],
            ['ביצה',60,70,6,0,5,'יחידה'],['גרנולה',30,130,3,22,5,'כף גדושה'],
            ['סילן',15,45,0,12,0,'חצי כף'],['שיבולת שועל',60,230,8,40,4,'60g'],
            ['חלב 3%',200,120,7,10,7,'200ml'],['אורז מבושל',150,170,4,38,0,'כוס'],
          ].map(([n,g,c,p,cb,f,l])=>
            `<button onclick="window.food.quickAdd('${n}',${g},${c},${p},${cb},${f},'${l}')" style="background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:8px;padding:5px 10px;font-family:Heebo,sans-serif;font-size:11px;color:var(--muted2);cursor:pointer;">${n}</button>`
          ).join('')}
        </div>

        <div id="searchSpinner" style="display:none;text-align:center;padding:12px;color:var(--muted2);font-size:13px;">🔍 מחפש...</div>
        <div id="searchResults" style="margin-bottom:10px;"></div>

        <!-- Current items -->
        <label class="label">מרכיבי הארוחה</label>
        <div id="currentMealItems"></div>
        <div id="mealRunTotal" style="display:none;background:rgba(245,166,35,0.06);border:1px solid rgba(245,166,35,0.2);border-radius:10px;padding:10px 14px;display:none;flex-wrap:wrap;gap:14px;margin-top:8px;">
          <div><span style="font-size:10px;color:var(--muted2);">קל׳</span><br><span id="mrt_cal" style="font-size:18px;font-weight:900;color:var(--gold);">0</span></div>
          <div><span style="font-size:10px;color:var(--muted2);">חלבון</span><br><span id="mrt_prot" style="font-size:18px;font-weight:900;color:var(--purple);">0g</span></div>
          <div><span style="font-size:10px;color:var(--muted2);">פחמימה</span><br><span id="mrt_carb" style="font-size:18px;font-weight:900;color:var(--blue);">0g</span></div>
          <div><span style="font-size:10px;color:var(--muted2);">שומן</span><br><span id="mrt_fat" style="font-size:18px;font-weight:900;color:var(--green);">0g</span></div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="window.food.closeAddMeal()" class="btn btn-ghost">ביטול</button>
        <button onclick="window.food.saveMealToLog()" class="btn btn-primary">✓ שמור — אכלתי!</button>
      </div>
    </div>`;
  renderCurrentMealItems();
}

export function closeAddMeal() {
  document.getElementById('addMealModal').style.display='none';
  document.body.style.overflow='';
}

// ── AI PHOTO ANALYSIS ──
export async function analyzePhoto(input) {
  const file = input.files[0];
  if (!file) return;
  const status = document.getElementById('photoStatus');
  const results = document.getElementById('aiResults');
  status.textContent = '🔄 מנתח תמונה...';
  results.innerHTML = '';

  try {
    const base64 = await new Promise((res,rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result.split(',')[1]);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            { type:'image', source:{ type:'base64', media_type:file.type, data:base64 } },
            { type:'text', text:`אתה מנתח תמונות אוכל לחישוב קלוריות.
זהה את המרכיבים בתמונה והחזר JSON בלבד (ללא טקסט אחר):
{
  "items": [
    {"name":"שם המוצר", "qty":"כמות משוערת", "grams":100, "cal":200, "prot":10, "carb":25, "fat":5},
    ...
  ],
  "total_cal": 400,
  "confidence": "גבוה/בינוני/נמוך"
}
הערות: השתדל לזהות מוצרים ישראליים. אם לא ברור, תן הערכה שמרנית.` }
          ]
        }]
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    const clean = text.replace(/```json|```/g,'').trim();
    const parsed = JSON.parse(clean);

    status.textContent = `✅ זוהו ${parsed.items.length} מוצרים (ביטחון: ${parsed.confidence})`;
    results.innerHTML = `
      <div style="background:rgba(167,139,250,0.06);border:1px solid rgba(167,139,250,0.15);border-radius:10px;padding:12px;">
        ${parsed.items.map((item,i) => `
          <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
            <div style="flex:1;font-size:13px;">${item.name} <span style="color:var(--muted2);">${item.qty}</span></div>
            <div style="font-size:12px;color:var(--gold);">${item.cal} קל׳</div>
            <button onclick="window.food.addAiItem(${i})" style="background:rgba(52,211,153,0.15);border:1px solid rgba(52,211,153,0.3);color:var(--green);border-radius:6px;padding:4px 8px;font-family:Heebo,sans-serif;font-size:11px;cursor:pointer;">+ הוסף</button>
          </div>`).join('')}
        <button onclick="window.food.addAllAiItems()" class="btn btn-primary btn-full" style="margin-top:8px;font-size:13px;">+ הוסף הכל (${parsed.total_cal} קל׳)</button>
      </div>`;

    window._aiItems = parsed.items;
  } catch(e) {
    status.textContent = '❌ לא הצלחתי לנתח. נסה שוב.';
    console.error('AI photo error:', e);
  }
}

export function addAiItem(idx) {
  const item = window._aiItems?.[idx];
  if (!item) return;
  currentMealItems.push({ name:item.name, qtyLabel:item.qty, grams:item.grams||100, cal:item.cal, prot:item.prot||0, carb:item.carb||0, fat:item.fat||0 });
  renderCurrentMealItems();
  showToast(`✅ ${item.name} הוסף`);
}

export function addAllAiItems() {
  (window._aiItems||[]).forEach(item => {
    currentMealItems.push({ name:item.name, qtyLabel:item.qty, grams:item.grams||100, cal:item.cal, prot:item.prot||0, carb:item.carb||0, fat:item.fat||0 });
  });
  renderCurrentMealItems();
  showToast(`✅ כל המרכיבים הוספו`);
}

// ── PRODUCT SEARCH ──
export async function searchProduct() {
  const q = document.getElementById('productSearch')?.value.trim();
  if (!q) return;
  document.getElementById('searchSpinner').style.display='block';
  document.getElementById('searchResults').innerHTML='';
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=8&lc=he&cc=il`;
    const res = await fetch(url);
    const data = await res.json();
    document.getElementById('searchSpinner').style.display='none';
    const products = (data.products||[]).filter(p=>p.product_name&&p.nutriments&&p.nutriments['energy-kcal_100g']);
    if (products.length===0) { document.getElementById('searchResults').innerHTML='<div style="font-size:12px;color:var(--muted2);">לא נמצא. נסה באנגלית.</div>'; return; }
    window._searchResults = products;
    document.getElementById('searchResults').innerHTML = products.map((p,i) => {
      const name = p.product_name_he||p.product_name||'מוצר';
      const cal = Math.round(p.nutriments['energy-kcal_100g']||0);
      const img = p.image_small_url||'';
      return `<div onclick="window.food.openQtyModal(${i})" style="display:flex;align-items:center;gap:10px;padding:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;cursor:pointer;margin-bottom:6px;transition:all 0.15s;" onmouseover="this.style.borderColor='rgba(245,166,35,0.4)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.07)'">
        ${img?`<img src="${img}" style="width:38px;height:38px;object-fit:contain;border-radius:6px;flex-shrink:0;" onerror="this.style.display='none'"/>`:'<div style="width:38px;height:38px;background:rgba(255,255,255,0.04);border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">🛒</div>'}
        <div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>${p.brands?`<div style="font-size:11px;color:var(--muted2);">${p.brands}</div>`:''}</div>
        <div style="text-align:left;flex-shrink:0;"><div style="font-size:14px;font-weight:700;color:var(--gold);">${cal}</div><div style="font-size:10px;color:var(--muted2);">קל׳/100g</div></div>
      </div>`;
    }).join('');
  } catch(e) {
    document.getElementById('searchSpinner').style.display='none';
    document.getElementById('searchResults').innerHTML='<div style="font-size:12px;color:var(--red);">שגיאת חיבור</div>';
  }
}

// ── QTY MODAL ──
export function openQtyModal(idx) {
  const p = window._searchResults[idx];
  pendingProduct = {
    name:p.product_name_he||p.product_name,
    cal100:Math.round(p.nutriments['energy-kcal_100g']||0),
    prot100:Math.round(p.nutriments.proteins_100g||0),
    carb100:Math.round(p.nutriments.carbohydrates_100g||0),
    fat100:Math.round(p.nutriments.fat_100g||0),
    brand:p.brands||''
  };
  showQtyModal();
}

export function quickAdd(name, grams, cal, prot, carb, fat, label) {
  pendingProduct = { name, cal100:Math.round(cal/grams*100), prot100:Math.round(prot/grams*100), carb100:Math.round(carb/grams*100), fat100:Math.round(fat/grams*100), brand:'', _unitGrams:grams };
  showQtyModal(label);
}

function showQtyModal(defaultUnit) {
  const modal = document.getElementById('qtyModal');
  if (!modal) return;
  modal.style.display='flex';
  modal.innerHTML = `
    <div style="background:#1a2538;border:1px solid rgba(255,255,255,0.15);border-radius:18px;padding:22px;max-width:360px;width:100%;">
      <div style="font-size:16px;font-weight:700;margin-bottom:4px;">${pendingProduct.name}</div>
      <div style="font-size:12px;color:var(--muted2);margin-bottom:16px;">${pendingProduct.brand} · ${pendingProduct.cal100} קל׳/100g · חל׳ ${pendingProduct.prot100}g</div>
      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <input id="qtyAmount" type="number" value="1" min="0.1" step="0.5" oninput="window.food.updateQtyPreview()"
          style="width:80px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:10px;font-family:Heebo,sans-serif;font-size:18px;font-weight:700;color:var(--text);text-align:center;outline:none;"/>
        <select id="qtyUnit" onchange="window.food.updateQtyPreview()" class="select" style="flex:1;">
          <option value="serving">מנה (100g)</option>
          <option value="g">גרם</option>
          <option value="ml">מ"ל</option>
          <option value="unit">יחידה</option>
          <option value="cup">כוס (240ml)</option>
          <option value="tbsp">כף (15g)</option>
          <option value="tsp">כפית (5g)</option>
          <option value="handful">חופן (~30g)</option>
        </select>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
        ${[['0.5','serving','חצי מנה'],['1','serving','מנה'],['1','unit','יחידה'],['1','cup','כוס'],['1','tbsp','כף'],['100','g','100g'],['150','g','150g'],['200','g','200g']].map(([a,u,l])=>
          `<button onclick="window.food.setQty(${a},'${u}')" style="background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:6px;padding:4px 9px;font-family:Heebo,sans-serif;font-size:11px;color:var(--muted2);cursor:pointer;">${l}</button>`
        ).join('')}
      </div>
      <div id="qtyPreview" style="background:rgba(245,166,35,0.08);border:1px solid rgba(245,166,35,0.2);border-radius:8px;padding:10px 14px;font-size:13px;margin-bottom:14px;"></div>
      <div style="display:flex;gap:8px;">
        <button onclick="window.food.closeQty()" class="btn btn-ghost" style="flex:1;">ביטול</button>
        <button onclick="window.food.confirmAddProduct()" class="btn btn-primary" style="flex:2;">+ הוסף לארוחה</button>
      </div>
    </div>`;
  updateQtyPreview();
}

export function setQty(a,u) { document.getElementById('qtyAmount').value=a; document.getElementById('qtyUnit').value=u; updateQtyPreview(); }

function getGrams() {
  const amt = parseFloat(document.getElementById('qtyAmount')?.value)||1;
  const unit = document.getElementById('qtyUnit')?.value;
  const map = {serving:100,g:1,ml:1,unit:pendingProduct._unitGrams||100,cup:240,tbsp:15,tsp:5,handful:30};
  return amt*(map[unit]||100);
}

function getUnitLabel() {
  const amt = document.getElementById('qtyAmount')?.value;
  const unit = document.getElementById('qtyUnit')?.value;
  const labels = {serving:'מנה',g:'g',ml:'ml',unit:'יח׳',cup:'כוס',tbsp:'כף',tsp:'כפית',handful:'חופן'};
  return `${amt} ${labels[unit]||unit}`;
}

export function updateQtyPreview() {
  if (!pendingProduct) return;
  const g = getGrams();
  const cal=Math.round(pendingProduct.cal100*g/100), prot=Math.round(pendingProduct.prot100*g/100);
  const carb=Math.round(pendingProduct.carb100*g/100), fat=Math.round(pendingProduct.fat100*g/100);
  const el=document.getElementById('qtyPreview');
  if(el) el.innerHTML=`<strong>${getUnitLabel()} = ${g}g</strong> &nbsp;|&nbsp; <span style="color:var(--gold)">${cal} קל׳</span> &nbsp;|&nbsp; <span style="color:var(--purple)">חל׳ ${prot}g</span> &nbsp;|&nbsp; <span style="color:var(--blue)">פח׳ ${carb}g</span>`;
}

export function confirmAddProduct() {
  if (!pendingProduct) return;
  const g=getGrams();
  currentMealItems.push({
    name:pendingProduct.name, qtyLabel:getUnitLabel(), grams:g,
    cal:Math.round(pendingProduct.cal100*g/100), prot:Math.round(pendingProduct.prot100*g/100),
    carb:Math.round(pendingProduct.carb100*g/100), fat:Math.round(pendingProduct.fat100*g/100)
  });
  closeQty();
  renderCurrentMealItems();
}

export function closeQty() { document.getElementById('qtyModal').style.display='none'; pendingProduct=null; }

function renderCurrentMealItems() {
  const container = document.getElementById('currentMealItems');
  const totalEl = document.getElementById('mealRunTotal');
  if (!container) return;
  if (currentMealItems.length===0) {
    container.innerHTML='<div style="font-size:13px;color:var(--muted);text-align:center;padding:10px;">עוד לא הוספת מוצרים</div>';
    if(totalEl) totalEl.style.display='none';
    return;
  }
  container.innerHTML = currentMealItems.map((it,i)=>`
    <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:rgba(255,255,255,0.03);border-radius:8px;margin-bottom:5px;">
      <div style="flex:1;font-size:13px;">${it.name} <span style="color:var(--muted2);font-size:11px;">${it.qtyLabel}</span></div>
      <div style="font-size:13px;color:var(--gold);font-weight:700;">${it.cal}</div>
      <div style="font-size:11px;color:var(--purple);">${it.prot}g</div>
      <button onclick="window.food.removeItem(${i})" style="background:rgba(248,113,113,0.1);border:none;color:var(--red);border-radius:5px;padding:3px 7px;font-size:11px;cursor:pointer;">✕</button>
    </div>`).join('');
  const totCal=currentMealItems.reduce((a,i)=>a+i.cal,0);
  const totP=currentMealItems.reduce((a,i)=>a+i.prot,0);
  const totC=currentMealItems.reduce((a,i)=>a+i.carb,0);
  const totF=currentMealItems.reduce((a,i)=>a+i.fat,0);
  if(totalEl){totalEl.style.display='flex';[['cal',totCal],['prot',totP+'g'],['carb',totC+'g'],['fat',totF+'g']].forEach(([k,v])=>{const el=document.getElementById('mrt_'+k);if(el)el.textContent=v;});}
}

export function removeItem(i) { currentMealItems.splice(i,1); renderCurrentMealItems(); }

export async function saveMealToLog() {
  const name=document.getElementById('mealNameInput')?.value.trim()||'ארוחה';
  if(currentMealItems.length===0){showToast('❌ הוסף לפחות מוצר אחד');return;}
  const key=getDayKey(currentDayOffset);
  if(!foodLog[key]) foodLog[key]=[];
  const now=new Date();
  const time=now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0');
  const totCal=currentMealItems.reduce((a,i)=>a+i.cal,0);
  const totP=currentMealItems.reduce((a,i)=>a+i.prot,0);
  const totC=currentMealItems.reduce((a,i)=>a+i.carb,0);
  const totF=currentMealItems.reduce((a,i)=>a+i.fat,0);
  foodLog[key].push({name,time,items:currentMealItems,cal:totCal,prot:totP,carb:totC,fat:totF});
  await saveData('foodLog',foodLog);
  closeAddMeal();
  renderFoodLog();
  showToast(`✅ ${name} נשמרה! ${totCal} קל׳`);
}
