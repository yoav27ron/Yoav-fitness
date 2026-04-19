// V2 — Real Life Performance (Day Modes) + Notifications Center + Business Insights

function V2ModePicker({ t, L, active, setActive, onClose }) {
  const rtl = L.dir === 'rtl';
  return (
    <div style={{ position: 'absolute', inset: 0, background: YLV2_Tokens.ink, zIndex: 60, padding: '56px 22px 40px', direction: L.dir, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={{
          width: 38, height: 38, borderRadius: 19, border: `1px solid ${YLV2_Tokens.creamHair}`,
          background: YLV2_Tokens.inkSoft, color: YLV2_Tokens.cream, cursor: 'pointer',
          display: 'grid', placeItems: 'center',
        }}><V2Icon name="x" size={16}/></button>
        <span style={{ fontFamily: YLV2_Type.mono, fontSize: 10, color: YLV2_Tokens.creamMute, letterSpacing: 2, textTransform: 'uppercase' }}>
          Real Life Performance
        </span>
        <div style={{ width: 38 }}/>
      </div>
      <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 34, color: YLV2_Tokens.cream, letterSpacing: -0.5, lineHeight: 1.05, marginTop: 20 }}>
        {t.rlpPick}
      </div>
      <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 13.5, color: YLV2_Tokens.creamDim, marginTop: 8 }}>
        {t.rlpSubtitle}
      </div>

      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {t.modes.map(m => {
          const isActive = active === m.k;
          return (
            <button key={m.k} onClick={() => { setActive(m.k); onClose(); }} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
              borderRadius: 16, cursor: 'pointer', textAlign: rtl ? 'right' : 'left',
              background: isActive ? YLV2_Tokens.amber : YLV2_Tokens.inkSoft,
              border: `1px solid ${isActive ? YLV2_Tokens.amber : YLV2_Tokens.creamHair}`,
              color: isActive ? YLV2_Tokens.ink : YLV2_Tokens.cream,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: isActive ? 'rgba(28,23,15,0.15)' : 'rgba(242,234,211,0.06)',
                color: isActive ? YLV2_Tokens.ink : YLV2_Tokens.amber,
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}><V2Icon name={m.icon} size={18}/></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 15, fontWeight: 600, letterSpacing: -0.1 }}>{m.label}</div>
                <div style={{ fontFamily: YLV2_Type.mono, fontSize: 10, letterSpacing: 0.5, marginTop: 3, opacity: isActive ? 0.7 : 0.5 }}>{m.sub}</div>
              </div>
              {isActive && <V2Icon name="check" size={18} color={YLV2_Tokens.ink}/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function V2ModeCard({ t, L, modeKey, onChange }) {
  const rtl = L.dir === 'rtl';
  const mode = t.modes.find(m => m.k === modeKey) || t.modes[0];
  const headline = t.rlpHeadlines[modeKey] || '';
  const rules = t.rlpRules[modeKey] || [];
  return (
    <V2Card style={{ background: YLV2_Tokens.inkElev, border: `1px solid ${YLV2_Tokens.inkLine}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(232,150,60,0.16)', color: YLV2_Tokens.amber, display: 'grid', placeItems: 'center' }}>
            <V2Icon name={mode.icon} size={16}/>
          </div>
          <div>
            <div style={{ fontFamily: YLV2_Type.mono, fontSize: 9.5, color: YLV2_Tokens.amber, letterSpacing: 1.2, textTransform: 'uppercase' }}>
              {t.rlpActive}
            </div>
            <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 14, fontWeight: 600, color: YLV2_Tokens.cream, marginTop: 2 }}>{mode.label}</div>
          </div>
        </div>
        <button onClick={onChange} style={{
          padding: '7px 12px', borderRadius: 999, border: `1px solid ${YLV2_Tokens.creamHair}`,
          background: 'transparent', color: YLV2_Tokens.creamDim, cursor: 'pointer',
          fontFamily: YLV2_Type.mono, fontSize: 10, letterSpacing: 0.5,
        }}>{t.rlpChange}</button>
      </div>
      <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 19, color: YLV2_Tokens.cream, lineHeight: 1.35, letterSpacing: -0.2, marginTop: 14 }}>
        {headline}
      </div>
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {rules.map(([k, v], i) => (
          <div key={i} style={{
            padding: '10px 10px', borderRadius: 12,
            background: 'rgba(242,234,211,0.05)',
            border: `1px solid ${YLV2_Tokens.creamHair}`,
          }}>
            <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 12, fontWeight: 600, color: YLV2_Tokens.cream, letterSpacing: -0.1 }}>{k}</div>
            <div style={{ fontFamily: YLV2_Type.mono, fontSize: 9.5, color: YLV2_Tokens.creamMute, marginTop: 3, letterSpacing: 0.3 }}>{v}</div>
          </div>
        ))}
      </div>
    </V2Card>
  );
}

function V2PreMeeting({ t, L }) {
  const rtl = L.dir === 'rtl';
  const [showReset, setShowReset] = React.useState(false);
  return (
    <V2Card style={{ background: YLV2_Tokens.inkSoft, border: `1px solid ${YLV2_Tokens.inkLine}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: YLV2_Type.mono, fontSize: 10, color: YLV2_Tokens.amber, letterSpacing: 1.2, textTransform: 'uppercase' }}>
            {t.preMeeting}
          </div>
          <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 12, color: YLV2_Tokens.creamDim, marginTop: 4 }}>
            {t.preMeetingSub}
          </div>
        </div>
        <button onClick={() => setShowReset(s => !s)} style={{
          padding: '8px 12px', borderRadius: 999, border: 'none',
          background: YLV2_Tokens.amber, color: YLV2_Tokens.ink, cursor: 'pointer',
          fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 11.5, fontWeight: 600,
        }}>{showReset ? (rtl ? 'סגור' : 'Close') : (rtl ? 'ריסט 3 דק׳' : 'Reset 3 min')}</button>
      </div>

      {!showReset ? (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 12, color: YLV2_Tokens.cream, fontWeight: 600, marginBottom: 8 }}>
            {t.preMealLabel}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {t.preMealItems.map((m, i) => (
              <div key={i} style={{
                padding: '10px 12px', borderRadius: 10,
                background: 'rgba(165,176,136,0.08)',
                border: `1px solid rgba(165,176,136,0.18)`,
                color: YLV2_Tokens.cream,
                fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 12.5,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <V2Icon name="check" size={12} color={YLV2_Tokens.sage}/> {m}
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 8, padding: '8px 12px', borderRadius: 10,
            background: 'rgba(181,74,56,0.1)', border: '1px solid rgba(181,74,56,0.22)',
            color: '#E8AFA3', fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 11.5,
          }}>{t.preMealAvoid}</div>
        </div>
      ) : (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 17, color: YLV2_Tokens.cream, letterSpacing: -0.2, lineHeight: 1.3 }}>
            {t.resetTitle}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            {t.resetSteps.map(([n, s], i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '10px 12px', borderRadius: 10,
                background: 'rgba(242,234,211,0.04)',
                border: `1px solid ${YLV2_Tokens.creamHair}`,
              }}>
                <span style={{ fontFamily: YLV2_Type.mono, fontSize: 11, color: YLV2_Tokens.amber, fontWeight: 600 }}>{n}</span>
                <span style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 12.5, color: YLV2_Tokens.cream, flex: 1, lineHeight: 1.4 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </V2Card>
  );
}

function V2BizInsights({ t, L }) {
  const rtl = L.dir === 'rtl';
  return (
    <V2Card dark style={{ background: YLV2_Tokens.inkSoft }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <V2Icon name="brain" size={14} color={YLV2_Tokens.gold}/>
        <span style={{ fontFamily: YLV2_Type.mono, fontSize: 10, color: YLV2_Tokens.gold, letterSpacing: 1.2, textTransform: 'uppercase' }}>
          {t.bizTitle}
        </span>
      </div>
      <div style={{ fontFamily: YLV2_Type.mono, fontSize: 9.5, color: YLV2_Tokens.creamMute, letterSpacing: 0.5, marginBottom: 12 }}>
        {t.bizSub}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {t.bizInsights.map((ins, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10, alignItems: 'flex-start',
            padding: '10px 12px', borderRadius: 10,
            background: 'rgba(212,179,122,0.07)',
            border: '1px solid rgba(212,179,122,0.18)',
          }}>
            <div style={{ fontFamily: YLV2_Type.mono, fontSize: 9, color: YLV2_Tokens.gold, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', minWidth: 52, paddingTop: 2 }}>
              {ins.k}
            </div>
            <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 13, color: YLV2_Tokens.cream, flex: 1, lineHeight: 1.4 }}>
              {ins.t}
            </div>
          </div>
        ))}
      </div>
    </V2Card>
  );
}

// Notifications center
function V2Notifications({ t, L, close }) {
  const rtl = L.dir === 'rtl';
  const [tab, setTab] = React.useState('now');
  const [cleared, setCleared] = React.useState({});
  const items = t.notifs.filter(n => n.t === tab && !cleared[n.title]);

  const colorFor = (c) => ({
    amber: YLV2_Tokens.amber,
    blood: YLV2_Tokens.blood,
    sage:  YLV2_Tokens.sage,
    gold:  YLV2_Tokens.gold,
    ghost: YLV2_Tokens.creamMute,
  }[c] || YLV2_Tokens.amber);

  return (
    <div style={{ position: 'absolute', inset: 0, background: YLV2_Tokens.ink, zIndex: 55, direction: L.dir, overflowY: 'auto' }}>
      <div style={{ padding: '56px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={close} style={{
          width: 38, height: 38, borderRadius: 19, border: `1px solid ${YLV2_Tokens.creamHair}`,
          background: YLV2_Tokens.inkSoft, color: YLV2_Tokens.cream, cursor: 'pointer',
          display: 'grid', placeItems: 'center',
        }}><V2Icon name="x" size={16}/></button>
        <span style={{ fontFamily: YLV2_Type.mono, fontSize: 10, color: YLV2_Tokens.creamMute, letterSpacing: 2, textTransform: 'uppercase' }}>
          {rtl ? 'מרכז · התראות' : 'Notifications'}
        </span>
        <button onClick={() => {
          const c = {}; t.notifs.forEach(n => { if (n.t === tab) c[n.title] = 1; });
          setCleared({ ...cleared, ...c });
        }} style={{
          padding: '8px 12px', borderRadius: 999, border: `1px solid ${YLV2_Tokens.creamHair}`,
          background: 'transparent', color: YLV2_Tokens.creamDim, cursor: 'pointer',
          fontFamily: YLV2_Type.mono, fontSize: 10, letterSpacing: 0.5,
        }}>{t.notifClear}</button>
      </div>

      <div style={{ padding: '0 22px' }}>
        <div style={{ fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 32, color: YLV2_Tokens.cream, letterSpacing: -0.5, lineHeight: 1.05 }}>
          {t.notifTitle}
        </div>
        <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 13, color: YLV2_Tokens.creamDim, marginTop: 6 }}>
          {t.notifSubtitle}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '18px 22px 6px', display: 'flex', gap: 6 }}>
        {t.notifTabs.map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: '9px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: tab === k ? YLV2_Tokens.cream : 'transparent',
            color: tab === k ? YLV2_Tokens.ink : YLV2_Tokens.creamDim,
            border: `1px solid ${tab === k ? YLV2_Tokens.cream : YLV2_Tokens.creamHair}`,
            fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 12, fontWeight: 600,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: '10px 16px 40px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.length === 0 ? (
          <div style={{
            padding: '40px 20px', textAlign: 'center',
            fontFamily: rtl ? YLV2_Type.heb : YLV2_Type.serif, fontSize: 18,
            color: YLV2_Tokens.creamDim, fontStyle: 'italic', lineHeight: 1.4,
          }}>{t.notifEmpty}</div>
        ) : items.map((n, i) => {
          const c = colorFor(n.color);
          return (
            <div key={i} style={{
              padding: '14px 16px', borderRadius: 16,
              background: YLV2_Tokens.inkSoft,
              border: `1px solid ${YLV2_Tokens.creamHair}`,
              borderLeft: rtl ? undefined : `3px solid ${c}`,
              borderRight: rtl ? `3px solid ${c}` : undefined,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <span style={{ fontFamily: YLV2_Type.mono, fontSize: 9.5, color: c, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>{n.tag}</span>
                <span style={{ fontFamily: YLV2_Type.mono, fontSize: 10, color: YLV2_Tokens.creamMute }}>{n.time}</span>
              </div>
              <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 14.5, fontWeight: 600, color: YLV2_Tokens.cream, letterSpacing: -0.1 }}>
                {n.title}
              </div>
              <div style={{ fontFamily: rtl ? YLV2_Type.hebSans : YLV2_Type.sans, fontSize: 12.5, color: YLV2_Tokens.creamDim, marginTop: 4, lineHeight: 1.4 }}>
                {n.body}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { V2ModePicker, V2ModeCard, V2PreMeeting, V2BizInsights, V2Notifications });
