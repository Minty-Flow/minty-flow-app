/**
 * How long a trashed transaction is kept before it is purged for good.
 *
 * The settings screen, the persisted preference and the purge all read this one
 * list, so the stored value and the parser cannot drift apart. `value` is what
 * is persisted (it is the format users already have stored), `days` is what the
 * purge uses; `null` means keep forever.
 */
export const TRASH_RETENTION_CHOICES = [
  { value: "1 day", days: 1 },
  { value: "7 days", days: 7 },
  { value: "14 days", days: 14 },
  { value: "30 days", days: 30 },
  { value: "90 days", days: 90 },
  { value: "180 days", days: 180 },
  { value: "365 days", days: 365 },
  { value: "forever", days: null },
] as const

export type TrashRetentionValue =
  (typeof TRASH_RETENTION_CHOICES)[number]["value"]

export const DEFAULT_TRASH_RETENTION: TrashRetentionValue = "7 days"

/**
 * Days to keep a trashed transaction, or `null` to keep it forever. A value that
 * is not one of the choices also gives `null`: a setting we cannot read must not
 * delete anything.
 */
export function getTrashRetentionDays(value: string): number | null {
  return TRASH_RETENTION_CHOICES.find((c) => c.value === value)?.days ?? null
}
