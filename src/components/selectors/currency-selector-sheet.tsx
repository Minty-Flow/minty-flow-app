/**
 * Currency selector: trigger row (shared style) + native bottom sheet with
 * search and FlatList. Currencies are local/static — no async, no Suspense.
 * FlatList virtualization handles performance;
 */
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList, View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { SearchInput } from "~/components/search-input"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { EmptyState } from "~/components/ui/empty-state"
import { ListItem } from "~/components/ui/list-item"
import { Text } from "~/components/ui/text"
import { currencyRegistryService } from "~/services/currency-registry"
import type { Currency } from "~/types/currency"

import { sheetHeaderStyles, sheetStyles, triggerStyles } from "./styles"

interface CurrencySelectorSheetProps {
  selectedCurrencyCode: string
  onCurrencySelected: (code: string) => void
  editable?: boolean
}
interface CurrencyRowProps {
  item: Currency
  isSelected: boolean
  onSelect: (code: string) => void
}
const CurrencyRow = function CurrencyRow({
  item,
  isSelected,
  onSelect,
}: CurrencyRowProps) {
  const { t } = useTranslation()
  return (
    <ListItem
      style={({ pressed }: { pressed: boolean }) => [
        sheetStyles.item,
        pressed && sheetStyles.itemPressed,
        isSelected && sheetStyles.itemSelected,
      ]}
      onPress={() => onSelect(item.code)}
    >
      <View style={sheetStyles.itemLeft}>
        <Text variant="large" style={currencyItemStyles.currencyName}>
          {item.name}
        </Text>
        <Text variant="muted" style={currencyItemStyles.countryName}>
          {item.country ||
            (item.isCrypto
              ? t("components.selectors.currency.cryptocurrency")
              : "")}
        </Text>
      </View>
      <View style={sheetStyles.itemRight}>
        <Text variant="large" style={currencyItemStyles.currencyCode}>
          {item.code}
        </Text>
      </View>
    </ListItem>
  )
}
const currencyItemStyles = StyleSheet.create((theme) => ({
  currencyName: {
    ...theme.typography.headlineSmall,
  },
  countryName: {
    fontSize: theme.typography.labelLarge.fontSize,
    opacity: 0.7,
  },
  currencyCode: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
}))
export function CurrencySelectorSheet({
  selectedCurrencyCode,
  onCurrencySelected,
  editable = true,
}: CurrencySelectorSheetProps) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const filteredCurrencies =
    currencyRegistryService.searchCurrencies(searchQuery)
  const open = () => {
    if (!editable) return
    setSearchQuery("")
    setVisible(true)
  }
  const close = () => {
    setVisible(false)
  }
  const handleSelect = (code: string) => {
    onCurrencySelected(code)
    close()
  }
  const renderItem = ({ item }: { item: Currency }) => (
    <CurrencyRow
      item={item}
      isSelected={selectedCurrencyCode === item.code}
      onSelect={handleSelect}
    />
  )
  const keyExtractor = (item: Currency) => item.code
  const listEmptyComponent = (
    <EmptyState
      variant="compact"
      icon="search-outline"
      title={t("components.selectors.currency.noCurrenciesFound")}
    />
  )
  return (
    <>
      <View style={triggerStyles.wrapper}>
        <ListItem
          style={triggerStyles.triggerRow}
          onPress={open}
          disabled={!editable}
        >
          <View style={triggerStyles.triggerLeft}>
            <IconSvg name="currency-outline" size={24} />
            <Text variant="default" style={triggerStyles.triggerLabel}>
              {t("components.selectors.currency.triggerLabel")}
            </Text>
          </View>
          <View style={triggerStyles.triggerRight}>
            <Text variant="default" style={triggerStyles.triggerValue}>
              {selectedCurrencyCode}
            </Text>
            {editable && (
              <ChevronIcon
                direction="trailing"
                size={20}
                style={triggerStyles.chevronIcon}
              />
            )}
          </View>
        </ListItem>
      </View>

      <BottomSheet
        isPresented={visible}
        onDismiss={close}
        contentPadding={0}
        heightFraction={0.75}
      >
        <View style={{ flex: 1 }}>
          <View style={sheetHeaderStyles.header}>
            <Text variant="default" style={sheetHeaderStyles.title}>
              {t("components.selectors.currency.title")}
            </Text>
          </View>
          <View style={sheetStyles.searchContainer}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={() => setSearchQuery("")}
              placeholder={t(
                "components.selectors.currency.searchPlaceholderEx",
              )}
            />
          </View>
          <View style={sheetStyles.listWrapper}>
            <FlatList
              data={filteredCurrencies}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ListEmptyComponent={listEmptyComponent}
              initialNumToRender={14}
              maxToRenderPerBatch={20}
              windowSize={11}
              extraData={selectedCurrencyCode}
              keyboardShouldPersistTaps="always"
              style={sheetStyles.list}
              contentContainerStyle={sheetStyles.listContent}
              showsVerticalScrollIndicator
            />
          </View>
        </View>
      </BottomSheet>
    </>
  )
}
