import { sql } from "drizzle-orm"
import * as DocumentPicker from "expo-document-picker"
import { Directory, File, Paths } from "expo-file-system"
import * as FileSystem from "expo-file-system/legacy"
import { Platform, Share } from "react-native"
import { unzip, zip } from "react-native-zip-archive"

import {
  BACKUP_JSON_NAME,
  defaultExportBaseName,
  type ExportType,
  type ImportResult,
  type MintyFlowBackup,
  type RawRow,
  type SavedExport,
  SCHEMA_VERSION,
} from "~/database/backup/backup-format"
import {
  insertBackupData,
  resetDatabaseForBackupImport,
} from "~/database/backup/backup-import-plan"
import { drizzleDb } from "~/database/drizzle/db"
import { runInTransaction } from "~/database/transaction"
import type { RowTransaction } from "~/database/types/rows"
import {
  deleteSqliteSnapshot,
  readSqliteSnapshot,
  writeSqliteSnapshot,
} from "~/database/utils/import-snapshot"
import { attachmentsDirectory } from "~/utils/attachments"
import { getFileExtension, getMimeTypeForExtension } from "~/utils/file-icon"
import { logger } from "~/utils/logger"
import { minorUnitsToDecimalString } from "~/utils/money"

export {
  countBackupRecords,
  defaultExportBaseName,
  type ExportType,
  type MintyFlowBackup,
  validateBackup,
} from "~/database/backup/backup-format"

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Each export gets its own folder so two exports sharing a name can't overwrite each other. */
async function prepareExportDir(): Promise<string> {
  const dir = `${FileSystem.documentDirectory}exports/${Date.now()}/`
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true })
  return dir
}

/**
 * Build `<base>.<ext>` from user-typed text.
 *
 * Sanitising lives here rather than in the caller because the result is concatenated
 * into a file path — a separator or a leading dot must never survive.
 */
