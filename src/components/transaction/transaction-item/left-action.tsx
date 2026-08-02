import { TouchableOpacity } from "react-native-gesture-handler"
import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"

const RESTORE_ACTION_WIDTH = 128

type LeftActionProps = {
  progress: SharedValue<number>
  onRestorePress: () => void
  accessibilityLabel?: string
}

export const LeftAction = ({
  progress,
  onRestorePress,
  accessibilityLabel,
}: LeftActionProps) => {
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
      style={leftActionStyles.container}
      onPress={onRestorePress}
      activeOpacity={1}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Animated.View style={iconStyle}>
        <IconSvg
          name="restore-outline"
          size={24}
          color={leftActionStyles.restoreIcon.color}
        />
      </Animated.View>
    </TouchableOpacity>
  )
}

const leftActionStyles = StyleSheet.create((theme) => ({
  container: {
    width: RESTORE_ACTION_WIDTH,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.semantic.success,
  },
  restoreIcon: {
    color: theme.colors.onError,
  },
}))
