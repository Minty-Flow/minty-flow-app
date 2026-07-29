import { asc } from "drizzle-orm"

import { drizzleDb } from "../drizzle/db"
import { accounts } from "../drizzle/schema"
import type { RowAccount } from "../types/rows"

export async function getAllAccounts(): Promise<RowAccount[]> {
  return drizzleDb
    .select({
      id: accounts.id,
      name: accounts.name,
      type: accounts.type,
      balance: accounts.balance,
      currency_code: accounts.currencyCode,
      icon: accounts.icon,
      color_scheme_name: accounts.colorSchemeName,
      is_primary: accounts.isPrimary,
      exclude_from_balance: accounts.excludeFromBalance,
      is_archived: accounts.isArchived,
      sort_order: accounts.sortOrder,
      created_at: accounts.createdAt,
      updated_at: accounts.updatedAt,
    })
    .from(accounts)
    .orderBy(asc(accounts.sortOrder), asc(accounts.createdAt))
    .all()
}
