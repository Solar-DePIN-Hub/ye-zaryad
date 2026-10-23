import type { KitItem } from "./types";

/** Upper limits for kit numbers. Wide enough for a large home station, small enough to catch typos. */
export const LIMITS = {
  capacityWh: { min: 0, max: 5000 },
  chargeW: { min: 0, max: 3000 },
  drawW: { min: 0, max: 3000 },
  percent: { min: 0, max: 100 },
} as const;

export const NAME_MAX = 40;
export const SCHEDULE_MAX = 1000;
export const KIT_MAX = 12;

export type NumberCheck = { ok: true; value: number } | { ok: false; reason: "empty" | "nan" | "range" };

/** Reads a number field. Accepts a comma as the decimal mark. Never clamps silently. */
export function checkNumber(raw: string, min: number, max: number): NumberCheck {
  const text = raw.trim().replace(",", ".");
  if (text === "") return { ok: false, reason: "empty" };
  const value = Number(text);
  if (!Number.isFinite(value)) return { ok: false, reason: "nan" };
  if (value < min || value > max) return { ok: false, reason: "range" };
  return { ok: true, value };
}

export function checkName(raw: string): { ok: true; value: string } | { ok: false; reason: "empty" | "long" } {
  const value = raw.trim();
  if (value === "") return { ok: false, reason: "empty" };
  if (value.length > NAME_MAX) return { ok: false, reason: "long" };
  return { ok: true, value };
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** Makes a saved or edited item safe to simulate: finite numbers inside the limits and a name. */
export function sanitizeItem(item: KitItem): KitItem {
  const name = item.name.trim().slice(0, NAME_MAX) || "Device";
  return {
    ...item,
    name,
    capacityWh: clamp(item.capacityWh, LIMITS.capacityWh.min, LIMITS.capacityWh.max),
    chargeW: clamp(item.chargeW, LIMITS.chargeW.min, LIMITS.chargeW.max),
    drawW: clamp(item.drawW, LIMITS.drawW.min, LIMITS.drawW.max),
    soc: clamp(item.soc, 0, 1),
  };
}
