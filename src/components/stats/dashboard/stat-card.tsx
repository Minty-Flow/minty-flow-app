import type { ReactNode } from "react"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg, type IconSvgName } from "~/components/icons"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

interface StatCardProps {
  title: string
  icon: IconSvgName
  children?: ReactNode
  onPress?: () => void
}

export function StatCard({ title, icon, children, onPress }: StatCardProps) {
  const { theme } = useUnistyles()

  return (
    <Pressable style={styles.card} onPress={onPress} disabled={!onPress}>
      <View style={styles.header}>
        <IconSvg name={icon} size={16} color={theme.colors.primary} />
        <Text variant="muted" style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {onPress ? (
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
    // In a side-by-side row the cards stretch to the same height; the content
    // spreads so the shorter one doesn't look empty.
    justifyContent: "space-between",
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flex: 1,
    ...theme.typography.labelSmall,
    color: theme.colors.semantic.semi,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
}))
