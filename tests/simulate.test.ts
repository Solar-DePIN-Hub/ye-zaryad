import { describe, expect, it } from "vitest";
import { simulate } from "../src/domain/simulate";
import type { KitItem } from "../src/domain/types";
import { formatClock } from "../src/domain/time";

function item(partial: Partial<KitItem> & Pick<KitItem, "id" | "name">): KitItem {
  return {
    capacityWh: 0,
    chargeW: 0,
    drawW: 0,
    soc: 1,
    sharesPower: false,
    ...partial,
  };
}

describe("simulate", () => {
  it("survives when the battery exactly covers the outage", () => {
    const result = simulate({
      nowMin: 10 * 60,
      blocks: [{ startMin: 600, endMin: 615 }],
      items: [item({ id: "b", name: "Battery", capacityWh: 15, drawW: 60, soc: 1 })],
    });
    expect(result.deaths).toEqual([]);
    expect(result.allClear).toBe(true);
    expect(result.reports[0]?.minSocById.b).toBeCloseTo(0, 5);
    expect(result.reports[0]?.survives).toBe(true);
  });

  it("names the quarter hour when a battery runs out", () => {
    const result = simulate({
      nowMin: 10 * 60,
      blocks: [{ startMin: 600, endMin: 660 }],
      items: [item({ id: "b", name: "Battery", capacityWh: 15, drawW: 60, soc: 1 })],
    });
    expect(result.deaths).toHaveLength(1);
    expect(formatClock(result.deaths[0].atMin)).toBe("10:15");
    expect(result.chargeFirst?.name).toBe("Battery");
  });

  it("gives scarce energy to the earlier device in the list", () => {
    const result = simulate({
      nowMin: 0,
      blocks: [{ startMin: 0, endMin: 15 }],
      items: [
        item({ id: "router", name: "Router", drawW: 12 }),
        item({ id: "lamp", name: "Lamp", drawW: 60 }),
        item({
          id: "bank",
          name: "Power bank",
          capacityWh: 10,
          soc: 1,
          sharesPower: true,
        }),
      ],
    });
    expect(result.deaths.map((death) => death.itemId)).toEqual(["lamp"]);
    expect(result.chargeFirst?.name).toBe("Power bank");
    expect(result.chargeFirst?.becauseName).toBe("Lamp");
  });

  it("recharges between two outages and survives the second", () => {
    const result = simulate({
      nowMin: 0,
      blocks: [
        { startMin: 0, endMin: 60 },
        { startMin: 120, endMin: 180 },
      ],
      items: [
        item({
          id: "pack",
          name: "Pack",
          capacityWh: 100,
          chargeW: 100,
          drawW: 100,
          soc: 0.5,
        }),
      ],
    });
    expect(result.reports).toHaveLength(2);
    expect(result.reports[0]?.survives).toBe(false);
    expect(result.reports[1]?.survives).toBe(true);
    const charged = result.steps.find((step) => step.offsetMin === 105);
    expect(charged?.socById.pack).toBeCloseTo(1, 5);
    expect(result.deaths.every((death) => death.offsetMin < 120)).toBe(true);
  });

  it("stays all clear when there is no outage", () => {
    const result = simulate({
      nowMin: 9 * 60,
      blocks: [],
      items: [item({ id: "laptop", name: "Laptop", capacityWh: 60, chargeW: 60, drawW: 45, soc: 0.2 })],
    });
    expect(result.hasOutage).toBe(false);
    expect(result.allClear).toBe(true);
    expect(result.deaths).toEqual([]);
    expect(result.actions).toEqual([]);
    expect(result.chargeFirst).toBeNull();
  });

  it("sets the plug-in deadline so the battery is full before the outage", () => {
    const result = simulate({
      nowMin: 8 * 60,
      blocks: [{ startMin: 12 * 60, endMin: 13 * 60 }],
      items: [
        item({
          id: "pack",
          name: "Power bank",
          capacityWh: 100,
          chargeW: 100,
          drawW: 0,
          soc: 0.5,
          sharesPower: true,
        }),
      ],
    });
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0]?.needsMinutes).toBe(30);
    expect(formatClock(result.actions[0]?.deadlineMin ?? 0)).toBe("11:30");
    expect(result.actions[0]?.fullByOutage).toBe(true);
    expect(result.actions[0]?.startNow).toBe(false);
  });

  it("says to start now when the battery cannot be full in time", () => {
    const result = simulate({
      nowMin: 11 * 60 + 45,
      blocks: [{ startMin: 12 * 60, endMin: 13 * 60 }],
      items: [
        item({
          id: "pack",
          name: "Power bank",
          capacityWh: 100,
          chargeW: 100,
          soc: 0.5,
          sharesPower: true,
        }),
      ],
    });
    expect(result.actions[0]?.fullByOutage).toBe(false);
    expect(result.actions[0]?.startNow).toBe(true);
  });
});
