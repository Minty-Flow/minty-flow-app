import { useTranslation } from "react-i18next"

import { ConfirmSheet } from "~/components/confirm-sheet"
import { DeleteRecurringSheet } from "~/components/transaction/delete-recurring-sheet"
import { EditRecurringSheet } from "~/components/transaction/edit-recurring-sheet"
import { LocationPickerModal } from "~/components/transaction/location-picker-modal"
import { DateTimePickerSheet } from "~/components/ui/date-time-picker"
import type { RecurringTransactionTemplate } from "~/database/services/recurring-transaction-service"
import type {
  Recurrence,
  Transaction,
  TransactionLocation,
} from "~/types/transactions"

import type { DatePickerState, OverlayState } from "./types"

interface FormOverlaysProps {
  overlays: OverlayState
  setOverlays: (update: Partial<OverlayState>) => void
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
  onLocationDelete: () => void
  onIosDateConfirm: (date: Date) => void
  onDatePickerClose: () => void
}

export function FormOverlays({
  overlays,
  setOverlays,
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
  onLocationDelete,
  onIosDateConfirm,
  onDatePickerClose,
}: FormOverlaysProps) {
  const { t } = useTranslation()

  return (
    <>
      <DateTimePickerSheet
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
        visible={overlays.locationPickerVisible}
        initialLocation={location}
        onConfirm={onLocationConfirm}
        onDelete={() => {
          onLocationDelete()
          setOverlays({ locationPickerVisible: false })
        }}
        onRequestClose={() => setOverlays({ locationPickerVisible: false })}
      />

      <ConfirmSheet
        visible={overlays.unsavedSheetVisible}
        onRequestClose={() => setOverlays({ unsavedSheetVisible: false })}
        onConfirm={() => {
          setOverlays({ unsavedSheetVisible: false })
          onConfirmExit()
        }}
        title={t("common.sheets.closeWithoutSaving")}
        description={t("common.sheets.unsavedDescription")}
        confirmLabel={t("common.actions.discard")}
        cancelLabel={t("common.actions.cancel")}
        variant="default"
      />

      <ConfirmSheet
        visible={overlays.deleteLoanSheetVisible}
        onRequestClose={() => setOverlays({ deleteLoanSheetVisible: false })}
        onConfirm={onDeleteLoanConfirm}
        title={t("components.transactionForm.deleteLoanSheet.title")}
        description={t(
          "components.transactionForm.deleteLoanSheet.description",
        )}
        confirmLabel={t("common.actions.delete")}
        cancelLabel={t("common.actions.cancel")}
        variant="destructive"
        icon="trash-outline"
      />

      <ConfirmSheet
        visible={overlays.destroySheetVisible}
        onRequestClose={() => setOverlays({ destroySheetVisible: false })}
        onConfirm={onDestroyConfirm}
        title={t("common.sheets.deletePermanently")}
        description={t("components.transactionForm.destroySheet.description")}
        confirmLabel={t("common.actions.delete")}
        cancelLabel={t("common.actions.cancel")}
        variant="destructive"
        icon="trash-outline"
      />

      {transaction?.recurringId && recurringRule && (
        <>
          <DeleteRecurringSheet
            visible={overlays.deleteRecurringSheetVisible}
            transaction={transaction}
            recurringRule={recurringRule}
            onRequestClose={() =>
              setOverlays({ deleteRecurringSheetVisible: false })
            }
            onDeleted={onConfirmExit}
          />
          <EditRecurringSheet
            visible={overlays.editRecurringSheetVisible}
            transaction={transaction}
            recurringRule={recurringRule}
            pendingPayload={overlays.pendingEditPayload}
            recurrence={recurrenceForEdit}
            until={untilForEdit}
            onRequestClose={() => {
              setOverlays({
                editRecurringSheetVisible: false,
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
