import type { Account } from "~/types/accounts"

export interface CurrencyAccountSelectorProps {
  accounts: Account[]
  selectedCurrency: string | null
  selectedAccountIds: string[]
  onCurrencyChange: (currency: string) => void
  onAccountIdsChange: (ids: string[]) => void
  /** The currency can no longer change (something depends on it). */
  currencyLocked?: boolean
}

export interface CurrencyItem {
  code: string
  accountCount: number
}
