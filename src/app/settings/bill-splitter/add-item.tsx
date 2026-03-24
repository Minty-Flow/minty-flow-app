import { useLocalSearchParams, useRouter } from "expo-router"
import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, TextInput } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { AddNameModal } from "~/components/bill-splitter/add-name-modal"
import { SmartAmountInput } from "~/components/smart-amount-input"
import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useBillSplitterStore } from "~/stores/bill-splitter.store"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import type { ItemSplit } from "~/types/bill-splitter"

// Per-participant string state for controlled percentage inputs.
// Keyed by participantId — avoids the "33." reset bug by keeping raw
// string until blur, then parsing to number.
type PercentageStrings = Record<string, string>

export default function AddItemScreen() {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const router = useRouter()
  const params = useLocalSearchParams<{ itemId?: string }>()
  const currency = useMoneyFormattingStore((s) => s.preferredCurrency)

  const participants = useBillSplitterStore((s) => s.participants)
  const items = useBillSplitterStore((s) => s.items)
  const addItem = useBillSplitterStore((s) => s.addItem)
  const updateItem = useBillSplitterStore((s) => s.updateItem)
  const addParticipant = useBillSplitterStore((s) => s.addParticipant)

  const editItem = params.itemId
    ? items.find((i) => i.id === params.itemId)
    : undefined
  const isEditMode = !!editItem

  const [name, setName] = useState(editItem?.name ?? "")
  const [price, setPrice] = useState(editItem?.price ?? 0)
  const [quantity, setQuantity] = useState(editItem?.quantity ?? 1)
  const [splitEvenly, setSplitEvenly] = useState(editItem?.splitEvenly ?? true)
  const [splits, setSplits] = useState<ItemSplit[]>(() => {
    if (editItem) return editItem.splits
    return participants.map((p) => ({
      participantId: p.id,
      selected: true,
      percentage: participants.length > 0 ? 100 / participants.length : 0,
    }))
  })

  // String state for percentage inputs — prevents "33." from resetting to "33"
  const [percentageStrings, setPercentageStrings] = useState<PercentageStrings>(
    () => {
      const initial: PercentageStrings = {}
      for (const split of editItem?.splits ?? []) {
        initial[split.participantId] =
          split.percentage > 0 ? split.percentage.toString() : ""
      }
      return initial
    },
  )

  const [addNameVisible, setAddNameVisible] = useState(false)
  const [multiplierExpanded, setMultiplierExpanded] = useState(
    editItem ? editItem.quantity !== 1 : false,
  )

  const quantityNum = Math.max(quantity > 0 ? quantity : 1, 0.01)

  const selectedCount = splits.filter((s) => s.selected).length

  // Recalculate even split when toggling participants or splitEvenly.
  // Also syncs newly added participants into the splits list so they
  // immediately get the correct even share instead of 0%.
  const effectiveSplits = useMemo(() => {
    // Merge in any participants not yet present in splits
    const existingIds = new Set(splits.map((s) => s.participantId))
    const merged = [...splits]
    for (const p of participants) {
      if (!existingIds.has(p.id)) {
        merged.push({ participantId: p.id, selected: true, percentage: 0 })
      }
    }
    // Remove splits for deleted participants
    const active = merged.filter((s) =>
      participants.some((p) => p.id === s.participantId),
    )

    if (!splitEvenly) return active
    const activeSelected = active.filter((s) => s.selected).length
    const evenPercentage = activeSelected > 0 ? 100 / activeSelected : 0
    return active.map((s) => ({
      ...s,
      percentage: s.selected ? evenPercentage : 0,
    }))
  }, [splits, splitEvenly, participants])

  const toggleParticipant = useCallback((participantId: string) => {
    setSplits((prev) =>
      prev.map((s) =>
        s.participantId === participantId ? { ...s, selected: !s.selected } : s,
      ),
    )
  }, [])

  // Only update numeric split state on blur — keeps string state authoritative during typing
  const handlePercentageChange = useCallback(
    (participantId: string, rawValue: string) => {
      setPercentageStrings((prev) => ({ ...prev, [participantId]: rawValue }))
    },
    [],
  )

  const handlePercentageBlur = useCallback(
    (participantId: string, rawValue: string) => {
      const numValue = Number.parseFloat(rawValue)
      const clamped = Number.isNaN(numValue) ? 0 : Math.min(numValue, 100)
      setSplits((prev) =>
        prev.map((s) =>
          s.participantId === participantId ? { ...s, percentage: clamped } : s,
        ),
      )
      // Normalise the displayed string after blur
      setPercentageStrings((prev) => ({
        ...prev,
        [participantId]: clamped > 0 ? clamped.toString() : "",
      }))
    },
    [],
  )

  const handleAddParticipant = useCallback(
    (pName: string) => {
      addParticipant(pName)
      // New participant will be picked up by effectiveSplits on next render
    },
    [addParticipant],
  )

  // Total of selected participants' percentages — used for the indicator bar
  const totalPercentage = useMemo(
    () =>
      effectiveSplits
        .filter((s) => s.selected)
        .reduce((sum, s) => sum + s.percentage, 0),
    [effectiveSplits],
  )

  const handleSave = useCallback(() => {
    const finalSplits = splitEvenly
      ? effectiveSplits.map((s) => ({
          ...s,
          percentage: s.selected
            ? 100 / effectiveSplits.filter((x) => x.selected).length
            : 0,
        }))
      : effectiveSplits

    const itemData = {
      name,
      price,
      quantity: quantityNum,
      splitEvenly,
      splits: finalSplits,
    }

    if (isEditMode && params.itemId) {
      updateItem(params.itemId, itemData)
    } else {
      addItem(itemData)
    }
    router.back()
  }, [
    name,
    price,
    quantityNum,
    splitEvenly,
    effectiveSplits,
    isEditMode,
    params.itemId,
    addItem,
    updateItem,
    router,
  ])

  const handleCancel = useCallback(() => {
    router.back()
  }, [router])

  // Determine percentage total indicator color
  const totalRounded = Math.round(totalPercentage * 10) / 10
  const isExact = totalRounded === 100
  const isOver = totalRounded > 100
  const totalColor = isExact
    ? theme.colors.customColors.income
    : isOver
      ? theme.colors.error
      : theme.colors.onSecondary

  const isSaveDisabled = !name.trim()

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Item Details section ─────────────────────────── */}
        <Text style={styles.sectionLabel}>
          {t("screens.settings.billSplitter.item.name")}
        </Text>

        <View style={styles.card}>
          <Input
            value={name}
            onChangeText={setName}
            placeholder={t("screens.settings.billSplitter.item.name")}
            style={styles.nameInput}
          />
        </View>

        {/* ── Split Configuration section ───────────────────── */}
        <Text style={styles.sectionLabel}>
          {t("screens.settings.billSplitter.item.price")}
        </Text>

        <View style={styles.card}>
          <SmartAmountInput
            value={price}
            onChange={setPrice}
            currencyCode={currency}
            label={t("screens.settings.billSplitter.item.price")}
            placeholder="0"
          />
        </View>

        {/* Multiplier — collapsed by default, expands inline */}
        <Pressable
          style={styles.multiplierTrigger}
          onPress={() => setMultiplierExpanded((v) => !v)}
        >
          <View style={styles.switchLeft}>
            <IconSvg
              name="x"
              size={20}
              color={
                multiplierExpanded
                  ? theme.colors.primary
                  : theme.colors.onSecondary
              }
            />
            <View>
              <Text style={styles.multiplierLabel}>
                {t("screens.settings.billSplitter.item.quantity")}
              </Text>
              <Text style={styles.multiplierHint}>
                {t("screens.settings.billSplitter.item.quantityDescription")}
              </Text>
            </View>
          </View>
          {!multiplierExpanded && quantity !== 1 ? (
            <Text style={styles.multiplierBadge}>×{quantity}</Text>
          ) : (
            <IconSvg
              name={multiplierExpanded ? "chevron-up" : "chevron-down"}
              size={18}
              color={theme.colors.onSecondary}
            />
          )}
        </Pressable>

        {multiplierExpanded && (
          <View style={styles.multiplierContent}>
            <SmartAmountInput
              value={quantity}
              onChange={setQuantity}
              label={t("screens.settings.billSplitter.item.quantity")}
              placeholder="1"
              decimalPlaces={2}
            />
          </View>
        )}

        {/* Split Evenly toggle — switchRow pattern from budget-modify */}
        <Pressable
          style={styles.switchRow}
          onPress={() => setSplitEvenly(!splitEvenly)}
          accessibilityRole="switch"
          accessibilityState={{ checked: splitEvenly }}
        >
          <View style={styles.switchLeft}>
            <IconSvg name="divide" size={24} />
            <Text style={styles.switchLabel}>
              {t("screens.settings.billSplitter.item.splitEvenly")}
            </Text>
          </View>
          <Switch value={splitEvenly} onValueChange={setSplitEvenly} />
        </Pressable>

        {/* ── Participants section ──────────────────────────── */}
        <Text style={styles.sectionLabel}>
          {t("screens.settings.billSplitter.names.title")}
        </Text>

        <View style={styles.participantsList}>
          {effectiveSplits.map((split) => {
            const participant = participants.find(
              (p) => p.id === split.participantId,
            )
            if (!participant) return null

            // Amount preview: price * quantity * percentage / 100
            const amountPreview = price * quantityNum * (split.percentage / 100)
            const amountFormatted =
              split.selected && split.percentage > 0
                ? amountPreview.toFixed(1)
                : null

            return (
              <Pressable
                key={split.participantId}
                style={[
                  styles.participantRow,
                  !split.selected && styles.participantRowDeselected,
                ]}
                onPress={() => toggleParticipant(split.participantId)}
              >
                <View style={styles.checkbox}>
                  {split.selected ? (
                    <IconSvg
                      name="square-check"
                      size={22}
                      color={theme.colors.primary}
                    />
                  ) : (
                    <IconSvg
                      name="square"
                      size={22}
                      color={theme.colors.onSecondary}
                    />
                  )}
                </View>

                <Text style={styles.participantName} numberOfLines={1}>
                  {participant.name}
                </Text>

                {/* Amount preview */}
                {amountFormatted !== null && (
                  <Text style={styles.amountPreview}>
                    {currency ? `${currency} ` : ""}
                    {amountFormatted}
                  </Text>
                )}

                {splitEvenly ? (
                  <Text style={styles.percentageText}>
                    {split.selected && selectedCount > 0
                      ? `${(100 / selectedCount).toFixed(1)}%`
                      : "0%"}
                  </Text>
                ) : (
                  // Controlled string TextInput — only parses on blur
                  <TextInput
                    value={
                      percentageStrings[split.participantId] ??
                      (split.percentage > 0 ? split.percentage.toString() : "")
                    }
                    onChangeText={(v) =>
                      handlePercentageChange(split.participantId, v)
                    }
                    onBlur={() =>
                      handlePercentageBlur(
                        split.participantId,
                        percentageStrings[split.participantId] ?? "",
                      )
                    }
                    keyboardType="decimal-pad"
                    editable={split.selected}
                    style={[
                      styles.percentageInput,
                      {
                        color: split.selected
                          ? theme.colors.onSurface
                          : theme.colors.onSecondary,
                      },
                    ]}
                    placeholder="0%"
                    placeholderTextColor={theme.colors.onSecondary}
                  />
                )}
              </Pressable>
            )
          })}

          {/* Add participant button */}
          <Pressable
            style={styles.addParticipantButton}
            onPress={() => setAddNameVisible(true)}
          >
            <IconSvg name="plus" size={20} color={theme.colors.onSecondary} />
          </Pressable>
        </View>

        {/* Percentage total indicator — shown only in manual split mode */}
        {!splitEvenly && (
          <View style={styles.percentageTotalRow}>
            <Text style={styles.percentageTotalLabel}>
              {t("screens.settings.billSplitter.item.total")}
            </Text>
            <Text style={[styles.percentageTotalValue, { color: totalColor }]}>
              {totalRounded.toFixed(1)}%
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer: Cancel + Save side by side, matching budget-modify pattern */}
      <View style={styles.footer}>
        <Button
          variant="outline"
          onPress={handleCancel}
          style={styles.footerButton}
        >
          <Text style={styles.cancelText}>{t("common.actions.cancel")}</Text>
        </Button>
        <Button
          variant="default"
          onPress={handleSave}
          style={styles.footerButton}
          disabled={isSaveDisabled}
        >
          <Text style={styles.saveText}>
            {isEditMode
              ? t("common.actions.save")
              : t("screens.settings.billSplitter.actions.addItem")}
          </Text>
        </Button>
      </View>

      <AddNameModal
        visible={addNameVisible}
        onAdd={handleAddParticipant}
        onClose={() => setAddNameVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    padding: 20,
    paddingBottom: 140,
    gap: 12,
  },
  // Section header label — 12px, 600 weight, letter-spacing 0.5 (matches budget-modify)
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.onSurface,
    letterSpacing: 0.5,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  card: {
    gap: 12,
    borderRadius: 14,
    backgroundColor: `${theme.colors.onSurface}08`,
    borderWidth: 1,
    borderColor: theme.colors.customColors.semi,
    overflow: "hidden",
  },
  nameInput: {
    fontSize: 16,
  },
  // Multiplier trigger — collapsible row
  multiplierTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: `${theme.colors.onSurface}08`,
    borderWidth: 1,
    borderColor: theme.colors.customColors.semi,
  },
  multiplierLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
  multiplierHint: {
    fontSize: 12,
    color: theme.colors.onSecondary,
    marginTop: 2,
  },
  multiplierBadge: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}15`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  multiplierContent: {
    borderRadius: 14,
    backgroundColor: `${theme.colors.onSurface}08`,
    borderWidth: 1,
    borderColor: theme.colors.customColors.semi,
    overflow: "hidden",
  },
  // switchRow — matches budget-modify switchRow pattern exactly
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: `${theme.colors.onSurface}08`,
    borderWidth: 1,
    borderColor: theme.colors.customColors.semi,
  },
  switchLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
  participantsList: {
    gap: 8,
  },
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    gap: 10,
    backgroundColor: `${theme.colors.onSurface}08`,
    borderWidth: 1,
    borderColor: theme.colors.customColors.semi,
  },
  participantRowDeselected: {
    opacity: 0.45,
  },
  checkbox: {
    width: 22,
    height: 22,
  },
  participantName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
  // Inline dollar amount preview — secondary label style
  amountPreview: {
    fontSize: 13,
    fontWeight: "400",
    color: theme.colors.onSecondary,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
    minWidth: 52,
    textAlign: "right",
  },
  percentageInput: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 52,
    textAlign: "right",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.customColors.semi,
    paddingVertical: 2,
  },
  addParticipantButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.customColors.semi,
    borderStyle: "dashed",
  },
  // Percentage total indicator row
  percentageTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: `${theme.colors.onSurface}08`,
    borderWidth: 1,
    borderColor: theme.colors.customColors.semi,
  },
  percentageTotalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.onSecondary,
    letterSpacing: 0.3,
  },
  percentageTotalValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  // Footer — Cancel + Save side by side (matches budget-modify actions pattern)
  footer: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  footerButton: {
    flex: 1,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onPrimary,
  },
}))
