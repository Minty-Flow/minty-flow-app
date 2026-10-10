import type { StyleProp, ViewStyle } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { Pressable } from "~/components/ui/pressable"

interface FabProps {
  onPress: () => void
  accessibilityLabel: string
  style?: StyleProp<ViewStyle>
}

/** Floating "+" button pinned to the bottom corner of a list screen. */
export function Fab({ onPress, accessibilityLabel, style }: FabProps) {
  const { theme } = useUnistyles()
  return (
    <Pressable
      onPress={onPress}
      style={[styles.fab, style]}
      accessibilityLabel={accessibilityLabel}
    >
      <IconSvg name="plus-outline" size={24} color={theme.colors.onPrimary} />
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
}))
