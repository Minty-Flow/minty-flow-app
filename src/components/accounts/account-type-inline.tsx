/**
 * Inline account type selector: trigger row + expandable panel.
 * Reusable; same pattern as CategoryTypeInline / ColorVariantInline.
 */

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { useScrollIntoView } from "~/hooks/use-scroll-into-view"
import type { AccountType } from "~/types/accounts"
import { accountTypesList } from "~/utils/account-types-list"

import { ChevronIcon } from "../ui/chevron-icon"

interface AccountTypeInlineProps {
  /** Currently selected type. */
  selectedType: AccountType
  /** Called when user selects a type (select and close). */
  onTypeSelected: (type: AccountType) => void
  /** When false, the row is not tappable and no chevron is shown. */
  editable?: boolean
}

export function AccountTypeInline({
  selectedType,
  onTypeSelected,
  editable = true,
}: AccountTypeInlineProps) {
  const { t } = useTranslation()
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

  const handleSelect = (type: AccountType) => {
    onTypeSelected(type)

    setExpanded(false)
  }

  const displayLabel = (() => {
    const found = accountTypesList.find((item) => item.type === selectedType)
    return found ? t(found.label) : selectedType
  })()

  return (
    <View ref={wrapperRef} style={styles.wrapper}>
      <Pressable
        style={styles.triggerRow}
        onPress={handleToggle}
        disabled={!editable}
      >
        <View style={styles.triggerLeft}>
          <IconSvg name="building-bank" size={24} />
          <Text variant="default" style={styles.triggerLabel}>
            {t("screens.accounts.form.typeLabel")}
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
              style={styles.chevronIcon}
            />
          )}
        </View>
      </Pressable>

      {editable && expanded && (
        <View style={styles.panel}>
          {accountTypesList.map((item) => (
            <Pressable
              key={item.type}
              style={[
                styles.option,
                selectedType === item.type && styles.optionActive,
              ]}
              onPress={() => handleSelect(item.type)}
            >
              <Text
                variant="default"
                style={[
                  styles.optionText,
                  selectedType === item.type && styles.optionTextActive,
                ]}
              >
                {t(item.label)}
              </Text>
              {selectedType === item.type && (
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
  chevronIcon: {
    color: theme.colors.onSecondary,
    opacity: 0.4,
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
    borderRadius: theme.radius ?? 12,
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
