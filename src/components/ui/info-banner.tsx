import { StyleSheet } from "react-native-unistyles"

import type { IconSvgName } from "~/components/icons"
import { IconSvg } from "~/components/icons"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

type AlertBannerProps = {
  text: string
  icon?: IconSvgName
  onDismiss?: () => void
  dismissLabel?: string
}

export function InfoBanner({
  text,
  icon = "info-circle",
  onDismiss,
  dismissLabel = "Dismiss",
}: AlertBannerProps) {
  return (
    <View style={[styles.container, onDismiss && styles.dismissibleContainer]}>
      <IconSvg name={icon} size={20} color={styles.icon.color} />
      <Text style={styles.text}>{text}</Text>
      {onDismiss && (
        <Pressable
          accessibilityLabel={dismissLabel}
          onPress={onDismiss}
          style={styles.dismissButton}
        >
          <IconSvg name="x-outline" size={18} color={styles.icon.color} />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  dismissibleContainer: {
    marginHorizontal: 20,
    padding: 12,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
  },
  icon: {
    color: theme.colors.semantic.semi,
  },
  text: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.semantic.semi,
    lineHeight: 18,
    flex: 1,
  },
  dismissButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -12,
    marginRight: -12,
    borderRadius: theme.radius,
  },
}))
