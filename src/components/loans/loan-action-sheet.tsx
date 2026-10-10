/**
 * LoanActionSheet
 *
 * Bottom sheet shown on the loan detail page.
 * Offers two action options:
 *   - Full action:    "Collect All" (LENT) or "Settle All" (BORROWED)
 *   - Partial action: "Partially Collect" (LENT) or "Partially Settle" (BORROWED)
 *
 * Follows the option-row pattern from edit-recurring-sheet.tsx.
 */

import { useTranslation } from "react-i18next"
import { Pressable, View } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import { ListItem } from "~/components/ui/list-item"
import { Text } from "~/components/ui/text"
import { type LoanType, LoanTypeEnum } from "~/types/loans"

import { ChevronIcon } from "../ui/chevron-icon"

interface LoanActionSheetProps {
  visible: boolean
  loanType: LoanType
  isLoading: boolean
  onFullAction: () => void
  onPartialAction: () => void
  onClose: () => void
}

interface OptionRowProps {
  label: string
  sublabel: string
  onPress: () => void
  /** When true, shows ActivityIndicatorMinty instead of chevron */
  showSpinner: boolean
  /** When true, row is non-interactive and rendered at reduced opacity */
  disabled: boolean
  isLast?: boolean
}

function OptionRow({
  label,
  sublabel,
  onPress,
  showSpinner,
  disabled,
  isLast,
}: OptionRowProps) {
  const { theme } = useUnistyles()

  return (
    <ListItem
      style={({ pressed }) => [
        styles.optionRow,
        !isLast && styles.optionRowBorder,
        pressed && !disabled && styles.optionRowPressed,
        disabled && styles.optionRowDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      disableRipple={disabled}
    >
      <View style={styles.optionRowContent}>
        <Text style={styles.optionLabel}>{label}</Text>
        <Text style={styles.optionSublabel}>{sublabel}</Text>
      </View>
      {showSpinner ? (
        <ActivityIndicatorMinty size="small" />
      ) : (
        <ChevronIcon
          direction="trailing"
          size={20}
          color={theme.colors.onSecondary}
          style={styles.optionChevron}
        />
      )}
    </ListItem>
  )
}

export function LoanActionSheet({
  visible,
  loanType,
  isLoading,
  onFullAction,
  onPartialAction,
  onClose,
}: LoanActionSheetProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  const isLent = loanType === LoanTypeEnum.LENT

  // Translation keys vary by loan type
  const sheetTitle = isLent
    ? t("screens.settings.loans.actions.collect")
    : t("screens.settings.loans.actions.settle")

  const fullActionLabel = isLent
    ? t("screens.settings.loans.actions.collectAll")
    : t("screens.settings.loans.actions.settleAll")

  const fullActionSublabel = isLent
    ? t("screens.settings.loans.actions.collectAllDesc")
    : t("screens.settings.loans.actions.settleAllDesc")

  const partialActionLabel = isLent
    ? t("screens.settings.loans.actions.partialCollect")
    : t("screens.settings.loans.actions.partialSettle")

  const partialActionSublabel = isLent
    ? t("screens.settings.loans.actions.partialCollectDesc")
    : t("screens.settings.loans.actions.partialSettleDesc")

  return (
    <BottomSheet
      isPresented={visible}
      onDismiss={onClose}
      dismissable={!isLoading}
    >
      <View style={styles.card}>
        {/* Icon + title header */}
        <View style={styles.header}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: `${theme.colors.primary}20` },
            ]}
          >
            <IconSvg
              name="wallet-outline"
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.title}>{sheetTitle}</Text>
        </View>

        {/* Action option rows */}
        <View style={styles.optionsCard}>
          <OptionRow
            label={fullActionLabel}
            sublabel={fullActionSublabel}
            onPress={onFullAction}
            showSpinner={isLoading}
            disabled={isLoading}
          />
          <OptionRow
            label={partialActionLabel}
            sublabel={partialActionSublabel}
            onPress={onPartialAction}
            showSpinner={false}
            disabled={isLoading}
            isLast
          />
        </View>

        {/* Cancel button */}
        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.cancelButtonPressed,
          ]}
          onPress={onClose}
          disabled={isLoading}
        >
          <Text style={styles.cancelText}>{t("common.actions.cancel")}</Text>
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
  optionsCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    backgroundColor: `${theme.colors.onSurface}10`,
    borderColor: theme.colors.semantic.semi,
  },
  optionRow: {},
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
