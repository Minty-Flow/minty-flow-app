import { StyleSheet, useUnistyles } from "react-native-unistyles"

import type { IconSvgName } from "~/components/icons"
import { IconSvg } from "~/components/icons"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

type EmptyStateVariant = "default" | "compact"

interface EmptyStateProps {
  icon?: IconSvgName
  title: string
  description?: string
  variant?: EmptyStateVariant
  /** What the user can do about it, e.g. add the first item. */
  action?: { label: string; onPress: () => void }
}

export function EmptyState({
  icon,
  title,
  description,
  variant = "default",
  action,
}: EmptyStateProps) {
  const { theme } = useUnistyles()
  const isCompact = variant === "compact"
  const iconSize = isCompact ? 32 : 48

  return (
    <View style={[styles.container, isCompact && styles.containerCompact]}>
      {icon ? (
        <IconSvg
          name={icon}
          size={iconSize}
          color={theme.colors.onSecondary}
          style={[styles.icon, isCompact && styles.iconCompact]}
        />
      ) : null}
      <Text
        variant="default"
        style={[styles.title, isCompact && styles.titleCompact]}
      >
        {title}
      </Text>
      {description ? (
        <Text variant="small" style={styles.description}>
          {description}
        </Text>
      ) : null}
      {action ? (
        <Button
          variant="secondary"
          style={styles.action}
          onPress={action.onPress}
        >
          <Text>{action.label}</Text>
        </Button>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create((t) => ({
  action: {
    marginTop: 16,
  },
  container: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.colors.secondary,
    borderRadius: t.radius,
    marginTop: 8,
  },
  containerCompact: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    borderRadius: 0,
    marginTop: 0,
  },
  icon: {
    opacity: 0.5,
    marginBottom: 16,
  },
  iconCompact: {
    marginBottom: 8,
  },
  title: {
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
    color: t.colors.onSurface,
  },
  titleCompact: {
    marginBottom: 4,
    color: t.colors.onSecondary,
  },
  description: {
    color: t.colors.onSecondary,
    textAlign: "center",
  },
}))