function toFileName(type: ExportType, baseName?: string): string {
  const cleaned = (baseName ?? "")
    // biome-ignore lint/suspicious/noControlCharactersInRegex: stripping them is the point
    .replace(/[/\\:*?"<>|\u0000-\u001f]/g, "")
    .slice(0, 100)
    .trim()
    .replace(/^\.+/, "")
  return `${cleaned || defaultExportBaseName(type)}.${type}`
}

/**
 * Copy an exported file out of app-private storage to a folder the user picks.
 *
 * Android uses a folder picker, not a "Save as" dialog: CREATE_DOCUMENT is unusable here
 * because expo-intent-launcher returns the result Intent's `toString()` as `data`, and
 * `Intent.toString()` redacts the URI path (`content://…/...`), so the document URI never
 * survives the trip to JS. Note Android itself forbids granting access to the Download
 * root — users must pick another folder (Documents, or a Download subfolder).
 *
 * @returns false if the user cancelled or the copy failed.
 */
async function saveToDevice(uri: string, fileName: string): Promise<boolean> {
  if (Platform.OS !== "android") {
    await Share.share({ url: uri })
    return true
  }

  try {
    const { StorageAccessFramework: SAF } = FileSystem
    const permission = await SAF.requestDirectoryPermissionsAsync()
    if (!permission.granted) return false

    const ext = getFileExtension(fileName)
    const targetUri = await SAF.createFileAsync(
      permission.directoryUri,
      fileName,
      getMimeTypeForExtension(ext),
    )

    // Binary must not round-trip through a UTF-8 string — that corrupts it.
    // ponytail: pulls the whole file through a base64 JS string (~1.33x), so a very large
    // attachment set can OOM. SAF documents are read-only to File.copy
    // (DestinationSink.ContentResource), so there is no streaming handoff available.
    const encoding =
      ext === "zip"
        ? FileSystem.EncodingType.Base64
        : FileSystem.EncodingType.UTF8
    const content = await FileSystem.readAsStringAsync(uri, { encoding })
    await SAF.writeAsStringAsync(targetUri, content, { encoding })
    return true
  } catch (e) {
    logger.error("Save to device failed", {
      message: e instanceof Error ? e.message : String(e),
    })
    return false
  }
}

// ─── Export ──────────────────────────────────────────────────────────────────

/** Fetch all 13 tables from the SQLite DB and return a MintyFlowBackup object. */
async function buildBackupInMemory(): Promise<MintyFlowBackup> {
  const [
    categories,
    tags,
    accounts,
    recurringTransactions,
    budgets,
    goals,
    loans,
    transactions,
    transfers,
    transactionTags,
    budgetAccounts,
    budgetCategories,
    goalAccounts,
  ] = await Promise.all([
    drizzleDb.all<RawRow>(sql.raw("SELECT * FROM categories")),
    drizzleDb.all<RawRow>(sql.raw("SELECT * FROM tags")),
    drizzleDb.all<RawRow>(sql.raw("SELECT * FROM accounts")),
    drizzleDb.all<RawRow>(sql.raw("SELECT * FROM recurring_transactions")),
    drizzleDb.all<RawRow>(sql.raw("SELECT * FROM budgets")),
    drizzleDb.all<RawRow>(sql.raw("SELECT * FROM goals")),
    drizzleDb.all<RawRow>(sql.raw("SELECT * FROM loans")),
    drizzleDb.all<RawRow>(sql.raw("SELECT * FROM transactions")),
    drizzleDb.all<RawRow>(sql.raw("SELECT * FROM transfers")),
    drizzleDb.all<RawRow>(sql.raw("SELECT * FROM transaction_tags")),
    drizzleDb.all<RawRow>(sql.raw("SELECT * FROM budget_accounts")),
    drizzleDb.all<RawRow>(sql.raw("SELECT * FROM budget_categories")),
    drizzleDb.all<RawRow>(sql.raw("SELECT * FROM goal_accounts")),
  ])

  return {
    meta: {
      version: 1,
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      appId: "minty-flow-app",
    },
    data: {
      categories,
      tags,
      accounts,
      recurring_transactions: recurringTransactions,
      budgets,
      goals,
      loans,
      transactions,
      transfers,
      transaction_tags: transactionTags,
      budget_accounts: budgetAccounts,
      budget_categories: budgetCategories,
      goal_accounts: goalAccounts,
    },
  }
}

async function generateJsonBackup(baseName?: string): Promise<{
  uri: string
  fileName: string
}> {
  const [dir, backup] = await Promise.all([
    prepareExportDir(),
    buildBackupInMemory(),
  ])
  const fileName = toFileName("json", baseName)
  const uri = `${dir}${fileName}`
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(backup, null, 2), {
    encoding: FileSystem.EncodingType.UTF8,
  })
  return { uri, fileName }
}

export async function generateInternalJsonBackup(baseName?: string): Promise<{
  uri: string
  fileName: string
}> {
  return generateJsonBackup(baseName)
}

export async function readBackupJsonFromUri(uri: string): Promise<string> {
  return FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.UTF8,
  })
}

export async function saveJsonToDevice(
  baseName?: string,
): Promise<SavedExport> {
  const { uri, fileName } = await generateJsonBackup(baseName)
  const savedToDevice = await saveToDevice(uri, fileName)
  return { uri, fileName, savedToDevice }
}

async function generateZipBackup(
  baseName?: string,
): Promise<{ uri: string; fileName: string }> {
  const [dir, backup] = await Promise.all([
    prepareExportDir(),
    buildBackupInMemory(),
  ])
  const jsonUri = `${dir}${BACKUP_JSON_NAME}`
  await FileSystem.writeAsStringAsync(
    jsonUri,
    JSON.stringify(backup, null, 2),
    {
      encoding: FileSystem.EncodingType.UTF8,
    },
  )

  const fileName = toFileName("zip", baseName)
  const uri = `${dir}${fileName}`
  const attachments = attachmentsDirectory()
    .list()
    .filter((entry): entry is File => entry instanceof File)
    .map((file) => file.uri)

  try {
    // An array source zips to flat basenames, so the live attachment files are archived
    // in place — a nested layout would need staging copies and twice the peak disk.
    await zip([jsonUri, ...attachments], uri)
  } finally {
    await FileSystem.deleteAsync(jsonUri, { idempotent: true })
  }

  return { uri, fileName }
}

