import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/?now=12:00");
  await page.evaluate(() => localStorage.clear());
  await page.goto("/?now=12:00");
});

test("plans the sample day and keeps it after reload", async ({ page }) => {
  await page.getByRole("button", { name: "Use a sample schedule" }).click();
  await expect(page.getByRole("list", { name: "Outages" }).getByRole("listitem")).toHaveCount(2);

  await page.getByRole("button", { name: "Add typical kit (estimates)" }).click();
  await expect(page.getByRole("alert")).toContainText(/runs out at/i);
  await expect(page.getByRole("alert")).toContainText(/Charge this first/i);
  await expect(page.getByTestId("daybar").locator("[data-outage-segment='true']")).toHaveCount(2);

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Add reminders to calendar" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.ics$/);
  const filePath = await download.path();
  const body = await readFile(filePath ?? "", "utf8");
  expect(body).toContain("BEGIN:VCALENDAR");
  expect(body).toContain("\r\n");

  await page.getByRole("checkbox", { name: /Mark Power bank done/i }).check();
  await page.reload();
  await expect(page.getByLabel("Name").first()).toHaveValue("Router");
  await expect(page.getByRole("alert")).toContainText(/runs out at/i);
  await expect(page.getByRole("checkbox", { name: /Mark Power bank done/i })).toBeChecked();
});

test("still opens after the network drops", async ({ page, context }) => {
  await page.getByRole("button", { name: "Use a sample schedule" }).click();
  await page.waitForFunction(() => navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Charge Ahead" })).toBeVisible();
  await expect(page.getByRole("list", { name: "Outages" })).toContainText("08:00–12:00");
});

test("says when nothing can charge because the power is already off", async ({ page }) => {
  await page.goto("/?now=09:00");
  await page.getByRole("button", { name: "Use a sample schedule" }).click();
  await page.getByRole("button", { name: "Add typical kit (estimates)" }).click();
  await expect(page.getByRole("alert")).toContainText("The power is off now. It is due back at 12:00");
  await expect(page.getByRole("alert")).toContainText(/When the power is back, charge this first/);
});

test("is English only", async ({ page }) => {
  await page.getByRole("button", { name: "Use a sample schedule" }).click();
  await page.getByRole("button", { name: "Add typical kit (estimates)" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Charge Ahead" })).toBeVisible();
  expect(await page.locator("body").innerText()).not.toMatch(/[\u0400-\u04FF]/);
  expect(await page.title()).toBe("Charge Ahead");
});

test("first screen says what it is and opens a demo day in one tap", async ({ page }) => {
  await expect(page.getByText(/For anyone living with scheduled power cuts/)).toBeVisible();
  await expect(page.getByText(/No account/)).toBeVisible();
  await page.getByRole("button", { name: "Try a demo day" }).click();
  await expect(page.getByRole("list", { name: "Outages" }).getByRole("listitem")).toHaveCount(2);
  await expect(page.getByLabel("Name").first()).toHaveValue("Router");
  await expect(page.getByRole("alert")).toContainText("Router runs out at 18:15");
  await page.getByRole("button", { name: "Start over" }).click();
  await expect(page.getByRole("button", { name: "Try a demo day" })).toBeVisible();
  await expect(page.getByRole("list", { name: "Outages" }).getByRole("listitem")).toHaveCount(0);
});

test("rejects bad numbers and empty names with a plain message", async ({ page }) => {
  await page.getByRole("button", { name: "Try a demo day" }).click();
  const holds = page.getByLabel("Holds, Wh").nth(1);
  await holds.fill("-5");
  await expect(page.getByText("Use a number from 0 to 5000 Wh.")).toBeVisible();
  await expect(holds).toHaveAttribute("aria-invalid", "true");
  await holds.fill("90");
  await expect(page.getByText("Use a number from 0 to 5000 Wh.")).toHaveCount(0);
  const name = page.getByLabel("Name").first();
  await name.fill("");
  await expect(page.getByText("Give this device a name.")).toBeVisible();
  await name.blur();
  await expect(name).toHaveValue("Router");
});
