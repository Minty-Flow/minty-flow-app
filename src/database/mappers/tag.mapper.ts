import { getThemeStrict } from "~/styles/theme/registry"
import type { Tag, TagKindType } from "~/types/tags"

import type { RowTag } from "../types/rows"

export function mapTag(row: RowTag): Omit<Tag, "transactionCount"> {
  return {
    id: row.id,
    name: row.name,
    type: row.type as TagKindType,
    icon: row.icon,
    colorSchemeName: row.color_scheme_name,
    colorScheme: getThemeStrict(row.color_scheme_name),
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}
