/**
 * Bottom sheet that asks the user to pick one of a few actions: an icon + title
 * header, a card of option rows (label, sublabel, chevron), and a cancel button.
 * Used for recurring edit / delete scopes and loan collect / settle.
 */
import { useTranslation } from "react-i18next"
import { Pressable, View } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import type { IconSvgName } from "~/components/icons"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { ListItem } from "~/components/ui/list-item"
import { SheetIconHeader } from "~/components/ui/sheet-icon-header"
import { Text } from "~/components/ui/text"

export interface ActionChoiceOption {
  key: string
  label: string
  sublabel: string
  onPress: () => void
  destructive?: boolean
}

interface ActionChoiceSheetProps {
  visible: boolean
  onClose: () => void
  icon: IconSvgName
  /** Header icon, its tinted circle, and the row spinner use this color. */
  accentColor: string
  title: string
  subtitle?: string
  options: ActionChoiceOption[]
  /** Option whose action is running: it shows a spinner and every row is disabled. */
  loadingKey?: string | null
  cancelLabel?: string
}

export function ActionChoiceSheet({
  visible,
  onClose,
  icon,
  accentColor,
  title,
  subtitle,
  options,
  loadingKey = null,
  cancelLabel,
}: ActionChoiceSheetProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const isLoading = loadingKey != null

  return (
    <BottomSheet
      isPresented={visible}
      onDismiss={onClose}
      dismissable={!isLoading}
    >
      <View style={styles.card}>
        <SheetIconHeader
          icon={icon}
          accentColor={accentColor}
          title={title}
          subtitle={subtitle}
        />

        <View style={styles.optionsCard}>
          {options.map((option, index) => {
            const isRowLoading = option.key === loadingKey
            return (
              <ListItem
                key={option.key}
                style={({ pressed }) => [
                  index < options.length - 1 && styles.optionRowBorder,
                  pressed && !isLoading && styles.optionRowPressed,
                  isLoading && !isRowLoading && styles.optionRowDisabled,
                ]}
                onPress={option.onPress}
                disabled={isLoading}
                disableRipple={isLoading}
              >
                <View style={styles.optionRowContent}>
                  <Text
                    style={[
                      styles.optionLabel,
                      option.destructive && styles.optionLabelDestructive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.optionSublabel}>{option.sublabel}</Text>
                </View>
                {isRowLoading ? (
                  <ActivityIndicatorMinty size="small" color={accentColor} />
                ) : (
                  <ChevronIcon
                    direction="trailing"
                    size={20}
                    color={
                      option.destructive
                        ? theme.colors.error
                        : theme.colors.onSecondary
                    }
                    style={styles.optionChevron}
                  />
                )}
              </ListItem>
            )
          })}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.cancelButtonPressed,
          ]}
          onPress={onClose}
          disabled={isLoading}
        >
          <Text style={styles.cancelText}>
            {cancelLabel ?? t("common.actions.cancel")}
          </Text>
        </Pressable>
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create((theme) => ({
  card: {
    paddingVertical: 8,
    gap: 16,
  },
  optionsCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    backgroundColor: `${theme.colors.onSurface}10`,
    borderColor: theme.colors.semantic.semi,
  },
  optionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.semantic.semi,
  },
  optionRowPressed: { opacity: 0.7 },
  optionRowDisabled: { opacity: 0.5 },
  optionRowContent: { flex: 1, gap: 2 },
  optionLabel: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    letterSpacing: -0.2,
    color: theme.colors.onSurface,
  },
  optionLabelDestructive: { color: theme.colors.error },
  optionSublabel: {
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: "400",
    color: theme.colors.onSecondary,
  },
  optionChevron: { marginLeft: 8 },
  cancelButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: `${theme.colors.onSurface}10`,
    borderColor: theme.colors.semantic.semi,
  },
  cancelButtonPressed: { opacity: 0.7 },
  cancelText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
}))
