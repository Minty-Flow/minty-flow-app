import * as FileSystem from "expo-file-system/legacy"

// Distinct from the WDB snapshot path to avoid collision during migration coexistence.
const SQLITE_SNAPSHOT_PATH = `${FileSystem.documentDirectory}minty-emergency-snapshot-sqlite.json`

export async function writeSqliteSnapshot(data: unknown): Promise<void> {
  await FileSystem.writeAsStringAsync(
    SQLITE_SNAPSHOT_PATH,
    JSON.stringify(data),
    { encoding: FileSystem.EncodingType.UTF8 },
  )
}

export async function readSqliteSnapshot<T>(): Promise<T | null> {
  const info = await FileSystem.getInfoAsync(SQLITE_SNAPSHOT_PATH)
  if (!info.exists) return null
  const json = await FileSystem.readAsStringAsync(SQLITE_SNAPSHOT_PATH, {
    encoding: FileSystem.EncodingType.UTF8,
  })
  return JSON.parse(json) as T
}

export async function deleteSqliteSnapshot(): Promise<void> {
  const info = await FileSystem.getInfoAsync(SQLITE_SNAPSHOT_PATH)
  if (info.exists) {
    await FileSystem.deleteAsync(SQLITE_SNAPSHOT_PATH, { idempotent: true })
  }
}
