import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated"
import { StyleSheet } from "react-native-unistyles"

import { IconSymbol } from "~/components/ui/icon-symbol"
import { Pressable } from "~/components/ui/pressable"
import { View } from "~/components/ui/view"

const RESTORE_ACTION_WIDTH = 100

type LeftActionProps = {
  progress: SharedValue<number>
  translation: SharedValue<number>
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
    <View style={leftActionStyles.container}>
      <Pressable
        style={leftActionStyles.pressable}
        onPress={onRestorePress}
        accessibilityLabel={accessibilityLabel}
      >
        <Animated.View style={iconStyle}>
          <IconSymbol
            name="restore"
            size={24}
            color={leftActionStyles.restoreIcon.color}
          />
        </Animated.View>
      </Pressable>
    </View>
  )
}

const leftActionStyles = StyleSheet.create((theme) => ({
  container: {
    width: RESTORE_ACTION_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.customColors.success,
  },
  pressable: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  restoreIcon: {
    color: theme.colors.onError,
  },
}))
