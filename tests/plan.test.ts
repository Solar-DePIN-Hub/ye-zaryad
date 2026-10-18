import { describe, expect, it } from "vitest";
import { actionHeadline } from "../src/domain/actions";
import { SAMPLE_SCHEDULE, parseSchedule } from "../src/domain/parseSchedule";
import { presetById, typicalKitIds } from "../src/domain/presets";
import { simulate } from "../src/domain/simulate";
import type { KitItem } from "../src/domain/types";

function kit(ids: string[]): KitItem[] {
  return ids.map((id) => {
    const preset = presetById(id);
    if (!preset) throw new Error(id);
    return { ...preset.item, id, presetId: id };
  });
}

describe("sample day at noon", () => {
  const blocks = parseSchedule(SAMPLE_SCHEDULE).blocks;

  it("the typical kit runs out, and a charging station covers the same day", () => {
    const short = simulate({ nowMin: 12 * 60, blocks, items: kit(typicalKitIds) });
    expect(short.deaths.length).toBeGreaterThan(0);
    expect(short.chargeFirst).not.toBeNull();
    expect(short.actions.some((action) => actionHeadline(action).startsWith("Charge "))).toBe(true);

    const covered = simulate({
      nowMin: 12 * 60,
      blocks,
      items: kit([...typicalKitIds, "station"]),
    });
    expect(covered.deaths).toEqual([]);
    expect(covered.allClear).toBe(true);
  });
});
