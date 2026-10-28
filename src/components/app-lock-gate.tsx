import { BlurView } from "expo-blur"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useAppLockStore } from "~/stores/app-lock.store"

export function AppLockGate() {
  const { t } = useTranslation()
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
        {/* The whole screen is the tap target, so tapping anywhere unlocks. */}
        <Pressable
          onPress={attemptUnlock}
          disabled={isAuthenticating}
          accessibilityRole="button"
          accessibilityLabel={t("common.appLock.tapToUnlock")}
          style={styles.tapTarget}
        >
          {isLocked && !isAuthenticating ? (
            <Text style={styles.hint}>{t("common.appLock.tapToUnlock")}</Text>
          ) : null}
          <View
            style={[
              styles.lockButton,
              isAuthenticating && styles.lockButtonDim,
            ]}
          >
            <IconSvg
              // Closed while locked (including while the prompt is up); flips open
              // only once the fingerprint/PIN succeeds, then fades out.
              name={isLocked ? "lock-outline" : "lock-open-outline"}
              size={40}
              color={styles.iconColor.color}
            />
          </View>
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
  },
  tapTarget: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  lockButton: {
    padding: 24,
    borderRadius: 999,
    backgroundColor: theme.colors.secondary,
  },
  lockButtonDim: {
    opacity: 0.6,
  },
  iconColor: {
    color: theme.colors.onSecondary,
  },
  hint: {
    ...theme.typography.bodyMedium,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: "hidden",
    color: theme.colors.onSecondary,
    backgroundColor: theme.colors.secondary,
  },
}))
