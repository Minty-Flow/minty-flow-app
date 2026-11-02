import { File, Paths } from "expo-file-system"

/**
 * The profile photo is stored as a bare file name and resolved against
 * `Paths.document` when shown. An absolute `file://` URI would break on iOS,
 * where the app container path changes after a reinstall or restore.
 */

/** The file name of a stored value, including a legacy absolute URI. */
export function profileImageFileName(stored: string): string {
  const withoutQuery = stored.split("?")[0]
  return withoutQuery.slice(withoutQuery.lastIndexOf("/") + 1)
}

/**
 * An absolute URI for display, or null when there is no photo or its file is
 * missing, so the caller shows the initials avatar instead of a broken image.
 */
export function resolveProfileImage(stored: string | null): string | null {
  if (!stored) return null
  const file = new File(Paths.document, profileImageFileName(stored))
  return file.exists ? file.uri : null
}

/** Delete the photo file behind a stored value; a missing file is fine. */
export function deleteProfileImage(stored: string | null): void {
  if (!stored) return
  try {
    new File(Paths.document, profileImageFileName(stored)).delete()
  } catch {
    // already gone: ignore
  }
}

/**
 * Convert a value saved by an earlier build (an absolute URI) to a file name.
 * Null when the file is no longer in app storage.
 */
export function migrateStoredProfileImage(
  stored: string | null,
): string | null {
  if (!stored) return null
  const name = profileImageFileName(stored)
  return new File(Paths.document, name).exists ? name : null
}
