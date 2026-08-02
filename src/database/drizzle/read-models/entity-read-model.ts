export type ReadModelStatus = "loading" | "ready" | "error"

export interface LiveReadModelResult<T> {
  data: T
  error: Error | undefined
  updatedAt: Date | undefined
  status: ReadModelStatus
}

interface LiveQueryState {
  error: Error | undefined
  updatedAt: Date | undefined
}

export function createLiveReadModelResult<T>(
  data: T,
  states: LiveQueryState[],
): LiveReadModelResult<T> {
  const error = states.find((state) => state.error)?.error
  const ready = states.every((state) => state.updatedAt !== undefined)

  return {
    data,
    error,
    updatedAt: ready
      ? states.reduce<Date | undefined>((latest, state) => {
          if (!state.updatedAt) return latest
          if (!latest || state.updatedAt > latest) return state.updatedAt
          return latest
        }, undefined)
      : undefined,
    status: error ? "error" : ready ? "ready" : "loading",
  }
}
