/**
 * Stored file names of the attachments held in a transaction's `extra` JSON.
 * Never throws: an unreadable blob has no files to clean up.
 */
export function attachmentFilesFromExtra(extra: string | null): string[] {
  if (!extra) return []
  try {
    const outer = JSON.parse(extra) as { attachments?: unknown } | null
    const raw = outer?.attachments
    if (typeof raw !== "string") return []
    const list = JSON.parse(raw) as unknown
    if (!Array.isArray(list)) return []
    return list.flatMap((a) =>
      typeof (a as { uri?: unknown })?.uri === "string"
        ? [(a as { uri: string }).uri]
        : [],
    )
  } catch {
    return []
  }
}

/**
 * Delete attachment files from app storage. The file layer is loaded on demand
 * so the data layer (and its Node tests) does not pull in expo-file-system
 * unless a destroyed row actually had files.
 */
export async function deleteAttachmentFiles(
  files: Iterable<string>,
): Promise<void> {
  const list = [...files]
  if (list.length === 0) return
  const { deleteAttachmentFile } = await import("~/utils/attachments")
  for (const file of list) deleteAttachmentFile(file)
}
