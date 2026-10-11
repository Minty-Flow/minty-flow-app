import { count, sql } from "drizzle-orm"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { getThemeStrict } from "~/styles/theme/registry"
import type { Tag, TagKindType } from "~/types/tags"

import { drizzleDb } from "../db"
import { tags, transactionTags } from "../schema"
import {
  createLiveReadModelResult,
  type LiveReadModelResult,
} from "./entity-read-model"

/**
 * `withCounts` fills `transactionCount`. Off by default because the count
 * query re-runs on every tag link write; enable it only where the count is
 * shown or checked (delete warning). Without it `transactionCount` is 0.
 */
export function useTagsQuery(withCounts = false): LiveReadModelResult<Tag[]> {
  const tagsResult = useLiveQuery(
    drizzleDb.select().from(tags).orderBy(tags.name),
  )
  const countsResult = useLiveQuery(
    drizzleDb
      .select({
        tagId: transactionTags.tagId,
        count: count(),
      })
      .from(transactionTags)
      .where(withCounts ? undefined : sql`1 = 0`)
      .groupBy(transactionTags.tagId),
    [withCounts],
  )
  const counts = new Map(countsResult.data.map((row) => [row.tagId, row.count]))

  const data = tagsResult.data.map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type as TagKindType,
    icon: row.icon,
    colorSchemeName: row.colorSchemeName,
    colorScheme: getThemeStrict(row.colorSchemeName),
    transactionCount: counts.get(row.id) ?? 0,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  }))

  return createLiveReadModelResult(data, [tagsResult, countsResult])
}

export function useTags(withCounts = false): Tag[] {
  return useTagsQuery(withCounts).data
}
