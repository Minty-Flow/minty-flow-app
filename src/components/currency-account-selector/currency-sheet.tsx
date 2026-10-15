/**
 * Single-select sheet for the currencies the user's accounts use. Tapping a
 * currency selects it and closes the sheet.
 */
import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { IconSvg } from "~/components/icons"
import {
  PICKER_SEARCH_MIN_ROWS,
  PickerSheet,
} from "~/components/selectors/picker-sheet"
import { EmptyState } from "~/components/ui/empty-state"
import { Pressable } from "~/components/ui/pressable"
import {
  SingleSelectItem,
  SingleSelectLabel,
} from "~/components/ui/single-select-item"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { currencyRegistryService } from "~/services/currency-registry"
import { NewEnum } from "~/types/new"

import { currencyAccountStyles } from "./currency-account-selector.styles"
import type { CurrencyItem } from "./types"

interface CurrencySheetProps {
  visible: boolean
  onClose: () => void
  currencies: CurrencyItem[]
  selectedCurrency: string | null
  onSelect: (code: string) => void
}

export function CurrencySheet({
  visible,
  onClose,
  currencies,
  selectedCurrency,
  onSelect,
}: CurrencySheetProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const showSearch = currencies.length > PICKER_SEARCH_MIN_ROWS

  const filtered = (() => {
    if (!query.trim()) return currencies
    // The shared registry search matches code, name, symbol and country.
    const matchedCodes = new Set(
      currencyRegistryService.searchCurrencies(query).map((c) => c.code),
    )
    return currencies.filter((item) => matchedCodes.has(item.code))
  })()

  const handleClose = () => {
    setQuery("")
    onClose()
  }
  const handleSelect = (code: string) => {
    handleClose()
    onSelect(code)
  }
  const handleCreateAccount = () => {
    handleClose()
    router.push({
      pathname: "/accounts/[accountId]/modify",
      params: { accountId: NewEnum.NEW },
    })
  }

  return (
    <PickerSheet
      visible={visible}
      onClose={handleClose}
      title={t("components.currencyAccountSelector.currencyLabel")}
      search={
        showSearch
          ? {
              value: query,
              onChange: setQuery,
              placeholder: t(
                "components.selectors.currency.searchPlaceholderEx",
              ),
            }
          : undefined
      }
      data={filtered}
      keyExtractor={(item) => item.code}
      renderRow={(item) => (
        <SingleSelectItem
          selected={item.code === selectedCurrency}
          style={currencyAccountStyles.panelRow}
          onPress={() => handleSelect(item.code)}
        >
          <View style={currencyAccountStyles.panelRowLeft}>
            <SingleSelectLabel variant="large">{item.code}</SingleSelectLabel>
            <Text variant="muted">
              {item.accountCount} account{item.accountCount !== 1 ? "s" : ""}
            </Text>
          </View>
        </SingleSelectItem>
      )}
      empty={
        currencies.length === 0 ? (
          <View style={currencyAccountStyles.emptyPanel}>
            <Text style={currencyAccountStyles.emptyText}>
              {t("components.currencyAccountSelector.noAccounts")}
            </Text>
            <Pressable
              style={currencyAccountStyles.createButton}
              onPress={handleCreateAccount}
            >
              <IconSvg
                name="plus-outline"
                size={16}
                color={currencyAccountStyles.createButtonIcon.color}
              />
              <Text style={currencyAccountStyles.createButtonText}>
                {t("components.currencyAccountSelector.createAccount")}
              </Text>
            </Pressable>
          </View>
        ) : (
          <EmptyState
            variant="compact"
            icon="search-outline"
            title={t("components.selectors.currency.noCurrenciesFound")}
          />
        )
      }
    />
  )
}
