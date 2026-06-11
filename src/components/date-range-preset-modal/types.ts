import type { DateRangePresetId } from "~/utils/time-utils"

export interface DateRangePresetModalProps {
  visible: boolean
  initialStart?: Date
  initialEnd?: Date
  onSave: (start: Date, end: Date) => void
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

export type ExpandedSection = "byMonth" | "byYear" | "custom" | null
export type ActiveSource = "preset" | "byMonth" | "byYear" | "custom"

export interface DateRangePresetModalContentProps {
  initialStart?: Date
  initialEnd?: Date
  onSave: (start: Date, end: Date) => void
  onRequestClose: () => void
}
