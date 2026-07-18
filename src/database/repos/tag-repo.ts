import { query } from "../sql"
import type { RowTag } from "../types/rows"

export async function getAllTags(): Promise<RowTag[]> {
  return query<RowTag>(`SELECT * FROM tags ORDER BY name ASC`)
}
