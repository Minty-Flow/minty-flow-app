import type { ReactNode } from "react"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg, type IconSvgName } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

interface InsightCardProps {
  icon: IconSvgName
  badge: string
  sentence: ReactNode
  children?: ReactNode
}

export function InsightCard({
  icon,
  badge,
  sentence,
  children,
}: InsightCardProps) {
  const { theme } = useUnistyles()

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <IconSvg name={icon} size={16} color={theme.colors.primary} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      </View>
      <Text variant="large" style={styles.sentence}>
        {sentence}
      </Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 16,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    backgroundColor: `${theme.colors.primary}30`,
    borderRadius: theme.radius,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    ...theme.typography.labelXSmall,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: theme.colors.primary,
  },
  sentence: {
    fontWeight: "700",
  },
}))
