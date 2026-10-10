import { useTranslation } from "react-i18next"

import { ConfirmSheet } from "~/components/confirm-sheet"
import type { Account } from "~/types/accounts"

interface AccountFormSheetsProps {
  deleteSheetVisible: boolean
  archiveSheetVisible: boolean
  unsavedSheetVisible: boolean
  isAddMode: boolean
  account: Account | undefined
  transactionCount: number
  onCloseDeleteSheet: () => void
  onCloseArchiveSheet: () => void
  onCloseUnsavedSheet: () => void
  onConfirmDelete: () => void
  onConfirmArchive: () => void
  onDiscardAndNavigate: () => void
}

export function AccountFormSheets({
  deleteSheetVisible,
  archiveSheetVisible,
  unsavedSheetVisible,
  isAddMode,
  account,
  transactionCount,
  onCloseDeleteSheet,
  onCloseArchiveSheet,
  onCloseUnsavedSheet,
  onConfirmDelete,
  onConfirmArchive,
  onDiscardAndNavigate,
}: AccountFormSheetsProps) {
  const { t } = useTranslation()

  const isArchived = account?.isArchived ?? false

  return (
    <>
      {!isAddMode && account && (
        <ConfirmSheet
          visible={deleteSheetVisible}
          onRequestClose={onCloseDeleteSheet}
          onConfirm={onConfirmDelete}
          title={t("screens.accounts.form.deleteSheet.title", {
            name: account.name,
          })}
          description={
            transactionCount > 0
              ? t("screens.accounts.form.deleteSheet.descriptionWithCount", {
                  count: transactionCount,
                })
              : t("screens.accounts.form.deleteSheet.descriptionEmpty")
          }
          confirmLabel={t("common.actions.delete")}
          cancelLabel={t("common.actions.cancel")}
          variant="destructive"
          icon="trash-outline"
        />
      )}

      {!isAddMode && account && (
        <ConfirmSheet
          visible={archiveSheetVisible}
          onRequestClose={onCloseArchiveSheet}
          onConfirm={onConfirmArchive}
          title={
            isArchived
              ? t("screens.accounts.form.archiveSheet.unarchiveTitle")
              : t("screens.accounts.form.archiveSheet.archiveTitle")
          }
          confirmLabel={
            isArchived
              ? t("screens.accounts.form.archiveSheet.unarchiveConfirm")
              : t("screens.accounts.form.archiveSheet.archiveConfirm")
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
