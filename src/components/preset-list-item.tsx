import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import type { IconSvgName } from "~/components/icons"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"

interface PresetListItemProps {
  icon: IconSvgName
  label: string
  isSelected: boolean
  isAdded: boolean
  onPress: () => void
}

export function PresetListItem({
  icon,
  label,
  isSelected,
  isAdded,
  onPress,
}: PresetListItemProps) {
  return (
    <Pressable
      style={[
        styles.tile,
        isSelected && styles.tileSelected,
        isAdded && styles.tileAdded,
      ]}
      onPress={onPress}
      disabled={isAdded}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSelected, disabled: isAdded }}
    >
      <DynamicIcon icon={icon} size={32} />
      <Text
        style={[styles.tileLabel, isSelected && styles.tileLabelSelected]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  tile: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 10,
  },
  tileSelected: {
    backgroundColor: `${theme.colors.primary}22`,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  tileAdded: {
    opacity: 0.5,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: `${theme.colors.onSecondary}35`,
  },
  tileLabel: {
    fontSize: theme.typography.labelSmall.fontSize,
    fontWeight: "600",
    color: theme.colors.onSurface,
    textAlign: "center",
  },
  tileLabelSelected: {
    color: theme.colors.primary,
  },
}))
