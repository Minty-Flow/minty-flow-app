import { useTranslation } from "react-i18next"

import { ConfirmSheet } from "~/components/confirm-sheet"

interface BudgetFormSheetsProps {
  deleteSheetVisible: boolean
  unsavedSheetVisible: boolean
  isAddMode: boolean
  onCloseDeleteSheet: () => void
  onCloseUnsavedSheet: () => void
  onConfirmDelete: () => Promise<boolean | undefined>
  onDeleted: () => void
  onDiscardAndNavigate: () => void
}

export function BudgetFormSheets({
  deleteSheetVisible,
  unsavedSheetVisible,
  isAddMode,
  onCloseDeleteSheet,
  onCloseUnsavedSheet,
  onConfirmDelete,
  onDeleted,
  onDiscardAndNavigate,
}: BudgetFormSheetsProps) {
  const { t } = useTranslation()

  return (
    <>
      {!isAddMode && (
        <ConfirmSheet
          visible={deleteSheetVisible}
          onRequestClose={onCloseDeleteSheet}
          onConfirm={onConfirmDelete}
          onConfirmed={onDeleted}
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
        onConfirm={() => undefined}
        onConfirmed={onDiscardAndNavigate}
        title={t("common.sheets.closeWithoutSaving")}
        description={t("common.sheets.unsavedDescription")}
        confirmLabel={t("common.actions.discard")}
        cancelLabel={t("common.actions.cancel")}
        variant="default"
      />
    </>
  )
}
