import { StyleSheet } from "react-native-unistyles"

import { IconSvg, type IconSvgName } from "~/components/icons"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

interface DataCardProps {
  icon: IconSvgName
  title: string
  description: string
  onPress: () => void
  loading?: boolean
}

export function DataCard({
  icon,
  title,
  description,
  onPress,
  loading,
}: DataCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      disabled={loading}
    >
      <View style={styles.cardIconContainer}>
        {loading ? (
          <ActivityIndicatorMinty size="small" />
        ) : (
          <IconSvg name={icon} size={22} />
        )}
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  card: {
    flexGrow: 1,
    flexBasis: "47%",
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 16,
    minHeight: 150,
  },
  cardPressed: {
    opacity: 0.8,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardTitle: {
    ...theme.typography.bodyLarge,
    fontWeight: "700",
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.onSecondary,
    lineHeight: 18,
  },
}))
