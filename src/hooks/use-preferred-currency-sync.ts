import { useEffect } from "react"

import { useActiveAccounts } from "~/database/drizzle/read-models/account-read-model"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"

/**
 * The preferred currency follows the default (primary) account: choosing a
 * default account makes its currency the one used wherever no account is
 * picked yet (summary cards, the bill splitter, new onboarding accounts).
 * With no primary account the stored value stays as it was.
 */
export function usePreferredCurrencySync(): void {
  const primaryCurrency = useActiveAccounts().find(
    (account) => account.isPrimary,
  )?.currencyCode
  const preferredCurrency = useMoneyFormattingStore((s) => s.preferredCurrency)
  const setCurrency = useMoneyFormattingStore((s) => s.setCurrency)

  useEffect(() => {
    if (primaryCurrency && primaryCurrency !== preferredCurrency) {
      setCurrency(primaryCurrency)
    }
  }, [primaryCurrency, preferredCurrency, setCurrency])
}
