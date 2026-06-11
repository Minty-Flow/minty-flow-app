import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import type { IconSvgName } from "~/components/ui/icon-svg"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

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
    >
      {isSelected && (
        <View style={styles.checkBadge}>
          <IconSvg name="check" size={14} color={styles.checkColor.color} />
        </View>
      )}
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
  },
  tileAdded: {
    opacity: 0.5,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: `${theme.colors.onSecondary}35`,
  },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkColor: {
    color: theme.colors.onPrimary,
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
