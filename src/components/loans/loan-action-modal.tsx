/**
 * LoanActionModal
 *
 * Bottom-sheet style modal shown on the loan detail page.
 * Offers two action options:
 *   - Full action:    "Collect All" (LENT) or "Settle All" (BORROWED)
 *   - Partial action: "Partially Collect" (LENT) or "Partially Settle" (BORROWED)
 *
 * Follows the option-row pattern from edit-recurring-modal.tsx.
 */

import { useTranslation } from "react-i18next"
import {
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { type LoanType, LoanTypeEnum } from "~/types/loans"

import { ChevronIcon } from "../ui/chevron-icon"

interface LoanActionModalProps {
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
    <Pressable
      style={({ pressed }) => [
        styles.optionRow,
        !isLast && styles.optionRowBorder,
        pressed && !disabled && styles.optionRowPressed,
        disabled && styles.optionRowDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      android_ripple={disabled ? null : { color: theme.colors.rippleColor }}
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
    </Pressable>
  )
}

export function LoanActionModal({
  visible,
  loanType,
  isLoading,
  onFullAction,
  onPartialAction,
  onClose,
}: LoanActionModalProps) {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const maxCardWidth = Math.min(width - 48, 400)
  const { theme } = useUnistyles()

  const isLent = loanType === LoanTypeEnum.LENT

  // Translation keys vary by loan type
  const modalTitle = isLent
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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <Pressable
        style={[styles.backdrop, { width }]}
        onPress={onClose}
        accessibilityLabel={t("common.actions.close")}
      >
        <TouchableWithoutFeedback onPress={() => {}}>
          <View
            style={[
              styles.card,
              {
                maxWidth: maxCardWidth,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius ?? 16,
              },
            ]}
            pointerEvents="box-none"
          >
            {/* Icon + title header */}
            <View style={styles.header}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${theme.colors.primary}20` },
                ]}
              >
                <IconSvg name="wallet" size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.title}>{modalTitle}</Text>
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
              <Text style={styles.cancelText}>
                {t("common.actions.cancel")}
              </Text>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create((theme) => ({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.shadow,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 24,
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
    fontSize: 18,
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
    borderColor: theme.colors.customColors.semi,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  optionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.customColors.semi,
  },
  optionRowPressed: { opacity: 0.7 },
  optionRowDisabled: { opacity: 0.5 },
  optionRowContent: { flex: 1, gap: 2 },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.2,
    color: theme.colors.onSurface,
  },
  optionSublabel: {
    fontSize: 13,
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
    borderColor: theme.colors.customColors.semi,
  },
  cancelButtonPressed: { opacity: 0.7 },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
}))
