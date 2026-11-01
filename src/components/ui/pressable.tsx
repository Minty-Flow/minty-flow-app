import type { ComponentRef, Ref } from "react"
import type { StyleProp, ViewStyle } from "react-native"
import {
  Platform,
  Pressable as RNPressable,
  type PressableProps as RNPressableProps,
} from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { useAndroidSoundStore } from "~/stores/android-sound.store"

interface PressableProps extends RNPressableProps {
  native?: boolean
  disableRipple?: boolean
  ref?: Ref<ComponentRef<typeof RNPressable>>
}

export const Pressable = ({
  native,
  style,
  disableRipple,
  accessibilityRole = "button",
  ref,
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
        ref={ref}
        style={style}
        android_disableSound={disableSound}
        android_ripple={sharedRipple}
        accessibilityRole={accessibilityRole}
        {...props}
      />
    )

  // iOS has no ripple, so a press needs its own feedback. The clip that keeps
  // the Android ripple inside rounded corners would also cut off an iOS shadow,
  // so it is Android-only and sits before the caller's style, which can override.
  const withBase = (resolved: RNPressableProps["style"], pressed = false) => [
    Platform.OS === "android" ? pressableStyles.base : undefined,
    resolved as StyleProp<ViewStyle>,
    Platform.OS === "ios" && pressed && !disableRipple
      ? pressableStyles.pressedIos
      : undefined,
  ]

  return (
    <RNPressable
      ref={ref}
      style={(state) =>
        withBase(
          typeof style === "function" ? style(state) : style,
          state.pressed,
        )
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
  pressedIos: {
    opacity: 0.6,
  },
  ripple: {
    color: theme.rippleColor,
  },
}))
