import { View } from "react-native"

import { Chip } from "~/components/ui/chips"

import { filterHeaderStyles } from "../filter-header.styles"
import { PanelClearButton } from "../panel-clear-button"
import { PanelDoneButton } from "../panel-done-button"

interface ChipOptionsPanelProps<T extends string> {
  options: { id: T; label: string }[]
  isSelected: (id: T) => boolean
  onPress: (id: T) => void
  onDone: () => void
  /** Shows a Clear button when given. */
  onClear?: () => void
  clearDisabled?: boolean
}

/** Filter panel for a fixed set of options: wrapping chips + Clear / Done. */
export function ChipOptionsPanel<T extends string>({
  options,
  isSelected,
  onPress,
  onDone,
  onClear,
  clearDisabled,
}: ChipOptionsPanelProps<T>) {
  return (
    <View>
      <View
        style={[filterHeaderStyles.chipWrap, filterHeaderStyles.categoryRow]}
      >
        {options.map((opt) => (
          <Chip
            key={opt.id}
            label={opt.label}
            selected={isSelected(opt.id)}
            onPress={() => onPress(opt.id)}
          />
        ))}
      </View>
      <View style={filterHeaderStyles.panelHeader}>
        <View />
        <View style={filterHeaderStyles.panelHeaderActions}>
          {onClear ? (
            <PanelClearButton onPress={onClear} disabled={clearDisabled} />
          ) : null}
          <PanelDoneButton onPress={onDone} />
        </View>
      </View>
    </View>
  )
}
