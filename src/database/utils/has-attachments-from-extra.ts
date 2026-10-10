/** Whether a transaction's `extra` blob carries at least one attachment. */
export function hasAttachmentsFromExtra(
  extra: Record<string, string> | null,
): boolean {
  if (!extra?.attachments) return false
  try {
    const parsed = JSON.parse(extra.attachments) as unknown
    if (Array.isArray(parsed)) return parsed.length > 0
    if (typeof parsed === "object" && parsed !== null)
      return Object.keys(parsed).length > 0
    return false
  } catch {
    return extra.attachments.length > 0
  }
}
