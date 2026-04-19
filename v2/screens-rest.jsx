// V2 Food, Train, Progress, AI

function V2Food({ t, L, go }) {
  const rtl = L.dir === 'rtl';
  return (
    <div style={{ padding: '20px 0 150px', direction: L.dir, color: YLV2_Tokens.cream }}>
      <div style={{ padding: '0 22px 14px' }}>
        <div style={{ fontFamily: YLV2_Type.mono, fontSize: 10.5, color: YLV2_Tokens.creamMute, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          {rtl ? 'מסלול · חלבון גבוה' : 'Path · High protein'}
        </div>
        <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 32, color: YLV2_Tokens.cream, letterSpacing: -0.5, marginTop: 6, lineHeight: 1.05 }}>
          {rtl ? <>אוכל לחיים האמיתיים,<br/><em style={{ color: YLV2_Tokens.amber }}>לא לדיאטה.</em></> : <>Food for real life,<br/><em style={{ color: YLV2_Tokens.amber }}>not a diet.</em></>}
        </div>
      </div>

      {/* fuel */}
      <div style={{ padding: '0 16px' }}>
        <V2Card dark>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <V2Ring size={88} stroke={6} value={0.39}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: YLV2_Type.serif, fontSize: 22, color: YLV2_Tokens.cream, lineHeight: 1 }}>740</div>
                <div style={{ fontFamily: YLV2_Type.mono, fontSize: 9, color: YLV2_Tokens.creamMute }}>/1900</div>
              </div>
            </V2Ring>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: YLV2_Type.mono, fontSize: 10, color: YLV2_Tokens.creamMute, letterSpacing: 1, textTransform: 'uppercase' }}>
                {rtl ? 'נשאר להיום' : 'left today'}
              </div>
              <div style={{ fontFamily: YLV2_Type.serif, fontSize: 34, color: YLV2_Tokens.amber, lineHeight: 1, marginTop: 4 }}>1,160</div>
              <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 12, color: YLV2_Tokens.creamDim, marginTop: 6 }}>
                {rtl ? 'צריך עוד 62g חלבון' : 'Need 62g more protein'}
              </div>
            </div>
          </div>
        </V2Card>
      </div>

      {/* Quick actions */}
      <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
        {[
          { icon: 'cam',    l: rtl ? 'צילום' : 'Photo' },
          { icon: 'mic',    l: rtl ? 'קול'    : 'Voice' },
          { icon: 'fridge', l: rtl ? 'מקרר'   : 'Fridge' },
          { icon: 'plus',   l: rtl ? 'הוסף'   : 'Add' },
        ].map((a,i) => (
          <button key={i} onClick={() => go('photo')} style={{
            padding: '14px 6px', borderRadius: 14, border: `1px solid ${YLV2_Tokens.creamHair}`,
            background: YLV2_Tokens.inkSoft, color: YLV2_Tokens.cream, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          }}>
            <V2Icon name={a.icon} size={20} color={YLV2_Tokens.amber}/>
            <span style={{ fontFamily: YLV2_Type.mono, fontSize: 10, letterSpacing: 0.5 }}>{a.l}</span>
          </button>
        ))}
      </div>

      {/* Real life meals — Israeli context */}
      <div style={{ padding: '20px 22px 10px' }}>
        <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 20, color: YLV2_Tokens.cream, letterSpacing: -0.2 }}>
          {rtl ? 'הצעות מהחיים שלך' : 'From your real life'}
        </div>
        <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 12, color: YLV2_Tokens.creamDim, marginTop: 4 }}>
          {rtl ? 'חומוס, פיתה, שניצל — נלמד לנצח בתוך החיים, לא מחוץ להם.' : 'Hummus, pita, schnitzel — win inside real life, not outside it.'}
        </div>
      </div>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { k: rtl ? 'חומוס + ביצה + סלט'       : 'Hummus + egg + salad',      kcal: 540, note: rtl ? 'פיתה קטנה בסדר' : 'small pita is fine' },
          { k: rtl ? 'שניצל אפוי + אורז + ירק'  : 'Baked schnitzel + rice',    kcal: 620, note: rtl ? 'אפוי — לא מטוגן' : 'baked, not fried' },
          { k: rtl ? 'שווארמה בסלט גדול'          : 'Shawarma on big salad',    kcal: 580, note: rtl ? 'בלי פיתה הפעם' : 'skip the pita today' },
          { k: rtl ? 'יוגורט + גרנולה + פירות'   : 'Yogurt + granola + fruit', kcal: 380, note: rtl ? 'ארוחה פשוטה' : 'simple win' },
        ].map((m,i) => (
          <V2Card key={i} pad={14} dark style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <V2Ph label="" h={48} style={{ width: 48, flexShrink: 0 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 14, fontWeight: 500, color: YLV2_Tokens.cream }}>{m.k}</div>
              <div style={{ fontFamily: YLV2_Type.mono, fontSize: 10, color: YLV2_Tokens.creamMute, marginTop: 2 }}>{m.note}</div>
            </div>
            <div style={{ fontFamily: YLV2_Type.serif, fontSize: 16, color: YLV2_Tokens.amber }}>{m.kcal}</div>
          </V2Card>
        ))}
      </div>

      {/* Dislikes reminder */}
      <div style={{ padding: '18px 16px' }}>
        <V2Card pad={14} dark>
          <div style={{ fontFamily: YLV2_Type.mono, fontSize: 10, color: YLV2_Tokens.creamMute, letterSpacing: 1, textTransform: 'uppercase' }}>
            {rtl ? 'הכללים שלך' : 'Your rules'}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
            {(rtl ? ['לא עגבניות','לא זיתים','לא כוסברה','אין חלב אחרי 20:00'] : ['no tomatoes','no olives','no cilantro','no dairy after 20:00']).map(r => (
              <span key={r} style={{
                padding: '5px 10px', borderRadius: 999,
                background: 'rgba(163,58,46,0.15)', color: '#E8A598',
                fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 11.5, fontWeight: 500,
              }}>✕ {r}</span>
            ))}
          </div>
        </V2Card>
      </div>
    </div>
  );
}

