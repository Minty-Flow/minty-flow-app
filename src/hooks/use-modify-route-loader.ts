import { NewEnum } from "~/types/new"

export type ModifyRouteLoadState<T> =
  | { mode: "new" }
  | { mode: "loading" }
  | { mode: "not-found"; message: string }
  | { mode: "edit"; entity: T }

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
  if (!id || id === NewEnum.NEW) return { mode: "new" }
  if (updatedAt === undefined) return { mode: "loading" }

  const entity = data.find((item) => find(item, id))
  if (!entity) return { mode: "not-found", message: notFoundMessage }

  return { mode: "edit", entity }
}