export async function saveZipToDevice(baseName?: string): Promise<SavedExport> {
  const { uri, fileName } = await generateZipBackup(baseName)
  const savedToDevice = await saveToDevice(uri, fileName)
  return { uri, fileName, savedToDevice }
}

/**
 * Read a picked backup, transparently unwrapping a zip archive.
 *
 * The extension only routes to a read strategy — it never rejects. `validateBackup`
 * is the gate on whether the contents are actually a backup.
 *
 * @returns The backup JSON text, plus the staging dir holding the archive's attachment
 *   files (null for a plain JSON pick). The caller owns the staging dir.
 */
export async function readPickedBackup(
  uri: string,
  name: string,
): Promise<{ json: string; stagingDir: string | null }> {
  if (!name.toLowerCase().endsWith(".zip")) {
    const json = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.UTF8,
    })
    return { json, stagingDir: null }
  }

  const staging = new Directory(Paths.cache, `import-${Date.now()}`)
  staging.create({ intermediates: true, idempotent: true })
  try {
    await unzip(uri, staging.uri)
    const jsonFile = new File(staging, BACKUP_JSON_NAME)
    if (!jsonFile.exists) throw new Error(`Archive has no ${BACKUP_JSON_NAME}`)
    return { json: await jsonFile.text(), stagingDir: staging.uri }
  } catch (e) {
    deleteStagingDir(staging.uri)
    throw e
  }
}

/** Copy an archive's attachment files into permanent storage. Deletes the staging dir. */
export async function restoreAttachmentsFromStaging(
  stagingDir: string,
): Promise<void> {
  const destination = attachmentsDirectory()
  const files = new Directory(stagingDir)
    .list()
    .filter(
      (entry): entry is File =>
        entry instanceof File && entry.name !== BACKUP_JSON_NAME,
    )

  await Promise.all(
    files.map((file) =>
      file.copy(new File(destination, file.name), { overwrite: true }),
    ),
  )
  deleteStagingDir(stagingDir)
}

export function deleteStagingDir(stagingDir: string): void {
  try {
    new Directory(stagingDir).delete()
  } catch {
    // staging lives in the cache dir — the OS reclaims it either way
  }
}

async function generateCsvExport(
  baseName?: string,
): Promise<{ uri: string; fileName: string }> {
  const dir = await prepareExportDir()
  const transactions = drizzleDb.all<
    RowTransaction & { currency_code: string }
  >(
    sql.raw(
      `SELECT t.*, a.currency_code
     FROM transactions t
     JOIN accounts a ON a.id = t.account_id
     WHERE t.is_deleted = 0`,
    ),
  )

  const headers = [
    "id",
    "date",
    "type",
    "amount",
    "title",
    "description",
    "category_id",
    "account_id",
    "is_pending",
    "goal_id",
    "budget_id",
    "loan_id",
    "recurring_id",
    "subtype",
    "location",
    "created_at",
  ]

  function escapeCsvField(value: unknown): string {
    if (value === null || value === undefined) return ""
    const str = String(value)
    if (
      str.includes(",") ||
      str.includes('"') ||
      str.includes("\n") ||
      str.includes("\r")
    ) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const rows = transactions.map((r) =>
    [
      escapeCsvField(r.id),
      escapeCsvField(r.transaction_date), // already ISO string in SQLite
      escapeCsvField(r.type),
      escapeCsvField(minorUnitsToDecimalString(r.amount, r.currency_code)),
      escapeCsvField(r.title),
      escapeCsvField(r.description),
      escapeCsvField(r.category_id),
      escapeCsvField(r.account_id),
      escapeCsvField(r.is_pending),
      escapeCsvField(r.goal_id),
      escapeCsvField(r.budget_id),
      escapeCsvField(r.loan_id),
      escapeCsvField(r.recurring_id),
      escapeCsvField(r.subtype),
      escapeCsvField(r.location),
      escapeCsvField(r.created_at),
    ].join(","),
  )

  const csv = [headers.join(","), ...rows].join("\r\n")
  const fileName = toFileName("csv", baseName)
  const uri = `${dir}${fileName}`
  await FileSystem.writeAsStringAsync(uri, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  })
  return { uri, fileName }
}

