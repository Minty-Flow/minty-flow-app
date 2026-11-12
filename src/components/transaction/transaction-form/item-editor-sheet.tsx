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
import { StepButton } from "./step-button"

const MAX_QUANTITY = 9999

interface Props {
  visible: boolean
  /** The line being edited; null only while the sheet has never opened. */
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
  const stepTo = (next: number) => setQuantityText(String(next))

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
          title={t("components.transactionForm.items.editItem")}
        />

        <Input
          value={name}
          onChangeText={setName}
          maxLength={255}
          placeholder={t("components.transactionForm.items.namePlaceholder")}
          accessibilityLabel={t("components.transactionForm.items.name")}
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
          <View style={styles.stepper}>
            <StepButton
              icon="minus-outline"
              disabled={quantity <= 1}
              onPress={() => stepTo(quantity - 1)}
              label={t("components.transactionForm.items.a11y.decrease")}
            />
            {/* Input's wrapper fills its parent; the box keeps it narrow. */}
            <View style={styles.quantityBox}>
              <Input
                value={quantityText}
                onChangeText={(text) =>
                  setQuantityText(text.replace(/\D/g, ""))
                }
                onBlur={() => setQuantityText(String(quantity))}
                keyboardType="number-pad"
                maxLength={4}
                style={styles.quantityInput}
                accessibilityLabel={t(
                  "components.transactionForm.items.quantity",
                )}
              />
            </View>
            <StepButton
              icon="plus-outline"
              disabled={quantity >= MAX_QUANTITY}
              onPress={() => stepTo(quantity + 1)}
              label={t("components.transactionForm.items.a11y.increase")}
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Button
            variant="outline"
            onPress={() => {
              onDelete()
              onClose()
            }}
            style={styles.button}
          >
            <Text style={styles.deleteText}>{t("common.actions.delete")}</Text>
          </Button>
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
