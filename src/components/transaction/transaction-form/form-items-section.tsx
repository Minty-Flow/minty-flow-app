import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { Button } from "~/components/ui/button"
import { ListItem } from "~/components/ui/list-item"
import { Pressable } from "~/components/ui/pressable"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionItem } from "~/types/transactions"

import { transactionFormStyles } from "./form.styles"
import { formItemsStyles as styles } from "./form-items.styles"
import { itemsTotal } from "./form-utils"
import { ItemEditorSheet } from "./item-editor-sheet"

interface Props {
  items: TransactionItem[]
  currencyCode: string
  onChange: (items: TransactionItem[]) => void
}

/**
 * The "Itemize" switch and, when on, the list of line items. Off keeps the
 * single amount as before; turning it off clears the items.
 */
export function FormItemsSection({ items, currencyCode, onChange }: Props) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const [enabled, setEnabled] = useState(items.length > 0)
  // null: closed, -1: adding, otherwise the index being edited.
  const [editing, setEditing] = useState<number | null>(null)

  const toggle = () => {
    if (enabled) onChange([])
    setEnabled(!enabled)
  }

  const saveItem = (item: TransactionItem) => {
    if (editing === null) return
    onChange(
      editing === -1
        ? [...items, item]
        : items.map((it, i) => (i === editing ? item : it)),
    )
  }

  return (
    <View>
      <ListItem
        style={transactionFormStyles.switchRow}
        onPress={toggle}
        accessibilityRole="switch"
        accessibilityState={{ checked: enabled }}
      >
        <View style={transactionFormStyles.switchLeft}>
          <DynamicIcon
            icon="list-outline"
            size={20}
            color={theme.colors.primary}
            variant="badge"
          />
          <Text variant="default" style={transactionFormStyles.switchLabel}>
            {t("components.transactionForm.items.toggle")}
          </Text>
        </View>
        <Switch value={enabled} />
      </ListItem>

      {enabled ? (
        <View style={styles.list}>
          {items.map((item, index) => (
            <Pressable
              // biome-ignore lint/suspicious/noArrayIndexKey: items have no id until saved, and the order is the identity
              key={index}
              style={styles.row}
              onPress={() => setEditing(index)}
              accessibilityLabel={item.name}
            >
              <View style={styles.rowName}>
                <Text variant="default" numberOfLines={1} style={styles.name}>
                  {item.name}
                </Text>
                {item.quantity > 1 ? (
                  <Text variant="small" style={styles.quantity}>
                    ×{item.quantity}
                  </Text>
                ) : null}
              </View>
              <Money
                value={item.unitPrice * item.quantity}
                currency={currencyCode}
                hideSign
                variant="default"
              />
            </Pressable>
          ))}

          {items.length > 0 ? (
            <View style={styles.totalRow}>
              <Text variant="small" style={styles.totalLabel}>
                {t("components.transactionForm.items.total")}
              </Text>
              <Money
                value={itemsTotal(items)}
                currency={currencyCode}
                hideSign
                variant="default"
              />
            </View>
          ) : null}

          <Button variant="ghost" onPress={() => setEditing(-1)}>
            <IconSvg name="plus-outline" size={18} />
            <Text>{t("components.transactionForm.items.addItem")}</Text>
          </Button>
        </View>
      ) : null}

      <ItemEditorSheet
        visible={editing !== null}
        item={editing !== null && editing >= 0 ? items[editing] : null}
        currencyCode={currencyCode}
        onSave={saveItem}
        onDelete={() => onChange(items.filter((_, i) => i !== editing))}
        onClose={() => setEditing(null)}
      />
    </View>
  )
}
