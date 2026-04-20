import { useTranslation } from "react-i18next"

import { ConfirmModal } from "~/components/confirm-modal"

import type { LoanFormModalsProps } from "./types"

export function LoanFormModals({
  deleteModalVisible,
  unsavedModalVisible,
  isAddMode,
  loan,
  onCloseDeleteModal,
  onCloseUnsavedModal,
  onConfirmDelete,
  onDiscardAndNavigate,
}: LoanFormModalsProps) {
  const { t } = useTranslation()

  return (
    <>
      {!isAddMode && loan && (
        <ConfirmModal
          visible={deleteModalVisible}
          onRequestClose={onCloseDeleteModal}
          onConfirm={onConfirmDelete}
          title={t("common.modals.deletePermanently")}
          note={t("common.modals.deleteNoteLoan")}
          confirmLabel={t("common.actions.delete")}
          cancelLabel={t("common.actions.cancel")}
          variant="destructive"
          icon="trash"
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
