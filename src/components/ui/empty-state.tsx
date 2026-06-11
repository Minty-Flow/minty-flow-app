import { StyleSheet } from "react-native-unistyles"

import type { IconSvgName } from "~/components/ui/icon-svg"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

type EmptyStateVariant = "default" | "compact"

interface EmptyStateProps {
  icon?: IconSvgName
  title: string
  description?: string
  variant?: EmptyStateVariant
}

// TODO: icon colors are not changing fast on theme change
export function EmptyState({
  icon,
  title,
  description,
  variant = "default",
}: EmptyStateProps) {
  const isCompact = variant === "compact"
  const iconSize = isCompact ? 32 : 48

  return (
    <View style={[styles.container, isCompact && styles.containerCompact]}>
      {icon ? (
        <IconSvg
          name={icon}
          size={iconSize}
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
    </View>
  )
}

const styles = StyleSheet.create((t) => ({
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
    color: t.colors.onSecondary,
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
