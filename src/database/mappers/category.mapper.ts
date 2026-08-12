import { getThemeStrict } from "~/styles/theme/registry"
import type { Category, CategoryType } from "~/types/categories"

import type { RowCategory } from "../types/rows"

export function mapCategory(
  row: RowCategory,
): Omit<Category, "transactionCount"> {
  return {
    id: row.id,
    name: row.name,
    type: row.type as CategoryType,
    icon: row.icon,
    colorSchemeName: row.color_scheme_name,
    colorScheme: getThemeStrict(row.color_scheme_name),
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}
