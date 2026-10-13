/**
 * Where exchange rates come from, and how each source's response is read.
 *
 * Source order: open.er-api.com first, then the fawazahmed0 currency API (two
 * mirrors). The fawazahmed0 feed still quotes the Syrian pound in old units
 * (about 13,000 per USD; the pound lost two zeros on 1 January 2026, so a USD
 * is now about 130), so its `syp` rate is never used. open.er-api.com has the
 * new scale but no crypto and a few ISO codes, so fawazahmed0 fills the gaps.
 *
 * Pure functions only: no network, no app state.
 */

export interface SourceRates {
  /** `YYYY-MM-DD`. */
  date: string
  /** Lowercase currency code to units of that currency per 1 base unit. */
  rates: Record<string, number>
}

export interface RateSource {
  name: string
  url: (baseCurrency: string) => string
  parse: (json: unknown, baseCurrency: string) => SourceRates | null
}

/** Currencies whose rate a source quotes on the wrong scale. */
const UNTRUSTED_FAWAZ_CODES = ["syp"]

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

/** Keep only finite, positive numbers, with lowercase keys. */
function cleanRates(
  raw: Record<string, unknown>,
  skip: readonly string[] = [],
): Record<string, number> {
  const rates: Record<string, number> = {}
  for (const [code, value] of Object.entries(raw)) {
    const key = code.trim().toLowerCase()
    if (skip.includes(key)) continue
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      rates[key] = value
    }
  }
  return rates
}

const today = (): string => new Date().toISOString().split("T")[0] ?? ""

export function parseOpenErApi(json: unknown): SourceRates | null {
  // The API answers HTTP 200 with `result: "error"` for an unsupported code.
  if (!isRecord(json) || json.result !== "success") return null
  if (!isRecord(json.rates)) return null

  const updated = json.time_last_update_unix
  return {
    date:
      typeof updated === "number"
        ? (new Date(updated * 1000).toISOString().split("T")[0] ?? today())
        : today(),
    rates: cleanRates(json.rates),
  }
}

export function parseFawaz(
  json: unknown,
  baseCurrency: string,
): SourceRates | null {
  const base = baseCurrency.trim().toLowerCase()
  // Rates quoted per old Syrian pound are on the wrong scale for every code.
  if (UNTRUSTED_FAWAZ_CODES.includes(base)) return null
  if (!isRecord(json) || !isRecord(json[base])) return null

  return {
    date: typeof json.date === "string" ? json.date : today(),
    rates: cleanRates(json[base], UNTRUSTED_FAWAZ_CODES),
  }
}

export const OPEN_ER_API: RateSource = {
  name: "open.er-api.com",
  url: (base) => `https://open.er-api.com/v6/latest/${base.toUpperCase()}`,
  parse: (json) => parseOpenErApi(json),
}

export const FAWAZ_JSDELIVR: RateSource = {
  name: "fawazahmed0 (jsDelivr)",
  url: (base) =>
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base.toLowerCase()}.min.json`,
  parse: parseFawaz,
}

export const FAWAZ_PAGES: RateSource = {
  name: "fawazahmed0 (pages.dev)",
  url: (base) =>
    `https://latest.currency-api.pages.dev/v1/currencies/${base.toLowerCase()}.min.json`,
  parse: parseFawaz,
}

/** Primary source, then fallbacks in order. */
export const RATE_SOURCES: readonly RateSource[] = [
  OPEN_ER_API,
  FAWAZ_JSDELIVR,
  FAWAZ_PAGES,
]

/** The fallback sources that can fill gaps in the primary one. */
export const GAP_FILL_SOURCES: readonly RateSource[] = [
  FAWAZ_JSDELIVR,
  FAWAZ_PAGES,
]

/**
 * Add the codes `primary` lacks (crypto, a few ISO codes) from `extra`. A rate
 * the primary has is never replaced.
 */
export function fillMissingRates(
  primary: SourceRates,
  extra: SourceRates | null,
): SourceRates {
  if (!extra) return primary
  return { ...primary, rates: { ...extra.rates, ...primary.rates } }
}
