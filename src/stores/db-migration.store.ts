import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type DbMigrationPhase =
  | "idle"
  | "needs_backup"
  | "exporting"
  | "exported"
  | "migrating"
  | "complete"
  | "failed"

interface DbMigrationState {
  phase: DbMigrationPhase
  backupUri: string | null
  backupFileName: string | null
  startedAt: string | null
  error: string | null
  setPhase: (phase: DbMigrationPhase) => void
  markNeedsBackup: () => void
  markExported: (backup: { uri: string; fileName: string }) => void
  markComplete: () => void
  markFailed: (error: string) => void
}

const migrationStorage = createMMKV({ id: "db-migration-storage" })

export const useDbMigrationStore = create<DbMigrationState>()(
  persist(
    (set) => ({
      phase: "idle",
      backupUri: null,
      backupFileName: null,
      startedAt: null,
      error: null,
      setPhase: (phase) => set({ phase, error: null }),
      markNeedsBackup: () =>
        set({
          phase: "needs_backup",
          startedAt: new Date().toISOString(),
          error: null,
        }),
      markExported: ({ uri, fileName }) =>
        set({
          phase: "exported",
          backupUri: uri,
          backupFileName: fileName,
          error: null,
        }),
      markComplete: () =>
        set({
          phase: "complete",
          backupUri: null,
          backupFileName: null,
          error: null,
        }),
      markFailed: (error) => set({ phase: "failed", error }),
    }),
    {
      name: "db-migration-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => migrationStorage.getString(name) ?? null,
        setItem: (name, value) => migrationStorage.set(name, value),
        removeItem: (name) => migrationStorage.remove(name),
      })),
    },
  ),
)
