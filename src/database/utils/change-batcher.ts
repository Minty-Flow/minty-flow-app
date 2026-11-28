interface Watcher {
  tables: readonly string[]
  run: () => void
}

/**
 * Collects the names of changed tables and, once per flush, runs each watcher
 * of any of them a single time.
 *
 * @param schedule - Runs the flush after the change events already queued.
 * @param isBlocked - True while a flush would read a half-written transaction;
 *   the flush is scheduled again.
 */
export function createChangeBatcher({
  schedule,
  isBlocked,
}: {
  schedule: (flush: () => void) => void
  isBlocked: () => boolean
}) {
  const watchers = new Set<Watcher>()
  let changed = new Set<string>()
  let scheduled = false

  function flush() {
    if (isBlocked()) {
      schedule(flush)
      return
    }
    // Reset first: a change arriving while watchers run needs another flush.
    scheduled = false
    const tables = changed
    changed = new Set()
    for (const watcher of [...watchers]) {
      if (watcher.tables.some((table) => tables.has(table))) watcher.run()
    }
  }

  return {
    watch(tables: readonly string[], run: () => void): () => void {
      const watcher = { tables, run }
      watchers.add(watcher)
      return () => {
        watchers.delete(watcher)
      }
    },
    notify(table: string): void {
      changed.add(table)
      if (scheduled) return
      scheduled = true
      schedule(flush)
    },
  }
}
