import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { AccessibilityInfo, ScrollView, type TextInput } from "react-native"
import { useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { Button } from "~/components/ui/button"
import { Chip } from "~/components/ui/chips"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  getRecentItems,
  type RecentItem,
} from "~/database/drizzle/read-models/transaction-item-read-model"
import { currencyRegistryService } from "~/services/currency-registry"
import { useHiddenRecentItemsStore } from "~/stores/hidden-recent-items.store"
import type { TransactionItem } from "~/types/transactions"
import { logger } from "~/utils/logger"
import { minorUnitsToDecimalString } from "~/utils/money"
import { formatMoney } from "~/utils/number-format"
import { normalizeItemName } from "~/utils/string-utils"

import { formItemsStyles as styles } from "./form-items.styles"
import { parsePriceInput, sanitizePriceInput } from "./form-utils"

const RECENT_SHOWN = 8
const RECENT_FETCH = 40

interface Props {
  items: TransactionItem[]
  currencyCode: string
  /** A new line typed into the row. */
  onAdd: (item: TransactionItem) => void
  /** A recent chip tapped: add it, or one more if it is already listed. */
  onAddRecent: (recent: RecentItem) => void
}

/**
 * Recent-item chips and the inline "name · price · +" row. Return on price
 * adds the line and puts the cursor back in name, so the keyboard stays up.
 */
