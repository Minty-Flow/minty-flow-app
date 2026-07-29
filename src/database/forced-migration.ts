import * as FileSystem from "expo-file-system/legacy"

import { deleteDbSync, getDb } from "~/database/db"
import { resetDrizzleDb } from "~/database/drizzle/db"
import {
  generateInternalJsonBackup,
  type MintyFlowBackup,
  readBackupJsonFromUri,
  validateBackup,
} from "~/database/services/data-management-service"

const REQUIRED_TABLES = [
  "categories",
  "tags",
  "accounts",
  "recurring_transactions",
  "budgets",
  "goals",
  "loans",
  "transactions",
  "transfers",
  "transaction_tags",
  "budget_accounts",
  "budget_categories",
  "goal_accounts",
]

function tableExists(name: string): boolean {
  return (
    getDb().getFirstSync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
      [name],
    ) !== null
  )
}

export function needsForcedDrizzleMigration(): boolean {
  if (tableExists("__drizzle_migrations")) return false

  const existingTables = REQUIRED_TABLES.filter(tableExists)
  if (existingTables.length === 0) return false
  if (existingTables.length !== REQUIRED_TABLES.length) {
    throw new Error("Existing database schema is incomplete.")
  }
  return true
}

export async function exportLegacyDbForForcedMigration(): Promise<{
  uri: string
  fileName: string
}> {
  return generateInternalJsonBackup("minty-flow-drizzle-migration")
}

export function resetDbForForcedMigration(): void {
  deleteDbSync()
  resetDrizzleDb()
}

export async function readForcedMigrationBackup(
  uri: string,
): Promise<MintyFlowBackup> {
  const info = await FileSystem.getInfoAsync(uri)
  if (!info.exists) throw new Error("Migration backup file is missing.")

  const json = await readBackupJsonFromUri(uri)
  const result = validateBackup(json)
  if (!result.success) throw new Error(result.message)
  return result.backup
}
