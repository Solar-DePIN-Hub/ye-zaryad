import { describe, expect, it } from "vitest";
import { buildIcs, formatUtc } from "../src/domain/ics";

describe("buildIcs", () => {
  it("writes a UTC calendar with one reminder per event and CRLF lines", () => {
    const start = new Date(Date.UTC(2026, 9, 18, 11, 30, 0));
    const end = new Date(Date.UTC(2026, 9, 18, 11, 45, 0));
    const text = buildIcs(
      [
        {
          uid: "charge:bank-690@ye-zaryad",
          summary: "Charge power bank by 11:30",
          description: "Needs 30 min to be full before the 12:00 outage.",
          start,
          end,
        },
        {
          uid: "charge:laptop-700@ye-zaryad",
          summary: "Charge laptop by 11:40",
          description: "Needs 20 min.",
          start: new Date(Date.UTC(2026, 9, 18, 11, 40, 0)),
          end: new Date(Date.UTC(2026, 9, 18, 11, 55, 0)),
        },
      ],
      new Date(Date.UTC(2026, 9, 18, 8, 0, 0)),
    );

    expect(text.includes("\n") && !text.includes("\r\n")).toBe(false);
    expect(text.endsWith("\r\n")).toBe(true);
    const lines = text.split("\r\n").filter((line) => line.length > 0);
    expect(lines[0]).toBe("BEGIN:VCALENDAR");
    expect(lines.at(-1)).toBe("END:VCALENDAR");
    expect(lines.filter((line) => line === "BEGIN:VEVENT")).toHaveLength(2);
    expect(lines.filter((line) => line === "BEGIN:VALARM")).toHaveLength(2);
    expect(text).toContain("DTSTART:20261018T113000Z");
    expect(text).toContain("DTEND:20261018T114500Z");
    expect(text).toContain("TRIGGER:-PT15M");
    expect(formatUtc(start)).toBe("20261018T113000Z");
  });
});
