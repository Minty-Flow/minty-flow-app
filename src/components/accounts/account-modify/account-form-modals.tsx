import { useTranslation } from "react-i18next"

import { ConfirmModal } from "~/components/confirm-modal"
import type { Account } from "~/types/accounts"

interface AccountFormModalsProps {
  deleteModalVisible: boolean
  archiveModalVisible: boolean
  unsavedModalVisible: boolean
  isAddMode: boolean
  account: Account | undefined
  transactionCount: number
  onCloseDeleteModal: () => void
  onCloseArchiveModal: () => void
  onCloseUnsavedModal: () => void
  onConfirmDelete: () => void
  onConfirmArchive: () => void
  onDiscardAndNavigate: () => void
}

export function AccountFormModals({
  deleteModalVisible,
  archiveModalVisible,
  unsavedModalVisible,
  isAddMode,
  account,
  transactionCount,
  onCloseDeleteModal,
  onCloseArchiveModal,
  onCloseUnsavedModal,
  onConfirmDelete,
  onConfirmArchive,
  onDiscardAndNavigate,
}: AccountFormModalsProps) {
  const { t } = useTranslation()

  const isArchived = account?.isArchived ?? false

  return (
    <>
      {!isAddMode && account && (
        <ConfirmModal
          visible={deleteModalVisible}
          onRequestClose={onCloseDeleteModal}
          onConfirm={onConfirmDelete}
          title={t("screens.accounts.form.deleteModal.title", {
            name: account.name,
          })}
          description={
            transactionCount > 0
              ? t("screens.accounts.form.deleteModal.descriptionWithCount", {
                  count: transactionCount,
                })
              : t("screens.accounts.form.deleteModal.descriptionEmpty")
          }
          confirmLabel={t("common.actions.delete")}
          cancelLabel={t("common.actions.cancel")}
          variant="destructive"
          icon="trash"
        />
      )}

      {!isAddMode && account && (
        <ConfirmModal
          visible={archiveModalVisible}
          onRequestClose={onCloseArchiveModal}
          onConfirm={onConfirmArchive}
          title={
            isArchived
              ? t("screens.accounts.form.archiveModal.unarchiveTitle")
              : t("screens.accounts.form.archiveModal.archiveTitle")
          }
          confirmLabel={
            isArchived
              ? t("screens.accounts.form.archiveModal.unarchiveConfirm")
              : t("screens.accounts.form.archiveModal.archiveConfirm")
          }
          cancelLabel={t("common.actions.cancel")}
          variant="default"
          icon={isArchived ? "archive-off" : "archive"}
        />
      )}

      <ConfirmModal
        visible={unsavedModalVisible}
        onRequestClose={onCloseUnsavedModal}
        onConfirm={onDiscardAndNavigate}
        title={t("common.modals.closeWithoutSaving")}
        description={t("common.modals.unsavedDescription")}
        confirmLabel={t("common.actions.discard")}
        cancelLabel={t("common.actions.cancel")}
        variant="default"
      />
    </>
  )
}
