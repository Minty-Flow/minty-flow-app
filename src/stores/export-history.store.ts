import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const MAX_EXPORT_HISTORY = 50 // Choose a reasonable limit

export interface ExportRecord {
  id: string
  fileName: string
  /** App-private file:// URI written at export time. */
  uri: string
  type: "json" | "csv"
  exportedAt: string // ISO date string
}

interface ExportHistoryStore {
  exports: ExportRecord[]
  addExport: (record: Omit<ExportRecord, "id">) => void
  removeExport: (id: string) => void
  clearAll: () => void
}

const exportHistoryStorage = createMMKV({ id: "export-history-storage" })

export const useExportHistoryStore = create<ExportHistoryStore>()(
  persist(
    (set) => ({
      exports: [],

      addExport: (record) =>
        set((state) => ({
          exports: [
            {
              ...record,
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            },
            ...state.exports,
          ].slice(0, MAX_EXPORT_HISTORY), // Keep only the most recent N items
        })),

      removeExport: (id) =>
        set((state) => ({
          exports: state.exports.filter((e) => e.id !== id),
        })),

      clearAll: () => set({ exports: [] }),
    }),
    {
      name: "export-history-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => exportHistoryStorage.getString(name) ?? null,
        setItem: (name, value) => exportHistoryStorage.set(name, value),
        removeItem: (name) => exportHistoryStorage.remove(name),
      })),
    },
  ),
)
