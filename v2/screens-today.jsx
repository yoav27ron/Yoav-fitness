// V2 Today — morning check-in + generated day

function V2Today({ t, L, go, state, setState, openSOS, openNotifs, openMode, mode }) {
  const [checkedIn, setCheckedIn] = React.useState(state.checkedIn || false);
  const rtl = L.dir === 'rtl';

  if (!checkedIn) {
    return <V2CheckIn t={t} L={L} onDone={(r) => { setState({ ...state, ...r, checkedIn: true }); setCheckedIn(true); }} rtl={rtl}/>;
  }

  const W = 300, H = 60;
  const weights = [97, 96.4, 95.8, 95.1, 94.6, 94.1, 93.8, 93.5, 93.2];
  const min = 92.5, max = 97.5;
  const pts = weights.map((w, i) => {
    const x = (i/(weights.length-1))*W;
    const y = H - ((w - min)/(max - min))*H;
    return [x,y];
  });
  const path = pts.map((p,i)=>(i===0?'M':'L')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');

  return (
    <div style={{ padding: '0 0 150px', direction: L.dir, color: YLV2_Tokens.cream }}>
      {/* Header */}
      <div style={{ padding: '20px 22px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: YLV2_Type.mono, fontSize: 10.5, color: YLV2_Tokens.creamMute, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            {t.dayCount}
          </div>
          <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 34, color: YLV2_Tokens.cream, lineHeight: 1.05, letterSpacing: -0.5, marginTop: 8 }}>
            {t.goodMorning}<br/>
            <em style={{ color: YLV2_Tokens.amber, fontStyle: 'italic' }}>{t.name}.</em>
          </div>
        </div>
        <button onClick={openSOS} style={{
          width: 58, height: 58, borderRadius: 29, border: 'none',
          background: YLV2_Tokens.blood, color: YLV2_Tokens.cream, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
          boxShadow: '0 6px 20px rgba(181,74,56,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}>
          <V2Icon name="handUp" size={20}/>
          <span style={{ fontFamily: YLV2_Type.mono, fontSize: 9, fontWeight: 600, letterSpacing: 1 }}>{t.sosTiny}</span>
        </button>
      </div>

      {/* Notifications quick row */}
      <div style={{ padding: '10px 22px 0', display: 'flex', gap: 8 }}>
        <button onClick={openNotifs} style={{
          flex: 1, padding: '10px 14px', borderRadius: 999, border: `1px solid ${YLV2_Tokens.creamHair}`,
          background: YLV2_Tokens.inkSoft, color: YLV2_Tokens.cream, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between',
          fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 12, fontWeight: 500,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: YLV2_Tokens.amber }}/>
            {rtl ? '3 התראות חדשות — רק מה שחשוב' : '3 new — only what matters'}
          </span>
          <V2Icon name={rtl ? 'chevL' : 'chev'} size={14} color={YLV2_Tokens.creamMute}/>
        </button>
      </div>

      {/* Day mode card */}
      <div style={{ padding: '14px 16px 4px' }}>
        <V2ModeCard t={t} L={L} modeKey={mode} onChange={openMode}/>
      </div>

      {/* Identity read — Yoav knows you */}
      <div style={{ padding: '14px 16px' }}>
        <V2Card dark style={{ background: YLV2_Tokens.inkElev, border: `1px solid ${YLV2_Tokens.creamHair}` }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
            <V2Icon name="brain" size={16} color={YLV2_Tokens.amber}/>
            <span style={{ fontFamily: YLV2_Type.mono, fontSize: 10, color: YLV2_Tokens.amber, letterSpacing: 1.2, textTransform: 'uppercase' }}>
              {rtl ? 'קראתי אותך' : 'I read you'}
            </span>
          </div>
          <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 19, color: YLV2_Tokens.cream, lineHeight: 1.35, letterSpacing: -0.2 }}>
            {rtl
              ? 'אמרת שאתה עייף ועם מעט זמן. הורדתי לך את המטרה היום — תנועה קלה וארוחות פשוטות. מחר נחזור חזק.'
              : 'You said tired with little time. I lowered today\'s bar — light movement, simple meals. Tomorrow we push.'}
          </div>
        </V2Card>
      </div>

      {/* Priority mission + Pre-meeting */}
      <div style={{ padding: '10px 16px' }}>
        <V2Card style={{ background: YLV2_Tokens.amber, border: 'none', color: YLV2_Tokens.ink }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: YLV2_Type.mono, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.7 }}>
              {t.priorityMission}
            </div>
            <V2Icon name="target" size={16} color={YLV2_Tokens.ink}/>
          </div>
          <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 22, lineHeight: 1.2, letterSpacing: -0.3, marginTop: 10 }}>
            {t.missionText}
          </div>
        </V2Card>
      </div>

      <div style={{ padding: '10px 16px' }}>
        <V2PreMeeting t={t} L={L}/>
      </div>

      {/* Danger + Win dual */}
      <div style={{ padding: '10px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <V2Card pad={14} dark>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <V2Icon name="eye" size={14} color={YLV2_Tokens.blood}/>
            <span style={{ fontFamily: YLV2_Type.mono, fontSize: 9, color: YLV2_Tokens.blood, letterSpacing: 1, textTransform: 'uppercase' }}>
              {t.dangerMoment}
            </span>
          </div>
          <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 12.5, color: YLV2_Tokens.cream, lineHeight: 1.4 }}>
            {t.dangerText}
          </div>
        </V2Card>
        <V2Card pad={14} dark>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <V2Icon name="shield" size={14} color={YLV2_Tokens.sage}/>
            <span style={{ fontFamily: YLV2_Type.mono, fontSize: 9, color: YLV2_Tokens.sage, letterSpacing: 1, textTransform: 'uppercase' }}>
              {t.simpleWin}
            </span>
          </div>
          <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 12.5, color: YLV2_Tokens.cream, lineHeight: 1.4 }}>
            {t.simpleWinText}
          </div>
        </V2Card>
      </div>

      {/* Today's plan */}
      <div style={{ padding: '22px 22px 10px' }}>
        <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 22, color: YLV2_Tokens.cream, letterSpacing: -0.2 }}>
          {t.yourDay}
        </div>
      </div>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { time: '07:30', label: rtl ? 'צ׳ק-אין · הושלם'    : 'Check-in · done',     icon: 'check',  done: true },
          { time: '08:00', label: rtl ? 'ארוחת בוקר חלבונית' : 'High-protein breakfast', icon: 'food',  data: '420 · 38g P' },
          { time: '13:00', label: rtl ? 'הליכה מהירה 20 דק׳' : 'Brisk walk, 20 min',   icon: 'walk',  data: '20 min' },
          { time: '14:00', label: rtl ? 'צהריים פשוט'        : 'Simple lunch',          icon: 'food',  data: '540 · 42g P' },
          { time: '18:00', label: rtl ? 'רגע סכנה — בדרך הביתה' : 'Danger window',     icon: 'eye',   danger: true },
          { time: '20:00', label: rtl ? 'ערב: כוס מים + ארוחה קלה' : 'Water + light dinner', icon: 'food', data: '480 · 36g P' },
          { time: '22:30', label: rtl ? 'לכבות מסכים'         : 'Screens off',           icon: 'moon' },
        ].map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
            background: r.danger ? 'rgba(163,58,46,0.12)' : YLV2_Tokens.inkSoft,
            border: `1px solid ${r.danger ? 'rgba(163,58,46,0.3)' : YLV2_Tokens.creamHair}`,
            borderRadius: 14, opacity: r.done ? 0.5 : 1,
          }}>
            <div style={{ width: 48, textAlign: rtl ? 'right' : 'left' }}>
              <div style={{ fontFamily: YLV2_Type.mono, fontSize: 11, color: YLV2_Tokens.cream, letterSpacing: 0.5 }}>{r.time}</div>
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: r.danger ? YLV2_Tokens.blood : 'rgba(237,231,216,0.06)',
              display: 'grid', placeItems: 'center', color: r.danger ? YLV2_Tokens.cream : YLV2_Tokens.amber,
              flexShrink: 0,
            }}>
              <V2Icon name={r.icon} size={16}/>
            </div>
            <div style={{ flex: 1, fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 13.5, fontWeight: 500, color: YLV2_Tokens.cream, textDecoration: r.done ? 'line-through' : 'none' }}>
              {r.label}
            </div>
            {r.data && <span style={{ fontFamily: YLV2_Type.mono, fontSize: 10, color: YLV2_Tokens.creamMute }}>{r.data}</span>}
          </div>
        ))}
      </div>

      {/* Weight trend small */}
      <div style={{ padding: '22px 16px 10px' }}>
        <V2Card dark>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: YLV2_Type.mono, fontSize: 10, color: YLV2_Tokens.creamMute, letterSpacing: 1, textTransform: 'uppercase' }}>
                {t.journey} · 97 → 80 {t.kg}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8, direction: 'ltr' }}>
                <span style={{ fontFamily: YLV2_Type.serif, fontSize: 46, color: YLV2_Tokens.cream, lineHeight: 1, letterSpacing: -1 }}>93.2</span>
                <span style={{ fontFamily: YLV2_Type.mono, fontSize: 11, color: YLV2_Tokens.amber }}>↓ 3.8 {t.kg}</span>
              </div>
            </div>
            <V2Ring size={52} stroke={4} value={0.22}>
              <span style={{ fontFamily: YLV2_Type.mono, fontSize: 10, color: YLV2_Tokens.cream }}>22%</span>
            </V2Ring>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="60" style={{ marginTop: 10 }} preserveAspectRatio="none">
            <path d={path} fill="none" stroke={YLV2_Tokens.amber} strokeWidth="1.5"/>
            <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3" fill={YLV2_Tokens.amber}/>
          </svg>
          <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 12, color: YLV2_Tokens.creamDim, marginTop: 6 }}>
            {t.pace}
          </div>
        </V2Card>
      </div>
    </div>
  );
}

