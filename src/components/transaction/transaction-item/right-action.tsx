import { useTranslation } from "react-i18next"
import { TouchableOpacity } from "react-native-gesture-handler"
import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"

const TRASH_ACTION_WIDTH = 128

type RightActionProps = {
  progress: SharedValue<number>
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
    <TouchableOpacity
      style={rightActionStyles.container}
      onPress={onTrashPress}
      activeOpacity={1}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Animated.View style={iconStyle}>
        <IconSvg
          name="trash-outline"
          size={24}
          color={rightActionStyles.trashIcon.color}
        />
      </Animated.View>
    </TouchableOpacity>
  )
}

const rightActionStyles = StyleSheet.create((theme) => ({
  container: {
    width: TRASH_ACTION_WIDTH,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.error,
  },
  trashIcon: {
    color: theme.colors.onError,
  },
}))
