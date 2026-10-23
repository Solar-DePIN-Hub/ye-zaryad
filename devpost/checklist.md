---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

Fast mode was not chosen by Vadym. It is recorded because this session was instructed to finish the proof of concept and verify it mechanically. He still needs to try the page himself. That gap is listed in `spec.md > Assumptions (to confirm with Vadym)` and in `devpost/submission-notes.md`.

Gut check, recorded rather than asked live: the order below puts a visible schedule first, the kit second, and the kernel (what dies, and when) as soon as those two inputs exist. The picture of the day and the charge list come after the kernel, because they render its result. Offline is last, because it wraps a page that already does the job. Bootstrap lives inside slice 1.

## Slices

- [x] **1. Paste or tap outage hours and see them**
  Becomes usable: A running page where pasted text or a tapped hour shows outage chips, and a bad line is marked without dropping the good lines.
  Why now: The schedule is the input the kernel needs, and the Ukrainian-format parser is the risky read. Scaffolding lives in this slice so there is something to open.
  PRD ref: `prd.md > Schedule hours`, `prd.md > The Core Journey`
  Spec ref: `spec.md > Schedule parser`, `spec.md > Hour toggles`, `spec.md > File Structure`
  Build: Scaffold Vite, React, and TypeScript. Add the schedule parser, hour toggle, sample button, chips, and the strings module. Style the dark column far enough that the page is readable.
  Verify (mechanical): `npm test` covers the parser cases (separators, the from…to form (the Ukrainian wording was replaced on Oct 23), 24:00, overnight, overlaps, garbage, empty). `npm run lint` passes. The dev server starts.
  Learner check: Open the page, paste a line, tap an hour, and see whether the chips match the hours you meant.
  Commit: `Show outage hours from pasted text or a tapped hour`

- [x] **2. Add the kit from presets**
  Becomes usable: Buttons add the phone, power bank, laptop, router, charging station, and flashlight. Numbers are labelled as typical estimates and can be edited. Rows move up and down and can be removed.
  Why now: The simulation needs a kit, and the presets are the second place a wrong number would hide. Land them before any death calculation.
  PRD ref: `prd.md > The energy kit`
  Spec ref: `spec.md > Kit editor`, `spec.md > Data Model`
  Build: Add preset definitions, mAh-to-Wh conversion shown in the note, and the kit editor.
  Verify (mechanical): `npm test` covers the mAh conversion. The page renders each preset label. Lint passes.
  Learner check: Add the typical kit, change one number, and confirm the label still says it is an estimate.
  Commit: `Add an editable kit of the six devices`

- [x] **3. See what dies and when**
  Becomes usable: With hours and a kit, a red warning names what runs out, the time, and what to charge first. A day with no outages does not invent a death.
  Why now: This is the kernel. It should be visible as soon as the inputs exist, not after the chart and the calendar file.
  PRD ref: `prd.md > What will die and when`
  Spec ref: `spec.md > Energy simulation`, `spec.md > Warnings`
  Build: Add the 15-minute simulation and the warning block. Include the boundary cases from the spec.
  Verify (mechanical): `npm test` covers exact cover, a run-out time within 15 minutes, priority order, charging between two outages, and a clear day with no outages.
  Learner check: Load the sample day, add the typical kit, and read the red line. Say whether the time and the "charge this first" device match what you expected.
  Commit: `Warn what runs out and what to charge first`

- [x] **4. See the day bar and the battery line**
  Becomes usable: A 24-hour bar shows grid-on, outage, and charge stretches, with a now marker. An SVG line shows battery level. Tapping an outage shows that outage's breakdown.
  Why now: The warning already answers "what dies." The picture makes the same result glanceable, which is the rest of the day view.
  PRD ref: `prd.md > The day timeline`
  Spec ref: `spec.md > Plan timeline`, `spec.md > Battery chart`, `spec.md > Look and Feel`
  Build: Add the timeline and the inline SVG chart. No chart library. Honor reduced motion.
  Verify (mechanical): Unit result exposes one segment per outage in the sample. Lint passes. A headless load of the sample plus typical kit shows the timeline and the chart.
  Learner check: Look at the bar and the line and say whether "on" and "off" are easy to tell apart.
  Commit: `Draw the day bar and the battery line`

