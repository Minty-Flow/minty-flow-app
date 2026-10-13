export type TransferRateCheck =
  | { ok: true; conversionRate: number | null }
  | { ok: false; reason: "loading" | "missing" }

/**
 * Decide whether a transfer can be saved, and which conversion rate to send.
 *
 * A rate of exactly 1 is a real rate (pegged pairs such as BMD/USD), so only
 * `isLoading` says a rate is still on its way, never the value 1.
 */
export function checkTransferRate({
  differentCurrencies,
  conversionRate,
  isLoading,
}: {
  differentCurrencies: boolean
  conversionRate: number | null
  isLoading: boolean
}): TransferRateCheck {
  if (!differentCurrencies) return { ok: true, conversionRate: null }
  if (conversionRate != null && conversionRate > 0) {
    return { ok: true, conversionRate }
  }
  return { ok: false, reason: isLoading ? "loading" : "missing" }
}
