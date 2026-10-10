/**
 * LoanActionSheet
 *
 * Bottom sheet shown on the loan detail page.
 * Offers two action options:
 *   - Full action:    "Collect All" (LENT) or "Settle All" (BORROWED)
 *   - Partial action: "Partially Collect" (LENT) or "Partially Settle" (BORROWED)
 */

import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { ActionChoiceSheet } from "~/components/action-choice-sheet"
import { type LoanType, LoanTypeEnum } from "~/types/loans"

interface LoanActionSheetProps {
  visible: boolean
  loanType: LoanType
  isLoading: boolean
  onFullAction: () => void
  onPartialAction: () => void
  onClose: () => void
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
    <ActionChoiceSheet
      visible={visible}
      onClose={onClose}
      icon="wallet-outline"
      accentColor={theme.colors.primary}
      title={sheetTitle}
      loadingKey={isLoading ? "full" : null}
      options={[
        {
          key: "full",
          label: fullActionLabel,
          sublabel: fullActionSublabel,
          onPress: onFullAction,
        },
        {
          key: "partial",
          label: partialActionLabel,
          sublabel: partialActionSublabel,
          onPress: onPartialAction,
        },
      ]}
    />
  )
}
