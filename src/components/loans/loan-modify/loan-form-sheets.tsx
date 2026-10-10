import { useTranslation } from "react-i18next"

import { ConfirmSheet } from "~/components/confirm-sheet"

import type { LoanFormSheetsProps } from "./types"

export function LoanFormSheets({
  deleteSheetVisible,
  unsavedSheetVisible,
  isAddMode,
  loan,
  onCloseDeleteSheet,
  onCloseUnsavedSheet,
  onConfirmDelete,
  onDiscardAndNavigate,
}: LoanFormSheetsProps) {
  const { t } = useTranslation()

  return (
    <>
      {!isAddMode && loan && (
        <ConfirmSheet
          visible={deleteSheetVisible}
          onRequestClose={onCloseDeleteSheet}
          onConfirm={onConfirmDelete}
          title={t("common.sheets.deletePermanently")}
          note={t("common.sheets.deleteNoteLoan")}
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
