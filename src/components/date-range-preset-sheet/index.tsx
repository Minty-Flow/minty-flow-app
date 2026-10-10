/**
 * Date range picker sheet with presets and collapsible By month, By year, Custom range.
 */

import { BottomSheet } from "~/components/ui/bottom-sheet"

import { DateRangePresetSheetContent } from "./date-range-preset-sheet-content"
import type { DateRangePresetSheetProps } from "./types"

export function DateRangePresetSheet({
  visible,
  initialStart,
  initialEnd,
  onSave,
  onRequestClose,
}: DateRangePresetSheetProps) {
  return (
    <BottomSheet
      isPresented={visible}
      onDismiss={onRequestClose}
      contentPadding={0}
      heightFraction={0.75}
    >
      <DateRangePresetSheetContent
        key={`${initialStart?.getTime() ?? 0}-${initialEnd?.getTime() ?? 0}`}
        initialStart={initialStart}
        initialEnd={initialEnd}
        onSave={onSave}
        onRequestClose={onRequestClose}
      />
    </BottomSheet>
  )
}
