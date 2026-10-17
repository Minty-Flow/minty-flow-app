import type { Account } from "~/types/accounts"

export interface CurrencyAccountSelectorProps {
  accounts: Account[]
  selectedCurrency: string | null
  selectedAccountIds: string[]
  onCurrencyChange: (currency: string) => void
  onAccountIdsChange: (ids: string[]) => void
}

export interface CurrencyItem {
  code: string
  accountCount: number
}
