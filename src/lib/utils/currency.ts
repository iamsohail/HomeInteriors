// Map project city to currency + locale based on the flat/apartment location
const CITY_CURRENCY: Record<string, { locale: string; currency: string }> = {
  // India
  bangalore: { locale: "en-IN", currency: "INR" },
  mumbai: { locale: "en-IN", currency: "INR" },
  delhi: { locale: "en-IN", currency: "INR" },
  hyderabad: { locale: "en-IN", currency: "INR" },
  chennai: { locale: "en-IN", currency: "INR" },
  pune: { locale: "en-IN", currency: "INR" },
  kolkata: { locale: "en-IN", currency: "INR" },
  ahmedabad: { locale: "en-IN", currency: "INR" },
  jaipur: { locale: "en-IN", currency: "INR" },
  lucknow: { locale: "en-IN", currency: "INR" },
  kochi: { locale: "en-IN", currency: "INR" },
  gurgaon: { locale: "en-IN", currency: "INR" },
  noida: { locale: "en-IN", currency: "INR" },
  goa: { locale: "en-IN", currency: "INR" },
  chandigarh: { locale: "en-IN", currency: "INR" },
  "delhi ncr": { locale: "en-IN", currency: "INR" },
  other: { locale: "en-IN", currency: "INR" },
  // US
  "new york": { locale: "en-US", currency: "USD" },
  "los angeles": { locale: "en-US", currency: "USD" },
  chicago: { locale: "en-US", currency: "USD" },
  houston: { locale: "en-US", currency: "USD" },
  "san francisco": { locale: "en-US", currency: "USD" },
  seattle: { locale: "en-US", currency: "USD" },
  austin: { locale: "en-US", currency: "USD" },
  // UK
  london: { locale: "en-GB", currency: "GBP" },
  manchester: { locale: "en-GB", currency: "GBP" },
  birmingham: { locale: "en-GB", currency: "GBP" },
  // Europe
  berlin: { locale: "de-DE", currency: "EUR" },
  paris: { locale: "fr-FR", currency: "EUR" },
  amsterdam: { locale: "nl-NL", currency: "EUR" },
  madrid: { locale: "es-ES", currency: "EUR" },
  rome: { locale: "it-IT", currency: "EUR" },
  // Asia
  singapore: { locale: "en-SG", currency: "SGD" },
  dubai: { locale: "en-AE", currency: "AED" },
  "abu dhabi": { locale: "en-AE", currency: "AED" },
  tokyo: { locale: "ja-JP", currency: "JPY" },
  sydney: { locale: "en-AU", currency: "AUD" },
  melbourne: { locale: "en-AU", currency: "AUD" },
  toronto: { locale: "en-CA", currency: "CAD" },
  vancouver: { locale: "en-CA", currency: "CAD" },
  "kuala lumpur": { locale: "ms-MY", currency: "MYR" },
  bangkok: { locale: "th-TH", currency: "THB" },
  jakarta: { locale: "id-ID", currency: "IDR" },
  "ho chi minh": { locale: "vi-VN", currency: "VND" },
  manila: { locale: "en-PH", currency: "PHP" },
  dhaka: { locale: "bn-BD", currency: "BDT" },
  karachi: { locale: "en-PK", currency: "PKR" },
  lahore: { locale: "en-PK", currency: "PKR" },
  colombo: { locale: "en-LK", currency: "LKR" },
  riyadh: { locale: "ar-SA", currency: "SAR" },
  doha: { locale: "ar-QA", currency: "QAR" },
};

// Fallback: try matching country name within city string
const COUNTRY_CURRENCY: Record<string, { locale: string; currency: string }> = {
  india: { locale: "en-IN", currency: "INR" },
  usa: { locale: "en-US", currency: "USD" },
  "united states": { locale: "en-US", currency: "USD" },
  uk: { locale: "en-GB", currency: "GBP" },
  "united kingdom": { locale: "en-GB", currency: "GBP" },
  germany: { locale: "de-DE", currency: "EUR" },
  france: { locale: "fr-FR", currency: "EUR" },
  australia: { locale: "en-AU", currency: "AUD" },
  canada: { locale: "en-CA", currency: "CAD" },
  japan: { locale: "ja-JP", currency: "JPY" },
  singapore: { locale: "en-SG", currency: "SGD" },
  uae: { locale: "en-AE", currency: "AED" },
};

// Default to INR since the app's primary audience is India
const DEFAULT = { locale: "en-IN", currency: "INR" };

function resolveCurrency(city: string): { locale: string; currency: string } {
  const lower = city.toLowerCase().trim();

  // Exact city match
  if (CITY_CURRENCY[lower]) return CITY_CURRENCY[lower];

  // Partial city match (e.g., "Bangalore, India" → matches "bangalore")
  for (const [key, val] of Object.entries(CITY_CURRENCY)) {
    if (lower.includes(key)) return val;
  }

  // Country fallback
  for (const [key, val] of Object.entries(COUNTRY_CURRENCY)) {
    if (lower.includes(key)) return val;
  }

  // Browser locale fallback
  if (typeof navigator !== "undefined") {
    const region = (navigator.language || "").split("-")[1]?.toUpperCase();
    const regionMap: Record<string, { locale: string; currency: string }> = {
      IN: { locale: "en-IN", currency: "INR" },
      US: DEFAULT,
      GB: { locale: "en-GB", currency: "GBP" },
      AU: { locale: "en-AU", currency: "AUD" },
      CA: { locale: "en-CA", currency: "CAD" },
    };
    if (region && regionMap[region]) return regionMap[region];
  }

  return DEFAULT;
}

// Cached formatters per city
const fmtCache = new Map<string, Intl.NumberFormat>();
const fmtCompactCache = new Map<string, Intl.NumberFormat>();

function getFmt(city: string): Intl.NumberFormat {
  if (!fmtCache.has(city)) {
    const { locale, currency } = resolveCurrency(city);
    fmtCache.set(
      city,
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      })
    );
  }
  return fmtCache.get(city)!;
}

function getFmtCompact(city: string): Intl.NumberFormat {
  if (!fmtCompactCache.has(city)) {
    const { locale, currency } = resolveCurrency(city);
    fmtCompactCache.set(
      city,
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        notation: "compact",
        maximumFractionDigits: 1,
      })
    );
  }
  return fmtCompactCache.get(city)!;
}

export function formatCurrency(amount: number, city = ""): string {
  return getFmt(city).format(amount);
}

export function formatCurrencyCompact(amount: number, city = ""): string {
  return getFmtCompact(city).format(amount);
}

export function parseCurrencyInput(value: string): number {
  return Number(value.replace(/[^0-9.-]/g, "")) || 0;
}

// Format a number with locale-appropriate grouping (e.g., 15,00,000 for India, 1,500,000 for US)
const numFmtCache = new Map<string, Intl.NumberFormat>();

export function formatNumber(amount: number, city = ""): string {
  if (!numFmtCache.has(city)) {
    const { locale } = resolveCurrency(city);
    numFmtCache.set(city, new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }));
  }
  return numFmtCache.get(city)!.format(amount);
}

export function getCurrencySymbol(city = ""): string {
  const { locale, currency } = resolveCurrency(city);
  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).formatToParts(0);
  return parts.find((p) => p.type === "currency")?.value || "$";
}
