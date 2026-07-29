import { useTagsQuery } from "~/database/drizzle/hooks/use-tags-query"
import type { Tag } from "~/types/tags"

export function useTags(): Tag[] {
  return useTagsQuery().data
}

export function useTag(id: string): Tag | undefined {
  return useTags().find((tag) => tag.id === id)
}
