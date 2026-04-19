// V2 atoms

function V2Icon({ name, size = 20, color = 'currentColor' }) {
  const p = { stroke: color, strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    today:  <><circle cx="12" cy="12" r="4" {...p}/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" {...p}/></>,
    food:   <><path d="M4 4v16M4 4c3 0 3 7 0 7M20 4v16M16 4v5c0 2 2 2 2 0V4M8 15v5" {...p}/></>,
    train:  <><path d="M3 10v4M6 7v10M10 9v6M18 9v6M22 10v4M10 12h8" {...p}/></>,
    prog:   <><path d="M4 20V8M10 20V4M16 20v-7M22 20H2" {...p}/></>,
    ai:     <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" {...p}/></>,
    sos:    <><circle cx="12" cy="12" r="9" {...p}/><path d="M12 7v5M12 15v.5" {...p}/></>,
    chev:   <><path d="M9 6l6 6-6 6" {...p}/></>,
    chevL:  <><path d="M15 6l-6 6 6 6" {...p}/></>,
    x:      <><path d="M6 6l12 12M6 18L18 6" {...p}/></>,
    check:  <><path d="M4 12l5 5L20 6" {...p}/></>,
    play:   <><path d="M7 5v14l12-7z" {...p} fill={color}/></>,
    flame:  <><path d="M12 3c0 4-5 5-5 10a5 5 0 0010 0c0-3-2-4-2-7 0 2-3 2-3-3z" {...p}/></>,
    bolt:   <><path d="M13 3L5 14h6l-2 7 8-11h-6l2-7z" {...p}/></>,
    cam:    <><path d="M4 8h4l2-3h4l2 3h4v11H4z" {...p}/><circle cx="12" cy="13" r="3.5" {...p}/></>,
    mic:    <><rect x="9" y="3" width="6" height="12" rx="3" {...p}/><path d="M5 11a7 7 0 0014 0M12 18v3" {...p}/></>,
    brain:  <><path d="M9 4a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 001 5 3 3 0 003 3v-4M15 4a3 3 0 013 3 3 3 0 012 5 3 3 0 01-1 5 3 3 0 01-3 3v-4M9 4v16M15 4v16" {...p}/></>,
    target: <><circle cx="12" cy="12" r="9" {...p}/><circle cx="12" cy="12" r="5" {...p}/><circle cx="12" cy="12" r="1.5" {...p} fill={color}/></>,
    shield: <><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z" {...p}/></>,
    moon:   <><path d="M20 14A8 8 0 019 3a8 8 0 1011 11z" {...p}/></>,
    send:   <><path d="M4 12l16-8-6 16-3-7-7-1z" {...p}/></>,
    back:   <><path d="M15 6l-6 6 6 6" {...p}/></>,
    plus:   <><path d="M12 5v14M5 12h14" {...p}/></>,
    heart:  <><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" {...p}/></>,
    drop:   <><path d="M12 3s-6 7-6 12a6 6 0 0012 0c0-5-6-12-6-12z" {...p}/></>,
    clock:  <><circle cx="12" cy="12" r="9" {...p}/><path d="M12 7v5l3 2" {...p}/></>,
    walk:   <><circle cx="13" cy="4" r="2" {...p}/><path d="M8 20l2-6-3-3 3-4 3 2 4 4M9 13l-2 7" {...p}/></>,
    fridge: <><rect x="5" y="3" width="14" height="18" rx="2" {...p}/><path d="M5 10h14M8 6v1M8 13v3" {...p}/></>,
    eye:    <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" {...p}/><circle cx="12" cy="12" r="3" {...p}/></>,
    handUp: <><path d="M6 10V6a2 2 0 014 0v4M10 10V5a2 2 0 014 0v5M14 10V7a2 2 0 014 0v6c0 4-3 8-7 8s-7-3-7-7v-3a2 2 0 014 0" {...p}/></>,
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">{paths[name] || null}</svg>;
}

function V2Card({ children, style = {}, onClick, pad = 18, dark = false }) {
  return (
    <div onClick={onClick} style={{
      background: dark ? YLV2_Tokens.inkElev : YLV2_Tokens.inkSoft,
      borderRadius: 22, padding: pad,
      border: `1px solid ${YLV2_Tokens.creamHair}`,
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

function V2Pill({ children, tone = 'ghost', style = {} }) {
  const p = {
    amber:  { bg: YLV2_Tokens.amber, fg: YLV2_Tokens.ink },
    ghost:  { bg: 'rgba(237,231,216,0.08)', fg: YLV2_Tokens.cream },
    line:   { bg: 'transparent', fg: YLV2_Tokens.cream, border: `1px solid ${YLV2_Tokens.creamHair}` },
    blood:  { bg: YLV2_Tokens.blood, fg: YLV2_Tokens.cream },
    sage:   { bg: 'rgba(143,163,126,0.2)', fg: YLV2_Tokens.sage },
  }[tone] || {};
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px', borderRadius: 999,
      background: p.bg, color: p.fg, border: p.border,
      fontFamily: YLV2_Type.mono, fontSize: 10, fontWeight: 500,
      letterSpacing: 0.8, textTransform: 'uppercase',
      ...style,
    }}>{children}</span>
  );
}

// Striped dark placeholder
function V2Ph({ label = 'image', h = 120, style = {} }) {
  return (
    <div style={{
      height: h, borderRadius: 14,
      background: 'repeating-linear-gradient(135deg, #1F1F1C 0 6px, #17171400 6px 12px), #17171400',
      backgroundColor: '#17171400',
      border: `1px solid ${YLV2_Tokens.creamHair}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: YLV2_Type.mono, fontSize: 10, letterSpacing: 1,
      textTransform: 'uppercase', color: YLV2_Tokens.creamMute,
      ...style,
    }}>— {label} —</div>
  );
}

// Rings using tokens
function V2Ring({ size = 64, stroke = 5, value = 0.5, color = YLV2_Tokens.amber, track = 'rgba(237,231,216,0.09)', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
                strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value)}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>{children}</div>
    </div>
  );
}

Object.assign(window, { V2Icon, V2Card, V2Pill, V2Ph, V2Ring });
