/**
 * DeleteRecurringSheet
 *
 * Shows 3 options when deleting a transaction that belongs to a recurring rule:
 *   1. This transaction   — soft-delete only this instance
 *   2. All transactions   — soft-delete rule + all instances
 *   3. This and future    — soft-delete rule + instances from this date onward
 */
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Alert } from "react-native"
import { useUnistyles } from "react-native-unistyles"

import { ActionChoiceSheet } from "~/components/action-choice-sheet"
import {
  applyRecurringDeleteScope,
  type RecurringTransactionTemplate,
} from "~/database/services/recurring-transaction-service"
import { autoConfirmationService } from "~/services/auto-confirmation-service"
import type { Transaction } from "~/types/transactions"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

type DeleteScope = "this" | "all" | "this_and_future"
interface DeleteRecurringSheetProps {
  visible: boolean
  transaction: Transaction
  recurringRule: RecurringTransactionTemplate
  onRequestClose: () => void
  onDeleted: () => void
}
export function DeleteRecurringSheet({
  visible,
  transaction,
  recurringRule,
  onRequestClose,
  onDeleted,
}: DeleteRecurringSheetProps) {
  const [loadingScope, setLoadingScope] = useState<DeleteScope | null>(null)
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const performDelete = async (scope: DeleteScope) => {
    if (loadingScope) return
    setLoadingScope(scope)
    autoConfirmationService.cancelSchedule(transaction.id)
    try {
      await applyRecurringDeleteScope({
        scope,
        transactionId: transaction.id,
        transactionDate: transaction.transactionDate,
        ruleId: recurringRule.id,
      })
      Toast.success({
        title: t(
          scope === "this"
            ? "components.transactionForm.toast.deleteRecurringSuccess"
            : scope === "all"
              ? "components.transactionForm.toast.deleteRecurringAllSuccess"
              : "components.transactionForm.toast.deleteRecurringFutureSuccess",
        ),
      })
      onRequestClose()
      onDeleted()
    } catch (error) {
      logger.error("DeleteRecurringSheet: failed to delete", {
        scope,
        error: error instanceof Error ? error.message : String(error),
      })
      Toast.error({
        title: t("components.transactionForm.toast.deleteRecurringFailed"),
      })
    }
    setLoadingScope(null)
  }
  const handleDelete = (scope: DeleteScope) => {
    if (scope === "all" || scope === "this_and_future") {
      Alert.alert(
        t("components.recurring.deleteSheet.confirmTitle"),
        t("components.recurring.deleteSheet.confirmMessage"),
        [
          {
            text: t("components.recurring.deleteSheet.cancel"),
            style: "cancel",
          },
          {
            text: t("components.recurring.deleteSheet.delete"),
            style: "destructive",
            onPress: () => performDelete(scope),
          },
        ],
      )
    } else {
      void performDelete(scope)
    }
  }
  return (
    <ActionChoiceSheet
      visible={visible}
      onClose={onRequestClose}
      icon="trash-outline"
      accentColor={theme.colors.error}
      title={t("components.recurring.deleteSheet.title")}
      subtitle={t("components.recurring.deleteSheet.subtitle")}
      cancelLabel={t("components.recurring.deleteSheet.cancel")}
      loadingKey={loadingScope}
      options={[
        {
          key: "this",
          label: t("components.recurring.deleteSheet.optionThis"),
          sublabel: t("components.recurring.deleteSheet.optionThisSublabel"),
          onPress: () => handleDelete("this"),
          destructive: true,
        },
        {
          key: "all",
          label: t("components.recurring.deleteSheet.optionAll"),
          sublabel: t("components.recurring.deleteSheet.optionAllSublabel"),
          onPress: () => handleDelete("all"),
          destructive: true,
        },
        {
          key: "this_and_future",
          label: t("components.recurring.deleteSheet.optionFuture"),
          sublabel: t("components.recurring.deleteSheet.optionFutureSublabel"),
          onPress: () => handleDelete("this_and_future"),
          destructive: true,
        },
      ]}
    />
  )
}
