import { emit } from "~/database/events"
import { query } from "~/database/sql"
import { runInTransaction } from "~/database/transaction"
import { generateId } from "~/database/utils/generate-id"
import type { AddTagsFormSchema } from "~/schemas/tags.schema"

export async function createTag(data: AddTagsFormSchema): Promise<string> {
  const id = generateId()
  const now = new Date().toISOString()

  await runInTransaction("tag.create", async (db) => {
    await db.runAsync(
      `INSERT INTO tags (id, name, type, icon, color_scheme_name, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.name,
        data.type,
        data.icon ?? null,
        data.colorSchemeName ?? null,
        now,
        now,
      ],
    )
  })

  emit("tags:dirty", undefined)
  return id
}

export async function updateTagById(
  id: string,
  data: Partial<AddTagsFormSchema>,
): Promise<void> {
  const now = new Date().toISOString()

  await runInTransaction("tag.update", async (db) => {
    await db.runAsync(
      `UPDATE tags SET
        name = COALESCE(?, name),
        type = COALESCE(?, type),
        icon = CASE WHEN ? THEN ? ELSE icon END,
        color_scheme_name = CASE WHEN ? THEN ? ELSE color_scheme_name END,
        updated_at = ?
       WHERE id = ?`,
      [
        data.name ?? null,
        data.type ?? null,
        data.icon !== undefined ? 1 : 0,
        data.icon ?? null,
        data.colorSchemeName !== undefined ? 1 : 0,
        data.colorSchemeName ?? null,
        now,
        id,
      ],
    )
  })

  emit("tags:dirty", undefined)
}

export async function deleteTagById(id: string): Promise<void> {
  await runInTransaction("tag.delete", async (db) => {
    await db.runAsync(`DELETE FROM transaction_tags WHERE tag_id = ?`, [id])
    await db.runAsync(`DELETE FROM tags WHERE id = ?`, [id])
  })

  emit("tags:dirty", undefined)
  emit("transactions:dirty", {})
}

export async function getTagTransactionCounts(): Promise<Map<string, number>> {
  const rows = await query<{ tag_id: string; cnt: number }>(
    `SELECT tag_id, COUNT(*) as cnt FROM transaction_tags GROUP BY tag_id`,
  )
  const map = new Map<string, number>()
  for (const row of rows) {
    map.set(row.tag_id, row.cnt)
  }
  return map
}
