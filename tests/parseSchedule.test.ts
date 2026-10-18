import { describe, expect, it } from "vitest";
import {
  blocksToText,
  hourFullyOut,
  parseSchedule,
  removeBlock,
  SAMPLE_SCHEDULE,
  toggleHour,
} from "../src/domain/parseSchedule";

describe("parseSchedule", () => {
  it("reads an en dash range", () => {
    expect(parseSchedule("08:00–12:00").blocks).toEqual([{ startMin: 480, endMin: 720 }]);
  });

  it("reads a hyphen range", () => {
    expect(parseSchedule("08:00-12:00").blocks).toEqual([{ startMin: 480, endMin: 720 }]);
  });

  it("reads an em dash range", () => {
    expect(parseSchedule("08:00—12:00").blocks).toEqual([{ startMin: 480, endMin: 720 }]);
  });

  it("reads bare hours", () => {
    expect(parseSchedule("8-12").blocks).toEqual([{ startMin: 480, endMin: 720 }]);
  });

  it("reads Ukrainian з…до", () => {
    expect(parseSchedule("з 16:00 до 20:00").blocks).toEqual([{ startMin: 960, endMin: 1200 }]);
  });

  it("reads several lines", () => {
    const result = parseSchedule("08:00–12:00\n16:00–20:00");
    expect(result.blocks).toEqual([
      { startMin: 480, endMin: 720 },
      { startMin: 960, endMin: 1200 },
    ]);
    expect(result.errors).toEqual([]);
  });

  it("accepts 24:00 as an end", () => {
    expect(parseSchedule("20:00-24:00").blocks).toEqual([{ startMin: 1200, endMin: 1440 }]);
  });

  it("treats an end of 00:00 as midnight", () => {
    expect(parseSchedule("22:00-00:00").blocks).toEqual([{ startMin: 1320, endMin: 1440 }]);
  });

  it("splits a range that crosses midnight", () => {
    expect(parseSchedule("22:00–02:00").blocks).toEqual([
      { startMin: 0, endMin: 120 },
      { startMin: 1320, endMin: 1440 },
    ]);
  });

  it("merges overlaps", () => {
    expect(parseSchedule("08:00-12:00\n10:00-14:00").blocks).toEqual([
      { startMin: 480, endMin: 840 },
    ]);
  });

  it("reports a garbage line and keeps a good one", () => {
    const result = parseSchedule("08:00–12:00\nmaybe around 7ish\nз 16:00 до 20:00");
    expect(result.blocks).toHaveLength(2);
    expect(result.errors).toEqual([{ line: 2, text: "maybe around 7ish" }]);
  });

  it("returns nothing for empty input", () => {
    expect(parseSchedule("")).toEqual({ blocks: [], errors: [] });
    expect(parseSchedule("  \n\t")).toEqual({ blocks: [], errors: [] });
  });

  it("ignores a heading with no digits", () => {
    expect(parseSchedule("SAMPLE\nГрафік").blocks).toEqual([]);
    expect(parseSchedule("SAMPLE\nГрафік").errors).toEqual([]);
  });

  it("reads dotted times", () => {
    expect(parseSchedule("8.00-12.00").blocks).toEqual([{ startMin: 480, endMin: 720 }]);
  });

  it("reads two ranges on one line", () => {
    expect(parseSchedule("08:00-12:00, 16:00-20:00").blocks).toHaveLength(2);
  });

  it("allows spaces around the dash", () => {
    expect(parseSchedule("08:00 - 12:00").blocks).toEqual([{ startMin: 480, endMin: 720 }]);
  });

  it("parses the labelled sample", () => {
    const result = parseSchedule(SAMPLE_SCHEDULE);
    expect(result.errors).toEqual([]);
    expect(result.blocks).toEqual([
      { startMin: 480, endMin: 720 },
      { startMin: 960, endMin: 1200 },
    ]);
  });
});

describe("hour toggles", () => {
  it("fills an hour and clears it again", () => {
    const once = toggleHour([], 14);
    expect(once).toEqual([{ startMin: 840, endMin: 900 }]);
    expect(hourFullyOut(once, 14)).toBe(true);
    expect(toggleHour(once, 14)).toEqual([]);
  });

  it("merges a tapped hour into a neighbouring block", () => {
    const blocks = parseSchedule("08:00-10:00").blocks;
    expect(toggleHour(blocks, 10)).toEqual([{ startMin: 480, endMin: 660 }]);
  });

  it("removes one chip without dropping the other", () => {
    const blocks = parseSchedule("08:00-12:00\n16:00-20:00").blocks;
    const next = removeBlock(blocks, blocks[0]);
    expect(next).toEqual([blocks[1]]);
    expect(blocksToText(next)).toBe("16:00–20:00");
  });

  it("writes canonical text", () => {
    expect(blocksToText(parseSchedule("8-12").blocks)).toBe("08:00–12:00");
  });
});
