import { getThemeStrict } from "~/styles/theme/registry"
import type { Account, AccountType } from "~/types/accounts"

import type { RowAccount } from "../types/rows"

export function mapAccount(row: RowAccount): Account {
  return {
    id: row.id,
    name: row.name,
    type: row.type as AccountType,
    balance: row.balance,
    currencyCode: row.currency_code,
    icon: row.icon,
    colorSchemeName: row.color_scheme_name,
    colorScheme: getThemeStrict(row.color_scheme_name),
    isPrimary: !!row.is_primary,
    excludeFromBalance: !!row.exclude_from_balance,
    isArchived: !!row.is_archived,
    sortOrder: row.sort_order,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}
