---
doc: spec
status: approved
---

# Charge Ahead — Technical Spec

Source: `prd.md` headings below, and `scope.md > The Unique Kernel`. Interview answers were relayed from Vadym Bilobrovets. He did not choose a stack. The build brief that accompanied his answers fixed a browser app with no server and no API keys. That constraint is recorded here as a session decision, not as his words. See **Assumptions (to confirm with Vadym)** and **Decisions and Open Issues**.

`status: approved` means implementation follows this blueprint and his relayed product decisions. He has not separately reviewed this English page.

## How This Works, In Plain Language

Everything happens in the browser. Nothing is sent away.

1. **The schedule reader** turns pasted text, or tapped hours, into a list of outage ranges ("off from 08:00 to 12:00").
2. **The kit** is the list of devices he named, with a size, a charge speed, a use speed, and how full each one is now. Those numbers start as typical estimates and can be edited.
3. **The simulation** walks the next 24 hours in 15-minute steps. When the power is on, batteries fill. When it is off, devices spend their own charge first, then a power bank or a station, higher in the list first. It writes down the time a device can no longer be fully powered.
4. **The warning** is the red line: what dies, when, and what to charge first.
5. **The day picture** is a bar of those 24 hours plus a simple line of how full the batteries are.
6. **The charge list** turns "not full yet, outage coming" into "Charge power bank by 14:00" and a calendar file.
7. **The sticky note** is the browser's `localStorage`. Closing the tab does not throw the plan away.
8. **The offline copy** is a small cache (a service worker) so the page still opens after the first load when the network is gone.

This shape is a single page of JavaScript, not a server plus an app, because the proof does not need an account or a live feed. A server would add a key, a bill, and a failure during the very blackout the app is for.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`.

1. They open the page. The shell reads `localStorage` key `ye-zaryad:v1`. First visit: empty schedule, empty kit, and a **Try a demo day** button that fills `SAMPLE_SCHEDULE` and the typical kit (`typicalKit()` in `src/domain/presets.ts`).
2. They paste text or tap an hour. The schedule reader updates the outage ranges. Taps rewrite the text so both stay in agreement. Chips render from those ranges.
3. They add a preset. The kit list in memory grows. Edits and reordering change that list only.
4. The simulation runs on the ranges, the kit, and the current local time. It returns deaths, per-outage breakdowns, battery levels every 15 minutes, and charge lines.
5. The red warning, the day bar, the SVG lines, and the list render from that result. No second request.
6. They tick a line and press the calendar button. The tick is saved. The button builds `.ics` text and downloads it. No upload.
7. On the next open, step 1 restores the text, the kit, and the ticks. If the network is down and the cache exists, the same files load from the phone.

## Stack

Session decision from the build brief, sized to a proof of concept. Vadym did not name these tools.

| Piece | Choice | Why this, and the tradeoff | Docs |
|---|---|---|---|
| UI | React 19 + TypeScript (strict) | Components match the sections on the page. The tradeoff is a build step, which is acceptable because the page still ships as static files. | https://react.dev/ |
| Build | Vite 6 | Fast local server and a static `dist/` for GitHub Pages. | https://vite.dev/ |
| Styles | One `styles.css` with variables | No component library, so the dark / yellow-orange look does not fight a default theme. | — |
| Font | `@fontsource/manrope` (OFL) | Self-hosted, no runtime request to a font site. He did not name a font; see assumptions. | https://fontsource.org/fonts/manrope |
| Offline | `vite-plugin-pwa` | Generates the manifest and service worker at build time. No separate hosting account. | https://vite-pwa-org.netlify.app/ |
| Unit tests | Vitest | Same TypeScript as the app, no browser required for the parser and the simulation. | https://vitest.dev/ |
| End-to-end | Playwright (Chromium) | One scripted pass through the journey, plus the demo recording. | https://playwright.dev/ |
| Saved plan | `localStorage` | Stays on the device. The tradeoff: a different browser, or clearing site data, starts empty. | https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage |
| Calendar | Hand-built `.ics` text | No calendar API and no key. The tradeoff: the person adds the file themselves. | https://datatracker.ietf.org/doc/html/rfc5545 |

No UI kit, no chart library, no backend, no LLM, no analytics.

Versions are whatever `package.json` resolves at install time within these major lines. If a major refuses to install together, that is a build revision, not a silent swap of stack.

## Where It Runs and How Someone Tries It

It runs in a modern browser. Node.js 22 is needed only to install, test, and build. No API key. No `.env`.

Local:

```bash
npm install
npm run dev
```

Open the printed local URL. For a phone-sized window, use a narrow viewport (about 390×844). On a wide screen the page is a narrow column on the same dark background.

Checks:

```bash
npm run lint
npm test
npm run test:e2e
npm run build
npm run preview
```

Submission needs a short demo video and a public GitHub repository. A live URL does not replace either.

Optional deploy: GitHub Pages from `.github/workflows/deploy.yml`, Vite `base` `/ye-zaryad/`, site path `https://solar-depin-hub.github.io/ye-zaryad/` (live). The workflow builds with `VITE_BASE=/ye-zaryad/`. Local dev and tests use base `/`. Pages is enabled; every push to `main` that passes the checks redeploys the site.

