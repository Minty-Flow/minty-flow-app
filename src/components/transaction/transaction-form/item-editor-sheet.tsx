import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { SmartAmountInput } from "~/components/smart-amount-input"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { SheetIconHeader } from "~/components/ui/sheet-icon-header"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useSheetOpenKey } from "~/hooks/use-sheet-open-key"
import type { TransactionItem } from "~/types/transactions"

import { formItemsStyles as styles } from "./form-items.styles"

const MAX_QUANTITY = 9999

interface Props {
  visible: boolean
  /** The item being edited, or null to add a new one. */
  item: TransactionItem | null
  currencyCode: string
  onSave: (item: TransactionItem) => void
  onDelete: () => void
  onClose: () => void
}

export function ItemEditorSheet(props: Props) {
  // A new key per open resets the draft while the sheet animates out.
  const openKey = useSheetOpenKey(props.visible)
  return <ItemEditorSheetInner key={openKey} {...props} />
}

function ItemEditorSheetInner({
  visible,
  item,
  currencyCode,
  onSave,
  onDelete,
  onClose,
}: Props) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const [name, setName] = useState(item?.name ?? "")
  const [unitPrice, setUnitPrice] = useState(item?.unitPrice ?? 0)
  const [quantityText, setQuantityText] = useState(String(item?.quantity ?? 1))
  const quantity = Math.min(
    Math.max(Number.parseInt(quantityText, 10) || 1, 1),
    MAX_QUANTITY,
  )
  const canSave = name.trim().length > 0

  const handleSave = () => {
    if (!canSave) return
    onSave({ name: name.trim(), unitPrice, quantity })
    onClose()
  }

  return (
    <BottomSheet isPresented={visible} onDismiss={onClose}>
      <View style={styles.sheet}>
        <SheetIconHeader
          icon="list-outline"
          accentColor={theme.colors.primary}
          title={t(
            item
              ? "components.transactionForm.items.editItem"
              : "components.transactionForm.items.addItem",
          )}
        />

        <Input
          value={name}
          onChangeText={setName}
          maxLength={255}
          placeholder={t("components.transactionForm.items.namePlaceholder")}
          accessibilityLabel={t("components.transactionForm.items.name")}
          autoFocus={!item}
        />

        <SmartAmountInput
          valueMinor={unitPrice}
          onChangeMinor={setUnitPrice}
          currencyCode={currencyCode}
          label={t("components.transactionForm.items.unitPrice")}
          placeholder="0"
        />

        <View style={styles.quantityRow}>
          <Text variant="default">
            {t("components.transactionForm.items.quantity")}
          </Text>
          {/* Input's wrapper fills the row; the box keeps it narrow. */}
          <View style={styles.quantityBox}>
            <Input
              value={quantityText}
              onChangeText={(text) => setQuantityText(text.replace(/\D/g, ""))}
              onBlur={() => setQuantityText(String(quantity))}
              keyboardType="number-pad"
              maxLength={4}
              style={styles.quantityInput}
              accessibilityLabel={t(
                "components.transactionForm.items.quantity",
              )}
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          {item ? (
            <Button
              variant="outline"
              onPress={() => {
                onDelete()
                onClose()
              }}
              style={styles.button}
            >
              <Text style={styles.deleteText}>
                {t("common.actions.delete")}
              </Text>
            </Button>
          ) : (
            <Button variant="outline" onPress={onClose} style={styles.button}>
              <Text>{t("common.actions.cancel")}</Text>
            </Button>
          )}
          <Button
            onPress={handleSave}
            disabled={!canSave}
            style={styles.button}
          >
            <Text>{t("common.actions.done")}</Text>
          </Button>
        </View>
      </View>
    </BottomSheet>
  )
}
