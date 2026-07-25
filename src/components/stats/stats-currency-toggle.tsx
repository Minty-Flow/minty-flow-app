import { useCallback } from "react"
import { Pressable } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { Text } from "~/components/ui/text"
import { currencyRegistryService } from "~/services/currency-registry"

interface StatsCurrencyToggleProps {
  currencies: string[]
  value: string
  onChange: (currency: string) => void
}

export function StatsCurrencyToggle({
  currencies,
  value,
  onChange,
}: StatsCurrencyToggleProps) {
  const { theme } = useUnistyles()
  const opacity = useSharedValue(1)
  const scale = useSharedValue(1)

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const handlePress = useCallback(() => {
    const nextIdx = (currencies.indexOf(value) + 1) % currencies.length
    onChange(currencies[nextIdx])

    // ponytail: subtle fade-dip + gentle spring; tweak if feels sluggish
    opacity.value = withSequence(
      withTiming(0.6, { duration: 50 }),
      withTiming(1, { duration: 100 }),
    )
    scale.value = withSequence(
      withSpring(0.95, { damping: 18 }),
      withSpring(1, { damping: 14 }),
    )
  }, [currencies, value, onChange, opacity, scale])

  if (currencies.length <= 1) return null

  const symbol = currencyRegistryService.getCurrencySymbol(value)
  const moreThan2 = currencies.length > 2

  return (
    <Pressable onPress={handlePress} hitSlop={8}>
      <Animated.View style={[styles.capsule, animStyle]}>
        <Text style={styles.symbol} native>
          {symbol}
        </Text>
        <Text style={styles.code} native>
          {value}
        </Text>
        <IconSvg
          name={moreThan2 ? "repeat-outline" : "arrows-right-left-outline"}
          size={14}
          color={theme.colors.onSecondary}
          style={styles.swap}
        />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  capsule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: theme.colors.secondary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: theme.colors.semantic.semi,
  },
  symbol: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  code: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: theme.colors.onSecondary,
  },
  swap: {
    marginLeft: 3,
    opacity: 0.5,
  },
}))
