/**
 * EditRecurringSheet
 *
 * Shows 2 options when saving edits to a transaction that belongs to a recurring rule:
 *   1. This transaction        — update only this instance (detach from rule)
 *   2. This and future         — update this instance + all future ones + update rule template
 *
 * Past confirmed transactions are never retroactively changed.
 */
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { ActionChoiceSheet } from "~/components/action-choice-sheet"
import {
  applyRecurringEditScope,
  type RecurringTransactionTemplate,
} from "~/database/services/recurring-transaction-service"
import type { RecurringEditPayload } from "~/schemas/transactions.schema"
import type { Recurrence, Transaction } from "~/types/transactions"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

type EditScope = "this" | "this_and_future"
interface EditRecurringSheetProps {
  visible: boolean
  transaction: Transaction
  recurringRule: RecurringTransactionTemplate
  pendingPayload: RecurringEditPayload | null
  /** Current recurrence-card values; only applied on "this and future". */
  recurrence?: Recurrence
  until?: Date | null
  onRequestClose: () => void
  onSaved: () => void
}
export function EditRecurringSheet({
  visible,
  transaction,
  recurringRule,
  pendingPayload,
  recurrence,
  until,
  onRequestClose,
  onSaved,
}: EditRecurringSheetProps) {
  const [loadingScope, setLoadingScope] = useState<EditScope | null>(null)
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const handleEdit = async (scope: EditScope) => {
    if (loadingScope || !pendingPayload) return
    setLoadingScope(scope)
    try {
      await applyRecurringEditScope({
        scope,
        transactionId: transaction.id,
        transactionDate: transaction.transactionDate,
        ruleId: recurringRule.id,
        payload: pendingPayload,
        recurrence,
        until,
      })
      Toast.success({
        title: t(
          scope === "this"
            ? "components.transactionForm.toast.editRecurringSuccess"
            : "components.transactionForm.toast.editRecurringFutureSuccess",
        ),
      })
      onRequestClose()
      onSaved()
    } catch (error) {
      logger.error("EditRecurringSheet: failed to save", {
        scope,
        error: error instanceof Error ? error.message : String(error),
      })
      Toast.error({
        title: t("components.transactionForm.toast.editRecurringFailed"),
      })
    }
    setLoadingScope(null)
  }
  return (
    <ActionChoiceSheet
      visible={visible}
      onClose={onRequestClose}
      icon="pencil-outline"
      accentColor={theme.colors.semantic?.success ?? theme.colors.primary}
      title={t("components.recurring.editSheet.title")}
      subtitle={t("components.recurring.editSheet.subtitle")}
      cancelLabel={t("components.recurring.editSheet.cancel")}
      loadingKey={loadingScope}
      options={[
        {
          key: "this",
          label: t("components.recurring.editSheet.optionThis"),
          sublabel: t("components.recurring.editSheet.optionThisSublabel"),
          onPress: () => handleEdit("this"),
        },
        {
          key: "this_and_future",
          label: t("components.recurring.editSheet.optionFuture"),
          sublabel: t("components.recurring.editSheet.optionFutureSublabel"),
          onPress: () => handleEdit("this_and_future"),
        },
      ]}
    />
  )
}