Demo recording: run the app, record a 1920×1080 frame with the 390×844 column centered, no voice and no music. Captions are a separate draft file for Vadym to edit.

## Look and Feel

Implements `prd.md > Look and Feel`.

- Background `#0E1726`. Cards slightly lighter, still navy, not grey-purple.
- Accent `#FFB547` (the light). Pressed and chip edges use it.
- Grid-on `#3DDC97`, used in small doses on the day bar so "power is on" is visible. Outages are near-black with an amber edge.
- Danger `#FF6B6B` on a dark red card, with light text. This is the only red.
- Text `#F4EFE6`. Muted text is warm grey, still readable on the navy.
- Manrope for all UI text. Times use tabular numerals, larger than body text.
- Spacing is loose. The column max width is about 440px, centered.
- Copy tone: short, concrete, no jokes about the outage, no "AI" branding.
- `prefers-reduced-motion: reduce` turns off the bar and chart animation.

The stack can honor all of this in plain CSS. No third-party theme.

## Components

### Schedule parser

Pure function. Text in, outage ranges and unreadable lines out. No React.

Implements `prd.md > Schedule hours`.

Ranges are minutes from midnight: start inclusive, end exclusive, end may be 1440 (24:00). Overnight ranges are split before they leave the parser. Overlaps are merged. The same function builds the canonical text the tap bar writes back.

### Hour toggles

Given current ranges and an hour 0–23, return the next ranges: fill that hour, or clear it if it was already fully inside an outage. The page then replaces the text box with the canonical text.

Implements `prd.md > Schedule hours`.

### Kit editor

Renders presets and rows. Presets carry a stable id so the same preset is not added twice. Row edits call back with the next list. Up/down swaps array order. Array order is the protection order.

Implements `prd.md > The energy kit`.

### Energy simulation

Pure function. Inputs: local minute-of-day "now" (rounded down to 15 minutes), outage ranges, kit items. Output:

- 96 steps of grid on/off and watt-hours left in each battery
- deaths: item, minute, whether its own battery ran out or the shared supply did
- one report per outage segment in the window
- charge actions with a plug-in deadline
- the single "charge this first" suggestion when anything dies

Rules are the ones in `prd.md > What will die and when` and `prd.md > The charge-by list`. A device is "dead" at the first 15-minute step it cannot fully cover, and the displayed minute may fall inside that step in proportion to the energy it still had. Tests allow ±15 minutes.

Implements `prd.md > What will die and when` and `prd.md > The charge-by list`.

### Warnings

Renders the simulation's deaths. No deaths and no outages: the empty or all-clear copy from the strings module. One or more deaths: a red alert naming the first device to protect and the time, plus any further deaths as shorter lines.

Implements `prd.md > What will die and when`.

### Plan timeline

Draws the next 24 hours as segments. Charge windows are amber bands from the plug-in deadline to the outage. Now is the left edge of this window, labelled. Outage segments are buttons. The selected one shows the breakdown card.

Implements `prd.md > The day timeline`.

### Battery chart

Inline SVG. One polyline per item that holds watt-hours. No axes library. A text legend names the lines. Empty kit: the empty-state sentence, not a fake line.

