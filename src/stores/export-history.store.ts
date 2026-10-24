import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { mmkvJSONStorage } from "~/utils/mmkv-storage"

const MAX_EXPORT_HISTORY = 50 // Choose a reasonable limit

export interface ExportRecord {
  id: string
  fileName: string
  /** App-private file:// URI written at export time. */
  uri: string
  type: "json" | "csv" | "zip"
  exportedAt: string // ISO date string
}

interface ExportHistoryStore {
  exports: ExportRecord[]
  /** Returns the records pushed out of the history, whose files are now unreferenced. */
  addExport: (record: Omit<ExportRecord, "id">) => ExportRecord[]
  removeExport: (id: string) => void
  clearAll: () => void
}

const exportHistoryStorage = createMMKV({ id: "export-history-storage" })

export const useExportHistoryStore = create<ExportHistoryStore>()(
  persist(
    (set, get) => ({
      exports: [],

      addExport: (record) => {
        const all = [
          {
            ...record,
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          },
          ...get().exports,
        ]
        // Keep only the most recent N items
        set({ exports: all.slice(0, MAX_EXPORT_HISTORY) })
        return all.slice(MAX_EXPORT_HISTORY)
      },

      removeExport: (id) =>
        set((state) => ({
          exports: state.exports.filter((e) => e.id !== id),
        })),

      clearAll: () => set({ exports: [] }),
    }),
    {
      name: "export-history-store",
      storage: mmkvJSONStorage(exportHistoryStorage),
    },
  ),
)
