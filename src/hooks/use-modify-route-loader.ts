import { NewEnum } from "~/types/new"

export type ModifyRouteLoadState<T> =
  | { mode: "new" }
  | { mode: "loading" }
  | { mode: "not-found"; message: string }
  | { mode: "edit"; entity: T }

export function useModifyRouteLoader<T>({
  id,
  data,
  updatedAt,
  find,
  notFoundMessage,
}: {
  id: string | undefined
  data: T[]
  updatedAt: Date | undefined
  find: (item: T, id: string) => boolean
  notFoundMessage: string
}): ModifyRouteLoadState<T> {
  if (!id || id === NewEnum.NEW) return { mode: "new" }
  if (updatedAt === undefined) return { mode: "loading" }

  const entity = data.find((item) => find(item, id))
  if (!entity) return { mode: "not-found", message: notFoundMessage }

  return { mode: "edit", entity }
}
