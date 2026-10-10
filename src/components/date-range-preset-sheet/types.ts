import type { DateRangePresetId } from "~/utils/time-utils"

export interface DateRangePresetSheetProps {
  visible: boolean
  initialStart?: Date
  initialEnd?: Date
  onSave: (start: Date, end: Date, source: DateRangePresetId) => void
  onRequestClose: () => void
}

export type PresetButtonId =
  | "last30"
  | "thisWeek"
  | "thisMonth"
  | "thisYear"
  | "allTime"

export interface PresetOption {
  id: DateRangePresetId
  label: string
  getRange: () => { start: Date; end: Date }
}

export type ExpandedSection = "custom" | null

export interface DateRangePresetSheetContentProps {
  initialStart?: Date
  initialEnd?: Date
  onSave: (start: Date, end: Date, source: DateRangePresetId) => void
  onRequestClose: () => void
  /** Month / Year rows: the parent closes this sheet and opens the picker. */
  onPickMonth: () => void
  onPickYear: () => void
}
