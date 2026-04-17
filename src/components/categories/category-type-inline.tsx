/**
 * Inline category/transaction type selector: trigger row + expandable panel.
 * Reusable; trigger and panel styles live here (same pattern as ColorVariantInline).
 */

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { useScrollIntoView } from "~/hooks/use-scroll-into-view"
import type { TransactionType } from "~/types/transactions"

import { ChevronIcon } from "../ui/chevron-icon"

interface CategoryTypeInlineProps {
  /** Currently selected type. */
  selectedType: TransactionType
  /** Called when user selects a type (select and close). */
  onTypeSelected: (type: TransactionType) => void
  /** When false, the row is not tappable and no chevron is shown (e.g. edit mode). */
  editable?: boolean
}

export function CategoryTypeInline({
  selectedType,
  onTypeSelected,
  editable = true,
}: CategoryTypeInlineProps) {
  const { t } = useTranslation()
  const typeOptions = [
    {
      type: "expense" as TransactionType,
      label: t("components.categories.types.expense"),
    },
    {
      type: "income" as TransactionType,
      label: t("components.categories.types.income"),
    },
    {
      type: "transfer" as TransactionType,
      label: t("components.categories.types.transfer"),
    },
  ]
  const { wrapperRef, scrollIntoView } = useScrollIntoView()
  const [expanded, setExpanded] = useState(false)

  const handleToggle = () => {
    if (!editable) return

    setExpanded((v) => {
      const next = !v
      if (next) scrollIntoView()
      return next
    })
  }

  const handleSelect = (type: TransactionType) => {
    onTypeSelected(type)

    setExpanded(false)
  }

  const displayLabel =
    typeOptions.find((o) => o.type === selectedType)?.label ??
    selectedType.charAt(0).toUpperCase() + selectedType.slice(1)

  return (
    <View ref={wrapperRef} style={styles.wrapper}>
      <Pressable
        style={styles.triggerRow}
        onPress={handleToggle}
        disabled={!editable}
      >
        <View style={styles.triggerLeft}>
          <IconSvg name="arrows-diff" size={24} />
          <Text variant="default" style={styles.triggerLabel}>
            {t("components.categories.form.typeLabel")}
          </Text>
        </View>
        <View style={styles.triggerRight}>
          <Text variant="default" style={styles.triggerValue}>
            {displayLabel}
          </Text>
          {editable && (
            <ChevronIcon
              direction={expanded ? "up" : "trailing"}
              size={20}
              style={styles.chevronIconOpacity}
              color={styles.chevronIconColor.color}
            />
          )}
        </View>
      </Pressable>

      {editable && expanded && (
        <View style={styles.panel}>
          {typeOptions.map((opt) => (
            <Pressable
              key={opt.type}
              style={[
                styles.option,
                selectedType === opt.type && styles.optionActive,
              ]}
              onPress={() => handleSelect(opt.type)}
            >
              <Text
                variant="default"
                style={[
                  styles.optionText,
                  selectedType === opt.type && styles.optionTextActive,
                ]}
              >
                {opt.label}
              </Text>
              {selectedType === opt.type && (
                <IconSvg
                  name="check"
                  size={20}
                  color={styles.optionCheck.color}
                />
              )}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  wrapper: {
    width: "100%",
  },
  triggerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  triggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  triggerLabel: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  triggerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  triggerValue: {
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.onSecondary,
    opacity: 0.7,
  },
  chevronIconOpacity: {
    opacity: 0.4,
  },
  chevronIconColor: {
    color: theme.colors.onSecondary,
  },
  panel: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    marginTop: 10,
    gap: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: theme.radius,
    backgroundColor: `${theme.colors.onSurface}10`,
    borderWidth: 1,
    borderColor: "transparent",
  },
  optionActive: {
    backgroundColor: `${theme.colors.primary}20`,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.onSurface,
  },
  optionTextActive: {
    fontWeight: "600",
    color: theme.colors.primary,
  },
  optionCheck: {
    color: theme.colors.primary,
  },
}))
