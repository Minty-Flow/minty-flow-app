import { useTranslation } from "react-i18next"

import { Button } from "~/components/ui/button"
import { IconSymbol } from "~/components/ui/icon-symbol"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type TransactionModel from "~/database/models/transaction"

import { transactionFormStyles } from "./form.styles"

type Props = {
  transaction: TransactionModel
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
          accessibilityRole="button"
        >
          <IconSymbol name="delete-restore" size={20} />
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
          accessibilityRole="button"
        >
          <IconSymbol
            name="trash-can"
            size={20}
            style={transactionFormStyles.deleteButtonColor}
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
        accessibilityRole="button"
      >
        <IconSymbol
          name="trash-can"
          size={20}
          style={transactionFormStyles.deleteButtonColor}
        />
        <Text variant="default" style={transactionFormStyles.deleteButtonColor}>
          {t("components.transactionForm.fields.moveToTrash")}
        </Text>
      </Button>
    </View>
  )
}