// Morning check-in questionnaire
function V2CheckIn({ t, L, onDone, rtl }) {
  const [vals, setVals] = React.useState({ energy: 3, mood: 3, sore: 2, time: 40, sleep: 3, stress: 3, cravings: 2 });
  const row = (k, label, max = 5) => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 14, color: YLV2_Tokens.cream, fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: YLV2_Type.mono, fontSize: 11, color: YLV2_Tokens.amber }}>{vals[k]}{k === 'time' ? ' min' : `/${max}`}</span>
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
        {Array.from({length: max}).map((_, i) => (
          <button key={i} onClick={() => setVals({ ...vals, [k]: i+1 })} style={{
            flex: 1, height: 30, borderRadius: 6, border: 'none',
            background: (i+1) <= vals[k] ? YLV2_Tokens.amber : 'rgba(237,231,216,0.06)',
            cursor: 'pointer',
          }}/>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px 22px 40px', direction: L.dir }}>
      <div style={{ fontFamily: YLV2_Type.mono, fontSize: 10.5, color: YLV2_Tokens.amber, letterSpacing: 1.5, textTransform: 'uppercase' }}>
        {t.checkIn}
      </div>
      <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 30, color: YLV2_Tokens.cream, lineHeight: 1.05, letterSpacing: -0.4, marginTop: 8 }}>
        {rtl ? 'איך אתה באמת?' : <>How are you,<br/><em style={{ color: YLV2_Tokens.amber }}>really?</em></>}
      </div>
      <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 13, color: YLV2_Tokens.creamDim, marginTop: 8, lineHeight: 1.4 }}>
        {rtl ? '30 שניות. היום ייבנה סביב התשובות.' : '30 seconds. Today is built around your answers.'}
      </div>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {row('energy',   t.energy)}
        {row('mood',     t.mood)}
        {row('sore',     t.sore)}
        {row('sleep',    t.sleep)}
        {row('stress',   t.stress)}
        {row('cravings', t.cravings)}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 14, color: YLV2_Tokens.cream, fontWeight: 500 }}>{t.timeToday}</span>
            <span style={{ fontFamily: YLV2_Type.mono, fontSize: 11, color: YLV2_Tokens.amber }}>{vals.time} {t.min}</span>
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            {[15, 25, 40, 60, 90].map(n => (
              <button key={n} onClick={() => setVals({ ...vals, time: n })} style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
                background: vals.time === n ? YLV2_Tokens.amber : 'rgba(237,231,216,0.06)',
                color: vals.time === n ? YLV2_Tokens.ink : YLV2_Tokens.cream,
                fontFamily: YLV2_Type.mono, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              }}>{n}m</button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={() => onDone(vals)} style={{
        width: '100%', padding: '16px', borderRadius: 999, border: 'none', marginTop: 28,
        background: YLV2_Tokens.cream, color: YLV2_Tokens.ink, cursor: 'pointer',
        fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans,
        fontSize: 14, fontWeight: 600, letterSpacing: 0.3,
      }}>{t.buildDay}</button>
    </div>
  );
}