function V2Train({ t, L }) {
  const rtl = L.dir === 'rtl';
  return (
    <div style={{ padding: '20px 0 150px', direction: L.dir, color: YLV2_Tokens.cream }}>
      <div style={{ padding: '0 22px 14px' }}>
        <div style={{ fontFamily: YLV2_Type.mono, fontSize: 10.5, color: YLV2_Tokens.creamMute, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          {t.lowEnergy}
        </div>
        <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 30, color: YLV2_Tokens.cream, letterSpacing: -0.5, marginTop: 6, lineHeight: 1.05 }}>
          {t.trainHero}
        </div>
      </div>

      {/* Adaptive recommendation */}
      <div style={{ padding: '0 16px' }}>
        <V2Card pad={0} dark style={{ overflow: 'hidden' }}>
          <V2Ph label={rtl ? 'הליכה + ניידות · 25 דק׳' : 'walk + mobility · 25 min'} h={150} style={{ borderRadius: 0, border: 'none' }}/>
          <div style={{ padding: 18 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              <V2Pill tone="amber">{rtl ? 'מותאם לעכשיו' : 'tuned for now'}</V2Pill>
              <V2Pill tone="ghost">25 {t.min}</V2Pill>
            </div>
            <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 22, color: YLV2_Tokens.cream, letterSpacing: -0.2, lineHeight: 1.15 }}>
              {rtl ? 'הליכה מהירה + ניידות ביתית' : 'Brisk walk + home mobility'}
            </div>
            <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 13, color: YLV2_Tokens.creamDim, marginTop: 8, lineHeight: 1.4 }}>
              {rtl ? 'אמרת אנרגיה 2/5 ושינה גרועה. זה המינימום שישאיר אותך במסלול — בלי לשרוף אותך.' : 'You said energy 2/5 and bad sleep. Minimum to stay on track without burning you out.'}
            </div>
            <button style={{
              marginTop: 14, padding: '12px 18px', borderRadius: 999, border: 'none',
              background: YLV2_Tokens.amber, color: YLV2_Tokens.ink, cursor: 'pointer',
              fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 13, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}><V2Icon name="play" size={12} color={YLV2_Tokens.ink}/> {t.start}</button>
          </div>
        </V2Card>
      </div>

      {/* Modalities */}
      <div style={{ padding: '20px 22px 10px' }}>
        <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 20, color: YLV2_Tokens.cream, letterSpacing: -0.2 }}>
          {rtl ? 'או בחר בעצמך' : 'Or pick yourself'}
        </div>
      </div>
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {[
          { k: rtl ? 'הליכה' : 'Walk',     i: 'walk' },
          { k: rtl ? 'ריצה' : 'Run',       i: 'bolt' },
          { k: rtl ? 'כוח' : 'Strength',   i: 'train' },
          { k: 'HIIT',                      i: 'flame' },
          { k: rtl ? 'ניידות' : 'Mobility',i: 'heart' },
          { k: rtl ? 'אגרוף' : 'Boxing',   i: 'bolt' },
          { k: rtl ? 'שחיה' : 'Swim',      i: 'drop' },
          { k: rtl ? 'קצר' : 'Quick',      i: 'clock' },
          { k: rtl ? 'רגוע' : 'Recovery',  i: 'moon' },
        ].map((m,i) => (
          <V2Card key={i} pad={12} dark style={{ textAlign: 'center' }}>
            <div style={{ margin: '0 auto', width: 34, height: 34, borderRadius: 10, background: 'rgba(237,231,216,0.06)', display: 'grid', placeItems: 'center', color: YLV2_Tokens.amber }}>
              <V2Icon name={m.i} size={18}/>
            </div>
            <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 12, fontWeight: 500, color: YLV2_Tokens.cream, marginTop: 8 }}>{m.k}</div>
          </V2Card>
        ))}
      </div>
    </div>
  );
}

