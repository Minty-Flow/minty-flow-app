import { useTranslation } from "react-i18next"

import { ConfirmSheet } from "~/components/confirm-sheet"
import type { Budget } from "~/types/budgets"

interface BudgetFormSheetsProps {
  deleteSheetVisible: boolean
  unsavedSheetVisible: boolean
  isAddMode: boolean
  budget?: Budget
  onCloseDeleteSheet: () => void
  onCloseUnsavedSheet: () => void
  onConfirmDelete: () => void
  onDiscardAndNavigate: () => void
}

export function BudgetFormSheets({
  deleteSheetVisible,
  unsavedSheetVisible,
  isAddMode,
  budget,
  onCloseDeleteSheet,
  onCloseUnsavedSheet,
  onConfirmDelete,
  onDiscardAndNavigate,
}: BudgetFormSheetsProps) {
  const { t } = useTranslation()

  return (
    <>
      {!isAddMode && budget && (
        <ConfirmSheet
          visible={deleteSheetVisible}
          onRequestClose={onCloseDeleteSheet}
          onConfirm={onConfirmDelete}
          title={t("common.sheets.deletePermanently")}
          note={t("common.sheets.deleteNoteBudget")}
          confirmLabel={t("common.actions.delete")}
          cancelLabel={t("common.actions.cancel")}
          variant="destructive"
          icon="trash-outline"
        />
      )}

      <ConfirmSheet
        visible={unsavedSheetVisible}
        onRequestClose={onCloseUnsavedSheet}
        onConfirm={onDiscardAndNavigate}
        title={t("common.sheets.closeWithoutSaving")}
        description={t("common.sheets.unsavedDescription")}
        confirmLabel={t("common.actions.discard")}
        cancelLabel={t("common.actions.cancel")}
        variant="default"
      />
    </>
  )
}
