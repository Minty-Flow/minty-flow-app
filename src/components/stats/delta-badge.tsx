import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

interface DeltaBadgeProps {
  current: number
  previous: number | null | undefined
  /** When true, a lower value is "good" (expense). Default false (income/net). */
  invertedSentiment?: boolean
  size?: "sm" | "md"
}

export function DeltaBadge({
  current,
  previous,
  invertedSentiment = false,
  size = "sm",
}: DeltaBadgeProps) {
  const { t } = useTranslation()

  if (previous == null || previous === 0) {
    return (
      <View style={styles.container}>
        <Text
          variant="muted"
          style={size === "sm" ? styles.textSm : styles.textMd}
        >
          {t("screens.stats.delta.notAvailable")}
        </Text>
      </View>
    )
  }

  const delta = ((current - previous) / Math.abs(previous)) * 100
  const isPositive = delta > 0
  const isNegative = delta < 0

  // "Good" depends on sentiment: for expense, decrease is good; for income, increase is good
  const isGood = invertedSentiment ? isNegative : isPositive

  const formattedDelta = `${isPositive ? "+" : ""}${delta.toFixed(1)}%`
  const iconName = isPositive ? "trending-up" : "trending-down"
  const iconSize = size === "sm" ? 12 : 14

  return (
    <View style={[styles.container, isGood ? styles.goodBg : styles.badBg]}>
      <Text
        style={[
          size === "sm" ? styles.textSm : styles.textMd,
          isGood ? styles.goodText : styles.badText,
        ]}
      >
        {formattedDelta}
      </Text>
      <IconSvg
        name={iconName}
        size={iconSize}
        color={isGood ? styles.goodText.color : styles.badText.color}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius,
  },
  goodBg: {
    backgroundColor: `${theme.colors.customColors.income}18`,
  },
  badBg: {
    backgroundColor: `${theme.colors.customColors.expense}18`,
  },
  goodText: {
    color: theme.colors.customColors.income,
  },
  badText: {
    color: theme.colors.customColors.expense,
  },
  textSm: {
    ...theme.typography.labelXSmall,
    fontWeight: "600",
  },
  textMd: {
    ...theme.typography.bodyMedium,
    fontWeight: "600",
  },
}))
