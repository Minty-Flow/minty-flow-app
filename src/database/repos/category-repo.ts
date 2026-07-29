import { asc } from "drizzle-orm"

import { drizzleDb } from "../drizzle/db"
import { categories } from "../drizzle/schema"
import type { RowCategory } from "../types/rows"

export async function getAllCategories(): Promise<RowCategory[]> {
  return drizzleDb
    .select({
      id: categories.id,
      name: categories.name,
      type: categories.type,
      icon: categories.icon,
      color_scheme_name: categories.colorSchemeName,
      created_at: categories.createdAt,
      updated_at: categories.updatedAt,
    })
    .from(categories)
    .orderBy(asc(categories.name))
    .all()
}
