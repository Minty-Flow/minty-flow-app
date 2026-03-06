import { useTranslation } from "react-i18next"

import { ConfirmModal } from "~/components/confirm-modal"
import type { Category } from "~/types/categories"

interface CategoryFormModalsProps {
  deleteModalVisible: boolean
  unsavedModalVisible: boolean
  isAddMode: boolean
  category: Category | undefined
  onCloseDeleteModal: () => void
  onCloseUnsavedModal: () => void
  onConfirmDelete: () => void
  onDiscardAndNavigate: () => void
}

export function CategoryFormModals({
  deleteModalVisible,
  unsavedModalVisible,
  isAddMode,
  category,
  onCloseDeleteModal,
  onCloseUnsavedModal,
  onConfirmDelete,
  onDiscardAndNavigate,
}: CategoryFormModalsProps) {
  const { t } = useTranslation()

  return (
    <>
      {!isAddMode && category && (
        <ConfirmModal
          visible={deleteModalVisible}
          onRequestClose={onCloseDeleteModal}
          onConfirm={onConfirmDelete}
          title={t("components.categories.form.deleteModal.title", {
            name: category.name,
          })}
          description={
            category.transactionCount > 0
              ? t(
                  "components.categories.form.deleteModal.descriptionWithCount",
                  { count: category.transactionCount },
                )
              : t("components.categories.form.deleteModal.descriptionEmpty")
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
