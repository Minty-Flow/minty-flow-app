import {
  Pressable as RNPressable,
  type PressableProps as RNPressableProps,
} from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { useAndroidSoundStore } from "~/stores/android-sound.store"

interface PressableProps extends RNPressableProps {
  native?: boolean
  disableRipple?: boolean
}

export const Pressable = ({
  native,
  style,
  disableRipple,
  accessibilityRole = "button",
  ...props
}: PressableProps) => {
  const disableSound = useAndroidSoundStore((s) => s.disableSound)

  const sharedRipple = disableRipple
    ? undefined
    : {
        color: pressableStyles.ripple.color,
        foreground: true, // <-- KEY TO MAKE IT SHOW
      }

  if (native)
    return (
      <RNPressable
        style={style}
        android_disableSound={disableSound}
        android_ripple={sharedRipple}
        accessibilityRole={accessibilityRole}
        {...props}
      />
    )

  return (
    <RNPressable
      style={
        typeof style === "function"
          ? (state) => [style(state), pressableStyles.base]
          : [style, pressableStyles.base]
      }
      android_ripple={sharedRipple}
      android_disableSound={disableSound}
      accessibilityRole={accessibilityRole}
      {...props}
    />
  )
}

const pressableStyles = StyleSheet.create((theme) => ({
  base: {
    overflow: "hidden",
  },
  ripple: {
    color: theme.colors.rippleColor,
  },
}))