Implements `prd.md > The day timeline`.

### Action list and calendar file

Renders charge actions with checkboxes. The download button calls the `.ics` builder and triggers a file download (`ye-zaryad.ics`). Events use UTC (`Z`) timestamps and a `VALARM`. Line endings are CRLF. Times on screen stay local; only the file is UTC.

Implements `prd.md > The charge-by list`.

### Saved kit

Load on start, save whenever the schedule text, the kit, or the ticks change. Key `ye-zaryad:v1`. Unknown JSON is ignored and the page starts empty rather than crashing.

Implements `prd.md > States and Boundaries` (Saved).

### Offline shell

`vite-plugin-pwa` precaches the built assets. The manifest name is "Charge Ahead: blackout charging planner" (short name "Charge Ahead"), theme colour `#0E1726`, display `standalone`. Icons are original geometric marks (no logos). `start_url` and scope follow Vite's `base`.

Implements `prd.md > Offline and reminders`.

### Copy module

`src/strings.ts` exports one English dictionary. Components do not hard-code sentences. There is no toggle and no second dictionary yet.

Implements `prd.md > Offline and reminders`.

## Data Model

```ts
interface OutageBlock {
  startMin: number; // 0..1439
  endMin: number;   // 1..1440
}

interface KitItem {
  id: string;
  presetId?: string;
  name: string;
  capacityWh: number;
  chargeW: number;
  drawW: number;
  soc: number;          // 0..1
  sharesPower: boolean; // power bank, station
  capacityNote?: string;
}

interface SavedPlan {
  version: 1;
  scheduleText: string;
  items: KitItem[];
  checkedActionIds: string[];
}
```

Outage blocks are not stored. They are derived from `scheduleText`, which taps keep canonical. That way paste and tap cannot drift.

`soc` is how full the battery is now, before the simulation. The simulation copies items and spends those copies; it does not write the future state back into the kit.

Charge-action ids are `charge:{itemId}` so a tick survives a reload when the kit is unchanged.

Where it lives: `localStorage` only. Update: every edit. Coming back: read once at startup. Clearing site data deletes the plan. There is no server copy.

## File Structure

```
ye-zaryad/
├── .agents/ .claude/ agent/     # Devpost Learn Skill Pack
├── skills-lock.json
├── devpost/
│   ├── scope.md  prd.md  spec.md  checklist.md
│   ├── scope.html  prd.html  spec.html
│   ├── app-map.html             # written at the end of the build
│   └── submission-notes.md      # facts for Vadym, not submission prose
├── public/
│   ├── favicon.svg
│   └── icons/                   # original PWA icons
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── styles.css
│   ├── strings.ts               # all English UI copy
│   ├── vite-env.d.ts
│   ├── domain/
│   │   ├── time.ts
│   │   ├── parseSchedule.ts
│   │   ├── units.ts
│   │   ├── presets.ts
│   │   ├── simulate.ts
│   │   ├── actions.ts
│   │   └── ics.ts
│   ├── components/
│   │   ├── ScheduleInput.tsx
│   │   ├── KitEditor.tsx
│   │   ├── Warnings.tsx
│   │   ├── PlanTimeline.tsx
│   │   ├── BatteryChart.tsx
│   │   └── ActionList.tsx
│   └── state/store.ts
├── tests/
│   ├── parseSchedule.test.ts
│   ├── units.test.ts
│   ├── simulate.test.ts
│   ├── ics.test.ts
│   └── e2e.spec.ts
├── .github/workflows/deploy.yml
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── playwright.config.ts
├── README.md
├── LICENSE
└── .gitignore                   # includes /devpost/learner-profile.md
```

`devpost/learner-profile.md` exists on disk for the skills and is gitignored.

## External Services and Dependencies

None at runtime. No endpoints, no keys, no rate limits, no cost.

Build and test contact the npm registry once, during install. GitHub Actions contacts GitHub to run the workflow and, when Pages is enabled, to publish `dist/`. Those are development hosting, not app features.

Font files ship inside the build via Fontsource. Icons are files in `public/`.

## Important Failure Modes

