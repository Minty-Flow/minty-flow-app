import { query } from "../sql"
import type { RowCategory } from "../types/rows"

export async function getAllCategories(): Promise<RowCategory[]> {
  return query<RowCategory>(`SELECT * FROM categories ORDER BY name ASC`)
}
