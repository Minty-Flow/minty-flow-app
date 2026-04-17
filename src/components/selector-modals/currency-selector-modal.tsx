/**
 * Currency selector as a modal: trigger row (shared style) + full-screen modal
 * with search and FlatList. Currencies are local/static — no async, no Suspense.
 * FlatList virtualization handles performance; search auto-focuses when modal opens.
 */

import { memo, useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList, Modal, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StyleSheet } from "react-native-unistyles"

import { SearchInput } from "~/components/search-input"
import { Button } from "~/components/ui/button"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { currencyRegistryService } from "~/services/currency-registry"
import type { Currency } from "~/types/currency"

import { modalStyles, triggerStyles } from "./styles"

interface CurrencySelectorModalProps {
  selectedCurrencyCode: string
  onCurrencySelected: (code: string) => void
  editable?: boolean
}

interface CurrencyRowProps {
  item: Currency
  isSelected: boolean
  onSelect: (code: string) => void
}

const CurrencyRow = memo(function CurrencyRow({
  item,
  isSelected,
  onSelect,
}: CurrencyRowProps) {
  const { t } = useTranslation()
  return (
    <Pressable
      style={({ pressed }: { pressed: boolean }) => [
        modalStyles.item,
        pressed && modalStyles.itemPressed,
        isSelected && modalStyles.itemSelected,
      ]}
      onPress={() => onSelect(item.code)}
    >
      <View style={modalStyles.itemLeft}>
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
      <View style={modalStyles.itemRight}>
        <Text variant="large" style={currencyItemStyles.currencyCode}>
          {item.code}
        </Text>
      </View>
    </Pressable>
  )
})

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

export function CurrencySelectorModal({
  selectedCurrencyCode,
  onCurrencySelected,
  editable = true,
}: CurrencySelectorModalProps) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const currencies = useMemo(
    () => Object.values(currencyRegistryService.groupedCurrencies),
    [],
  )

  const filteredCurrencies = useMemo(() => {
    if (!searchQuery.trim()) return currencies
    const q = searchQuery.toLowerCase().trim()
    return currencies.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.code?.toLowerCase().includes(q) ||
        c.country?.toLowerCase().includes(q),
    )
  }, [currencies, searchQuery])

  const open = useCallback(() => {
    if (!editable) return
    setSearchQuery("")
    setVisible(true)
  }, [editable])

  const close = useCallback(() => {
    setVisible(false)
  }, [])

  const handleSelect = useCallback(
    (code: string) => {
      onCurrencySelected(code)
      close()
    },
    [onCurrencySelected, close],
  )

  const renderItem = useCallback(
    ({ item }: { item: Currency }) => (
      <CurrencyRow
        item={item}
        isSelected={selectedCurrencyCode === item.code}
        onSelect={handleSelect}
      />
    ),
    [selectedCurrencyCode, handleSelect],
  )

  const keyExtractor = useCallback((item: Currency) => item.code, [])

  const listEmptyComponent = useMemo(
    () => (
      <View style={modalStyles.emptyState}>
        <Text variant="muted">
          {t("components.selectors.currency.noCurrenciesFound")}
        </Text>
      </View>
    ),
    [t],
  )

  return (
    <>
      <View style={triggerStyles.wrapper}>
        <Pressable
          style={triggerStyles.triggerRow}
          onPress={open}
          disabled={!editable}
        >
          <View style={triggerStyles.triggerLeft}>
            <IconSvg name="currency" size={24} />
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
        </Pressable>
      </View>

      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={close}
        statusBarTranslucent
        accessibilityViewIsModal
      >
        <SafeAreaView
          style={modalStyles.modalContainer}
          edges={["top", "bottom"]}
        >
          <View style={modalStyles.header}>
            <Text variant="default" style={modalStyles.headerTitle}>
              {t("components.selectors.currency.title")}
            </Text>
            <Button variant="ghost" onPress={close}>
              <Text variant="default">{t("common.actions.cancel")}</Text>
            </Button>
          </View>
          <View style={modalStyles.searchContainer}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={() => setSearchQuery("")}
              placeholder={t(
                "components.selectors.currency.searchPlaceholderEx",
              )}
            />
          </View>
          <View style={modalStyles.listWrapper}>
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
              style={modalStyles.list}
              contentContainerStyle={modalStyles.listContent}
              showsVerticalScrollIndicator
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  )
}
