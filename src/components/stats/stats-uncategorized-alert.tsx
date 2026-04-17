import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { UncategorizedSummary } from "~/types/stats"

interface StatsUncategorizedAlertProps {
  uncategorizedSummary: UncategorizedSummary | null
  currency: string
  onCategorizePress: () => void
}

export function StatsUncategorizedAlert({
  uncategorizedSummary,
  onCategorizePress,
}: StatsUncategorizedAlertProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  if (!uncategorizedSummary || uncategorizedSummary.count === 0) return null

  return (
    <View style={styles.banner}>
      <IconSvg
        name="alert-circle"
        size={18}
        color={theme.colors.customColors.expense}
      />
      <View style={styles.content}>
        <Text style={styles.title}>
          {t("screens.stats.uncategorized.title", {
            count: uncategorizedSummary.count,
          })}
        </Text>
        <Text variant="muted" style={styles.description}>
          {t("screens.stats.uncategorized.description")}
        </Text>
        <Pressable onPress={onCategorizePress} style={styles.ctaRow}>
          <Text style={styles.ctaText}>
            {t("screens.stats.uncategorized.categorizeNow")}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  banner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    marginHorizontal: 16,
    borderRadius: theme.radius,
    backgroundColor: `${theme.colors.customColors.expense}18`,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...theme.typography.bodyMedium,
    fontWeight: "600",
    color: theme.colors.customColors.expense,
  },
  description: {
    fontSize: theme.typography.labelMedium.fontSize,
  },
  ctaRow: {
    alignSelf: "flex-end",
    marginTop: 4,
  },
  ctaText: {
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.primary,
    fontWeight: "600",
  },
}))
