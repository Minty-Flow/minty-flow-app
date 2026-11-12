import type { Account } from "~/types/accounts"

export interface CurrencyBalance {
  currency: string
  balance: number
}

/**
 * The user's total balance, one entry per currency in first-seen order.
 * Accounts marked `excludeFromBalance` do not count.
 */
export function getBalancesByCurrency(
  accounts: Pick<Account, "balance" | "currencyCode" | "excludeFromBalance">[],
): CurrencyBalance[] {
  const result: CurrencyBalance[] = []
  for (const account of accounts) {
    if (account.excludeFromBalance) continue
    const existing = result.find(
      (item) => item.currency === account.currencyCode,
    )
    if (existing) existing.balance += account.balance
    else
      result.push({ currency: account.currencyCode, balance: account.balance })
  }
  return result
}
