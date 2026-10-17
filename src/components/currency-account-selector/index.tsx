/**
 * CurrencyAccountSelector — two trigger rows that open bottom sheets.
 *
 * Currency: single-select sheet listing the unique currencies of the provided
 * accounts. Accounts: multi-select sheet (with Done) listing the accounts that
 * match the selected currency; it appears once a currency is picked.
 */
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { IconSvg } from "~/components/icons"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { ListItem } from "~/components/ui/list-item"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { Toast } from "~/utils/toast"

import { triggerStyles } from "../selectors/styles"
import { AccountsSheet } from "./accounts-sheet"
import { currencyAccountStyles } from "./currency-account-selector.styles"
import { CurrencySheet } from "./currency-sheet"
import type { CurrencyAccountSelectorProps, CurrencyItem } from "./types"

export function CurrencyAccountSelector({
  accounts,
  selectedCurrency,
  selectedAccountIds,
  onCurrencyChange,
  onAccountIdsChange,
}: CurrencyAccountSelectorProps) {
  const { t } = useTranslation()
  const [currencySheetOpen, setCurrencySheetOpen] = useState(false)
  const [accountsSheetOpen, setAccountsSheetOpen] = useState(false)

  // Derive unique currencies from accounts, sorted alphabetically
  const currencyItems: CurrencyItem[] = (() => {
    const map = new Map<string, number>()
    for (const account of accounts) {
      map.set(account.currencyCode, (map.get(account.currencyCode) ?? 0) + 1)
    }
    return Array.from(map.entries())
      .map(([code, accountCount]) => ({ code, accountCount }))
      .sort((a, b) => a.code.localeCompare(b.code))
  })()
  // Accounts matching the selected currency
  const matchingAccounts = selectedCurrency
    ? accounts.filter((a) => a.currencyCode === selectedCurrency)
    : []

  const handleCurrencySelect = (code: string) => {
    if (code === selectedCurrency) return
    // Clear account selections that belong to the old currency
    const hasStaleAccounts = selectedAccountIds.some((id) => {
      const account = accounts.find((a) => a.id === id)
      return account && account.currencyCode !== code
    })
    if (hasStaleAccounts) {
      onAccountIdsChange([])
      Toast.info({
        title: t("components.currencyAccountSelector.accountsClearedTitle"),
        description: t(
          "components.currencyAccountSelector.accountsClearedDescription",
          { currency: code },
        ),
      })
    }
    onCurrencyChange(code)
  }

  // Comma-separated names for the accounts trigger label
  const selectedAccountNames = (() => {
    if (selectedAccountIds.length === 0) return null
    const selected = new Set(selectedAccountIds)
    return matchingAccounts
      .flatMap((a) => (selected.has(a.id) ? [a.name] : []))
      .join(", ")
  })()

  return (
    <View style={currencyAccountStyles.container}>
      {/* ---- CURRENCY SECTION ---- */}
      <View style={currencyAccountStyles.section}>
        <Text style={currencyAccountStyles.sectionLabel}>
          {t("components.currencyAccountSelector.currencyLabel")}
        </Text>

        <ListItem
          style={triggerStyles.triggerRow}
          onPress={() => setCurrencySheetOpen(true)}
        >
          <View style={triggerStyles.triggerLeft}>
            <IconSvg name="currency-outline" size={24} />
            {selectedCurrency ? (
              <Text style={triggerStyles.triggerLabel}>{selectedCurrency}</Text>
            ) : (
              <Text style={triggerStyles.triggerValue}>
                {t("components.currencyAccountSelector.currencyLabel")}
              </Text>
            )}
          </View>
          <View style={triggerStyles.triggerRight}>
            <ChevronIcon
              direction="trailing"
              size={18}
              style={triggerStyles.chevronIcon}
            />
          </View>
        </ListItem>
      </View>

      {/* ---- ACCOUNTS SECTION (only when currency is selected) ---- */}
      {selectedCurrency !== null && (
        <View style={currencyAccountStyles.section}>
          <ListItem
            style={triggerStyles.triggerRow}
            onPress={() => setAccountsSheetOpen(true)}
          >
            <View style={triggerStyles.triggerLeft}>
              <IconSvg name="wallet-outline" size={24} />
              {selectedAccountNames ? (
                <Text
                  numberOfLines={1}
                  style={currencyAccountStyles.accountTriggerValue}
                >
                  {selectedAccountNames}
                </Text>
              ) : (
                <Text style={triggerStyles.triggerValue}>
                  {t("components.currencyAccountSelector.accountsLabel")}
                </Text>
              )}
            </View>
            <View style={triggerStyles.triggerRight}>
              <ChevronIcon
                direction="trailing"
                size={18}
                style={triggerStyles.chevronIcon}
              />
            </View>
          </ListItem>
        </View>
      )}

      <CurrencySheet
        visible={currencySheetOpen}
        onClose={() => setCurrencySheetOpen(false)}
        currencies={currencyItems}
        selectedCurrency={selectedCurrency}
        onSelect={handleCurrencySelect}
      />
      {selectedCurrency !== null && (
        <AccountsSheet
          visible={accountsSheetOpen}
          onClose={() => setAccountsSheetOpen(false)}
          currency={selectedCurrency}
          accounts={matchingAccounts}
          selectedIds={selectedAccountIds}
          onApply={onAccountIdsChange}
        />
      )}
    </View>
  )
}
