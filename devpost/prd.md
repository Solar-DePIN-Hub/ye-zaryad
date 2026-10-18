---
doc: prd
status: approved
---

# Є заряд — Product Requirements

A calm one-page planner for a person who needs to know what will go dead in the next outage, and what to charge by when. The name on screen is «Є заряд».

Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`, `scope.md > What "Working" Looks Like`. Interview answers were relayed from Vadym Bilobrovets. He has not separately reviewed this English page. `status: approved` means the build follows those relayed decisions. See **Assumptions (to confirm with Vadym)**.

## The Core Journey

1. They open Є заряд on their phone. The page is dark and quiet. The name and one line of purpose are at the top. Nothing is calculated yet.
2. They put in today's outage hours. They can paste a message (the way those messages are written, including forms such as `08:00–12:00`, `8-12`, and `з 16:00 до 20:00`) or tap hours on a 24-hour bar. Hours that parsed show up as chips. A line that cannot be read is marked, and the lines that could be read still count.
3. They add what they own from the set he named: phone, power bank, laptop, router, charging station, flashlight. Each preset is labelled as a typical estimate and can be changed. They can put the important things higher in the list.
4. The page says what will die and at what time. If something will not last, that line is red and it names what to charge first.
5. Under that, a 24-hour bar shows power-on time, outage time, and when to charge. A simple line shows battery level across the day. Tapping an outage shows that outage's breakdown.
6. The ready list is the moment he asked for: items like "Charge power bank by 14:00", each with a tick. One button downloads a calendar file with a reminder for each charge.
7. They can close the page and open it again. The hours, the kit, and the ticks are still there. After the first successful load, the page still opens with no internet.

Success is step 6: a charge-by list and a reminder, plus a red warning when the kit will not last. Source: `scope.md > What "Working" Looks Like`.

## Screens and Layout

One page, read from top to bottom, comfortable at a phone width and still a single calm column on a larger screen.

1. **Name.** «Є заряд», with a short English line under it.
2. **Outage hours.** A text box, a button to fill a labelled sample, chips for the hours that were understood, a note for lines that were not, and a 24-hour tap bar.
3. **Your kit.** Buttons for each device he named, then a short editable list. Higher means "keep this alive first."
4. **What dies.** Red when something runs out, with what to charge first. Quiet when nothing runs out.
5. **The day.** The 24-hour bar, the battery line, and a breakdown for the outage they tap.
6. **Charge by when.** The list and the calendar button.

No second page, no settings screen, no language switch.

## Look and Feel

From his answer: dark, calm, yellow-orange accents, like light in the dark. When the battery will not last: red.

He did not name a typeface, a hex colour, or an app to imitate. He also did not ask for a loud "AI product" look. Avoid purple gradients, utility logos, and trademarked product names on screen (the charging station is called a charging station, not a brand).

Large time numerals. Plenty of space. Short sentences. Motion, if any, is small: the day bar drawing itself, the battery line settling. People who prefer less motion get no animation.

## Features and Behavior

### Schedule hours

Develops `scope.md > The Core Loop` and `scope.md > The POC Boundary`.

The text box accepts several hours on several lines, and more than one range on a line. Separators include a hyphen, an en dash, an em dash, and the words `до` / `to`. A bare `8-12` means 08:00–12:00. `24:00` is allowed as an end. A range that crosses midnight is split into the piece before midnight and the piece after. Overlapping ranges become one block. `22:00–00:00` means "until midnight."

Understood ranges appear as chips. A chip can be removed. A line with no time in it and no digits (a heading, or the word SAMPLE) is ignored. A line that looks like it was trying to be a time and failed is highlighted, with a hint to try `08:00–12:00` or `8-12`. The rest of the text still works.

The tap bar has one control per hour, 00 through 23. Tapping an hour that is not fully an outage makes that whole hour an outage. Tapping an hour that is already fully an outage clears it. The text box updates to the merged hours so paste and taps stay the same schedule.

A button fills a sample schedule. The sample is visibly marked SAMPLE. It is not a real utility's text and shows no company name.

- As the person charging in a rush, I want to paste the message I already have so that I do not retype every hour.
  - [ ] Pasting `08:00–12:00` and `з 16:00 до 20:00` shows two chips.
  - [ ] A broken line is marked and a good line on another row still becomes a chip.
- As either person, I want to tap hours when I do not have a message so that the same plan still runs.
  - [ ] Tapping 14 and 15 shows an outage chip covering those hours.
  - [ ] Tapping one of those hours again removes it.

### The energy kit

Develops `scope.md > The POC Boundary`.

Presets, each labelled as a typical estimate: phone, power bank, laptop, router, charging station, flashlight. Adding one puts it on the list. Adding it again does not duplicate it. A second button adds the everyday set without the charging station, so a shortfall is visible before the station is added.

Each row can be edited: name, how much energy it holds, how fast it charges, how much it uses during an outage, and how full it is now (0–100%). The power bank can be shown from a mAh figure converted at 3.7 V with about 0.85 efficiency, and that conversion is visible, not hidden. The router does not hold a charge; it has to draw from something that does. The power bank and the charging station can feed other devices. The phone, laptop, and flashlight use their own charge first.

Rows move up and down. Higher in the list is protected first when there is not enough to run everything.

Rows can be removed.

- As the person working from home, I want the router and the laptop in the kit so that the plan is about the internet and the work machine, not only a phone.
  - [ ] After adding the typical kit, the list shows phone, power bank, laptop, router, and flashlight.
  - [ ] The charging station is a separate add, and the label says the numbers are typical estimates.
  - [ ] Moving the router above the laptop changes which device is protected first when energy is short.

### What will die and when

Develops `scope.md > The Unique Kernel`.

The plan looks at the next 24 hours from now, in 15-minute steps. While the grid is on, batteries charge. While it is off, devices draw power: own battery first, then a power bank or station, in the order of the list. The result names each device that cannot be fully powered, and the time it runs out, to the nearest quarter hour.

If nothing runs out, the page says so in a calm line, not in red.

If something runs out, a red warning names what runs out and when, and names what to charge first. A device that has its own battery is named as the thing to charge. A device that cannot hold a charge (the router) points at the supply that feeds it, the power bank or the station.

- As either person, I want the time a device dies, not only the outage hours.
  - [ ] With a sample day and the typical kit, at least one red line contains a time and the words that it runs out.
  - [ ] That red line also names what to charge first.
  - [ ] With no outage hours, the page does not claim that something died.

### The day timeline

Develops `scope.md > The Core Loop`.

A horizontal bar of the next 24 hours: grid-on, outage, and the stretch where a battery still needs to be plugged in. "Now" is marked. Under the bar, a line chart drawn as SVG (no chart library) shows how full each battery is across those hours.

Tapping an outage on the bar opens a short breakdown: which devices get through that outage, which run out, and how low each battery gets.

- [ ] The bar shows a distinct outage stretch for each outage in the next 24 hours.
- [ ] The battery lines are present once the kit has something that holds a charge.
- [ ] Tapping an outage shows a breakdown for that outage only.

### The charge-by list

Develops `scope.md > What "Working" Looks Like`.

For each battery that is not full, the list gives a concrete line: "Charge power bank by 14:00", plus how long that charge needs so it is full before the next outage. If it cannot be full in time, the line says to start now and that it will not be full. Each line has a tick that stays ticked after a reload. If there is nothing to charge, the list says so.

"Add reminders to calendar" downloads one `.ics` file. Each charge line becomes an event with a reminder. The file is built in the browser.

- As the person in the apartment, I want a list I can follow without re-reading the graph.
  - [ ] The list uses the form "Charge {name} by {time}".
  - [ ] The calendar button downloads a file whose name ends in `.ics`.
  - [ ] A tick is still ticked after reload.

### Offline and reminders

Develops `scope.md > The POC Boundary`.

The first visit needs a network so the page can load. After that, the page opens with the connection off, including the last hours and kit. Nothing is sent to a server. There is no account.

The interface is English. There is no language toggle. All user-facing sentences live in one module so a Ukrainian set can be added later without hunting through components.

- [ ] After one online load, reloading while offline still shows the app name and the saved schedule.
- [ ] The screen has no language switch.

## States and Boundaries

- **First visit** — empty text box, no chips, no kit, no red warning. Short instructions say to paste or tap hours, then add what they own.
- **Schedule only** — chips and the tap bar are filled in. The plan asks for a kit before it talks about dying devices.
- **Kit only** — devices are listed. Without outage hours, the page does not invent a blackout.
- **Normal plan** — warning or all-clear, the day bar, the battery line, and the charge list.
- **Unreadable line** — that line is called out; other lines still apply.
- **Will not last** — red warning plus "charge this first."
- **Will last** — calm all-clear, no red.
- **Saved** — schedule text, kit edits, order, and ticks survive a reload in this browser.
- **Offline** — after the first load, the same page opens with no network. Until that first load, the browser shows its own offline error; the app cannot appear from nothing.

## Product Decisions

- Two users, not one: the person rushing to charge the apartment, and the person who needs the laptop and the internet. Both are served by the same page.
- The kernel is both halves he chose: what dies and when, and what to charge by when.
- The moment that matters is the ready list with a reminder, in the shape "charge the power bank by 14:00."
- Devices are the six he named. A lamp preset from an earlier sketch is not included; he named a flashlight.
- Schedule entry is both paste and tap, not one of them.
- Look is dark, calm, yellow-orange. A shortfall is red and says what to charge first.
- Offline use and a calendar file are in. A language toggle is out.
- The name is «Є заряд».

## Assumptions (to confirm with Vadym)

- One scrolling page, phone-width, centered on a dark background on a large screen.
- Concrete palette used because he did not give hex values: background `#0E1726`, yellow-orange `#FFB547`, a quieter green for "grid is on" `#3DDC97`, danger red `#FF6B6B`, warm off-white text. These match "dark, calm, yellow-orange" and "red warning" but the exact values are not his.
- Typeface: Manrope, self-hosted, because he did not name a font. It is an open font (OFL).
- Typical estimates, editable, not his measurements:
  - Phone: about 12 Wh, charges around 18 W, uses about 3 W, starts near 40%.
  - Power bank: 20 000 mAh at 3.7 V × 0.85 efficiency (about 63 Wh), charges around 60 W, starts near 30%, other devices can draw from it.
  - Laptop: about 60 Wh, charges around 60 W, uses about 45 W while working, starts near 45%.
  - Router: about 12 W, no battery of its own.
  - Charging station: about 512 Wh, charges around 300 W, starts near 80%, other devices can draw from it.
  - Flashlight: about 8 Wh, charges around 5 W, uses about 3 W, starts near 70%.
