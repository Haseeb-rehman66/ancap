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
      const [rawLanguageTag, ...parameters] = preference.trim().split(";");
      const languageTag = rawLanguageTag.trim();
      let quality = 1;

      if (parameters.length > 1) {
        return { languageTag, quality: 0, order };
      }

      if (parameters.length === 1) {
        const qualityParameter = parameters[0].trim().match(/^q\s*=\s*(.*?)$/i);
        const qualityValue = qualityParameter?.[1].trim();
        if (!qualityValue || !/^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(qualityValue)) {
          return { languageTag, quality: 0, order };
        }
        quality = Number(qualityValue);
      }

      return { languageTag, quality, order };
    })
    .filter(({ languageTag, quality }) => languageTag && languageTag !== "*" && quality > 0)
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
