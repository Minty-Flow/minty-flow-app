import { useAccountsQuery } from "~/database/drizzle/hooks/use-accounts-query"
import type { Account } from "~/types/accounts"

export function useAccounts(): Account[] {
  return useAccountsQuery().data
}

export function useActiveAccounts(): Account[] {
  return useAccounts().filter((account) => !account.isArchived)
}

export function useArchivedAccounts(): Account[] {
  return useAccounts().filter((account) => account.isArchived)
}

export function useAccount(id: string): Account | undefined {
  return useAccounts().find((account) => account.id === id)
}
