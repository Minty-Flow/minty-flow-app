import { useLiveQuery as drizzleUseLiveQuery } from "drizzle-orm/expo-sqlite"

import { logger } from "~/utils/logger"

/** One frame at 60 fps: a query slower than this can be felt as loading. */
const SLOW_QUERY_MS = 16

type Query = Parameters<typeof drizzleUseLiveQuery>[0]

function describe(query: Query): string {
  try {
    const sql = (
      query as unknown as { toSQL?: () => { sql: string } }
    ).toSQL?.().sql
    return sql ? sql.replace(/\s+/g, " ").slice(0, 100) : "query"
  } catch {
    return "query"
  }
}

/**
 * Wraps a live query so the time until its result resolves is measured.
 * Drizzle calls `.then` on the query inside its effect, so that is where the
 * timer goes; everything else passes straight through to the real query.
 */
function withTiming<T extends Query>(query: T): T {
  return new Proxy(query, {
    get(target, prop) {
      const value = Reflect.get(target, prop, target)
      if (prop === "then" && typeof value === "function") {
        return (
          onFulfilled?: (data: unknown) => unknown,
          onRejected?: (error: unknown) => unknown,
        ) => {
          const start = performance.now()
          return value.call(
            target,
            (data: unknown) => {
              const ms = performance.now() - start
              if (ms > SLOW_QUERY_MS) {
                logger.warn(`Slow live query: ${ms.toFixed(1)} ms`, {
                  sql: describe(target),
                })
              }
              return onFulfilled?.(data)
            },
            onRejected,
          )
        }
      }
      return typeof value === "function" ? value.bind(target) : value
    },
  })
}

/**
 * Drop-in for drizzle's `useLiveQuery`. In development it logs live queries
 * slower than one frame (including each re-run after a write); release builds
 * use the original hook untouched.
 */
export const useLiveQuery: typeof drizzleUseLiveQuery = __DEV__
  ? (query, deps) => drizzleUseLiveQuery(withTiming(query), deps)
  : drizzleUseLiveQuery