export function ItemEntryRow({
  items,
  currencyCode,
  onAdd,
  onAddRecent,
}: Props) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const nameRef = useRef<TextInput>(null)
  const priceRef = useRef<TextInput>(null)
  const [name, setName] = useState("")
  const [priceText, setPriceText] = useState("")
  const [error, setError] = useState<"name" | "price" | null>(null)
  const [recents, setRecents] = useState<RecentItem[]>([])
  const [editingRecents, setEditingRecents] = useState(false)
  const hidden = useHiddenRecentItemsStore((s) => s.hidden[currencyCode])
  const hideRecent = useHiddenRecentItemsStore((s) => s.hide)
  const unhideRecent = useHiddenRecentItemsStore((s) => s.unhide)

  // Once per open and per currency: a USD expense never suggests SYP prices.
  // Fetches extra so hidden names don't leave the row short.
  useEffect(() => {
    try {
      setRecents(getRecentItems(currencyCode, RECENT_FETCH))
    } catch (e) {
      logger.error("Failed to load recent items", { error: e })
      setRecents([])
    }
  }, [currencyCode])

  const query = normalizeItemName(name)
  const visibleRecents = recents
    .filter((r) => !hidden?.includes(normalizeItemName(r.name)))
    .filter((r) => !query || normalizeItemName(r.name).includes(query))
    .slice(0, RECENT_SHOWN)
  // Hiding the last chip ends editing with it.
  const isEditing = editingRecents && visibleRecents.length > 0
  const quantityOf = (recentName: string) =>
    items.find(
      (item) => normalizeItemName(item.name) === normalizeItemName(recentName),
    )?.quantity ?? 0

  const price = parsePriceInput(priceText, currencyCode)
  const isValid = name.trim().length > 0 && price !== null

  const announceAdded = (itemName: string) =>
    AccessibilityInfo.announceForAccessibility(
      t("components.transactionForm.items.a11y.added", { name: itemName }),
    )

  const submit = () => {
    if (!name.trim()) {
      setError("name")
      nameRef.current?.focus()
      return
    }
    if (price === null) {
      setError("price")
      priceRef.current?.focus()
      return
    }
    onAdd({ name: name.trim(), unitPrice: price, quantity: 1 })
    // Typing a hidden name again means it is wanted back.
    unhideRecent(currencyCode, name)
    announceAdded(name.trim())
    setName("")
    setPriceText("")
    setError(null)
    nameRef.current?.focus()
  }

  const pickRecent = (recent: RecentItem) => {
    onAddRecent(recent)
    announceAdded(recent.name.trim())
    // While typing, a chip stands in for the name being typed.
    if (name) setName("")
  }

  const symbol =
    currencyRegistryService.getCurrencySymbol(currencyCode) ?? currencyCode

  return (
    <View style={styles.entry}>
      <View style={styles.entryRow}>
        <View style={styles.entryName}>
          <Input
            ref={nameRef}
            value={name}
            onChangeText={(text) => {
              setName(text)
              if (error === "name") setError(null)
            }}
            maxLength={255}
            placeholder={t("components.transactionForm.items.newPlaceholder")}
            accessibilityLabel={t(
              "components.transactionForm.items.a11y.newName",
            )}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => priceRef.current?.focus()}
            error={error === "name"}
          />
        </View>
        <View style={styles.entryPrice}>
          <Input
            ref={priceRef}
            value={priceText}
            onChangeText={(text) => {
              setPriceText(sanitizePriceInput(text, currencyCode))
              if (error === "price") setError(null)
            }}
            placeholder={minorUnitsToDecimalString(0, currencyCode)}
            keyboardType="decimal-pad"
            returnKeyType="done"
            // Return adds the line and keeps the keyboard up for the next.
            submitBehavior="submit"
            onSubmitEditing={submit}
            accessibilityLabel={t(
              "components.transactionForm.items.a11y.priceEach",
            )}
            style={styles.priceInput}
            left={<Text style={styles.priceSymbol}>{symbol}</Text>}
            error={error === "price"}
          />
        </View>
        <Pressable
          onPress={submit}
          style={[styles.addButton, !isValid && styles.addButtonIdle]}
          accessibilityRole="button"
          accessibilityLabel={t("components.transactionForm.items.addItem")}
        >
          <IconSvg
            name="plus-outline"
            size={22}
            color={isValid ? theme.colors.onPrimary : theme.colors.onSecondary}
          />
        </Pressable>
      </View>

      {error ? (
        <Text
          variant="small"
          style={styles.entryError}
          accessibilityLiveRegion="polite"
        >
          {t(
            error === "name"
              ? "components.transactionForm.items.needName"
              : "components.transactionForm.items.needPrice",
          )}
        </Text>
      ) : null}

      {visibleRecents.length > 0 ? (
        <View style={styles.recents}>
          <View style={styles.recentsHeader}>
            <Text variant="small" style={styles.chipsLabel}>
              {t("components.transactionForm.items.recent")}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => setEditingRecents(!isEditing)}
              style={styles.recentsEdit}
            >
              <Text variant="small" style={styles.recentsEditText}>
                {isEditing
                  ? t("common.actions.done")
                  : t("components.transactionForm.items.editRecent")}
              </Text>
            </Button>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={styles.chips}
          >
            {visibleRecents.map((recent) => {
              const count = quantityOf(recent.name)
              const priceLabel = formatMoney(recent.unitPrice, currencyCode, {
                hideSign: true,
              })
              return (
                <Chip
                  key={normalizeItemName(recent.name)}
                  selected={count > 0}
                  hideCheck
                  onPress={() =>
                    isEditing
                      ? hideRecent(currencyCode, recent.name)
                      : pickRecent(recent)
                  }
                  trailing={
                    isEditing ? (
                      <IconSvg
                        name="x-outline"
                        size={14}
                        color={theme.colors.onSurface}
                      />
                    ) : undefined
                  }
                  style={styles.chip}
                  // Added: how many are in the list. Not yet: a plus.
                  leading={
                    <View
                      style={[
                        styles.chipTile,
                        count > 0 && styles.chipTileAdded,
                      ]}
                    >
                      {count > 0 ? (
                        <Text variant="small" style={styles.chipCount}>
                          {count}
                        </Text>
                      ) : (
                        <IconSvg
                          name="plus-outline"
                          size={14}
                          color={theme.colors.onSurface}
                        />
                      )}
                    </View>
                  }
                  accessibilityLabel={
                    isEditing
                      ? t("components.transactionForm.items.a11y.hideRecent", {
                          name: recent.name.trim(),
                        })
                      : t("components.transactionForm.items.a11y.addRecent", {
                          name: recent.name.trim(),
                          price: priceLabel,
                        }) +
                        (count > 0
                          ? t(
                              "components.transactionForm.items.a11y.recentAdded",
                              {
                                count,
                              },
                            )
                          : "")
                  }
                >
                  <View style={styles.chipContent}>
                    <Text numberOfLines={1} style={styles.chipName}>
                      {recent.name.trim()}
                    </Text>
                    <Money
                      value={recent.unitPrice}
                      currency={currencyCode}
                      hideSign
                      variant="small"
                      style={styles.chipPrice}
                    />
                  </View>
                </Chip>
              )
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  )
}
