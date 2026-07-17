import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg, type IconSvgName } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

interface StatCardProps {
  title: string
  icon: IconSvgName
  children?: ReactNode
  onPress?: () => void
  /** Dimmed placeholder with a "Soon" badge — never pressable */
  soon?: boolean
}

export function StatCard({
  title,
  icon,
  children,
  onPress,
  soon,
}: StatCardProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  return (
    <Pressable
      style={[styles.card, soon && styles.cardSoon]}
      onPress={soon ? undefined : onPress}
      disabled={soon || !onPress}
    >
      <View style={styles.header}>
        <IconSvg name={icon} size={16} color={theme.colors.primary} />
        <Text variant="muted" style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {soon ? (
          <View style={styles.soonBadge}>
            <Text style={styles.soonText}>
              {t("screens.stats.dashboard.soon")}
            </Text>
          </View>
        ) : onPress ? (
          <IconSvg
            name="chevron-right-outline"
            size={16}
            color={theme.colors.semantic.semi}
          />
        ) : null}
      </View>
      {children}
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  card: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 16,
    gap: 12,
  },
  cardSoon: {
    opacity: 0.45,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flex: 1,
    ...theme.typography.labelMedium,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  soonBadge: {
    backgroundColor: `${theme.colors.primary}30`,
    borderRadius: theme.radius,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  soonText: {
    ...theme.typography.labelXSmall,
    fontWeight: "700",
    color: theme.colors.primary,
  },
}))
