import { StyleSheet } from "react-native-unistyles"

import type { IconSvgName } from "~/components/ui/icon-svg"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

type AlertBannerProps = {
  text: string
  icon?: IconSvgName
}

export function InfoBanner({ text, icon = "info-circle" }: AlertBannerProps) {
  return (
    <View style={styles.container}>
      <IconSvg name={icon} size={20} color={styles.icon.color} />
      <Text style={styles.text}>{text}</Text>
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
  icon: {
    color: theme.colors.customColors.semi,
  },
  text: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.customColors.semi,
    lineHeight: 18,
    flex: 1,
  },
}))
