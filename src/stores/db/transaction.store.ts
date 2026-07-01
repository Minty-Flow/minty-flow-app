import { useEffect, useMemo } from "react"
import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

import { on } from "~/database/events"
import {
  hydrateTransactions,
  type TransactionWithRelations,
} from "~/database/mappers/hydrateTransactions"
import { getTransactionsByFilter } from "~/database/repos/transaction-repo"
import { logger } from "~/utils/logger"

type Status = "idle" | "loading" | "ready" | "error"

interface CacheEntry {
  ids: string[]
  status: Status
  dirty: boolean
}

export interface TransactionFilters {
  from?: string // UTC ISO
  to?: string // UTC ISO
  accountIds?: string[]
  categoryIds?: string[]
  categoryId?: string
  loanId?: string
  goalId?: string
  isPending?: boolean
  deletedOnly?: boolean
  limit?: number
  offset?: number
}

interface TransactionStoreState {
  byId: Record<string, TransactionWithRelations>
  cache: Record<string, CacheEntry>
  fetch: (hash: string, filters: TransactionFilters) => Promise<void>
  markDirty: (changedIds?: string[]) => void
}

/**
 * Stable, deterministic cache key. Dates must be ISO strings — never raw Date objects.
 */
function stableFilterHash(filters: TransactionFilters): string {
  const sorted: Record<string, unknown> = {}
  for (const key of Object.keys(filters).sort()) {
    const value = filters[key as keyof TransactionFilters]
    if (value !== undefined) sorted[key] = value
  }
  return JSON.stringify(sorted)
}

const EMPTY_IDS: string[] = []

const useTransactionStore = create<TransactionStoreState>()(
  subscribeWithSelector((set, get) => ({
    byId: {},
    cache: {},

    fetch: async (hash, filters) => {
      const existing = get().cache[hash]
      if (existing?.status === "loading") return

      set((state) => ({
        cache: {
          ...state.cache,
          [hash]: {
            ids: existing?.ids ?? EMPTY_IDS,
            status: "loading",
            dirty: false,
          },
        },
      }))

      try {
        const rows = await getTransactionsByFilter(filters)
        const hydrated = await hydrateTransactions(rows)
        const ids = hydrated.map((t) => t.id)

        set((state) => {
          const nextById = { ...state.byId }
          for (const tx of hydrated) nextById[tx.id] = tx

          const nextCache = {
            ...state.cache,
            [hash]: { ids, status: "ready" as Status, dirty: false },
          }

          // GC: drop ids no longer referenced by any cache entry.
          const referenced = new Set<string>()
          for (const key in nextCache) {
            for (const id of nextCache[key].ids) referenced.add(id)
          }
          for (const id in nextById) {
            if (!referenced.has(id)) delete nextById[id]
          }

          return { byId: nextById, cache: nextCache }
        })
      } catch (error) {
        logger.error("Failed to fetch transactions", {
          error: error instanceof Error ? error.message : String(error),
        })
        set((state) => ({
          cache: {
            ...state.cache,
            [hash]: {
              ids: existing?.ids ?? EMPTY_IDS,
              status: "error",
              dirty: false,
            },
          },
        }))
      }
    },

    markDirty: (changedIds) => {
      set((state) => {
        const next: Record<string, CacheEntry> = {}
        const dirtySet =
          changedIds && changedIds.length > 0 ? new Set(changedIds) : null
        for (const key in state.cache) {
          const entry = state.cache[key]
          // Targeted (ids given): only refetch entries that contain a changed id.
          // Broadcast (no ids): refetch everything — used for creates/bulk ops
          // where new rows may enter any filter.
          const shouldMark = dirtySet
            ? entry.ids.some((id) => dirtySet.has(id))
            : true
          next[key] = shouldMark ? { ...entry, dirty: true } : entry
        }
        return { cache: next }
      })
    },
  })),
)

// Debounced refresh: mark dirty immediately, refetch after 50 ms
let debounceTimer: ReturnType<typeof setTimeout> | null = null

on("transactions:dirty", (payload) => {
  useTransactionStore.getState().markDirty(payload?.ids)

  if (debounceTimer) return

  debounceTimer = setTimeout(() => {
    debounceTimer = null
    const { cache, fetch } = useTransactionStore.getState()
    for (const key in cache) {
      if (cache[key].dirty) {
        fetch(key, JSON.parse(key) as TransactionFilters)
      }
    }
  }, 50)
})

on("db:reset", () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  useTransactionStore.setState({ byId: {}, cache: {} })
})

export function useTransactions(filters: TransactionFilters): {
  items: TransactionWithRelations[]
  status: Status
} {
  const hash = stableFilterHash(filters)

  const entry = useTransactionStore(useShallow((s) => s.cache[hash]))
  const fetch = useTransactionStore((s) => s.fetch)

  const ids = entry?.ids ?? EMPTY_IDS
  const status = entry?.status ?? "idle"
  const isNew = !entry
  const isDirty = entry?.dirty ?? false

  useEffect(() => {
    if (isNew || isDirty) {
      // Reconstruct filters from hash — hash fully encodes them
      fetch(hash, JSON.parse(hash) as TransactionFilters)
    }
  }, [hash, isNew, isDirty, fetch])

  const itemsRaw = useTransactionStore(
    useShallow((s) => ids.map((id) => s.byId[id]).filter(Boolean)),
  )

  // Stable identity when ids + underlying rows unchanged.
  const items = useMemo(
    () => itemsRaw as TransactionWithRelations[],
    [itemsRaw],
  )

  return { items, status }
}
