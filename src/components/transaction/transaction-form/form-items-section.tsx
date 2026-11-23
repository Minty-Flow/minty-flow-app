import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable"
import { useUnistyles } from "react-native-unistyles"

import { ConfirmSheet } from "~/components/confirm-sheet"
import { DynamicIcon } from "~/components/dynamic-icon"
import { Money } from "~/components/money"
import { SwipeAction } from "~/components/transaction/transaction-item/swipe-action"
import { ListItem } from "~/components/ui/list-item"
import { Pressable } from "~/components/ui/pressable"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionItem } from "~/types/transactions"
import { TransactionTypeEnum } from "~/types/transactions"
import { formatMoney, formatNumber } from "~/utils/number-format"
import { Toast } from "~/utils/toast"

import { transactionFormStyles } from "./form.styles"
import { formItemsStyles as styles } from "./form-items.styles"
import { addOrIncrementItem, itemsTotal } from "./form-utils"
import { ItemEditorSheet } from "./item-editor-sheet"
import { ItemEntryRow } from "./item-entry-row"
import { StepButton } from "./step-button"

const MAX_QUANTITY = 9999
const UNDO_MS = 4000
// Raw drag needed to open the delete action (threshold × friction ≈ 50px).
const SWIPE_THRESHOLD = 25

interface Props {
  items: TransactionItem[]
  /** The account's currency; undefined until an account is chosen. */
  currencyCode: string | undefined
  /** Current form amount, quoted when turning Itemize off. */
  amount: number
  onChange: (items: TransactionItem[]) => void
}

/**
 * The "Itemize" switch and, when on, the line items: rows with a quantity
 * stepper, recent-item chips and an inline entry row. Off keeps the single
 * amount as before.
 */
export function FormItemsSection({ currencyCode, ...props }: Props) {
  if (currencyCode)
    return <ItemsSection currencyCode={currencyCode} {...props} />
  return <NoAccountHint />
}

/** Prices and recent items follow the account's currency, so pick one first. */
function NoAccountHint() {
  const { t } = useTranslation()
  return (
    <Text variant="small" style={styles.noAccount}>
      {t("components.transactionForm.items.chooseAccount")}
    </Text>
  )
}

