import { query } from "../sql"
import type { RowCategory } from "../types/rows"

export async function getAllCategories(): Promise<RowCategory[]> {
  return query<RowCategory>(`SELECT * FROM categories ORDER BY name ASC`)
}

// export async function getCategoryById(id: string): Promise<RowCategory | null> {
//   return queryOne<RowCategory>(`SELECT * FROM categories WHERE id = ?`, [id])
// }