function V2Progress({ t, L }) {
  const rtl = L.dir === 'rtl';
  const stats = [
    { l: rtl ? 'משקל'         : 'Weight',       v: '93.2', s: '↓ 3.8 ' + t.kg, c: YLV2_Tokens.amber, dark: true },
    { l: rtl ? 'עקביות'        : 'Consistency', v: '87%',  s: rtl ? '+12% השבוע' : '+12% this week' },
    { l: rtl ? 'אימונים'       : 'Sessions',    v: '17/20' },
    { l: rtl ? 'רצף'           : 'Streak',      v: '14',   s: rtl ? 'ימים' : 'days' },
    { l: rtl ? 'חלבון ממוצע'   : 'Avg protein', v: '128g' },
    { l: rtl ? 'מים'           : 'Water',       v: '6.8',  s: rtl ? 'כוסות/יום' : 'cups/day' },
    { l: rtl ? 'שינה'          : 'Sleep',       v: '7h 12m' },
    { l: rtl ? 'ציון ביטחון'   : 'Confidence',  v: '4.2/5', s: rtl ? '↑ השבוע' : '↑ this week' },
  ];

  return (
    <div style={{ padding: '20px 0 150px', direction: L.dir, color: YLV2_Tokens.cream }}>
      <div style={{ padding: '0 22px 14px' }}>
        <div style={{ fontFamily: YLV2_Type.mono, fontSize: 10.5, color: YLV2_Tokens.creamMute, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          23 / 168 {rtl ? 'ימים' : 'days'}
        </div>
        <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 30, color: YLV2_Tokens.cream, letterSpacing: -0.5, marginTop: 6, lineHeight: 1.05 }}>
          {rtl ? <>זה קורה.<br/><em style={{ color: YLV2_Tokens.amber }}>באמת.</em></> : <>It's happening.<br/><em style={{ color: YLV2_Tokens.amber }}>For real.</em></>}
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {stats.map((s,i) => (
          <V2Card key={i} pad={14} dark style={s.dark ? { background: YLV2_Tokens.amber, color: YLV2_Tokens.ink, border: 'none' } : {}}>
            <div style={{ fontFamily: YLV2_Type.mono, fontSize: 9.5, color: s.dark ? 'rgba(14,14,12,0.6)' : YLV2_Tokens.creamMute, letterSpacing: 1, textTransform: 'uppercase' }}>{s.l}</div>
            <div style={{ fontFamily: YLV2_Type.serif, fontSize: 28, color: s.dark ? YLV2_Tokens.ink : YLV2_Tokens.cream, lineHeight: 1, marginTop: 8, letterSpacing: -0.3 }}>
              {s.v}
            </div>
            {s.s && <div style={{ fontFamily: YLV2_Type.mono, fontSize: 10, color: s.dark ? 'rgba(14,14,12,0.65)' : YLV2_Tokens.amber, marginTop: 4 }}>{s.s}</div>}
          </V2Card>
        ))}
      </div>

      {/* Identity feedback */}
      <div style={{ padding: '18px 16px' }}>
        <V2Card dark>
          <div style={{ fontFamily: YLV2_Type.mono, fontSize: 10, color: YLV2_Tokens.amber, letterSpacing: 1, textTransform: 'uppercase' }}>
            {rtl ? 'מה שאני רואה' : 'What I see'}
          </div>
          <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 17, color: YLV2_Tokens.cream, marginTop: 10, lineHeight: 1.4 }}>
            {rtl ? 'ימי ראשון היו קשים. התוכנית החדשה עוקפת את הטריגר. שומרים על 14 ימי רצף.' : 'Sundays used to break you. The new plan routes around the trigger. 14-day streak holding.'}
          </div>
        </V2Card>
      </div>

      {/* Business insights — body ↔ business */}
      <div style={{ padding: '0 16px' }}>
        <V2BizInsights t={t} L={L}/>
      </div>
    </div>
  );
}