function ItemsSection({
  items,
  currencyCode,
  amount,
  onChange,
}: Props & { currencyCode: string }) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const [enabled, setEnabled] = useState(items.length > 0)
  const [confirmOff, setConfirmOff] = useState(false)
  // The index stays set while the sheet animates out, so it keeps its item.
  const [editing, setEditing] = useState<number | null>(null)
  const [sheetVisible, setSheetVisible] = useState(false)
  // Undo runs after later edits; it must restore into the list as it is then.
  const itemsRef = useRef(items)
  useEffect(() => {
    itemsRef.current = items
  }, [items])

  const toggle = () => {
    if (!enabled) return setEnabled(true)
    if (items.length > 0) return setConfirmOff(true)
    setEnabled(false)
  }

  const setQuantity = (index: number, quantity: number) =>
    onChange(items.map((it, i) => (i === index ? { ...it, quantity } : it)))

  const remove = (index: number) => {
    const removed = items[index]
    onChange(items.filter((_, i) => i !== index))
    Toast.info({
      title: t("components.transactionForm.items.removed", {
        name: removed.name,
      }),
      visibilityTime: UNDO_MS,
      action: {
        label: t("common.actions.undo"),
        onPress: () => {
          const current = itemsRef.current
          const at = Math.min(index, current.length)
          onChange([...current.slice(0, at), removed, ...current.slice(at)])
        },
      },
    })
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
            // Swipe left to delete the whole line, whatever its quantity.
            <Swipeable
              // biome-ignore lint/suspicious/noArrayIndexKey: items have no id until saved, and the order is the identity
              key={index}
              friction={2}
              rightThreshold={SWIPE_THRESHOLD}
              overshootRight={false}
              containerStyle={styles.swipeContainer}
              renderRightActions={(progress, _translation, swipe) => (
                <SwipeAction
                  kind="trash"
                  progress={progress}
                  onPress={() => {
                    // Keys are indexes: close first, or the next line
                    // would inherit this open row.
                    swipe.close()
                    remove(index)
                  }}
                  accessibilityLabel={t(
                    "components.transactionForm.items.a11y.remove",
                  )}
                />
              )}
            >
              <View style={styles.row}>
                <View style={styles.rowInner}>
                  <Pressable
                    style={styles.rowMain}
                    onPress={() => {
                      setEditing(index)
                      setSheetVisible(true)
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={t(
                      "components.transactionForm.items.editItem",
                    )}
                    accessibilityHint={item.name}
                    // The swipe has no touch-free equivalent otherwise.
                    accessibilityActions={[
                      {
                        name: "remove",
                        label: t(
                          "components.transactionForm.items.a11y.remove",
                        ),
                      },
                    ]}
                    onAccessibilityAction={(event) => {
                      if (event.nativeEvent.actionName === "remove")
                        remove(index)
                    }}
                  >
                    <Text
                      variant="default"
                      numberOfLines={1}
                      style={styles.name}
                    >
                      {item.name}
                    </Text>
                    {/* At one, the unit price equals the line total: skip it. */}
                    {item.quantity > 1 ? (
                      <Text variant="small" style={styles.each}>
                        {t("components.transactionForm.items.breakdown", {
                          count: item.quantity,
                          price: formatMoney(item.unitPrice, currencyCode, {
                            hideSign: true,
                          }),
                        })}
                      </Text>
                    ) : null}
                  </Pressable>

                  <View style={styles.stepper}>
                    <StepButton
                      icon="minus-outline"
                      onPress={() =>
                        item.quantity > 1
                          ? setQuantity(index, item.quantity - 1)
                          : remove(index)
                      }
                      label={t(
                        item.quantity > 1
                          ? "components.transactionForm.items.a11y.decrease"
                          : "components.transactionForm.items.a11y.remove",
                      )}
                    />
                    <Text variant="default" style={styles.stepCount}>
                      {item.quantity}
                    </Text>
                    <StepButton
                      icon="plus-outline"
                      disabled={item.quantity >= MAX_QUANTITY}
                      onPress={() => setQuantity(index, item.quantity + 1)}
                      label={t(
                        "components.transactionForm.items.a11y.increase",
                      )}
                    />
                  </View>

                  <Money
                    value={item.unitPrice * item.quantity}
                    currency={currencyCode}
                    // Line totals stay neutral; green is for the total.
                    tone={TransactionTypeEnum.TRANSFER}
                    variant="default"
                    style={styles.lineTotal}
                  />
                </View>
              </View>
            </Swipeable>
          ))}

          {/* The total sits under the lines it sums. */}
          {items.length > 0 ? (
            <View style={styles.totalRow}>
              <Text variant="small" style={styles.totalLabel}>
                {/* Units, not lines: two coffees count as two. */}
                {t("components.transactionForm.items.totalWithCount", {
                  units: formatNumber(
                    items.reduce((sum, item) => sum + item.quantity, 0),
                  ),
                })}
              </Text>
              <Money
                value={itemsTotal(items)}
                currency={currencyCode}
                hideSign
                variant="default"
              />
            </View>
          ) : null}

          <ItemEntryRow
            items={items}
            currencyCode={currencyCode}
            onAdd={(item) => onChange([...items, item])}
            onAddRecent={(recent) =>
              onChange(addOrIncrementItem(items, recent))
            }
          />
        </View>
      ) : null}

      {/* The sheet edits an existing line; adding happens inline. */}
      <ItemEditorSheet
        visible={sheetVisible}
        item={editing !== null ? (items[editing] ?? null) : null}
        currencyCode={currencyCode}
        onSave={(item) =>
          onChange(items.map((it, i) => (i === editing ? item : it)))
        }
        onDelete={() => editing !== null && remove(editing)}
        onClose={() => setSheetVisible(false)}
      />

      <ConfirmSheet
        visible={confirmOff}
        onRequestClose={() => setConfirmOff(false)}
        onConfirm={() => {
          onChange([])
          setEnabled(false)
        }}
        title={t("components.transactionForm.items.confirmOff.title", {
          count: items.length,
        })}
        description={t(
          "components.transactionForm.items.confirmOff.description",
          {
            amount: formatMoney(amount, currencyCode, { hideSign: true }),
          },
        )}
        confirmLabel={t("common.actions.delete")}
        variant="destructive"
      />
    </View>
  )
}
