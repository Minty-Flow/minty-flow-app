import { getThemeStrict } from "~/styles/theme/registry"
import type { Budget, BudgetPeriod } from "~/types/budgets"

import type { RowBudget } from "../types/rows"

export function mapBudget(
  row: RowBudget,
  accountIds: string[],
  categoryIds: string[],
): Budget {
  return {
    id: row.id,
    name: row.name,
    amount: row.amount,
    currencyCode: row.currency_code,
    period: row.period as BudgetPeriod,
    startDate: new Date(row.start_date),
    endDate: row.end_date != null ? new Date(row.end_date) : null,
    alertThreshold: row.alert_threshold,
    isActive: !!row.is_active,
    icon: row.icon,
    colorSchemeName: row.color_scheme_name,
    colorScheme: getThemeStrict(row.color_scheme_name),
    accountIds,
    categoryIds,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}