function V2AI({ t, L }) {
  const rtl = L.dir === 'rtl';
  const [draft, setDraft] = React.useState('');
  const [msgs, setMsgs] = React.useState([
    { who: 'ai', text: rtl ? 'בוקר יואב. ראיתי שישנת פחות מ-6 שעות. הורדתי את האימון ל-25 דקות ודחפתי את הארוחה הכבדה לצהריים. בסדר?' : 'Morning Yoav. You slept under 6 hrs. I dropped training to 25 min and pushed your heavy meal to midday. OK?' },
    { who: 'me', text: rtl ? 'כן. ואני אחרי יום קשה בעבודה.' : 'Yes. And I had a rough work day.' },
    { who: 'ai', text: rtl ? 'ברור. הכנתי לך ארוחת ערב ב-15 דקות מהמקרר — בלי עגבניות. תרצה לראות?' : 'Got it. 15-min dinner ready from your fridge — no tomatoes. Want to see?' },
  ]);

  return (
    <div style={{ padding: '20px 0 150px', direction: L.dir, color: YLV2_Tokens.cream, position: 'relative', minHeight: '100%' }}>
      <div style={{ padding: '0 22px 14px' }}>
        <div style={{ fontFamily: YLV2_Type.mono, fontSize: 10.5, color: YLV2_Tokens.amber, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          {rtl ? 'יואב · הזיכרון שלי עליך' : 'Yoav · my memory of you'}
        </div>
        <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 30, color: YLV2_Tokens.cream, letterSpacing: -0.5, marginTop: 6, lineHeight: 1.05 }}>
          {t.askAnything}
        </div>
      </div>

      {/* Memory chips */}
      <div style={{ padding: '0 16px 12px' }}>
        <V2Card pad={14} dark>
          <div style={{ fontFamily: YLV2_Type.mono, fontSize: 9.5, color: YLV2_Tokens.creamMute, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
            {rtl ? 'מה שאני יודע עליך' : 'What I know about you'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(rtl ? [
              'סוף שבוע קשה', 'נשנוש בעבודה', 'ראשון = טריגר',
              'אוהב חלבון בבוקר', 'לא עגבניות', 'מתאמן יותר בערב',
              'מתייבש כשזה לחוץ',
            ] : [
              'tough weekends', 'snacks at work', 'Sundays = trigger',
              'protein breakfast fan', 'no tomatoes', 'evening trainer',
              'under-hydrates under stress',
            ]).map(m => (
              <span key={m} style={{
                padding: '5px 10px', borderRadius: 999,
                background: 'rgba(230,126,60,0.14)', color: YLV2_Tokens.amber,
                fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 11, fontWeight: 500,
              }}>{m}</span>
            ))}
          </div>
        </V2Card>
      </div>

      {/* Messages */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {msgs.map((m,i) => (
          <div key={i} style={{
            display: 'flex', alignSelf: m.who === 'me' ? 'flex-end' : 'flex-start',
            maxWidth: '82%',
          }}>
            <div style={{
              padding: '12px 14px', borderRadius: 16,
              background: m.who === 'me' ? YLV2_Tokens.amber : YLV2_Tokens.inkSoft,
              color: m.who === 'me' ? YLV2_Tokens.ink : YLV2_Tokens.cream,
              border: m.who === 'ai' ? `1px solid ${YLV2_Tokens.creamHair}` : 'none',
              fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 13.5, lineHeight: 1.45,
            }}>{m.text}</div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 104, direction: L.dir }}>
        <div style={{
          background: YLV2_Tokens.inkSoft, borderRadius: 999,
          border: `1px solid ${YLV2_Tokens.creamHair}`,
          display: 'flex', alignItems: 'center', padding: '6px',
        }}>
          <button style={{
            width: 38, height: 38, borderRadius: 19, border: 'none',
            background: 'transparent', color: YLV2_Tokens.cream, cursor: 'pointer',
            display: 'grid', placeItems: 'center',
          }}><V2Icon name="mic" size={18}/></button>
          <input value={draft} onChange={e => setDraft(e.target.value)} placeholder={t.placeholder}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 13.5,
              color: YLV2_Tokens.cream, padding: '0 8px', direction: L.dir,
            }}/>
          <button onClick={() => { if (!draft.trim()) return; setMsgs([...msgs, { who: 'me', text: draft }]); setDraft(''); }}
            style={{
              width: 38, height: 38, borderRadius: 19, border: 'none',
              background: YLV2_Tokens.amber, color: YLV2_Tokens.ink, cursor: 'pointer',
              display: 'grid', placeItems: 'center', transform: rtl ? 'scaleX(-1)' : 'none',
            }}><V2Icon name="send" size={16}/></button>
        </div>
      </div>
    </div>
  );
}

// Fridge photo flow
function V2Photo({ t, L, close }) {
  const rtl = L.dir === 'rtl';
  return (
    <div style={{ padding: '56px 0 120px', direction: L.dir, minHeight: '100%', color: YLV2_Tokens.cream }}>
      <div style={{ padding: '0 22px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={close} style={{
          width: 38, height: 38, borderRadius: 19, border: `1px solid ${YLV2_Tokens.creamHair}`,
          background: YLV2_Tokens.inkSoft, color: YLV2_Tokens.cream, cursor: 'pointer',
          display: 'grid', placeItems: 'center', transform: rtl ? 'scaleX(-1)' : 'none',
        }}><V2Icon name="back" size={16}/></button>
        <div style={{ fontFamily: YLV2_Type.mono, fontSize: 10, color: YLV2_Tokens.creamMute, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          {rtl ? 'מקרר · צילום' : 'Fridge · photo'}
        </div>
      </div>
      <div style={{ padding: '6px 22px 14px' }}>
        <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 28, color: YLV2_Tokens.cream, letterSpacing: -0.4, lineHeight: 1.1 }}>
          {rtl ? <>צלם.<br/><em style={{ color: YLV2_Tokens.amber }}>אני אבנה מזה ארוחה.</em></> : <>Snap it.<br/><em style={{ color: YLV2_Tokens.amber }}>I'll build a meal.</em></>}
        </div>
      </div>
      <div style={{ padding: '0 16px' }}>
        <V2Ph label={rtl ? 'המקרר שלך' : 'your fridge'} h={220} style={{ borderRadius: 18 }}/>
        <V2Card dark style={{ marginTop: 10 }}>
          <V2Pill tone="amber">{rtl ? 'זוהה · 8 פריטים' : 'detected · 8 items'}</V2Pill>
          <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 22, color: YLV2_Tokens.cream, marginTop: 10, letterSpacing: -0.2 }}>
            {rtl ? 'חזה עוף על שעועית וקישואים' : 'Chicken on beans + zucchini'}
          </div>
          <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 12.5, color: YLV2_Tokens.creamDim, marginTop: 8 }}>
            {rtl ? 'משתמש ב-6 מתוך 8 · בלי עגבניות · 15 דק׳' : 'Uses 6/8 · no tomatoes · 15 min'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginTop: 12 }}>
            {(rtl ? ['עוף','לימון','קישואים','שום','שמן','פפריקה','אורז','בצל'] : ['chicken','lemon','zucchini','garlic','oil','paprika','rice','onion']).map((f,i) => (
              <div key={i} style={{
                padding: '6px 8px', borderRadius: 8, textAlign: 'center',
                background: i < 6 ? 'rgba(230,126,60,0.18)' : 'rgba(0,0,0,0.25)',
                color: i < 6 ? YLV2_Tokens.amber : YLV2_Tokens.creamMute,
                fontFamily: YLV2_Type.mono, fontSize: 10,
                textDecoration: i >= 6 ? 'line-through' : 'none',
              }}>{f}</div>
            ))}
          </div>
          <button style={{
            width: '100%', marginTop: 14, padding: '14px', borderRadius: 999, border: 'none',
            background: YLV2_Tokens.amber, color: YLV2_Tokens.ink, cursor: 'pointer',
            fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 13, fontWeight: 600,
          }}>{rtl ? 'בנה מתכון' : 'Build recipe'}</button>
        </V2Card>
      </div>
    </div>
  );
}

