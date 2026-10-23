/**
 * Silent walkthrough, timed to docs/video-narration.md. The app is on screen from the first frame.
 * No voice, no music, no utility names.
 * Requires a built preview on port 4173 (`npm run build && npm run preview -- --host 127.0.0.1 --port 4173`).
 * Writes a webm next to the srt draft. Convert with ffmpeg if you need mp4.
 */
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = process.env.DEMO_OUT ?? path.resolve("demo-out");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1.5,
  recordVideo: { dir: outDir, size: { width: 1920, height: 1080 } },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const origin = Date.now();
const cues = [];

async function beat(caption, action) {
  const start = Date.now() - origin;
  await action();
  cues.push({ start, end: Date.now() - origin, caption });
}

function card(title, body) {
  return `<!doctype html><html><body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0e1726;color:#f4efe6;font-family:Georgia,serif;text-align:center">
    <div style="max-width:760px;padding:24px">
      <div style="width:18px;height:18px;border-radius:50%;background:#ffb547;margin:0 auto 18px;box-shadow:0 0 24px rgba(255,181,71,.5)"></div>
      <h1 style="font-weight:normal;font-size:56px;margin:0 0 12px">${title}</h1>
      <p style="font-size:28px;line-height:1.35;color:#c4b8a5;margin:0">${body}</p>
    </div>
  </body></html>`;
}

const hold = (ms) => page.waitForTimeout(ms);

const APP = "http://127.0.0.1:4173/?now=12:00";
const docUrl = (name) => "file://" + path.resolve("devpost", name);

// Part 1: the app, from the first second.
await page.goto(APP, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.goto(APP, { waitUntil: "networkidle" });

await beat("Charge Ahead: which devices will die in a blackout,\nand what to charge first.", async () => {
  await hold(7000);
});

await beat("For people living with scheduled power cuts.\nNo account. One tap loads a demo day.", async () => {
  await hold(5500);
  await page.getByRole("button", { name: "Try a demo day" }).click();
  await hold(4500);
});

await beat("Outages 08:00–12:00 and 16:00–20:00.\nPaste a schedule, or tap the hours.", async () => {
  const hour = page.getByRole("button", { name: "22:00 to 23:00, power on" });
  await hour.scrollIntoViewIfNeeded();
  await hold(3000);
  await hour.click();
  await hold(2500);
  await page.getByRole("button", { name: "22:00 to 23:00, outage" }).click();
  await hold(3500);
});

await beat("A typical home kit. Every number is an estimate you can change.", async () => {
  await page.getByRole("heading", { name: "Your kit" }).scrollIntoViewIfNeeded();
  await hold(9000);
});

await beat("Router runs out at 18:15.\nCharge this first: Power bank.", async () => {
  await page.evaluate(() => window.scrollTo({ top: 0 }));
  await page.getByRole("alert").scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(outDir, "warning.png") });
  await hold(8000);
});

await beat("The next 24 hours, and how each battery drains.", async () => {
  await page.getByRole("heading", { name: "The next 24 hours" }).scrollIntoViewIfNeeded();
  await hold(4000);
  await page.getByTestId("daybar").locator("[data-outage-segment='true']").first().click();
  await hold(3000);
  await page.getByRole("heading", { name: "Battery level" }).scrollIntoViewIfNeeded();
  await hold(3500);
});

await beat("Add a charging station. The plan updates.", async () => {
  await page.getByRole("button", { name: "Add charging station (estimate)" }).scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Add charging station (estimate)" }).click();
  await page.locator(".alert").scrollIntoViewIfNeeded();
  await hold(6000);
});

await beat("What to charge, and by when: Power bank by 15:15.\nOne tap adds calendar reminders.", async () => {
  await page.getByRole("heading", { name: "What to charge" }).scrollIntoViewIfNeeded();
  await hold(6000);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Add reminders to calendar" }).click();
  await download;
  await hold(4000);
});

await beat("Works offline. In a blackout, the internet often goes too.", async () => {
  await page.waitForFunction(() => navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "Charge Ahead" }).waitFor();
  await hold(6000);
  await context.setOffline(false);
});

await beat("Wrong input gets a plain message.\nThe plan keeps the last good value.", async () => {
  const holds = page.getByLabel("Holds, Wh").nth(1);
  await holds.scrollIntoViewIfNeeded();
  await hold(1000);
  await holds.fill("-5");
  await hold(5000);
  await holds.fill("60");
  await hold(1500);
});

// Part 2: how Vadym built it with the Devpost Learn Skill Pack.
await beat("Built with the Devpost Learn Skill Pack:\nsix skills, in order.", async () => {
  await page.setContent(
    card(
      "How Vadym built it",
      "Devpost Learn Skill Pack + an AI coding agent<br><br>1-start → 2-scope → 3-prd → 4-spec → 5-build → 6-ship",
    ),
  );
  await hold(8500);
});

await beat("The skills asked him interview questions.\nHis answers decided the users, the feature and the look.", async () => {
  await page.goto(docUrl("scope.html"), { waitUntil: "load" });
  await hold(8000);
});

await beat("scope.md: other apps show when the power goes off.\nThis one says what will die, and when.", async () => {
  await page.locator("svg").first().scrollIntoViewIfNeeded();
  await hold(10000);
});

await beat("prd.md: the screens, the states,\nand what counts as working.", async () => {
  await page.goto(docUrl("prd.html"), { waitUntil: "load" });
  await hold(3500);
  await page.mouse.wheel(0, 600);
  await hold(3500);
});

await beat("spec.md: React, TypeScript and Vite.\nNo server, so it still works in a blackout.", async () => {
  await page.goto(docUrl("spec.html"), { waitUntil: "load" });
  await hold(4000);
  await page.mouse.wheel(0, 600);
  await hold(4000);
});

await beat("Built slice by slice, with a checklist and tests.\n39 unit tests, 6 browser tests.", async () => {
  await page.goto(docUrl("app-map.html"), { waitUntil: "load" });
  await hold(9000);
});

await beat("Live on GitHub Pages. Open source, MIT license.", async () => {
  await page.setContent(
    card(
      "Charge Ahead",
      "solar-depin-hub.github.io/ye-zaryad<br>github.com/Solar-DePIN-Hub/ye-zaryad<br><br>Know what will die before the lights go out.",
    ),
  );
  await hold(10000);
});

function stamp(ms) {
  const clamped = Math.max(0, ms);
  const h = Math.floor(clamped / 3600000);
  const m = Math.floor((clamped % 3600000) / 60000);
  const s = Math.floor((clamped % 60000) / 1000);
  const milli = clamped % 1000;
  const pad = (n, w = 2) => String(n).padStart(w, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(milli, 3)}`;
}

const srt = cues
  .map((cue, index) => {
    const text = cue.caption.trim();
    return `${index + 1}\n${stamp(cue.start)} --> ${stamp(cue.end)}\n${text}\n`;
  })
  .join("\n");

await writeFile(path.join(outDir, "ye-zaryad-demo.srt"), srt, "utf8");
const video = page.video();
await context.close();
const videoPath = video ? await video.path() : "";
await browser.close();
console.log(JSON.stringify({ videoPath, srt: path.join(outDir, "ye-zaryad-demo.srt"), cues: cues.length }, null, 2));
