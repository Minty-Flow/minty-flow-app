import { getTableName, is } from "drizzle-orm"
import { type AnySQLiteSelect, SQLiteTable } from "drizzle-orm/sqlite-core"
import { addDatabaseChangeListener } from "expo-sqlite"
import { useEffect, useState } from "react"

import { isTransactionOpen } from "../transaction"
import { createChangeBatcher } from "../utils/change-batcher"

const batcher = createChangeBatcher({
  // Each changed row arrives as its own JS task, all queued while the write
  // runs. An idle callback runs after them; a timer would jump ahead of them.
  schedule: (flush) => {
    requestIdleCallback(() => flush())
  },
  isBlocked: isTransactionOpen,
})

let isListening = false

/** One native listener feeds every live query. */
function watchTables(tables: string[], run: () => void): () => void {
  if (!isListening) {
    addDatabaseChangeListener(({ tableName }) => batcher.notify(tableName))
    isListening = true
  }
  return batcher.watch(tables, run)
}

/**
 * Drizzle's `useLiveQuery`, batched: a committed write re-runs each affected
 * query once, however many rows it changed.
 *
 * The query is re-run when its `from` table changes. Joins and subqueries are
 * not watched; name those tables in `alsoReads`.
 */
export function useLiveQuery<T extends Pick<AnySQLiteSelect, "_" | "then">>(
  query: T,
  deps: unknown[] = [],
  alsoReads: SQLiteTable[] = [],
) {
  const [data, setData] = useState<Awaited<T>>([] as Awaited<T>)
  const [error, setError] = useState<Error>()
  const [updatedAt, setUpdatedAt] = useState<Date>()

  useEffect(
    () => {
      const { table } = query._.config
      if (!is(table, SQLiteTable)) {
        setError(new Error("useLiveQuery can only select from a table"))
        return
      }
      const run = () => {
        query
          .then((rows) => {
            setData(rows as Awaited<T>)
            setUpdatedAt(new Date())
          })
          .catch(setError)
      }
      const stop = watchTables([table, ...alsoReads].map(getTableName), run)
      run()
      return stop
    },
    // biome-ignore lint/correctness/useExhaustiveDependencies: the caller's deps decide when the query changes
    deps,
  )

  return { data, error, updatedAt } as const
}
