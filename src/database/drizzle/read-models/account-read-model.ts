import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { toAccount } from "~/database/mappers/account.mapper"
import type { Account } from "~/types/accounts"

import { drizzleDb } from "../db"
import { accounts } from "../schema"
import {
  createLiveReadModelResult,
  type LiveReadModelResult,
} from "./entity-read-model"

export function useAccountsQuery(): LiveReadModelResult<Account[]> {
  const result = useLiveQuery(
    drizzleDb
      .select()
      .from(accounts)
      .orderBy(accounts.sortOrder, accounts.createdAt),
  )

  const data = result.data.map(toAccount)

  return createLiveReadModelResult(data, [result])
}

export function useAccounts(): Account[] {
  return useAccountsQuery().data
}

export function useActiveAccounts(): Account[] {
  return useAccounts().filter((account) => !account.isArchived)
}

/**
 * Active accounts plus any archived account the edited row still points at.
 * A form needs the row's own account even when archived: without it the
 * currency falls back to the default and the amount is off by 10^n.
 */
export function useActiveAccountsWith(
  ...ids: (string | null | undefined)[]
): Account[] {
  return useAccounts().filter(
    (account) => !account.isArchived || ids.includes(account.id),
  )
}

export function useActiveAccountsQuery(): LiveReadModelResult<Account[]> {
  const result = useAccountsQuery()
  return {
    ...result,
    data: result.data.filter((account) => !account.isArchived),
  }
}

export function useAccount(id: string): Account | undefined {
  return useAccounts().find((account) => account.id === id)
}
