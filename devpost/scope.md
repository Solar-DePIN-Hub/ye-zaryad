---
doc: scope
status: approved
---

# Charge Ahead

A calm planner that tells you what will go dead in a blackout, and what to charge by when.

Source of decisions: interview answers relayed from Vadym Bilobrovets. The English text is a condensation of those answers. He has not separately reviewed this page. Items he did not decide are under **Assumptions (to confirm with Vadym)** and are not written as his choices. `status: approved` records that the relayed answers are the decisions this proof of concept follows.

## The Unique Kernel

Other tools show when the power goes off. This one says exactly what will die and when, and it gives a plan of what to charge by when.

If that sentence were deleted, this would be just another outage schedule, and it would not be his idea.

## Who It's For

Two people, both his:

- A person in an apartment who, before the power goes, rushes to charge everything at once.
- A person working from home who is afraid of being left without a laptop and without internet.

What they have today is a schedule of hours. The schedule does not tell them whether the router, the laptop, or the phone will still be alive at the end of those hours.

## The Core Loop

They open Charge Ahead. They put in today's outage hours, either by pasting the text or by tapping hours on a bar. They add what they own. They read what will die and when, and a list of what to charge by when. They can drop that list into the phone calendar. They come back on the next outage day and do it again, including when the internet is already gone.

## Inspiration & Identity

The name was first Ye Zaryad (Ukrainian for "there is charge"). It is now **Charge Ahead** (see Revisions below). The feeling he asked for: dark, calm, yellow-orange accents, like a light in the dark.

He did not name a reference app, a font, or a website to copy.

## Why This Matters to the Learner

He wants to be ready for the cuts. In his words, he had sat with the phone off and the appliances off, and it felt bad. (Translated from his message: "today I sat with my phone and all my appliances switched off, and it was sad.")

## What "Working" Looks Like

On one screen, a ready list in the shape he described: "Charge power bank by 14:00", with a reminder. If something will not last, a red warning says so and names what to charge first.

That list is the "oh, that's cool" moment. The warning is how he wants a shortfall to feel: not a quiet wrong number, a red line and a first action.

## The POC Boundary

In this proof of concept:

- Outage hours, entered both ways: paste a message, and tap hours on a 24-hour bar.
- The things he named: phone, power bank, laptop, router, charging station, flashlight.
- A result that says what will die and at what time, and a charge-by list.
- A reminder he can put in the phone calendar.
- It still opens after the internet drops.
- The words on screen are English, kept in one place so Ukrainian can be added later. He did not choose a language switch.

## Later

- A Ukrainian interface, once he wants it. The copy already lives in one module so this is an addition, not a rewrite.
- A way to pull a schedule from a provider, only if there is a clear public source he is allowed to use.

## Explicitly Cut

- A UA/EN toggle. He did not choose it. Judges read English, so the proof of concept is English only.
- Accounts, a server, and live downloads of a utility's schedule. He did not ask for them, and a pasted schedule is enough to prove the kernel.
- Logos or names of power companies on screen. The sample schedule is labelled as a sample.

## Assumptions (to confirm with Vadym)

- Review format is an HTML companion plus this Markdown file. He did not pick a format.
- The Latin slug `ye-zaryad` is for the repository and the site path. He first named the app Ye Zaryad and did not discuss the URL.
- Wattages, battery sizes, and charge speeds are typical estimates he can edit. He named the devices and did not give numbers.
- "By 14:00" is treated as the latest time to plug something in so it can be full before the next outage. The list still reads "Charge power bank by 14:00".
- One scrolling page, not several screens. He described what he sees and does, not a sitemap.

## Revisions after approval (Oct 23, 2026)

These changes were made after the build, at Vadym's request or to match the judges' checklist. The kernel did not change.

- **Name.** Renamed from Ye Zaryad (Ukrainian for "there is charge") to **Charge Ahead**, and the whole page is English only, as Vadym asked. The repository and site path stay `ye-zaryad`.
- **Schedule text.** The parser reads English and numeric forms: `08:00–12:00`, `8-12`, `from 16:00 to 20:00`. The Ukrainian "from…to" wording was removed with the Ukrainian copy.
- **First screen.** Under the name, one paragraph says who the page is for and what it does, three numbered steps show the flow, and a **Try a demo day** button fills the sample day and the typical kit in one tap. **Start over** clears it. No account exists, so judges and visitors need no login.
- **Form checks.** Kit numbers must be inside fixed ranges (0–5000 Wh, 0–3000 W, 0–100 %). An empty name or an out-of-range number shows a plain message under the field and the plan keeps the last valid value. Saved data is repaired on load.
- **Wide screens.** From 900 px wide, the inputs sit on the left and the answer stays in view on the right. Phones keep one column.
