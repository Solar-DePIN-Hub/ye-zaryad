import { describe, expect, it } from "vitest";
import { mahToWh } from "../src/domain/units";

describe("mahToWh", () => {
  it("converts 20 000 mAh at 3.7 V with 0.85 efficiency", () => {
    expect(mahToWh(20000)).toBeCloseTo(62.9, 5);
  });

  it("uses the volts and efficiency it is given", () => {
    expect(mahToWh(1000, 5, 1)).toBeCloseTo(5, 5);
  });
});
