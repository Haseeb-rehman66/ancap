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

  it("keeps a valid saved preference even when the browser excludes that language", () => {
    expect(
      detectPreferredLanguage({
        cookieLang: "de-DE",
        acceptLanguage: "de;q=0, ru-RU;q=1",
        countryCode: "UA",
      }),
    ).toBe("de");
  });

  it("ignores an invalid saved preference and uses the browser preference", () => {
    expect(
      detectPreferredLanguage({
        cookieLang: "fr-FR",
        acceptLanguage: "uk-UA;q=0.8, de-DE;q=0.5",
        countryCode: "RU",
      }),
    ).toBe("uk");
  });

  it("selects the supported browser language with the highest quality value", () => {
    expect(detectPreferredLanguage({ acceptLanguage: "ru-RU;q=0.4, en-US;q=0.9, uk-UA;q=0.7" })).toBe("en");
  });

  it("accepts valid quality values from zero through one", () => {
    expect(detectPreferredLanguage({ acceptLanguage: "ru;q=0, uk;q=0.8, de;q=1.000" })).toBe("de");
    expect(detectPreferredLanguage({ acceptLanguage: "uk;q=0.800, ru;q=0.799" })).toBe("uk");
  });

  it.each(["abc", "NaN", "Infinity", "-Infinity", "-0.1", "1.1", ".8", "0.1234"])(
    "ignores malformed or out-of-range quality value q=%s",
    (quality) => {
      expect(detectPreferredLanguage({ acceptLanguage: `ru;q=${quality}, uk-UA;q=0.6` })).toBe("uk");
    },
  );

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

  it("does not treat wildcard entries as a specific supported language", () => {
    expect(detectPreferredLanguage({ acceptLanguage: "*" })).toBe("en");
    expect(detectPreferredLanguage({ acceptLanguage: "*;q=1, fr-FR;q=0.9" })).toBe("en");
  });

  it("uses country fallback for a wildcard-only browser preference", () => {
    expect(detectPreferredLanguage({ acceptLanguage: "*", countryCode: "UA" })).toBe("uk");
  });

  it("falls back to country or English when all supported browser languages have q=0", () => {
    expect(detectPreferredLanguage({ acceptLanguage: "ru;q=0, uk-UA;q=0, de;q=0, en;q=0, zh-Hant;q=0", countryCode: "UA" })).toBe("uk");
    expect(detectPreferredLanguage({ acceptLanguage: "ru;q=0, uk-UA;q=0, de;q=0, en;q=0, zh-Hant;q=0", countryCode: "FR" })).toBe("en");
  });

  it("selects a supported language after higher-ranked entries are malformed or unsupported", () => {
    expect(detectPreferredLanguage({ acceptLanguage: "fr-FR;q=1, de;q=abc, uk-UA;q=0.4" })).toBe("uk");
  });

  it("uses the country hint only when there is no supported browser preference", () => {
    expect(detectPreferredLanguage({ acceptLanguage: "fr-FR", countryCode: "UA" })).toBe("uk");
    expect(detectPreferredLanguage({ countryCode: "DE" })).toBe("de");
  });

  it("defaults to English when there is no supported preference or country hint", () => {
    expect(detectPreferredLanguage({ acceptLanguage: "fr-FR", countryCode: "FR" })).toBe("en");
  });
});
