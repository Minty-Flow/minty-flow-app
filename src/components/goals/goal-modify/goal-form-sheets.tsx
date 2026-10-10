import { useTranslation } from "react-i18next"

import { ConfirmSheet } from "~/components/confirm-sheet"
import type { Goal } from "~/types/goals"

interface GoalFormSheetsProps {
  deleteSheetVisible: boolean
  archiveSheetVisible: boolean
  unsavedSheetVisible: boolean
  isAddMode: boolean
  goal?: Goal
  onCloseDeleteSheet: () => void
  onCloseArchiveSheet: () => void
  onCloseUnsavedSheet: () => void
  onConfirmDelete: () => void
  onConfirmArchive: () => void
  onDiscardAndNavigate: () => void
}

export function GoalFormSheets({
  deleteSheetVisible,
  archiveSheetVisible,
  unsavedSheetVisible,
  isAddMode,
  goal,
  onCloseDeleteSheet,
  onCloseArchiveSheet,
  onCloseUnsavedSheet,
  onConfirmDelete,
  onConfirmArchive,
  onDiscardAndNavigate,
}: GoalFormSheetsProps) {
  const { t } = useTranslation()

  const isArchived = goal?.isArchived ?? false

  return (
    <>
      {!isAddMode && goal && (
        <ConfirmSheet
          visible={deleteSheetVisible}
          onRequestClose={onCloseDeleteSheet}
          onConfirm={onConfirmDelete}
          title={t("common.sheets.deletePermanently")}
          note={t("common.sheets.deleteNoteGoal")}
          confirmLabel={t("common.actions.delete")}
          cancelLabel={t("common.actions.cancel")}
          variant="destructive"
          icon="trash-outline"
        />
      )}

      {!isAddMode && goal && (
        <ConfirmSheet
          visible={archiveSheetVisible}
          onRequestClose={onCloseArchiveSheet}
          onConfirm={onConfirmArchive}
          title={
            isArchived
              ? t("screens.settings.goals.form.archiveSheet.unarchiveTitle")
              : t("screens.settings.goals.form.archiveSheet.archiveTitle")
          }
          confirmLabel={
            isArchived
              ? t("screens.settings.goals.form.archiveSheet.unarchiveConfirm")
              : t("screens.settings.goals.form.archiveSheet.archiveConfirm")
          }
          cancelLabel={t("common.actions.cancel")}
          variant="default"
          icon={isArchived ? "archive-off-outline" : "archive-outline"}
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
