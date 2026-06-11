import { getThemeStrict } from "~/styles/theme/registry"
import type { Goal, GoalType } from "~/types/goals"

import type { RowGoal } from "../types/rows"

export function mapGoal(row: RowGoal, accountIds: string[]): Goal {
  return {
    id: row.id,
    name: row.name,
    goalType: (row.goal_type || "savings") as GoalType,
    description: row.description,
    targetAmount: row.target_amount,
    currencyCode: row.currency_code,
    targetDate: row.target_date != null ? new Date(row.target_date) : null,
    icon: row.icon,
    colorSchemeName: row.color_scheme_name,
    colorScheme: getThemeStrict(row.color_scheme_name),
    isArchived: !!row.is_archived,
    accountIds,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}
