/**
 * Multi-select sheet for the accounts that match the chosen currency. Changes
 * are held as a draft and applied on Done; closing any other way discards them.
 */
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { DynamicIcon } from "~/components/dynamic-icon"
import {
  PICKER_SEARCH_MIN_ROWS,
  PickerSheet,
} from "~/components/selectors/picker-sheet"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import { EmptyState } from "~/components/ui/empty-state"
import { ListItem } from "~/components/ui/list-item"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { Account } from "~/types/accounts"

import { currencyAccountStyles } from "./currency-account-selector.styles"

interface AccountsSheetProps {
  visible: boolean
  onClose: () => void
  currency: string
  /** Accounts in `currency`. */
  accounts: Account[]
  selectedIds: string[]
  onApply: (ids: string[]) => void
}

export function AccountsSheet({
  visible,
  onClose,
  currency,
  accounts,
  selectedIds,
  onApply,
}: AccountsSheetProps) {
  const { t } = useTranslation()
  // null = untouched since opening, so the draft follows the saved selection.
  const [draftOverride, setDraftOverride] = useState<string[] | null>(null)
  const [query, setQuery] = useState("")
  const draft = draftOverride ?? selectedIds
  const draftSet = new Set(draft)
  const showSearch = accounts.length > PICKER_SEARCH_MIN_ROWS

  const q = query.trim().toLowerCase()
  const filtered = q
    ? accounts.filter((a) => a.name.toLowerCase().includes(q))
    : accounts
  const allSelected =
    accounts.length > 0 && accounts.every((a) => draftSet.has(a.id))
  const someSelected = !allSelected && accounts.some((a) => draftSet.has(a.id))

  const handleClose = () => {
    setDraftOverride(null)
    setQuery("")
    onClose()
  }
  const handleDone = () => {
    onApply(draft)
    handleClose()
  }
  const handleToggle = (id: string) => {
    setDraftOverride(
      draftSet.has(id) ? draft.filter((x) => x !== id) : [...draft, id],
    )
  }
  const handleSelectAll = () => {
    const ids = new Set(accounts.map((a) => a.id))
    setDraftOverride(
      allSelected
        ? draft.filter((id) => !ids.has(id))
        : [...new Set([...draft, ...ids])],
    )
  }

  return (
    <PickerSheet
      visible={visible}
      onClose={handleClose}
      title={t("components.currencyAccountSelector.accountsLabel")}
      search={
        showSearch
          ? {
              value: query,
              onChange: setQuery,
              placeholder: t("screens.accounts.a11y.searchPlaceholder"),
            }
          : undefined
      }
      footer={
        accounts.length > 0 ? (
          <Button
            variant="default"
            onPress={handleDone}
            style={currencyAccountStyles.doneButton}
          >
            <Text variant="default">{t("common.actions.done")}</Text>
          </Button>
        ) : undefined
      }
      data={filtered}
      keyExtractor={(account) => account.id}
      listHeader={
        accounts.length >= 2 && !q ? (
          <ListItem
            style={[
              currencyAccountStyles.panelRow,
              currencyAccountStyles.selectAllRow,
            ]}
            onPress={handleSelectAll}
            accessibilityRole="checkbox"
            accessibilityState={{
              checked: someSelected ? "mixed" : allSelected,
            }}
          >
            <Text style={currencyAccountStyles.selectAllText}>
              {t("components.currencyAccountSelector.selectAll", { currency })}
            </Text>
            <Checkbox checked={allSelected} indeterminate={someSelected} />
          </ListItem>
        ) : null
      }
      renderRow={(account) => (
        <ListItem
          style={currencyAccountStyles.accountRow}
          onPress={() => handleToggle(account.id)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: draftSet.has(account.id) }}
        >
          <View style={currencyAccountStyles.accountLeft}>
            <DynamicIcon
              icon={account.icon}
              size={20}
              colorScheme={account.colorScheme}
              variant="badge"
            />
            <View>
              <Text style={currencyAccountStyles.accountName} numberOfLines={1}>
                {account.name}
              </Text>
              <Text style={currencyAccountStyles.accountCurrency}>
                {account.currencyCode}
              </Text>
            </View>
          </View>
          <Checkbox checked={draftSet.has(account.id)} />
        </ListItem>
      )}
      empty={
        accounts.length === 0 ? (
          <EmptyState
            variant="compact"
            icon="wallet-outline"
            title={t(
              "components.currencyAccountSelector.noAccountsForCurrency",
            )}
          />
        ) : (
          <EmptyState
            variant="compact"
            icon="search-outline"
            title={t("components.accountPicker.noResults")}
          />
        )
      }
    />
  )
}
