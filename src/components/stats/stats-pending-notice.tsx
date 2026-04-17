import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { PendingSummary } from "~/types/stats"

interface StatsPendingNoticeProps {
  pendingSummary: PendingSummary | null
  currency: string
}

export function StatsPendingNotice({
  pendingSummary,
}: StatsPendingNoticeProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  // Render nothing when there is no pending data
  if (!pendingSummary || pendingSummary.count === 0) return null

  return (
    <View style={styles.banner}>
      <IconSvg name="info-circle" size={18} color={theme.colors.primary} />
      <Text style={styles.message}>
        {t("screens.stats.pendingNotice", { count: pendingSummary.count })}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    marginHorizontal: 16,
    borderRadius: theme.radius,
    // primary color at ~10% opacity using hex suffix "18"
    backgroundColor: `${theme.colors.primary}18`,
  },
  message: {
    flex: 1,
    color: theme.colors.primary,
    fontSize: theme.typography.bodyMedium.fontSize,
  },
}))
