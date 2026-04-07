import { BlurView } from "expo-blur"
import { useEffect } from "react"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { useAppLockStore } from "~/stores/app-lock.store"

export function AppLockGate() {
  const lockAppEnabled = useAppLockStore((s) => s.lockAppEnabled)
  const isLocked = useAppLockStore((s) => s.isLocked)
  const isAuthenticating = useAppLockStore((s) => s.isAuthenticating)
  const attemptUnlock = useAppLockStore((s) => s.attemptUnlock)

  const opacity = useSharedValue(isLocked ? 1 : 0)

  useEffect(() => {
    opacity.value = withTiming(isLocked ? 1 : 0, {
      duration: isLocked ? 300 : 400,
    })
  }, [isLocked, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    // Blocks all touches when locked, passes through when faded out
    pointerEvents: opacity.value > 0 ? "auto" : "none",
  }))

  if (!lockAppEnabled) return null

  return (
    <Animated.View
      style={[styles.overlay, animatedStyle]}
      importantForAccessibility={isLocked ? "yes" : "no-hide-descendants"}
      accessibilityElementsHidden={!isLocked}
    >
      <BlurView intensity={80} tint="regular" style={styles.fill}>
        <Pressable
          onPress={attemptUnlock}
          disabled={isAuthenticating}
          style={styles.lockButton}
        >
          <IconSvg name={isAuthenticating ? "lock-open" : "lock"} size={40} />
        </Pressable>
      </BlurView>
    </Animated.View>
  )
}

const styles = StyleSheet.create((theme) => ({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  fill: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lockButton: {
    padding: 24,
    borderRadius: 999,
    backgroundColor: `${theme.colors.surface}55`,
  },
}))
