/**
 * Date range picker sheet: presets, Month, Year and Custom range.
 *
 * Month and Year open their own sheet in place of this one (this sheet closes
 * first), so the picker state lives here, above the range sheet's content.
 */

import { endOfMonth, endOfYear, startOfMonth, startOfYear } from "date-fns"
import { useEffect, useState } from "react"

import { MonthPickerSheet } from "~/components/month-picker-sheet"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import { YearPickerSheet } from "~/components/year-picker-sheet"

import { DateRangePresetSheetContent } from "./date-range-preset-sheet-content"
import type { DateRangePresetSheetProps } from "./types"

type Stage = "range" | "month" | "year"

export function DateRangePresetSheet({
  visible,
  initialStart,
  initialEnd,
  onSave,
  onRequestClose,
}: DateRangePresetSheetProps) {
  const [stage, setStage] = useState<Stage>("range")
  const now = new Date()

  // Always reopen on the range sheet.
  useEffect(() => {
    if (!visible) setStage("range")
  }, [visible])

  return (
    <>
      <BottomSheet
        isPresented={visible && stage === "range"}
        // Hiding this sheet to show the month / year picker also reports a
        // dismiss; only a real dismiss (stage still "range") closes everything.
        onDismiss={() => {
          if (stage === "range") onRequestClose()
        }}
        contentPadding={0}
        heightFraction={0.75}
      >
        <DateRangePresetSheetContent
          key={`${initialStart?.getTime() ?? 0}-${initialEnd?.getTime() ?? 0}`}
          initialStart={initialStart}
          initialEnd={initialEnd}
          onSave={onSave}
          onRequestClose={onRequestClose}
          onPickMonth={() => setStage("month")}
          onPickYear={() => setStage("year")}
        />
      </BottomSheet>

      <MonthPickerSheet
        visible={visible && stage === "month"}
        year={now.getFullYear()}
        month={now.getMonth()}
        onSelect={(year, month) => {
          const d = new Date(year, month, 1)
          onSave(startOfMonth(d), endOfMonth(d), "byMonth")
          onRequestClose()
        }}
        // Cancel / swipe away goes back to the range sheet. After Done the
        // parent has already closed (visible false), so nothing reopens.
        onClose={() => setStage("range")}
      />

      <YearPickerSheet
        visible={visible && stage === "year"}
        year={now.getFullYear()}
        onSelect={(year) => {
          const d = new Date(year, 0, 1)
          onSave(startOfYear(d), endOfYear(d), "byYear")
          onRequestClose()
        }}
        onClose={() => setStage("range")}
      />
    </>
  )
}