- "Charge X by HH:MM" means the latest time to plug it in so it can be full before the next outage. The outage time is in the smaller line under it.
- Higher in the kit list means protected first. He did not define a separate priority control.
- The sample day is `08:00–12:00` and `16:00–20:00`, marked SAMPLE.
- English copy was written for judges. He did not write the English sentences.
- The next 24 hours are simulated from the phone's current local time, in 15-minute steps.
- Calendar times are in UTC so the file does not depend on a timezone database. The on-screen times are local.

## What We're Building

Paste and tap for outage hours, an editable kit of the six devices, a 15-minute simulation of the next 24 hours, a red "runs out at / charge this first" warning, a day bar and SVG battery line, a charge-by list with ticks, an `.ics` download, and an offline-capable page that remembers the kit. English only, strings in one module.

## Deferred From the POC

- Ukrainian copy. Out for now because he did not choose a language toggle. The module is the place it will go.
- Fetching a live schedule from a utility. Out because there is no official public API he asked to use, and terms are unclear. Paste and tap prove the kernel without it.

## Possible Later Enhancements

- Ukrainian strings beside the English ones, and a switch only if he asks for it then.
- A note of which outage group he usually follows, still typed or tapped by him.
- Sharing a plan as a file he already understands (the calendar file is the version in this proof of concept).

## Non-Goals

- No accounts and no backend. The plan stays on the phone.
- No push notifications. The calendar file is the reminder.
- No utility logos, wordmarks, or branded station names on screen.
- No claim that the preset wattages are his measured devices. They are labelled as typical estimates.

## Open Questions

None that block the blueprint. The numbers and colours above are assumptions, not unanswered product choices. He can correct them without changing the kernel.
