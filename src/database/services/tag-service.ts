import { count, eq } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import { tags, transactionTags } from "~/database/drizzle/schema"
import { runInTransaction } from "~/database/transaction"
import { generateId } from "~/database/utils/generate-id"
import type { AddTagsFormSchema } from "~/schemas/tags.schema"

export async function createTag(data: AddTagsFormSchema): Promise<string> {
  const id = generateId()
  const now = new Date().toISOString()

  await runInTransaction("tag.create", (db) => {
    db.insert(tags)
      .values({
        id,
        name: data.name,
        type: data.type,
        icon: data.icon ?? null,
        colorSchemeName: data.colorSchemeName ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .run()
  })
  return id
}

export async function updateTagById(
  id: string,
  data: Partial<AddTagsFormSchema>,
): Promise<void> {
  const now = new Date().toISOString()

  await runInTransaction("tag.update", (db) => {
    db.update(tags)
      .set({
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.icon !== undefined ? { icon: data.icon ?? null } : {}),
        ...(data.colorSchemeName !== undefined
          ? { colorSchemeName: data.colorSchemeName ?? null }
          : {}),
        updatedAt: now,
      })
      .where(eq(tags.id, id))
      .run()
  })
}

export async function deleteTagById(id: string): Promise<void> {
  await runInTransaction("tag.delete", (db) => {
    db.delete(transactionTags).where(eq(transactionTags.tagId, id)).run()
    db.delete(tags).where(eq(tags.id, id)).run()
  })
}

export async function getTagTransactionCounts(): Promise<Map<string, number>> {
  const rows = drizzleDb
    .select({ tagId: transactionTags.tagId, cnt: count() })
    .from(transactionTags)
    .groupBy(transactionTags.tagId)
    .all()
  const map = new Map<string, number>()
  for (const row of rows) {
    map.set(row.tagId, row.cnt)
  }
  return map
}