- **A schedule line cannot be parsed** → that line is listed with a hint; parsed lines still become chips and still feed the simulation.
- **Saved JSON is corrupt or from a future shape** → ignore it and start from an empty plan. Do not throw a blank screen.
- **The battery cannot be full before the outage** → the charge line says to start now and that it will not be full. The red warning still names what runs out.
- **Offline before the first successful load** → the browser cannot show the app. After one load, reload offline shows the cached page and the saved plan.
- **No outages, or no devices** → explain what is missing. Do not show a fake death.

## What Was Simplified and Why

- **A 15-minute step** instead of a continuous physics model. The proof needs "runs out at 18:40", within a quarter hour. A finer step would not change the decision of what to plug in.
- **Typical estimates** instead of a database of real device models. He can type over the numbers. A model database would pretend to be accurate and would go stale.
- **One shared-supply order (the kit list)** instead of a wiring diagram of which cable feeds which device. Enough to show that the router dies when the power bank is empty, and that putting the router higher changes who is saved.
- **A downloaded `.ics` file** instead of a push notification or a calendar API. Same reminder, no account.
- **UTC inside the file** instead of a full `VTIMEZONE` for Europe/Kyiv. The on-screen clock stays local. A timezone component is easy to get wrong on the DST weekend.
- **English only** instead of a toggle. He did not choose the toggle. Strings are still isolated.

The simulation itself is not faked. Sample schedules are labelled SAMPLE. Preset numbers are labelled typical estimates.

## Decisions and Open Issues

- **Product decisions** are his and are listed in `prd.md > Product Decisions`.
- **Stack** was not his. The build brief required Vite, React, TypeScript, an offline page, unit tests, one Playwright test, and GitHub Pages at `/ye-zaryad/`. Pages is now enabled, so the live URL works.
- **No learner uncertainty was stated.** He did not name a technical part he was unsure about. Plan-first experience is not established (`learner-profile.md`). This blueprint does not invent a doubt or add a tool for practice.
- **Check during the build:** the simulation tests are the evidence for "what dies and when." If a boundary case (exactly enough energy, priority order, charging between two outages, a clear day) disagrees with this spec, fix the code or record the revision. Do not soften the kernel.
- **Open questions carried from the PRD:** none that block implementation. Assumptions stay labelled.

## Assumptions (to confirm with Vadym)

- Vite + React + TypeScript + `vite-plugin-pwa` + Vitest + Playwright, because the build brief required them.
- Palette, Manrope, preset wattages, and the meaning of "by HH:MM" as the latest plug-in time. Same list as `prd.md > Assumptions (to confirm with Vadym)`.
- Storage key `ye-zaryad:v1`.
- GitHub Pages base path `/ye-zaryad/`.
- Build mode for the implementation session: fast, with mechanical checks (tests and a scripted browser pass) standing in for a live hands-on review. He did not choose learn or fast mode. He still needs to try the page himself before he submits.

## Revisions after approval (Oct 23, 2026)

- **English only, renamed Charge Ahead.** `src/strings.ts` holds one English set. The parser no longer reads the Ukrainian "from…to" wording; it reads the English `from … to …`. A unit test and an end-to-end test fail if any Cyrillic text reaches the page.
- **Power already off.** When the simulation starts inside an outage, the warning says when the power is due back and what to charge first once it is (`Warnings.tsx`).
- **First screen.** `App.tsx` renders a "who it is for" paragraph (`strings.heroWho`), three numbered steps, and a **Try a demo day** button. The button sets `SAMPLE_SCHEDULE`, the typical kit, clears ticks, and scrolls to the result. When a plan exists, the button becomes **Start over**.
- **Validation.** `src/domain/validate.ts` defines limits (capacity 0–5000 Wh, charge and draw 0–3000 W, charge level 0–100 %, name 1–40 characters, schedule text up to 1000 characters, up to 12 devices). `src/components/Fields.tsx` keeps the typed text, sets `aria-invalid`, shows a plain message, and passes only valid values to the plan. On blur, an invalid field returns to the last valid value. `loadPlan` runs `sanitizeItem` on saved items.
- **Layout.** At 900 px and wider, `.layout` is a two-column grid; the result column is sticky.
- **Tests.** Vitest: 39 tests in 7 files (adds `strings` and `validate`). Playwright: 6 tests (adds the demo-day first screen and the form checks).
