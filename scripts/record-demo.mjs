/**
 * Silent walkthrough. No voice, no music, no utility names.
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
  viewport: { width: 1920, height: 1080 },
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

await beat("Ukraine, winter 2026:\nscheduled blackouts, every day.", async () => {
  await page.setContent(card("Є заряд", "What will go dead, and what to charge by when."));
  await hold(7000);
});

await beat("Outage apps show when the power goes off.\nNot whether your batteries will last.", async () => {
  await page.setContent(
    card("When, not whether.", "A schedule says the power goes off.<br>It does not say what still has charge."),
  );
  await hold(8000);
});

await beat("Paste your outage schedule.\nAny common format.", async () => {
  await page.goto("http://127.0.0.1:4173/?now=12:00", { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.goto("http://127.0.0.1:4173/?now=12:00", { waitUntil: "networkidle" });
  await hold(1500);
  await page.locator("#schedule-text").fill("SAMPLE\n08:00–12:00\nз 16:00 до 20:00\n");
  await hold(5000);
});

await beat("Or tap the hours the power is off.", async () => {
  const hour = page.getByRole("button", { name: "22:00 to 23:00, power on" });
  await hour.scrollIntoViewIfNeeded();
  await hour.click();
  await hold(1500);
  await page.getByRole("button", { name: "22:00 to 23:00, outage" }).click();
  await hold(2500);
});

await beat("Add what you own.\nPhone, power bank, laptop, router, flashlight.", async () => {
  await page.getByRole("button", { name: "Add typical kit (estimates)" }).click();
  await hold(6000);
});

await beat("Ye Zaryad says what dies, and when.\nThe router runs out at 18:15.", async () => {
  await page.getByRole("alert").scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(outDir, "warning.png") });
  await hold(9000);
});

await beat("The next 24 hours,\nand how the batteries fall.", async () => {
  await page.getByRole("heading", { name: "The next 24 hours" }).scrollIntoViewIfNeeded();
  await hold(4000);
  await page.getByTestId("daybar").locator("[data-outage-segment='true']").first().click();
  await hold(4000);
  await page.getByRole("heading", { name: "Battery level" }).scrollIntoViewIfNeeded();
  await hold(4000);
});

await beat("Add a charging station.\nThe plan updates.", async () => {
  await page.getByRole("button", { name: "Add charging station (estimate)" }).click();
  await page.locator(".alert").scrollIntoViewIfNeeded();
  await hold(8000);
});

await beat("A list: what to charge, and by when.\nCharge the power bank by 15:15.", async () => {
  await page.getByRole("heading", { name: "What to charge" }).scrollIntoViewIfNeeded();
  await hold(7000);
});

await beat("One tap downloads calendar reminders.", async () => {
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Add reminders to calendar" }).click();
  await download;
  await hold(5000);
});

await beat("Works offline.\nDuring a blackout, the internet goes too.", async () => {
  await page.waitForFunction(() => navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "Є заряд" }).waitFor();
  await hold(7000);
  await context.setOffline(false);
});

await beat("Planned with the Devpost Learn Skill Pack.\nOpen source, MIT.", async () => {
  await page.setContent(
    card("Open source.", "Planned with the Devpost Learn Skill Pack.<br>MIT license. No account. No server."),
  );
  await hold(7000);
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