// SOS Mode
function V2SOS({ t, L, close }) {
  const [stage, setStage] = React.useState('select'); // select | plan
  const [pick, setPick] = React.useState(null);
  const rtl = L.dir === 'rtl';

  if (stage === 'plan') {
    const plans = {
      junk:  { title: rtl ? 'דקה. בוא נעצור.' : 'One minute. Let\'s stop.', sub: rtl ? 'החשק יעבור תוך 7 דקות. אני אתך.' : 'This craving passes in 7 minutes. I\'m with you.' },
      binge: { title: rtl ? 'זה קרה. עכשיו חזרה.' : 'It happened. Now — back.', sub: rtl ? 'בלי אשמה. התוכנית מתעדכנת עכשיו.' : 'No guilt. Plan is updating now.' },
      ruin:  { title: rtl ? 'היום לא נגמר.' : 'Today is not over.',         sub: rtl ? 'עוד 14 שעות. נבנה מחדש.' : '14 hours left. We rebuild.' },
      skip:  { title: rtl ? 'דלג — אבל לא תיעלם.' : 'Skip — but don\'t vanish.', sub: rtl ? '8 דקות תנועה עכשיו = הצלת היום.' : '8 min now = day saved.' },
      weak:  { title: rtl ? 'חולשה זה אות, לא כישלון.' : 'Weakness is signal, not failure.', sub: rtl ? 'מים + חלבון + 10 דק׳ אור שמש.' : 'Water + protein + 10 min sunlight.' },
      nomo:  { title: rtl ? 'שים לב — לא צריך מוטיבציה.' : 'You don\'t need motivation.', sub: rtl ? 'צריך פעולה אחת קטנה. בדיוק עכשיו.' : 'You need one small action. Right now.' },
      stress:{ title: rtl ? 'נשימה. ואז נמשיך.' : 'Breathe. Then we continue.',   sub: rtl ? '4 שאיפות · 6 נשיפות · 2 דקות.' : '4 in · 6 out · 2 min.' },
      quit:  { title: rtl ? 'אני לא אתן לך לעזוב.' : 'I\'m not letting you quit.',  sub: rtl ? 'ירדת כבר 3.8 ק״ג. זה לא סתם.' : 'You\'re down 3.8 kg. That\'s not nothing.' },
    };
    const p = plans[pick] || plans.junk;

    return (
      <div style={{
        position: 'absolute', inset: 0, background: YLV2_Tokens.blood,
        color: YLV2_Tokens.cream, padding: '56px 22px 40px',
        direction: L.dir, display: 'flex', flexDirection: 'column',
      }}>
        <button onClick={close} style={{
          width: 40, height: 40, borderRadius: 20, border: 'none',
          background: 'rgba(0,0,0,0.25)', color: YLV2_Tokens.cream, cursor: 'pointer',
          display: 'grid', placeItems: 'center', alignSelf: rtl ? 'flex-end' : 'flex-start',
        }}><V2Icon name="x" size={16}/></button>
        <div style={{ fontFamily: YLV2_Type.mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.65, marginTop: 20 }}>
          SOS · {(t.sosStates.find(s=>s.k===pick)||{}).label}
        </div>
        <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 40, lineHeight: 1, letterSpacing: -0.8, marginTop: 10 }}>
          {p.title}
        </div>
        <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 15, marginTop: 16, opacity: 0.85, lineHeight: 1.4 }}>
          {p.sub}
        </div>

        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(pick === 'junk' ? [
            { n: '01', txt: rtl ? 'כוס מים גדולה — עכשיו'                 : 'Big glass of water — now' },
            { n: '02', txt: rtl ? 'יציאה של 3 דקות מהבית / החדר'          : 'Step out of the room for 3 min' },
            { n: '03', txt: rtl ? 'אם החשק נשאר — חטיף חלבון מאושר'     : 'Craving remains? Pre-approved protein snack' },
            { n: '04', txt: rtl ? 'רשום איפה היית ומה הרגשת'              : 'Log where you were, what you felt' },
          ] : [
            { n: '01', txt: rtl ? 'עצור. נשימה עמוקה אחת.'                : 'Stop. One deep breath.' },
            { n: '02', txt: rtl ? 'אין אשמה. אין ענישה.'                  : 'No guilt. No punishment.' },
            { n: '03', txt: rtl ? 'פעולה אחת קטנה — עכשיו.'               : 'One small action — right now.' },
            { n: '04', txt: rtl ? 'מחר זה יום חדש. אני אשמור.'             : 'Tomorrow is new. I\'ll hold the line.' },
          ]).map((s, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 16px',
              background: 'rgba(0,0,0,0.18)', borderRadius: 14,
            }}>
              <span style={{ fontFamily: YLV2_Type.mono, fontSize: 11, color: YLV2_Tokens.cream, opacity: 0.6, fontWeight: 600 }}>{s.n}</span>
              <span style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 14, color: YLV2_Tokens.cream, flex: 1 }}>{s.txt}</span>
            </div>
          ))}
        </div>

        <button onClick={close} style={{
          width: '100%', padding: '16px', borderRadius: 999, border: 'none', marginTop: 'auto',
          background: YLV2_Tokens.cream, color: YLV2_Tokens.blood, cursor: 'pointer',
          fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans,
          fontSize: 14, fontWeight: 700, letterSpacing: 0.3,
        }}>{rtl ? 'יצאתי מזה. ממשיך.' : 'I\'m out of it. Moving on.'}</button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, background: YLV2_Tokens.blood,
      color: YLV2_Tokens.cream, padding: '56px 22px 40px',
      direction: L.dir, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={close} style={{
          width: 40, height: 40, borderRadius: 20, border: 'none',
          background: 'rgba(0,0,0,0.25)', color: YLV2_Tokens.cream, cursor: 'pointer',
          display: 'grid', placeItems: 'center',
        }}><V2Icon name="x" size={16}/></button>
        <span style={{ fontFamily: YLV2_Type.mono, fontSize: 10, letterSpacing: 2, opacity: 0.7 }}>EMERGENCY · SOS</span>
        <div style={{ width: 40 }}/>
      </div>
      <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 38, lineHeight: 1.05, letterSpacing: -0.7, marginTop: 36 }}>
        {t.sosQ}
      </div>
      <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 13, marginTop: 8, opacity: 0.8 }}>
        {rtl ? 'בחר — ואני אחזיר אותך למסלול בפחות מ-30 שניות.' : 'Pick one — I\'ll get you back on track in under 30 seconds.'}
      </div>
      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {t.sosStates.map(s => (
          <button key={s.k} onClick={() => { setPick(s.k); setStage('plan'); }} style={{
            padding: '18px 14px', borderRadius: 16, border: '1px solid rgba(237,231,216,0.25)',
            background: 'rgba(0,0,0,0.18)', color: YLV2_Tokens.cream, cursor: 'pointer',
            fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans,
            fontSize: 13.5, fontWeight: 500, textAlign: rtl ? 'right' : 'left', lineHeight: 1.3,
          }}>{s.label}</button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { V2Today, V2CheckIn, V2SOS });
