import { useTranslation } from "react-i18next"

import { ConfirmModal } from "~/components/confirm-modal"
import type { Budget } from "~/types/budgets"

interface BudgetFormModalsProps {
  deleteModalVisible: boolean
  unsavedModalVisible: boolean
  isAddMode: boolean
  budget?: Budget
  onCloseDeleteModal: () => void
  onCloseUnsavedModal: () => void
  onConfirmDelete: () => void
  onDiscardAndNavigate: () => void
}

export function BudgetFormModals({
  deleteModalVisible,
  unsavedModalVisible,
  isAddMode,
  budget,
  onCloseDeleteModal,
  onCloseUnsavedModal,
  onConfirmDelete,
  onDiscardAndNavigate,
}: BudgetFormModalsProps) {
  const { t } = useTranslation()

  return (
    <>
      {!isAddMode && budget && (
        <ConfirmModal
          visible={deleteModalVisible}
          onRequestClose={onCloseDeleteModal}
          onConfirm={onConfirmDelete}
          title={t("common.modals.deletePermanently")}
          note={t("common.modals.deleteNoteBudget")}
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
