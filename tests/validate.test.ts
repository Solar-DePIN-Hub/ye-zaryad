import { describe, expect, it } from "vitest";
import { checkName, checkNumber, sanitizeItem } from "../src/domain/validate";

describe("form checks", () => {
  it("accepts numbers inside the range, with a comma or a dot", () => {
    expect(checkNumber("62.9", 0, 5000)).toEqual({ ok: true, value: 62.9 });
    expect(checkNumber("62,9", 0, 5000)).toEqual({ ok: true, value: 62.9 });
    expect(checkNumber(" 0 ", 0, 100)).toEqual({ ok: true, value: 0 });
  });

  it("rejects empty, non-numbers and out-of-range values", () => {
    expect(checkNumber("", 0, 100)).toEqual({ ok: false, reason: "empty" });
    expect(checkNumber("abc", 0, 100)).toEqual({ ok: false, reason: "nan" });
    expect(checkNumber("-1", 0, 100)).toEqual({ ok: false, reason: "range" });
    expect(checkNumber("101", 0, 100)).toEqual({ ok: false, reason: "range" });
  });

  it("needs a short, non-empty name", () => {
    expect(checkName("  Router ")).toEqual({ ok: true, value: "Router" });
    expect(checkName("   ")).toEqual({ ok: false, reason: "empty" });
    expect(checkName("x".repeat(41))).toEqual({ ok: false, reason: "long" });
  });

  it("repairs a saved item that has impossible numbers", () => {
    const item = sanitizeItem({
      id: "a",
      name: " ",
      capacityWh: -10,
      chargeW: Number.NaN,
      drawW: 99999,
      soc: 3,
      sharesPower: false,
    });
    expect(item).toMatchObject({ name: "Device", capacityWh: 0, chargeW: 0, drawW: 3000, soc: 1 });
  });
});
