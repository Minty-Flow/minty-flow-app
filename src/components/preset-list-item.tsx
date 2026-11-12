import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import type { IconSvgName } from "~/components/icons"
import { Checkbox } from "~/components/ui/checkbox"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"

interface PresetListItemProps {
  icon: IconSvgName
  label: string
  isSelected: boolean
  /** The user already has it: shown checked and dimmed, can't be toggled. */
  isAdded: boolean
  /** The last row of its card has no divider under it. */
  isLast: boolean
  onPress: () => void
}

/**
 * One preset as a checklist row. The name wraps to any length and the row
 * keeps its shape when toggled: only colours change.
 */
export function PresetListItem({
  icon,
  label,
  isSelected,
  isAdded,
  isLast,
  onPress,
}: PresetListItemProps) {
  return (
    <Pressable
      style={[
        styles.row,
        !isLast && styles.divider,
        isSelected && styles.rowSelected,
        isAdded && styles.rowAdded,
      ]}
      onPress={onPress}
      disabled={isAdded}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: isSelected || isAdded, disabled: isAdded }}
    >
      <DynamicIcon icon={icon} size={20} variant="badge" />
      <Text style={styles.label}>{label}</Text>
      <Checkbox checked={isSelected || isAdded} />
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  row: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.semantic.semi,
  },
  rowSelected: {
    backgroundColor: `${theme.colors.primary}14`,
  },
  rowAdded: {
    opacity: 0.5,
  },
  label: {
    flex: 1,
    ...theme.typography.bodyLarge,
    color: theme.colors.onSurface,
  },
}))
