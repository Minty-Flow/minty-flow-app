import { useTranslation } from "react-i18next"

import { ConfirmModal } from "~/components/confirm-modal"
import type { Account } from "~/types/accounts"

interface AccountFormModalsProps {
  deleteModalVisible: boolean
  unsavedModalVisible: boolean
  isAddMode: boolean
  account: Account | undefined
  transactionCount: number
  onCloseDeleteModal: () => void
  onCloseUnsavedModal: () => void
  onConfirmDelete: () => void
  onDiscardAndNavigate: () => void
}

export function AccountFormModals({
  deleteModalVisible,
  unsavedModalVisible,
  isAddMode,
  account,
  transactionCount,
  onCloseDeleteModal,
  onCloseUnsavedModal,
  onConfirmDelete,
  onDiscardAndNavigate,
}: AccountFormModalsProps) {
  const { t } = useTranslation()

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
          icon="trash-can"
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
