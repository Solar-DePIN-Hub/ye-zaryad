# Submission notes for Vadym

Facts only. This is not the Devpost description, not the "how I used the Skill Pack" answer, and not the exit survey. Those are yours to write.

## What was built

- Name on screen: Charge Ahead (renamed from Ye Zaryad on Oct 23, 2026). Repository and Pages path: `ye-zaryad`.
- One English page. No language switch. All sentences are in `src/strings.ts`.
- Outage hours: paste text (including `08:00–12:00`, `8-12`, `from 16:00 to 20:00`) or tap hours.
- Kit presets, each marked "Typical estimate": phone, power bank, laptop, router, flashlight, and a separate charging station. No brand names on screen.
- 15-minute simulation of the next 24 hours. Red warning with what runs out and what to charge first. At `?now=12:00` with the sample day and the typical kit, the warning includes "Router runs out at 18:15. Charge this first: Power bank." Adding the charging station clears that warning.
- Charge list in the form "Charge Power bank by 15:15", ticks, and a downloaded `ye-zaryad.ics` (CRLF, UTC, one reminder per event).
- Day bar and an inline SVG battery line.
- Saved in this browser under `ye-zaryad:v1`. Offline after the first load (service worker).
- No backend, no API key, no analytics, no utility logo.

## Skills that ran

Installed with `npx skills add challengepost/learn-ai-basics --all -y`. Recorded in `skills-lock.json`.

1. `1-start` — read `SKILL.md`, checked the folder (license only, no other project), wrote `devpost/learner-profile.md` from your relayed answers. That file is gitignored and was not committed.
2. `2-scope` — wrote `devpost/scope.md` and `devpost/scope.html`.
3. `3-prd` — wrote `devpost/prd.md` and `devpost/prd.html`.
4. `4-spec` — wrote `devpost/spec.md` and `devpost/spec.html`.
5. `5-build` — wrote `devpost/checklist.md`, built the page, ran the checks below, wrote `devpost/app-map.html`.
6. `6-ship` — public repo already existed (`https://github.com/Solar-DePIN-Hub/ye-zaryad`). Did not write your Devpost copy. Did not submit the entry. Demo recording is a local silent file plus a caption draft for you to edit and upload.

Your interview answers were relayed. They were not re-asked. The English planning pages were not reviewed by you in this session. `status: approved` means the build followed those relayed decisions.

## Tests

- Vitest (Oct 23): 39 tests, 7 files (`parseSchedule`, `units`, `simulate`, `ics`, `plan`, `strings`, `validate`). Parser cases include the separators, `from…to`, `24:00`, overnight, overlaps, a bad line, and empty input.
- Playwright (Oct 23): 6 tests. Sample schedule → typical kit → "runs out" → `.ics` download → reload; offline reload; "power is off now"; English only; the first screen and Try a demo day; form validation.
- `npm run lint` is `tsc --noEmit`.
- These passed locally before the pull request. GitHub Actions runs the same steps. The Pages deploy job runs only on a push to `main`.

## What you still do

- Read `devpost/scope.md`, `prd.md`, and `spec.md`. The assumptions lists are the decisions you did not make.
- Try the page yourself (`npm install` && `npm run dev`).
- Edit the caption draft if you want, then upload a public video under 3 minutes. No music, no utility logos.
- Write the Devpost text, the Skill Pack answer, and the exit survey yourself.
- Confirm you are the age of majority on the form. That checkbox is yours.
- GitHub Pages is on: https://solar-depin-hub.github.io/ye-zaryad/

## Assumptions to confirm

Copied here so you do not have to hunt. Detail is in the planning docs.

- HTML companions for the plan. You did not pick a review format.
- Fast build, with tests standing in for you clicking through it.
- English sentences. You did not write them. You did not ask for a language switch.
- Colours: background `#0E1726`, accent `#FFB547`, grid-on `#3DDC97`, danger `#FF6B6B`. Font: Manrope.
- Preset numbers: phone about 12 Wh, power bank 20 000 mAh → about 62.9 Wh at 3.7 V × 0.85, laptop about 60 Wh and 45 W, router about 12 W, station about 512 Wh, flashlight about 8 Wh. Starting charge levels are in `src/domain/presets.ts`.
- "Charge X by HH:MM" means the latest time to plug it in so it can be full before the next outage.
- Higher in the kit list is protected first.
- Sample hours: 08:00–12:00 and 16:00–20:00.
- Stack: Vite, React, TypeScript, no server. You did not choose the tools. The build brief did.
- Calendar file uses UTC. On-screen times are local.
- Latin slug `ye-zaryad`.

## Demo files

- Silent recording and `ye-zaryad-demo.srt` are with the agent artifacts, not in the git history.
- The `.srt` is a draft in English, short lines, for you to edit. It is not burned into the video. No voice. No music.
- At the fixed clock 12:00 the spoken-style lines use 18:15 and 15:15, which is what the page shows for the sample day and the typical kit.
