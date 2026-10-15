import { Language } from "@/locales/translations";

const COUNTRY_TO_LANG: Record<string, Language> = {
  RU: "ru",
  BY: "ru",
  KZ: "ru",
  KG: "ru",
  TJ: "ru",
  UZ: "ru",
  AM: "ru",
  AZ: "ru",
  DE: "de",
  AT: "de",
  CH: "de",
  LI: "de",
  LU: "de",
  UA: "uk",
  TW: "zh-Hant",
  HK: "zh-Hant",
  MO: "zh-Hant",
};

function normalizeLanguageTag(value: string): Language | null {
  const normalized = value.trim().toLowerCase().replace(/_/g, "-");
  const [language, ...subtags] = normalized.split("-");
  if (language === "en" || language === "ru" || language === "uk" || language === "de") {
    return language;
  }

  if (
    language === "zh" &&
    (subtags.includes("hant") || subtags.some((subtag) => ["tw", "hk", "mo"].includes(subtag)))
  ) {
    return "zh-Hant";
  }
  return null;
}

function parseAcceptLanguage(value: string): Array<{ languageTag: string; quality: number; order: number }> {
  return value
    .split(",")
    .map((preference, order) => {
      const [languageTag, ...parameters] = preference.trim().split(";");
      const qualityParameter = parameters.find((parameter) => /^\s*q\s*=/i.test(parameter));
      const qualityValue = qualityParameter?.split("=")[1]?.trim();
      const quality = qualityValue === undefined ? 1 : Number(qualityValue);

      return { languageTag, quality, order };
    })
    .filter(({ languageTag, quality }) => languageTag && Number.isFinite(quality) && quality > 0 && quality <= 1)
    .sort((a, b) => b.quality - a.quality || a.order - b.order);
}

export function detectPreferredLanguage(input: {
  cookieLang?: string | null;
  countryCode?: string | null;
  acceptLanguage?: string | null;
}): Language {
  const fromCookie = normalizeLanguageTag(input.cookieLang || "");
  if (fromCookie) {
    return fromCookie;
  }

  for (const preference of parseAcceptLanguage(input.acceptLanguage || "")) {
    const language = normalizeLanguageTag(preference.languageTag);
    if (language) {
      return language;
    }
  }

  const countryCode = (input.countryCode || "").trim().toUpperCase();
  if (countryCode && COUNTRY_TO_LANG[countryCode]) {
    return COUNTRY_TO_LANG[countryCode];
  }

  return "en";
}