export async function saveCsvToDevice(baseName?: string): Promise<SavedExport> {
  const { uri, fileName } = await generateCsvExport(baseName)
  const savedToDevice = await saveToDevice(uri, fileName)
  return { uri, fileName, savedToDevice }
}

export async function saveExistingFileToDevice(
  uri: string,
  fileName: string,
): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(uri)
  if (!info.exists) throw new Error("file_not_found")
  return saveToDevice(uri, fileName)
}

// ponytail: leaves the export's now-empty parent folder behind. Delete the folder too
// once history records predating per-export folders can no longer be in the store.
export async function deleteExportFile(uri: string): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(uri)
    if (info.exists) {
      await FileSystem.deleteAsync(uri)
    }
  } catch {
    // file may already be gone — ignore
  }
}

// ─── Pick file ────────────────────────────────────────────────────────────────

export async function pickBackupFile(): Promise<{
  uri: string
  name: string
} | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: "*/*",
    copyToCacheDirectory: true,
  })

  if (result.canceled || !result.assets?.[0]) return null

  const file = result.assets[0]
  return { uri: file.uri, name: file.name ?? "backup" }
}

// ─── Import ───────────────────────────────────────────────────────────────────

/**
 * Wipe all rows (reverse FK order) and recreate schema in a single transaction.
 * Two-transaction approach: reset (A) → insert (B) → delete snapshot.
 * Crash between A and B leaves empty DB; snapshot on disk triggers recovery on next launch.
 */
export async function recoverInterruptedImport(): Promise<boolean> {
  const snapshot = await readSqliteSnapshot<MintyFlowBackup>()
  if (!snapshot) return false

  await resetDatabaseForBackupImport()
  await runInTransaction("recover.insert", (db) => {
    insertBackupData(db, snapshot.data)
  })
  // Delete only after confirmed success
  await deleteSqliteSnapshot()
  return true
}

