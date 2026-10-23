import { describe, expect, it } from "vitest";
import { strings } from "../src/strings";
import { SAMPLE_SCHEDULE } from "../src/domain/parseSchedule";

function allText(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (typeof value === "function") return [String((value as (...a: string[]) => string)("X", "Y"))];
  if (value && typeof value === "object") return Object.values(value).flatMap(allText);
  return [];
}

describe("copy", () => {
  it("is English only, with no Cyrillic anywhere on the page", () => {
    const texts = [...allText(strings), SAMPLE_SCHEDULE];
    expect(texts.length).toBeGreaterThan(50);
    for (const text of texts) expect(text, text).not.toMatch(/[\u0400-\u04FF]/);
  });

  it("writes the warning and the charge list as plain sentences", () => {
    expect(strings.runsOut("Router", "18:15")).toBe("Router runs out at 18:15.");
    expect(strings.chargeBy("Power bank", "15:15")).toBe("Charge Power bank by 15:15");
  });

  it("says nothing can charge while the power is off", () => {
    expect(strings.offNow("12:00")).toBe("The power is off now. It is due back at 12:00, so nothing can charge before then.");
    expect(strings.chargeFirstWhenBack("Power bank")).toBe("When the power is back, charge this first: Power bank.");
  });
});
