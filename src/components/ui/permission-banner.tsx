import type { PressableProps } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg, type IconSvgName } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

interface PermissionBannerProps extends PressableProps {
  message: string
  icon?: IconSvgName
  showBanner: boolean
}

export function PermissionBanner({
  message,
  icon = "alert-triangle",
  onPress,
  showBanner,
  ...props
}: PermissionBannerProps) {
  if (!showBanner) return null

  return (
    <Pressable onPress={onPress} style={styles.container} {...props}>
      <View style={styles.iconWrap}>
        <IconSvg name={icon} size={20} color={styles.icon.color} />
      </View>
      <Text variant="default" style={styles.text} numberOfLines={2}>
        {message}
      </Text>
      <IconSvg name="external-link" size={20} style={styles.openInNew} />
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: theme.radius,
    backgroundColor: `${theme.colors.error}18`, // ~10% opacity tint
    borderWidth: 1,
    borderColor: `${theme.colors.error}40`,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: theme.colors.error,
  },
  text: {
    flex: 1,
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: "600",
    color: theme.colors.error,
    lineHeight: 18,
  },
  openInNew: {
    marginLeft: "auto",
    color: theme.colors.error,
  },
}))