export async function importBackup(
  backup: MintyFlowBackup,
): Promise<ImportResult> {
  try {
    const { data } = backup

    // 1️⃣ Build FK ID sets (before any DB mutation)
    const validAccountIds = new Set(data.accounts.map((a) => a.id))
    const validCategoryIds = new Set(data.categories.map((c) => c.id))
    const validTagIds = new Set(data.tags.map((t) => t.id))
    const validRecurringIds = new Set(
      data.recurring_transactions.map((r) => r.id),
    )
    const validBudgetIds = new Set(data.budgets.map((b) => b.id))
    const validGoalIds = new Set(data.goals.map((g) => g.id))
    const validLoanIds = new Set(data.loans.map((l) => l.id))
    const validTransactionIds = new Set(data.transactions.map((t) => t.id))

    // 2️⃣ Validate FKs in memory before any DB write
    for (const tx of data.transactions) {
      if (!validAccountIds.has(tx.account_id as string)) {
        throw new Error(
          `Transaction ${tx.id} references invalid account_id ${tx.account_id}`,
        )
      }
      if (tx.category_id && !validCategoryIds.has(tx.category_id as string)) {
        throw new Error(
          `Transaction ${tx.id} references invalid category_id ${tx.category_id}`,
        )
      }
      if (
        tx.recurring_id &&
        !validRecurringIds.has(tx.recurring_id as string)
      ) {
        throw new Error(
          `Transaction ${tx.id} references invalid recurring_id ${tx.recurring_id}`,
        )
      }
      if (tx.goal_id && !validGoalIds.has(tx.goal_id as string)) {
        throw new Error(
          `Transaction ${tx.id} references invalid goal_id ${tx.goal_id}`,
        )
      }
      if (tx.budget_id && !validBudgetIds.has(tx.budget_id as string)) {
        throw new Error(
          `Transaction ${tx.id} references invalid budget_id ${tx.budget_id}`,
        )
      }
      if (tx.loan_id && !validLoanIds.has(tx.loan_id as string)) {
        throw new Error(
          `Transaction ${tx.id} references invalid loan_id ${tx.loan_id}`,
        )
      }
    }

    for (const row of data.transaction_tags) {
      if (!validTransactionIds.has(row.transaction_id as string)) {
        throw new Error(
          `transaction_tags row references invalid transaction_id ${row.transaction_id}`,
        )
      }
      if (!validTagIds.has(row.tag_id as string)) {
        throw new Error(
          `transaction_tags row references invalid tag_id ${row.tag_id}`,
        )
      }
    }
    for (const row of data.budget_accounts) {
      if (!validBudgetIds.has(row.budget_id as string)) {
        throw new Error(
          `budget_accounts row references invalid budget_id ${row.budget_id}`,
        )
      }
      if (!validAccountIds.has(row.account_id as string)) {
        throw new Error(
          `budget_accounts row references invalid account_id ${row.account_id}`,
        )
      }
    }
    for (const row of data.budget_categories) {
      if (!validBudgetIds.has(row.budget_id as string)) {
        throw new Error(
          `budget_categories row references invalid budget_id ${row.budget_id}`,
        )
      }
      if (!validCategoryIds.has(row.category_id as string)) {
        throw new Error(
          `budget_categories row references invalid category_id ${row.category_id}`,
        )
      }
    }
    for (const row of data.goal_accounts) {
      if (!validGoalIds.has(row.goal_id as string)) {
        throw new Error(
          `goal_accounts row references invalid goal_id ${row.goal_id}`,
        )
      }
      if (!validAccountIds.has(row.account_id as string)) {
        throw new Error(
          `goal_accounts row references invalid account_id ${row.account_id}`,
        )
      }
    }
    for (const row of data.transfers) {
      if (!validTransactionIds.has(row.from_transaction_id as string)) {
        throw new Error(
          `transfers row references invalid from_transaction_id ${row.from_transaction_id}`,
        )
      }
      if (!validTransactionIds.has(row.to_transaction_id as string)) {
        throw new Error(
          `transfers row references invalid to_transaction_id ${row.to_transaction_id}`,
        )
      }
      if (!validAccountIds.has(row.from_account_id as string)) {
        throw new Error(
          `transfers row references invalid from_account_id ${row.from_account_id}`,
        )
      }
      if (!validAccountIds.has(row.to_account_id as string)) {
        throw new Error(
          `transfers row references invalid to_account_id ${row.to_account_id}`,
        )
      }
    }
    for (const row of data.loans) {
      if (!validAccountIds.has(row.account_id as string)) {
        throw new Error(
          `loans row ${row.id} references invalid account_id ${row.account_id}`,
        )
      }
      if (row.category_id && !validCategoryIds.has(row.category_id as string)) {
        throw new Error(
          `loans row ${row.id} references invalid category_id ${row.category_id}`,
        )
      }
    }

    // 3️⃣ Snapshot current DB to disk before any mutation
    // Survives process-kill between reset (A) and insert (B) — recovery reads it on next launch.
    const snapshot = await buildBackupInMemory()
    await writeSqliteSnapshot(snapshot)

    // 4️⃣ Transaction A: wipe all rows
    // 5️⃣ Transaction B: insert backup data
    try {
      await resetDatabaseForBackupImport()
      await runInTransaction("import.insert", (db) => {
        insertBackupData(db, data)
      })
      // Import succeeded — snapshot no longer needed
      await deleteSqliteSnapshot()
    } catch (importError) {
      // Attempt JS-layer restore from pre-import snapshot
      try {
        await resetDatabaseForBackupImport()
        await runInTransaction("restore.insert", (db) => {
          insertBackupData(db, snapshot.data)
        })
        // Restore succeeded — snapshot no longer needed
        await deleteSqliteSnapshot()
      } catch {
        // Restore also failed — leave snapshot on disk for next-launch recovery
        throw new Error(
          `Import failed and automatic restore failed: ${importError instanceof Error ? importError.message : String(importError)}. Please re-import from your last exported backup file.`,
        )
      }
      throw importError
    }

    const counts: Record<string, number> = {}
    for (const [table, rows] of Object.entries(data)) {
      counts[table] = rows.length
    }

    return { success: true, counts }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unknown error",
    }
  }
}
