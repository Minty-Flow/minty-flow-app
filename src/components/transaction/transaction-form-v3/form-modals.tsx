import type { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { useTranslation } from "react-i18next"

import { ConfirmModal } from "~/components/confirm-modal"
import { DeleteRecurringModal } from "~/components/transaction/delete-recurring-modal"
import { EditRecurringModal } from "~/components/transaction/edit-recurring-modal"
import { LocationPickerModal } from "~/components/transaction/location-picker-modal"
import type RecurringTransactionModel from "~/database/models/recurring-transaction"
import type TransactionModel from "~/database/models/transaction"
import type { TransactionLocation } from "~/types/transactions"

import { FormDatePickerModal } from "./form-date-picker-modal"
import type { DatePickerState, ModalState } from "./types"

interface FormModalsProps {
  modals: ModalState
  setModals: (update: Partial<ModalState>) => void
  datePicker: DatePickerState
  location: TransactionLocation | null
  transaction: TransactionModel | null
  recurringRule: RecurringTransactionModel | null
  onConfirmExit: () => void
  onDestroyConfirm: () => void
  onLocationConfirm: (loc: TransactionLocation) => void
  onIosDateConfirm: () => void
  onIosDateChange: (evt: DateTimePickerEvent, selectedDate?: Date) => void
  onDatePickerClose: () => void
}

export function FormModals({
  modals,
  setModals,
  datePicker,
  location,
  transaction,
  recurringRule,
  onConfirmExit,
  onDestroyConfirm,
  onLocationConfirm,
  onIosDateConfirm,
  onIosDateChange,
  onDatePickerClose,
}: FormModalsProps) {
  const { t } = useTranslation()

  return (
    <>
      <FormDatePickerModal
        visible={datePicker.visible}
        mode={datePicker.mode}
        tempDate={datePicker.tempDate}
        onClose={onDatePickerClose}
        onConfirm={onIosDateConfirm}
        onChange={onIosDateChange}
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
        visible={modals.destroyModalVisible}
        onRequestClose={() => setModals({ destroyModalVisible: false })}
        onConfirm={onDestroyConfirm}
        title={t("common.modals.deletePermanently")}
        description={t("components.transactionForm.destroyModal.description")}
        confirmLabel={t("common.actions.delete")}
        cancelLabel={t("common.actions.cancel")}
        variant="destructive"
        icon="trash-can"
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
