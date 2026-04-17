import { useCallback } from "react"
import { Platform, TouchableOpacity } from "react-native"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { StyleSheet } from "react-native-unistyles"
import { scheduleOnRN, scheduleOnUI } from "react-native-worklets"

import type { IconSvgName } from "~/components/ui/icon-svg"
import { IconSvg } from "~/components/ui/icon-svg"
import { type Toast, useToastStore } from "~/stores/toast.store"

import { Pressable } from "./pressable"
import { Text } from "./text"
import { View } from "./view"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

type ToastItemProps = {
  toast: Toast
  onHide: (id: string) => void
}

const ToastItem = ({ toast, onHide }: ToastItemProps) => {
  // Capture toast properties for use in worklets
  const toastPosition = toast.position
  const toastAutoHide = toast.autoHide
  const toastShowProgressBar = toast.showProgressBar
  const toastVisibilityTime = toast.visibilityTime
  const toastId = toast.id

  // Animated values for custom animations with withSequence
  const translateY = useSharedValue(toastPosition === "top" ? -100 : 100)
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.8)
  const progressWidth = useSharedValue(100)
  const autoHideTimer = useSharedValue(0)
  const hasAnimated = useSharedValue(false)

  const handleHide = useCallback(() => {
    onHide(toastId)
  }, [onHide, toastId])

  const triggerHide = useCallback(() => {
    // Exit animation sequence: scale down slightly → fade and slide out
    scale.value = withTiming(0.95, { duration: 100 })
    opacity.value = withDelay(
      50,
      withTiming(0, { duration: 200, easing: Easing.in(Easing.ease) }),
    )
    translateY.value = withDelay(
      50,
      withTiming(toastPosition === "top" ? -100 : 100, {
        duration: 200,
        easing: Easing.in(Easing.ease),
      }),
    )

    // Wait for animation to complete before hiding
    progressWidth.value = withDelay(
      300,
      withTiming(0, { duration: 0 }, () => {
        scheduleOnRN(handleHide)
      }),
    )
  }, [handleHide, toastPosition, opacity, scale, translateY, progressWidth])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }))

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }))

  const handlePress = () => {
    if (toast.onPress) {
      toast.onPress()
    } else {
      triggerHide()
    }
  }

  const getIconName = (): IconSvgName => {
    switch (toast.type) {
      case "success":
        return "check"
      case "error":
        return "alert-circle"
      case "warn":
        return "alert-triangle"
      case "info":
        return "info-circle"
      default:
        return "bell"
    }
  }

  const getIconColor = () => {
    switch (toast.type) {
      case "success":
        return toastItemStyles.iconSuccess.color
      case "error":
        return toastItemStyles.iconError.color
      case "warn":
        return toastItemStyles.iconWarn.color
      case "info":
        return toastItemStyles.iconInfo.color
      default:
        return toastItemStyles.iconDefault.color
    }
  }
  const getProgressBarColorStyle = () => {
    switch (toast.type) {
      case "success":
        return toastItemStyles.progressBarSuccess
      case "error":
        return toastItemStyles.progressBarError
      case "warn":
        return toastItemStyles.progressBarWarn
      case "info":
        return toastItemStyles.progressBarInfo
      default:
        return toastItemStyles.progressBarDefault
    }
  }

  const handleLayout = useCallback(() => {
    scheduleOnUI(() => {
      "worklet"
      if (hasAnimated.value) return
      hasAnimated.value = true

      // Enter animation sequence: slide in → small bounce → settle
      translateY.value = withSequence(
        withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) }),
      )

      // Fade and scale in sequence
      opacity.value = withTiming(1, { duration: 300 })
      scale.value = withSequence(
        withTiming(1.05, { duration: 200, easing: Easing.out(Easing.ease) }),
      )

      // Progress bar animation
      if (toastShowProgressBar && toastAutoHide) {
        progressWidth.value = withTiming(0, {
          duration: toastVisibilityTime,
          easing: Easing.linear,
        })
      }

      // Auto-hide with exit animation
      if (toastAutoHide) {
        // Use a dedicated timer for auto-hide
        autoHideTimer.value = withDelay(
          toastVisibilityTime,
          withTiming(1, { duration: 0 }, () => {
            scheduleOnRN(triggerHide)
          }),
        )
      }
    })
  }, [
    hasAnimated,
    translateY,
    opacity,
    scale,
    progressWidth,
    autoHideTimer,
    toastShowProgressBar,
    toastAutoHide,
    toastVisibilityTime,
    triggerHide,
  ])

  return (
    <AnimatedPressable
      style={[toastStyles.container, animatedStyle]}
      onPress={handlePress}
      onLayout={handleLayout}
    >
      <View native style={toastStyles.content}>
        <IconSvg name={getIconName()} size={24} color={getIconColor()} />
        <View native style={toastStyles.textContainer}>
          {toast.title && <Text style={toastStyles.text1}>{toast.title}</Text>}
          {toast.description && (
            <Text style={toastStyles.text2}>{toast.description}</Text>
          )}
        </View>
        {toast.showCloseIcon && (
          <TouchableOpacity
            onPress={triggerHide}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={toastStyles.closeButton}
          >
            <IconSvg
              name="x"
              size={20}
              color={
                toastItemStyles.closeIcon &&
                typeof toastItemStyles.closeIcon === "object" &&
                "color" in toastItemStyles.closeIcon
                  ? (toastItemStyles.closeIcon as { color: string }).color
                  : undefined
              }
            />
          </TouchableOpacity>
        )}
      </View>
      {toast.showProgressBar && (
        <View native style={toastStyles.progressBarContainer}>
          <Animated.View
            style={[
              toastStyles.progressBar,
              getProgressBarColorStyle(),
              progressStyle,
            ]}
          />
        </View>
      )}
    </AnimatedPressable>
  )
}

