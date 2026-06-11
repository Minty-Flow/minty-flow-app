import type { RecurringFrequency } from "~/types/transactions"

export const RECURRING_OPTIONS: { id: RecurringFrequency; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "biweekly", label: "Biweekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
]

export const EMPTY_TAG_IDS: string[] = []

export const ENDS_ON_OCCURRENCE_PRESETS = [2, 4, 6, 8, 10, 12, 14]