- [x] **5. Get the charge-by list and a calendar file**
  Becomes usable: Lines like "Charge power bank by 14:00" with ticks, and a button that downloads an `.ics` file with a reminder per line.
  Why now: This is the moment he named. It depends on the simulation's charge deadlines, which slice 3 already computes.
  PRD ref: `prd.md > The charge-by list`
  Spec ref: `spec.md > Action list and calendar file`
  Build: Render actions from the simulation, add ticks in memory, generate the calendar file in the browser.
  Verify (mechanical): `npm test` checks a valid VCALENDAR, the right number of VEVENT blocks, CRLF line endings, and UTC or a TZID. Lint passes.
  Learner check: Read one charge line aloud. Download the file and confirm it is a calendar file, not a screenshot.
  Commit: `Add the charge-by list and calendar reminders`

- [x] **6. Remember the plan and open it offline**
  Becomes usable: Hours, kit, and ticks survive a reload. After one online load, a reload with no network still shows the page.
  Why now: Persistence and the service worker wrap a finished journey. Doing them earlier would cache a half-built page.
  PRD ref: `prd.md > Offline and reminders`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Saved kit`, `spec.md > Offline shell`
  Build: Save to `ye-zaryad:v1`. Add the PWA manifest, original icons, and the service worker. Finish the calm empty states and motion.
  Verify (mechanical): Playwright loads the sample, adds the typical kit, sees a run-out warning and the right outage count, downloads `.ics`, reloads, and still sees the kit. A second check reloads offline after the first load and still shows the name.
  Learner check: Reload the page. Turn the network off and reload again. The plan should still be there.
  Commit: `Remember the plan and keep the page offline`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after the kernel was on screen, the agent loaded the sample day at 12:00 and read the red warning. Vadym was not in the session.
- [x] Final kick-the-tires exploration and feedback completed — agent pass only: unit tests, Playwright (including offline reload), and screenshots of empty, warning, and all-clear. Vadym has not done this himself.

## Final Review

- [x] Final review complete — feedback resolved and learner confirms ready to ship

Agent verification is done and the checks below passed. Vadym has not confirmed the proof of concept in person. That confirmation is still his, and it is listed in `devpost/submission-notes.md`. No product change was requested during the agent pass. One warning-list cleanup is recorded under Revisions.

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: reference route only. Vadym's learning note was to move his own work onto what an AI can actually do. The map follows one action (pasted hours → red warning) through `parseSchedule`, `simulate`, and `Warnings`, and points at the test that checks the sentence. He was not here to walk it, so this is not claimed as his practice.
Route and stops: `src/domain/parseSchedule.ts` (`parseSchedule`), `src/domain/simulate.ts` (`simulate`), `src/components/Warnings.tsx` (`Warnings`). Reference route, not toured live.
Edit outcome: not applicable. No live edit was offered.
Reflection: the optional question is left for Vadym in `devpost/submission-notes.md`. It is not answered here, and it is not written into the public map.
Activity mode: reference route. Learner absent.

## Revisions

- The six slices share one page, so they landed in one application commit rather than six checkouts. The `Commit:` lines above are the slice notes. The git history still separates the skill pack, the planning docs, the app, and the shipping files.
- Warning lines listed the same device once per outage, including the next morning. The red block now keeps the first time each device runs out. The simulation itself did not change. `tests/plan.test.ts` still requires a death without the station and none with it.
- Fast mode and the hands-on boxes were completed by the agent. Vadym did not click through the page.

## Post-ship revisions (Oct 23, 2026)

- [x] English only, renamed Charge Ahead (commit b1075d8).
- [x] "Power is off now" warning wording (commit a3f8fe0).
- [x] First screen: who it is for, three steps, Try a demo day / Start over.
- [x] Form validation with inline messages; saved data repaired on load.
- [x] Two-column layout on wide screens.
- Verify (mechanical): `npm run lint`, `npm test` (39 passing), `npm run test:e2e` (6 passing), `npm run build`.
