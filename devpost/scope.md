---
doc: scope
status: approved
---

# Є заряд

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

They open Є заряд. They put in today's outage hours, either by pasting the text or by tapping hours on a bar. They add what they own. They read what will die and when, and a list of what to charge by when. They can drop that list into the phone calendar. They come back on the next outage day and do it again, including when the internet is already gone.

## Inspiration & Identity

The name is «Є заряд» (Latin slug: Ye Zaryad). The feeling he asked for: dark, calm, yellow-orange accents, like a light in the dark.

He did not name a reference app, a font, or a website to copy.

## Why This Matters to the Learner

He wants to be ready for the cuts. In his words, he had sat with the phone off and the appliances off, and it felt bad. ("сьогодні я сидів з відключеним телефоном і всіма електро приладами) і було сумно")

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
- The Latin slug `ye-zaryad` is for the repository and the site path. He named the app «Є заряд» and did not discuss the URL.
- Wattages, battery sizes, and charge speeds are typical estimates he can edit. He named the devices and did not give numbers.
- "By 14:00" is treated as the latest time to plug something in so it can be full before the next outage. The list still reads "Charge power bank by 14:00".
- One scrolling page, not several screens. He described what he sees and does, not a sitemap.
