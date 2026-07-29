import { count } from "drizzle-orm"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { getThemeStrict } from "~/styles/theme/registry"
import type { Tag, TagKindType } from "~/types/tags"

import { drizzleDb } from "../db"
import { tags, transactionTags } from "../schema"

export function useTagsQuery(): {
  data: Tag[]
  error: Error | undefined
  updatedAt: Date | undefined
} {
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
      .groupBy(transactionTags.tagId),
  )
  const counts = new Map(countsResult.data.map((row) => [row.tagId, row.count]))

  return {
    data: tagsResult.data.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type as TagKindType,
      icon: row.icon,
      colorSchemeName: row.colorSchemeName,
      colorScheme: getThemeStrict(row.colorSchemeName),
      transactionCount: counts.get(row.id) ?? 0,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    })),
    error: tagsResult.error ?? countsResult.error,
    updatedAt: tagsResult.updatedAt ?? countsResult.updatedAt,
  }
}
