# CLAUDE.md — YOAV LIFE v2

Start every session by reading this file. It's the fastest path back into context.

## What this is

A personal OS for a self-employed Israeli man. Hebrew-first (RTL), dark theme, pear/rich-black palette. Built as a single-file React app with no build step, deployed to GitHub Pages.

- **Live:** https://yoav27ron.github.io/Yoav-fitness/
- **Repo:** https://github.com/yoav27ron/Yoav-fitness (branch: `main`, auto-deploys to Pages)

## Working directories

| Path | Purpose |
|---|---|
| `C:\Users\USER\projects\Yoav-fitness\` | **Production clone — edit here.** Git remote pushes to the live site. Not inside OneDrive (sync conflicts killed earlier attempts). |
| `C:\Users\USER\OneDrive\Documentos\yoavfitness\` | Design bundle archive + preview source. `python -m http.server 5173` runs from here. Sync edits with `cp` when you want to preview before pushing. |

## Architecture

```
index.html           <-- EVERYTHING. React 18 UMD + Babel standalone, JSX inline.
firebase-messaging-sw.js  <-- self-unregistering SW (legacy from v1 Firebase push)
CLAUDE.md            <-- this file
.claude/launch.json  <-- preview config (static-server on 5173)
v2/*.jsx             <-- design handoff source (unused at runtime; reference only)
ios-frame.jsx        <-- design handoff source (unused at runtime)
YOAV LIFE v2-print.html  <-- PDF/print export from the design tool
```

Every feature lives in `index.html`. There is no build step, no bundler, no package.json.

## Data layer

All persistent state lives in `localStorage` under key `yoav_life_v2_data`, shape = `EMPTY_DATA`:

```js
{ version, profile, mode, lang, weights, meals, workouts, water, checkIns,
  dislikes, apiKey, journal, googleFit, googleCal }
```

- `StoreProvider` + `useStore()` context exposes CRUD api: `setProfile`, `addWeight`, `addMeal`, `delMeal`, `addWorkout`, `delWorkout`, `addWater`, `removeWater`, `saveCheckIn`, `addDislike`, `removeDislike`, `setApiKey`, `addJournal`, `setJournalAnalysis`, `delJournal`, `resetAll`, `exportJSON`.
- `deriveStats(data)` computes: `todaysKcal`, `todaysProtein`, `todaysWater`, `latestWeight`, `delta`, `progressPct`, `dayCount`, `streak`, `avgProtein`, `avgWater`, `sessions`, `didCheckInToday`.

## Design system

Defined at the top of the main `<script type="text/babel">` block:

- `YLV2_Tokens` — `ink` (#061414), `inkSoft`, `inkElev`, `cream` (#E9EBE6), `amber` (pear #BCFF00), `blood` (#E56B5A), `sage`, `gold`, plus `creamDim/Mute/Hair` for opacity tiers.
- `YLV2_Type` — `serif` (Fraunces / Frank Ruhl Libre for HE), `sans` (Geist / Heebo for HE), `mono` (Geist Mono).
- **Do not change the palette without a very explicit user request.** The user chose pear + rich black deliberately.

## Screens

| Tab | Component | Notes |
|---|---|---|
| היום · Today | `V2Today` | Greeting + check-in CTA + day-mode card + coaching cards + today's plan (built from logged meals/workouts) + weight trend card. Morning check-in is a top CTA banner, **not a gate**. |
| אוכל · Food | `V2Food` | Kcal ring + water +/- + 4 quick-action buttons (Manual / Photo / Product-scan / Water) + today's meals + recipe catalog filtered by dislikes. |
| אימון · Train | `V2Train` | Adaptive recommendation + today's workouts + 23-tile modality grid, each with a YouTube chip. |
| התקדמות · Progress | `V2Progress` | 8 computed tiles + "what I see" identity card + business insights. |
| יואב AI | `V2AI` | Memory chips + thoughts journal (save + per-entry "analyze with AI") + chat that calls Claude with full user context. |

Overlays (always `position: fixed; inset: 0`):
- `V2SOS`, `V2Notifications`, `V2ModePicker`, `V2Settings`, `WeightSheet`, `MealSheet`, `WorkoutSheet`, `PhotoMealSheet`, `ProductScanSheet`, `V2Onboarding`.

## Claude API integration

- User pastes their Anthropic API key in Settings → "חיבור ל-AI · Claude". Stored in `store.data.apiKey` (localStorage, browser only).
- `callClaude({ apiKey, messages, model, maxTokens })` hits `api.anthropic.com/v1/messages` directly with header `anthropic-dangerous-direct-browser-access: true`.
- Default model: `claude-haiku-4-5-20251001` (cheap, fast, fine for most things).
- Features using it: `analyzeMealPhoto`, `analyzeProductPhoto`, `analyzeJournal`, Yoav AI chat.

## Responsive rules (don't regress)

- Root fills `100dvh`. No fake iOS frame. The app is full-viewport on mobile.
- Every screen's top padding = `calc(env(safe-area-inset-top) + Npx)`.
- Every screen's bottom padding = `calc(env(safe-area-inset-bottom) + 120px)` (clears the floating tab bar).
- Tab bar: `position: fixed; bottom: calc(env(safe-area-inset-bottom) + 14px); left/right: 12px`. Max-width 456px so it stays tight on desktop.
- Desktop (≥900px): `#root` is centered at `max-width: 480px`.
- Global CSS has `input, textarea, select { min-width: 0; max-width: 100% }` to prevent flex overflow.
- File inputs: `accept="image/*"` with **no `capture`** so users get a native "camera or gallery" picker.

## Workflow

1. Read CLAUDE.md. Load current todos if any.
2. Edit `C:\Users\USER\projects\Yoav-fitness\index.html` (Edit tool; read it once first).
3. `cp` to OneDrive if you want to preview locally on port 5173.
4. Use `mcp__Claude_Preview__preview_eval` to verify DOM state, not screenshots (screenshots time out often).
5. `git add -A && git commit -m "<type>: <summary>"` — follow the existing commit style (conventional, multi-paragraph body, Co-Authored-By trailer).
6. `git push origin main`.
7. Use `Monitor` with an until-loop to poll `curl https://yoav27ron.github.io/Yoav-fitness/ | grep <marker>` until the new build is live (~60-120s).
8. Summarize to the user in Hebrew. Keep responses tight.

## Common pitfalls

- **Hooks order:** Any early return in a component must come AFTER all `React.useState`/`useEffect` calls. I broke this twice already.
- **IOSDevice frame:** Do NOT re-wrap the app in `IOSDevice`. It collides with real Android/Chrome chrome. The components exist but are deliberately unused.
- **`capture="environment"`:** Never add this to file inputs. It forces camera and hides the gallery picker.
- **OneDrive ≠ git workdir:** Do not `git init` inside OneDrive. Always work from `~/projects/Yoav-fitness`.
- **Chrome caching:** Users report "still old build" after push. Either hard-refresh or the cache-clearing snippet in `<head>` handles them on next visit.
- **Never `git push --force` to main.** Never skip hooks. The repo is a live public-facing site.

## Collaborator language

The user writes in Hebrew. Respond in Hebrew. Code stays in English. Hebrew UI copy should be direct, non-generic, slightly rough — not corporate. The brand voice is "private operating system for a self-employed man" — elite, calm, personal.

## Deferred / waiting on user

- **Google Fit OAuth:** UI is stubbed with 4-step instructions. Waiting for user to create a Google Cloud project and hand over a Client ID so we can wire the full OAuth + data sync.
- **Google Calendar OAuth:** same.
- **Apple Health:** not started.
- **Push notifications:** deleted from v1 and not re-added. If the user asks, decide between browser Notifications API (simple, no backend) vs. re-introducing Firebase.

## Don't do unless asked

- Add animations / transitions beyond the existing subtle ones.
- Introduce a build step (Vite, Parcel, webpack). Single-file is a feature.
- Add a framework on top of React (Next, Remix, Astro). No.
- Switch to a different palette.
- Add community / social features (the user explicitly vetoed these in the original design brief).
