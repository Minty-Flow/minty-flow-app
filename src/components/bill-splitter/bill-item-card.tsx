import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Money } from "~/components/money"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import type { BillItem, Participant } from "~/types/bill-splitter"

interface BillItemCardProps {
  item: BillItem
  participants: Participant[]
  onDelete: () => void
  onEdit: () => void
}

export function BillItemCard({
  item,
  participants,
  onDelete,
  onEdit,
}: BillItemCardProps) {
  const { theme } = useUnistyles()
  const { t } = useTranslation()
  const currency = useMoneyFormattingStore((s) => s.preferredCurrency)

  const itemTotal = item.price * item.quantity
  const selectedSplits = item.splits.filter((s) => s.selected)

  return (
    // Outer wrapper provides relative positioning anchor for the delete button
    <View style={styles.wrapper}>
      {/* Tappable card body */}
      <Pressable
        onPress={onEdit}
        style={styles.card}
        accessibilityLabel={
          item.name || t("screens.settings.billSplitter.item.name")
        }
      >
        {/* Header: item name (+ optional quantity badge) + total amount */}
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name || t("screens.settings.billSplitter.item.name")}
            </Text>
            {/* Quantity badge — only visible when qty > 1 */}
            {item.quantity > 1 && (
              <View style={styles.quantityBadge}>
                <Text style={styles.quantityText}>×{item.quantity}</Text>
              </View>
            )}
          </View>
          <Money
            value={itemTotal}
            currency={currency}
            hideSign
            style={styles.totalAmount}
          />
        </View>

        {/* Per-person breakdown rows — no progress bars */}
        {selectedSplits.map((split) => {
          const participant = participants.find(
            (p) => p.id === split.participantId,
          )
          if (!participant) return null

          const personAmount = itemTotal * (split.percentage / 100)

          return (
            <View key={split.participantId} style={styles.personRow}>
              <Text style={styles.personName} numberOfLines={1}>
                {participant.name}
              </Text>
              <Money
                value={personAmount}
                currency={currency}
                hideSign
                style={styles.personAmount}
              />
            </View>
          )
        })}
      </Pressable>

      {/* Floating delete button anchored to the outer wrapper */}
      <Pressable
        onPress={onDelete}
        style={styles.deleteButton}
        accessibilityLabel={t("common.actions.delete")}
        // Larger hit slop so the touch target doesn't overlap card content
        hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}
      >
        <IconSvg name="trash" size={16} color={theme.colors.error} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  // Outer wrapper: needed so the absolutely-positioned delete button
  // is clipped to the card boundary rather than the screen.
  wrapper: {
    position: "relative",
  },
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: `${theme.colors.onSurface}08`,
    borderWidth: 1,
    borderColor: theme.colors.customColors.semi,
    gap: 10,
    // Ensure card content doesn't bleed under the delete button area
    paddingTop: 18,
  },
  deleteButton: {
    position: "absolute",
    top: -6,
    right: -6,
    zIndex: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${theme.colors.error}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  // Left side of header: name + quantity badge
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 6,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.onSurface,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  quantityBadge: {
    borderRadius: 10,
    backgroundColor: `${theme.colors.secondary}20`,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.secondary,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  // Per-person row: name left, amount right — no absolute positioning
  personRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  personName: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.onSecondary,
    flex: 1,
  },
  personAmount: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
}))
