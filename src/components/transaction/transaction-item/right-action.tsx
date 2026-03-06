import { useTranslation } from "react-i18next"
import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated"
import { StyleSheet } from "react-native-unistyles"

import { IconSymbol } from "~/components/ui/icon-symbol"
import { Pressable } from "~/components/ui/pressable"
import { View } from "~/components/ui/view"

const TRASH_ACTION_WIDTH = 100

type RightActionProps = {
  progress: SharedValue<number>
  translation: SharedValue<number>
  onTrashPress: () => void
  accessibilityLabel?: string
}

export const RightAction = ({
  progress,
  onTrashPress,
  accessibilityLabel: accessibilityLabelProp,
}: RightActionProps) => {
  const { t } = useTranslation()
  const accessibilityLabel =
    accessibilityLabelProp ?? t("screens.settings.trash.a11y.moveToTrash")
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
    <View style={rightActionStyles.container}>
      <Pressable
        style={rightActionStyles.pressable}
        onPress={onTrashPress}
        accessibilityLabel={accessibilityLabel}
      >
        <Animated.View style={iconStyle}>
          <IconSymbol
            name="trash-can"
            size={24}
            color={rightActionStyles.trashIcon.color}
          />
        </Animated.View>
      </Pressable>
    </View>
  )
}

const rightActionStyles = StyleSheet.create((theme) => ({
  container: {
    width: TRASH_ACTION_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.error,
  },
  pressable: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  trashIcon: {
    color: theme.colors.onError,
  },
}))