function V2TabBar({ tab, setTab, t, L }) {
  const rtl = L.dir === 'rtl';
  const items = [
    { k: 'today', icon: 'today', label: t.today },
    { k: 'food',  icon: 'food',  label: t.food },
    { k: 'train', icon: 'train', label: t.train },
    { k: 'prog',  icon: 'prog',  label: t.progress },
    { k: 'ai',    icon: 'ai',    label: t.ai },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
      padding: '8px 10px 28px', direction: L.dir,
      background: 'linear-gradient(to top, #0E0E0C 70%, rgba(14,14,12,0))',
      pointerEvents: 'none',
    }}>
      <div style={{
        pointerEvents: 'auto',
        background: YLV2_Tokens.inkElev, borderRadius: 28,
        padding: '10px 6px',
        display: 'flex', justifyContent: 'space-between',
        border: `1px solid ${YLV2_Tokens.creamHair}`,
      }}>
        {items.map(it => {
          const active = tab === it.k;
          return (
            <button key={it.k} onClick={() => setTab(it.k)} style={{
              flex: 1, border: 'none', background: active ? YLV2_Tokens.amber : 'transparent',
              color: active ? YLV2_Tokens.ink : YLV2_Tokens.creamDim,
              borderRadius: 20, padding: '7px 4px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans,
              fontSize: 10, fontWeight: 600,
            }}>
              <V2Icon name={it.icon} size={20}/>
              <span>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { V2Food, V2Train, V2Progress, V2AI, V2Photo, V2TabBar });
