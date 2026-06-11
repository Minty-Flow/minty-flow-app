import { useTranslation } from "react-i18next"

import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { Transaction } from "~/types/transactions"

import { transactionFormStyles } from "./form.styles"

type Props = {
  transaction: Transaction
  isSaving: boolean
  onRestore: () => void
  onDelete: () => void
  onDestroy: () => void
}

export function FormDeleteActions({
  transaction,
  isSaving,
  onRestore,
  onDelete,
  onDestroy,
}: Props) {
  const { t } = useTranslation()

  if (transaction.isDeleted) {
    return (
      <View style={transactionFormStyles.deleteButtonBlock}>
        <Button
          variant="ghost"
          onPress={onRestore}
          disabled={isSaving}
          accessibilityLabel={t("screens.settings.trash.a11y.restore")}
        >
          <IconSvg name="trash-off-outline" size={20} />
          <Text variant="default">
            {t("components.transactionForm.fields.restore")}
          </Text>
        </Button>
        <Button
          variant="ghost"
          onPress={onDestroy}
          disabled={isSaving}
          accessibilityLabel={t(
            "screens.settings.trash.a11y.destroyPermanently",
          )}
        >
          <IconSvg
            name="trash-outline"
            size={20}
            color={transactionFormStyles.deleteButtonColor.color}
          />
          <Text
            variant="default"
            style={transactionFormStyles.deleteButtonColor}
          >
            {t("common.modals.deletePermanently")}
          </Text>
        </Button>
      </View>
    )
  }

  return (
    <View style={transactionFormStyles.deleteButtonBlock}>
      <Button
        variant="ghost"
        style={transactionFormStyles.deleteButton}
        onPress={onDelete}
        disabled={isSaving}
        accessibilityLabel={t("screens.settings.trash.a11y.moveToTrash")}
      >
        <IconSvg
          name="trash-outline"
          size={20}
          color={transactionFormStyles.deleteButtonColor.color}
        />
        <Text variant="default" style={transactionFormStyles.deleteButtonColor}>
          {t("components.transactionForm.fields.moveToTrash")}
        </Text>
      </Button>
    </View>
  )
}
