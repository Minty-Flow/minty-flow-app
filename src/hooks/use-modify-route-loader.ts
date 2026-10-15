import { useRef } from "react"

import { NewEnum } from "~/types/new"

export type ModifyRouteLoadState<T> =
  | { mode: "new" }
  | { mode: "loading" }
  | { mode: "not-found"; message: string }
  | { mode: "edit"; entity: T }

/**
 * Resolves the edit route's entity. Once loaded, the entity is kept even if it
 * later disappears from `data` (the screen just deleted it): swapping the form
 * for a not-found state would unmount its confirm sheet mid-close. The screen
 * leaves once that sheet has closed.
 */
export function useModifyRouteLoader<T extends { id: string }>({
  id,
  data,
  updatedAt,
  find = (item, id) => item.id === id,
  notFoundMessage,
}: {
  id: string | undefined
  data: T[]
  updatedAt: Date | undefined
  /** Defaults to matching `item.id`. */
  find?: (item: T, id: string) => boolean
  notFoundMessage: string
}): ModifyRouteLoadState<T> {
  const lastLoaded = useRef<{ id: string; entity: T } | null>(null)
  if (!id || id === NewEnum.NEW) return { mode: "new" }
  if (updatedAt === undefined) return { mode: "loading" }

  const found = data.find((item) => find(item, id))
  if (found) {
    lastLoaded.current = { id, entity: found }
    return { mode: "edit", entity: found }
  }
  if (lastLoaded.current?.id === id) {
    return { mode: "edit", entity: lastLoaded.current.entity }
  }
  return { mode: "not-found", message: notFoundMessage }
}
