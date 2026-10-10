import { TouchableOpacity } from "react-native-gesture-handler"
import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"

const ACTION_WIDTH = 128

type SwipeActionProps = {
  progress: SharedValue<number>
  /** "trash" (red, right side) or "restore" (green, left side). */
  kind: "trash" | "restore"
  onPress: () => void
  accessibilityLabel?: string
}

/** Action revealed behind a swiped transaction row; the icon grows in as it opens. */
export const SwipeAction = ({
  progress,
  kind,
  onPress,
  accessibilityLabel,
}: SwipeActionProps) => {
  const iconStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.5, 1], "clamp")
    const opacity = interpolate(
      progress.value,
      [0, 0.5, 1],
      [0, 0.5, 1],
      "clamp",
    )
    return { transform: [{ scale }], opacity }
  })

  return (
    <TouchableOpacity
      style={[
        styles.container,
        kind === "trash" ? styles.trash : styles.restore,
      ]}
      onPress={onPress}
      activeOpacity={1}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Animated.View style={iconStyle}>
        <IconSvg
          name={kind === "trash" ? "trash-outline" : "restore-outline"}
          size={24}
          color={styles.icon.color}
        />
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    width: ACTION_WIDTH,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  trash: {
    backgroundColor: theme.colors.error,
  },
  restore: {
    backgroundColor: theme.colors.semantic.success,
  },
  icon: {
    color: theme.colors.onError,
  },
}))
