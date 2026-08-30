import { useTranslation } from "react-i18next"

import { ConfirmModal } from "~/components/confirm-modal"
import { DeleteRecurringModal } from "~/components/transaction/delete-recurring-modal"
import { EditRecurringModal } from "~/components/transaction/edit-recurring-modal"
import { LocationPickerModal } from "~/components/transaction/location-picker-modal"
import { DateTimePickerModal } from "~/components/ui/date-time-picker"
import type { RecurringTransactionTemplate } from "~/database/services/recurring-transaction-service"
import type {
  Recurrence,
  Transaction,
  TransactionLocation,
} from "~/types/transactions"

import type { DatePickerState, ModalState } from "./types"

interface FormModalsProps {
  modals: ModalState
  setModals: (update: Partial<ModalState>) => void
  datePicker: DatePickerState
  location: TransactionLocation | null
  transaction: Transaction | null
  recurringRule: RecurringTransactionTemplate | null
  recurrenceForEdit?: Recurrence
  untilForEdit?: Date | null
  onConfirmExit: () => void
  onDestroyConfirm: () => void
  onDeleteLoanConfirm: () => void
  onLocationConfirm: (loc: TransactionLocation) => void
  onIosDateConfirm: (date: Date) => void
  onDatePickerClose: () => void
}

export function FormModals({
  modals,
  setModals,
  datePicker,
  location,
  transaction,
  recurringRule,
  recurrenceForEdit,
  untilForEdit,
  onConfirmExit,
  onDestroyConfirm,
  onDeleteLoanConfirm,
  onLocationConfirm,
  onIosDateConfirm,
  onDatePickerClose,
}: FormModalsProps) {
  const { t } = useTranslation()

  return (
    <>
      <DateTimePickerModal
        visible={datePicker.visible}
        mode={datePicker.mode}
        value={datePicker.tempDate}
        onClose={onDatePickerClose}
        onConfirm={onIosDateConfirm}
        confirmLabel={
          datePicker.mode === "date"
            ? "common.actions.next"
            : "common.actions.add"
        }
      />

      <LocationPickerModal
        visible={modals.locationPickerVisible}
        initialLocation={location}
        onConfirm={onLocationConfirm}
        onRequestClose={() => setModals({ locationPickerVisible: false })}
      />

      <ConfirmModal
        visible={modals.unsavedModalVisible}
        onRequestClose={() => setModals({ unsavedModalVisible: false })}
        onConfirm={() => {
          setModals({ unsavedModalVisible: false })
          onConfirmExit()
        }}
        title={t("common.modals.closeWithoutSaving")}
        description={t("common.modals.unsavedDescription")}
        confirmLabel={t("common.actions.discard")}
        cancelLabel={t("common.actions.cancel")}
        variant="default"
      />

      <ConfirmModal
        visible={modals.deleteLoanModalVisible}
        onRequestClose={() => setModals({ deleteLoanModalVisible: false })}
        onConfirm={onDeleteLoanConfirm}
        title={t("components.transactionForm.deleteLoanModal.title")}
        description={t(
          "components.transactionForm.deleteLoanModal.description",
        )}
        confirmLabel={t("common.actions.delete")}
        cancelLabel={t("common.actions.cancel")}
        variant="destructive"
        icon="trash-outline"
      />

      <ConfirmModal
        visible={modals.destroyModalVisible}
        onRequestClose={() => setModals({ destroyModalVisible: false })}
        onConfirm={onDestroyConfirm}
        title={t("common.modals.deletePermanently")}
        description={t("components.transactionForm.destroyModal.description")}
        confirmLabel={t("common.actions.delete")}
        cancelLabel={t("common.actions.cancel")}
        variant="destructive"
        icon="trash-outline"
      />

      {transaction?.recurringId && recurringRule && (
        <>
          <DeleteRecurringModal
            visible={modals.deleteRecurringModalVisible}
            transaction={transaction}
            recurringRule={recurringRule}
            onRequestClose={() =>
              setModals({ deleteRecurringModalVisible: false })
            }
            onDeleted={onConfirmExit}
          />
          <EditRecurringModal
            visible={modals.editRecurringModalVisible}
            transaction={transaction}
            recurringRule={recurringRule}
            pendingPayload={modals.pendingEditPayload}
            recurrence={recurrenceForEdit}
            until={untilForEdit}
            onRequestClose={() => {
              setModals({
                editRecurringModalVisible: false,
                pendingEditPayload: null,
              })
            }}
            onSaved={onConfirmExit}
          />
        </>
      )}
    </>
  )
}
