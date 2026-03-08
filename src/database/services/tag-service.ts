import { Q } from "@nozbe/watermelondb"
import type { Observable } from "@nozbe/watermelondb/utils/rx"
import { map } from "rxjs/operators"

import type { Tag, TagKindType } from "../../types/tags"
import { database } from "../index"
import type TagModel from "../models/tag"
import { modelToTag } from "../utils/model-to-tag"
import { unlinkTagFromAllTransactions } from "./transaction-service"

/**
 * Tag Service
 *
 * Provides functions for managing tag data.
 * Follows WatermelonDB CRUD pattern: https://watermelondb.dev/docs/CRUD
 */

/**
 * Get the tags collection
 */
const getTagCollection = () => {
  return database.get<TagModel>("tags")
}

/**
 * Get all tags
 */
export const getTags = async (): Promise<TagModel[]> => {
  const tags = getTagCollection()
  return await tags.query().fetch()
}

/**
 * Find a tag by ID
 */
export const findTag = async (id: string): Promise<TagModel | null> => {
  try {
    return await getTagCollection().find(id)
  } catch {
    return null
  }
}

/**
 * Find a tag by name (first match). Used e.g. for recurring extension tags.
 */
export const findTagByName = async (name: string): Promise<TagModel | null> => {
  const rows = await getTagCollection().query(Q.where("name", name)).fetch()
  return rows[0] ?? null
}

/**
 * Observe all tags reactively
 */
export const observeTags = (): Observable<Tag[]> => {
  const tags = getTagCollection()
  return tags
    .query(Q.sortBy("name", Q.asc))
    .observeWithColumns([
      "name",
      "type",
      "color_scheme_name",
      "icon",
      "transaction_count",
    ])
    .pipe(
      map((results) => {
        return results.map(modelToTag) // convert to immutable plain object here
      }),
    )
}

/**
 * Observe a specific tag by ID
 */
export const observeTagById = (id: string): Observable<TagModel> => {
  return getTagCollection().findAndObserve(id)
}

/**
 * Create a new tag
 */
export const createTag = async (data: {
  name: string
  type: TagKindType
  colorSchemeName?: string | null
  icon?: string | null
}): Promise<TagModel> => {
  return await database.write(async () => {
    return await getTagCollection().create((tag) => {
      tag.name = data.name
      tag.type = data.type
      tag.colorSchemeName = data.colorSchemeName ?? null
      tag.icon = data.icon ?? null
      tag.transactionCount = 0
      tag.createdAt = new Date()
      tag.updatedAt = new Date()
    })
  })
}

/**
 * Update tag
 */
export const updateTag = async (
  tag: TagModel,
  updates: Partial<{
    name: string
    type: TagKindType
    colorSchemeName: string | null | undefined
    icon: string | null | undefined
    transactionCount: number
  }>,
): Promise<TagModel> => {
  return await database.write(async () => {
    return await tag.update((t) => {
      if (updates.name !== undefined) t.name = updates.name
      if (updates.type !== undefined) t.type = updates.type
      if (updates.colorSchemeName !== undefined)
        t.colorSchemeName = updates.colorSchemeName ?? null
      if (updates.icon !== undefined) t.icon = updates.icon ?? null
      if (updates.transactionCount !== undefined)
        t.transactionCount = updates.transactionCount
      t.updatedAt = new Date()
    })
  })
}

/**
 * Update tag by ID
 */
export const updateTagById = async (
  id: string,
  updates: Partial<{
    name: string
    type: TagKindType
    colorSchemeName: string | null | undefined
    icon: string | null | undefined
    transactionCount: number
  }>,
): Promise<TagModel> => {
  const tag = await findTag(id).then((tag) => {
    if (!tag) {
      throw new Error(`Tag with id ${id} not found`)
    }
    return tag
  })
  return await updateTag(tag, updates)
}

/**
 * Delete tag permanently.
 * Unlinks this tag from all transactions first, then permanently destroys the tag.
 */
export const deleteTag = async (tag: TagModel): Promise<void> => {
  await unlinkTagFromAllTransactions(tag.id).then(() => {
    return database.write(async () => {
      await tag.destroyPermanently()
    })
  })
}

/**
 * Permanently destroy tag (same as deleteTag).
 * Unlinks this tag from all transactions first, then permanently destroys the tag.
 */
export const destroyTag = async (tag: TagModel): Promise<void> => {
  await deleteTag(tag)
}
