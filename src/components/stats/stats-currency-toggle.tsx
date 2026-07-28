import { useCallback } from "react"
import { useTranslation } from "react-i18next"
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
import { View } from "~/components/ui/view"
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
  const { t } = useTranslation()
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
    <Pressable onPress={handlePress} hitSlop={12}>
      <View style={styles.wrap}>
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
            color={theme.colors.primary}
            style={styles.swap}
          />
        </Animated.View>

        <Text variant="muted" style={styles.helper}>
          {t("screens.stats.currency.showing", { currency: value })} ·{" "}
          {t("screens.stats.currency.tapToSwitch")}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  wrap: {
    alignItems: "center",
    gap: 6,
  },
  capsule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.secondary,
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary + "33",
  },
  symbol: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  code: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: theme.colors.onSurface,
  },
  swap: {
    marginLeft: 3,
    opacity: 0.75,
  },
  helper: {
    fontSize: theme.typography.labelSmall.fontSize,
    textAlign: "center",
  },
}))
