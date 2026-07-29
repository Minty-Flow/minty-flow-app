import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { getThemeStrict } from "~/styles/theme/registry"
import type { Account, AccountType } from "~/types/accounts"

import { drizzleDb } from "../db"
import { accounts } from "../schema"

export function useAccountsQuery(): {
  data: Account[]
  error: Error | undefined
  updatedAt: Date | undefined
} {
  const result = useLiveQuery(
    drizzleDb
      .select()
      .from(accounts)
      .orderBy(accounts.sortOrder, accounts.createdAt),
  )

  return {
    data: result.data.map((row) => ({
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
    })),
    error: result.error,
    updatedAt: result.updatedAt,
  }
}
