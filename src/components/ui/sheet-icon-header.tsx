import { View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg, type IconSvgName } from "~/components/icons"
import { Text } from "~/components/ui/text"

interface SheetIconHeaderProps {
  icon: IconSvgName
  /** Icon color; the circle behind it is a light tint of it. */
  accentColor: string
  title: string
  subtitle?: string
}

/** Centered sheet header: icon in a tinted circle, title, optional subtitle. */
export function SheetIconHeader({
  icon,
  accentColor,
  title,
  subtitle,
}: SheetIconHeaderProps) {
  return (
    <View style={styles.header}>
      <View
        style={[styles.iconCircle, { backgroundColor: `${accentColor}20` }]}
      >
        <IconSvg name={icon} size={24} color={accentColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  header: {
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    ...theme.typography.headlineSmall,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.3,
    color: theme.colors.onSurface,
  },
  subtitle: {
    fontSize: theme.typography.labelLarge.fontSize,
    textAlign: "center",
    color: theme.colors.onSecondary,
  },
}))
