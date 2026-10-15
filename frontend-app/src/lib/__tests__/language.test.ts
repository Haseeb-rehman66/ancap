import { describe, expect, it } from "vitest";
import { detectPreferredLanguage } from "../language";

describe("detectPreferredLanguage", () => {
  it("keeps a saved language preference ahead of browser and country hints", () => {
    expect(
      detectPreferredLanguage({
        cookieLang: "de",
        acceptLanguage: "ru-RU, en-US;q=0.9",
        countryCode: "UA",
      }),
    ).toBe("de");
  });

  it("selects the supported browser language with the highest quality value", () => {
    expect(detectPreferredLanguage({ acceptLanguage: "ru-RU;q=0.4, en-US;q=0.9, uk-UA;q=0.7" })).toBe("en");
  });

  it("uses browser order to break equal-quality ties", () => {
    expect(detectPreferredLanguage({ acceptLanguage: "uk-UA, de-AT" })).toBe("uk");
  });

  it("recognizes regional tags for supported languages", () => {
    expect(detectPreferredLanguage({ acceptLanguage: "ru-RU" })).toBe("ru");
    expect(detectPreferredLanguage({ acceptLanguage: "uk-UA" })).toBe("uk");
    expect(detectPreferredLanguage({ acceptLanguage: "de-AT" })).toBe("de");
    expect(detectPreferredLanguage({ acceptLanguage: "en-GB" })).toBe("en");
    expect(detectPreferredLanguage({ acceptLanguage: "zh-Hant-TW" })).toBe("zh-Hant");
    expect(detectPreferredLanguage({ acceptLanguage: "zh-HK" })).toBe("zh-Hant");
  });

  it("ignores zero-quality and unsupported browser languages", () => {
    expect(detectPreferredLanguage({ acceptLanguage: "ru;q=0, fr-FR;q=0.9, uk-UA;q=0.5" })).toBe("uk");
  });

  it("uses the country hint only when there is no supported browser preference", () => {
    expect(detectPreferredLanguage({ acceptLanguage: "fr-FR", countryCode: "UA" })).toBe("uk");
    expect(detectPreferredLanguage({ countryCode: "DE" })).toBe("de");
  });

  it("defaults to English when there is no supported preference or country hint", () => {
    expect(detectPreferredLanguage({ acceptLanguage: "fr-FR", countryCode: "FR" })).toBe("en");
  });
});
