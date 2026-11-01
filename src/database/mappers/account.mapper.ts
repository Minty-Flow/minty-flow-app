import { getThemeStrict } from "~/styles/theme/registry"
import type { Account, AccountType } from "~/types/accounts"

import type { RowAccount } from "../types/rows"

/** The same account in either column naming: raw SQL rows or drizzle rows. */
interface AccountFields {
  id: string
  name: string
  type: string
  balance: number
  currencyCode: string
  icon: string | null
  colorSchemeName: string | null
  isPrimary: number | boolean
  excludeFromBalance: number | boolean
  isArchived: number | boolean
  sortOrder: number | null
  createdAt: string
  updatedAt: string
}

export function toAccount(row: AccountFields): Account {
  return {
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
  }
}

export function mapAccount(row: RowAccount): Account {
  return toAccount({
    id: row.id,
    name: row.name,
    type: row.type,
    balance: row.balance,
    currencyCode: row.currency_code,
    icon: row.icon,
    colorSchemeName: row.color_scheme_name,
    isPrimary: row.is_primary,
    excludeFromBalance: row.exclude_from_balance,
    isArchived: row.is_archived,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  })
}
