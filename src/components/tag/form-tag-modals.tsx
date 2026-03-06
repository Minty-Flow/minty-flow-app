import { useTranslation } from "react-i18next"

import { ConfirmModal } from "~/components/confirm-modal"
import type { Tag } from "~/types/tags"

interface FormTagModalsProps {
  deleteModalVisible: boolean
  setDeleteModalVisible: (visible: boolean) => void
  tag?: Tag
  handleDelete: () => void
  unsavedModalVisible: boolean
  setUnsavedModalVisible: (visible: boolean) => void
  confirmNavigation: () => void
}

export const FormTagModals = ({
  deleteModalVisible,
  setDeleteModalVisible,
  tag,
  handleDelete,
  unsavedModalVisible,
  setUnsavedModalVisible,
  confirmNavigation,
}: FormTagModalsProps) => {
  const { t } = useTranslation()

  return (
    <>
      {tag && (
        <ConfirmModal
          visible={deleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
          onConfirm={handleDelete}
          title={t("screens.settings.tags.form.deleteModal.title", {
            name: tag.name,
          })}
          description={
            (tag.transactionCount ?? 0) > 0
              ? t(
                  "screens.settings.tags.form.deleteModal.descriptionWithCount",
                  { count: tag.transactionCount ?? 0 },
                )
              : t("screens.settings.tags.form.deleteModal.descriptionEmpty")
          }
          confirmLabel={t("common.actions.delete")}
          cancelLabel={t("common.actions.cancel")}
          variant="destructive"
          icon="trash-can"
        />
      )}

      <ConfirmModal
        visible={unsavedModalVisible}
        onRequestClose={() => setUnsavedModalVisible(false)}
        onConfirm={() => {
          setUnsavedModalVisible(false)
          confirmNavigation()
        }}
        title={t("common.modals.closeWithoutSaving")}
        description={t("common.modals.unsavedDescription")}
        confirmLabel={t("common.actions.discard")}
        cancelLabel={t("common.actions.cancel")}
        variant="default"
      />
    </>
  )
}
