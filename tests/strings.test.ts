import { describe, expect, it } from "vitest";
import { dictionaries, pickLang } from "../src/strings";

describe("languages", () => {
  it("has a Ukrainian line for every English line", () => {
    const en = dictionaries.en as Record<string, unknown>;
    const uk = dictionaries.uk as Record<string, unknown>;
    expect(Object.keys(uk).sort()).toEqual(Object.keys(en).sort());
    for (const key of Object.keys(en)) {
      expect(typeof uk[key]).toBe(typeof en[key]);
      if (typeof en[key] === "string" && !["latinName", "appName", "schedulePlaceholder"].includes(key)) {
        expect(uk[key], key).not.toBe(en[key]);
      }
    }
    expect(Object.keys(dictionaries.uk.presetNames).sort()).toEqual(Object.keys(dictionaries.en.presetNames).sort());
  });

  it("picks the URL first, then the saved choice, then the browser", () => {
    expect(pickLang("?lang=uk", "en", "en-US")).toBe("uk");
    expect(pickLang("", "uk", "en-US")).toBe("uk");
    expect(pickLang("", null, "uk-UA")).toBe("uk");
    expect(pickLang("", null, "en-GB")).toBe("en");
    expect(pickLang("?lang=xx", null, undefined)).toBe("en");
  });

  it("writes Ukrainian sentences that do not need noun cases", () => {
    expect(dictionaries.uk.chargeBy("Зарядна станція", "15:15")).toBe("Заряди до 15:15: Зарядна станція");
    expect(dictionaries.uk.runsOut("Роутер", "18:15")).toBe("Роутер сяде о 18:15.");
  });
});
