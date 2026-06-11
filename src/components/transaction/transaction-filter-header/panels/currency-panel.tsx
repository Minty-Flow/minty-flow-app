import { useTranslation } from "react-i18next"
import { ScrollView, View } from "react-native"
import { useUnistyles } from "react-native-unistyles"

import { Chip } from "~/components/ui/chips"
import { Text } from "~/components/ui/text"
import { CurrencyRegistryService } from "~/services/currency-registry"
import type { Account } from "~/types/accounts"

import { filterHeaderStyles } from "../filter-header.styles"
import { PanelClearButton } from "../panel-clear-button"
import { PanelDoneButton } from "../panel-done-button"
import { CHIPS_PER_ROW } from "../types"
import { chunk } from "../utils"

interface CurrencyPanelProps {
  /** All available accounts — used to derive unique currency codes. */
  accounts: Account[]
  /** Currently selected currency codes. */
  selectedCurrencies: string[]
  onToggle: (currencyCode: string) => void
  onClear: () => void
  onDone: () => void
}

export function CurrencyPanel({
  accounts,
  selectedCurrencies,
  onToggle,
  onClear,
  onDone,
}: CurrencyPanelProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  // Deduplicate currency codes while preserving order of first appearance.
  const currencies = [...new Set(accounts.map((a) => a.currencyCode))].filter(
    Boolean,
  )

  if (currencies.length === 0) {
    return (
      <View>
        <View style={filterHeaderStyles.panelHeader}>
          <Text variant="default" style={{ opacity: 0.5 }}>
            {t("components.selectors.currency.noCurrenciesFound")}
          </Text>
          <PanelDoneButton onPress={onDone} />
        </View>
      </View>
    )
  }

  return (
    <View>
      {chunk(currencies, CHIPS_PER_ROW).map((row) => (
        <ScrollView
          key={row.join(",")}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={filterHeaderStyles.chipScrollRow}
          style={filterHeaderStyles.categoryRow}
        >
          {row.map((code) => (
            <Chip
              key={code}
              label={code}
              selected={selectedCurrencies.includes(code)}
              onPress={() => onToggle(code)}
              leading={
                <Text
                  style={{
                    fontSize: theme.typography.labelLarge.fontSize,
                    fontWeight: "600",
                    lineHeight: 18,
                    color: theme.colors.primary,
                  }}
                >
                  {CurrencyRegistryService.getInstance().getCurrencySymbol(
                    code,
                  )}
                </Text>
              }
            />
          ))}
        </ScrollView>
      ))}

      <View style={filterHeaderStyles.panelHeader}>
        <View />
        <View style={filterHeaderStyles.panelHeaderActions}>
          <PanelClearButton
            onPress={onClear}
            disabled={selectedCurrencies.length === 0}
          />
          <PanelDoneButton onPress={onDone} />
        </View>
      </View>
    </View>
  )
}
