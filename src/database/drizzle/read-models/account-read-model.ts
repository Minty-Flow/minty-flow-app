import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { getThemeStrict } from "~/styles/theme/registry"
import type { Account, AccountType } from "~/types/accounts"

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

  const data = result.data.map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type as AccountType,
    balance: row.balance,
    currencyCode: row.currencyCode,
    icon: row.icon,
    colorSchemeName: row.colorSchemeName,
    colorScheme: getThemeStrict(row.colorSchemeName),
    isPrimary: !!row.isPrimary,
    excludeFromBalance: !!row.excludeFromBalance,
    isArchived: !!row.isArchived,
    sortOrder: row.sortOrder,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  }))

  return createLiveReadModelResult(data, [result])
}

export function useAccounts(): Account[] {
  return useAccountsQuery().data
}

export function useActiveAccounts(): Account[] {
  return useAccounts().filter((account) => !account.isArchived)
}

export function useActiveAccountsQuery(): LiveReadModelResult<Account[]> {
  const result = useAccountsQuery()
  return {
    ...result,
    data: result.data.filter((account) => !account.isArchived),
  }
}

export function useArchivedAccounts(): Account[] {
  return useAccounts().filter((account) => account.isArchived)
}

export function useArchivedAccountsQuery(): LiveReadModelResult<Account[]> {
  const result = useAccountsQuery()
  return {
    ...result,
    data: result.data.filter((account) => account.isArchived),
  }
}

export function useAccount(id: string): Account | undefined {
  return useAccounts().find((account) => account.id === id)
}
