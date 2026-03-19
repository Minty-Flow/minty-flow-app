import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { IconSvg, type IconSvgName } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

interface ActionItemProps {
  icon: IconSvgName
  title: string
  description?: string
  onPress: () => void
  soon?: boolean
  loading?: boolean
}

export function ActionItem({
  icon,
  title,
  description,
  onPress,
  soon,
  loading,
}: ActionItemProps) {
  const { t } = useTranslation()

  return (
    <Pressable
      style={() => [
        styles.actionItem,
        // state.pressed && styles.actionItemPressed,
        soon && { opacity: 0.5 },
      ]}
      onPress={onPress}
      disabled={loading}
    >
      <View style={styles.actionItemLeft}>
        <View style={styles.iconContainer}>
          <IconSvg name={icon} size={24} />
        </View>
        <View style={styles.actionItemContent}>
          <View style={styles.titleRow}>
            <Text variant="default" style={styles.actionItemTitle}>
              {title}
            </Text>
            {soon && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{t("common.states.soon")}</Text>
              </View>
            )}
          </View>
          {description && (
            <Text variant="small" style={styles.actionItemDescription}>
              {description}
            </Text>
          )}
        </View>
      </View>
      {loading ? (
        <ActivityIndicatorMinty size="small" />
      ) : (
        <ChevronIcon direction="trailing" size={18} />
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  // actionItemPressed: {
  //   opacity: 0.8,
  // },
  actionItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 15,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  actionItemContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  actionItemDescription: {
    fontSize: 13,
    color: theme.colors.onSecondary,
  },
  badge: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },
}))
