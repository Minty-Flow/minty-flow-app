import { Directory, File, Paths } from "expo-file-system"

import { generateId } from "~/database/utils/generate-id"
import type { TransactionAttachment } from "~/types/transactions"

import { getFileExtension } from "./file-icon"

let cachedDir: Directory | null = null

/**
 * Attachment files live here permanently. Pickers hand back cache URIs that the OS
 * evicts at will, so bytes are copied in on pick.
 *
 * Memoized: this is called once per attachment on every form hydrate, and `create`
 * is a synchronous native call.
 */
export function attachmentsDirectory(): Directory {
  if (cachedDir) return cachedDir
  const dir = new Directory(Paths.document, "attachments")
  dir.create({ intermediates: true, idempotent: true })
  cachedDir = dir
  return dir
}

/**
 * Copy a picked file into permanent storage.
 *
 * @returns The bare filename to persist — never an absolute URI. `documentDirectory`
 *   changes across iOS reinstalls, so an absolute path would not survive the restore
 *   it exists for.
 */
// ponytail: orphaned attachment files are never GC'd — a picked-then-discarded form
// leaks one, and an import leaves the previous data's files behind. Add a startup
// sweep against has_attachments rows if disk complaints appear.
export async function persistAttachment(
  sourceUri: string,
  name: string,
): Promise<string> {
  const ext = getFileExtension(name)
  const fileName = ext ? `att_${generateId()}.${ext}` : `att_${generateId()}`
  const destination = new File(attachmentsDirectory(), fileName)
  await new File(sourceUri).copy(destination)
  return fileName
}

/** Resolve a persisted filename to an absolute URI for display and opening. */
export function resolveAttachmentUri(stored: string): string {
  if (stored.includes("://")) return stored
  return new File(attachmentsDirectory(), stored).uri
}

/**
 * Inverse of {@link resolveAttachmentUri}, for writing back to the DB.
 *
 * Only strips URIs under the attachments directory — a legacy cache URI whose file
 * still exists keeps working instead of becoming a dangling filename.
 */
export function toStoredAttachment(
  a: TransactionAttachment,
): TransactionAttachment {
  const dirUri = attachmentsDirectory().uri
  if (!a.uri.startsWith(dirUri)) return a
  return { ...a, uri: a.uri.slice(dirUri.length).replace(/^\//, "") }
}

export function deleteAttachmentFile(stored: string): void {
  try {
    new File(resolveAttachmentUri(stored)).delete()
  } catch {
    // file may already be gone — ignore
  }
}