export const ToastManager = () => {
  const { toasts, hide } = useToastStore()

  if (toasts.length === 0) {
    return null
  }

  const topToasts = toasts.filter((t) => t.position === "top")
  const bottomToasts = toasts.filter((t) => t.position === "bottom")

  return (
    <View native style={toastStyles.overlay} pointerEvents="box-none">
      {topToasts.length > 0 && (
        <View native style={toastStyles.topContainer} pointerEvents="box-none">
          {topToasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onHide={hide} />
          ))}
        </View>
      )}
      {bottomToasts.length > 0 && (
        <View
          native
          style={toastStyles.bottomContainer}
          pointerEvents="box-none"
        >
          {bottomToasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onHide={hide} />
          ))}
        </View>
      )}
    </View>
  )
}

const toastItemStyles = StyleSheet.create((theme) => ({
  iconSuccess: {
    color: theme.colors.customColors.success,
  },
  iconError: {
    color: theme.colors.error,
  },
  iconWarn: {
    color: theme.colors.customColors.warning,
  },
  iconInfo: {
    color: theme.colors.customColors.info,
  },
  iconDefault: {
    color: theme.colors.onSurface,
  },
  closeIcon: {
    color: theme.colors.onSurface,
  },
  progressBarSuccess: {
    backgroundColor: theme.colors.customColors.success,
  },
  progressBarError: {
    backgroundColor: theme.colors.error,
  },
  progressBarWarn: {
    backgroundColor: theme.colors.customColors.warning,
  },
  progressBarInfo: {
    backgroundColor: theme.colors.customColors.info,
  },
  progressBarDefault: {
    backgroundColor: theme.colors.primary,
  },
}))

const toastStyles = StyleSheet.create((theme) => ({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: "transparent",
  },
  topContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.select({ ios: 60, android: 50, web: 20, default: 50 }),
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
    zIndex: 9999,
    pointerEvents: "box-none",
    _android: {
      elevation: 9999,
    },
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.select({
      ios: 40,
      android: 50,
      web: 20,
      default: 50,
    }),
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
    zIndex: 9999,
    pointerEvents: "box-none",
    _android: {
      elevation: 9999,
    },
  },
  container: {
    width: "100%",
    maxWidth: 400,
    borderRadius: theme.radius,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 60,
    pointerEvents: "auto",
    backgroundColor: theme.colors.secondary,
    _web: {
      boxShadow: theme.colors.boxShadow,
      cursor: "pointer",
    },
    _ios: {
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    _android: {
      elevation: 8,
    },
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  text1: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  text2: {
    fontSize: theme.typography.labelLarge.fontSize,
    color: theme.colors.onSecondary,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  progressBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderBottomLeftRadius: theme.radius,
    borderBottomRightRadius: theme.radius,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderBottomLeftRadius: theme.radius,
    borderBottomRightRadius: theme.radius,
  },
}))
