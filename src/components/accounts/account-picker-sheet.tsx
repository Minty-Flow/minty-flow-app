/**
 * Single-select account picker in a bottom sheet. Tapping an account selects it
 * and closes the sheet. Search appears only when the list is long enough to need
 * it; shorter lists size the sheet to their content.
 */
import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { SearchInput } from "~/components/search-input"
import { sheetHeaderStyles } from "~/components/selectors/styles"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import { EmptyState } from "~/components/ui/empty-state"
import { ListItem } from "~/components/ui/list-item"
import {
  SingleSelectItem,
  SingleSelectLabel,
} from "~/components/ui/single-select-item"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { Account } from "~/types/accounts"
import { NewEnum } from "~/types/new"

/** Above this many accounts the sheet shows a search field. */
const SEARCH_MIN_ACCOUNTS = 8

interface AccountPickerSheetProps {
  visible: boolean
  onClose: () => void
  title: string
  accounts: Account[]
  selectedId: string | undefined
  onSelect: (accountId: string) => void
}

export function AccountPickerSheet({
  visible,
  onClose,
  title,
  accounts,
  selectedId,
  onSelect,
}: AccountPickerSheetProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const showSearch = accounts.length > SEARCH_MIN_ACCOUNTS

  const q = query.trim().toLowerCase()
  const filtered = q
    ? accounts.filter((a) => a.name.toLowerCase().includes(q))
    : accounts

  const handleClose = () => {
    setQuery("")
    onClose()
  }
  const handleSelect = (id: string) => {
    onSelect(id)
    handleClose()
  }
  const handleAddAccount = () => {
    handleClose()
    router.push({
      pathname: "/accounts/[accountId]/modify",
      params: { accountId: NewEnum.NEW },
    })
  }

  const renderRow = (account: Account) => (
    <SingleSelectItem
      key={account.id}
      selected={account.id === selectedId}
      style={styles.row}
      onPress={() => handleSelect(account.id)}
    >
      <DynamicIcon
        icon={account.icon || "wallet-outline"}
        size={24}
        colorScheme={account.colorScheme}
        variant="badge"
      />
      <View style={styles.rowContent} native>
        <SingleSelectLabel style={styles.rowName} numberOfLines={1}>
          {account.name}
        </SingleSelectLabel>
        <Money
          value={account.balance}
          currency={account.currencyCode}
          style={styles.rowBalance}
        />
      </View>
    </SingleSelectItem>
  )

  const header = (
    <View style={sheetHeaderStyles.header}>
      <Text variant="default" style={sheetHeaderStyles.title}>
        {title}
      </Text>
    </View>
  )

  if (accounts.length === 0) {
    return (
      <BottomSheet
        isPresented={visible}
        onDismiss={handleClose}
        contentPadding={0}
      >
        {header}
        <ListItem style={styles.row} onPress={handleAddAccount}>
          <View style={styles.addIcon}>
            <IconSvg name="plus-outline" size={20} />
          </View>
          <Text style={styles.addLabel}>{t("screens.accounts.a11y.add")}</Text>
        </ListItem>
      </BottomSheet>
    )
  }

  if (!showSearch) {
    return (
      <BottomSheet
        isPresented={visible}
        onDismiss={handleClose}
        contentPadding={{ horizontal: 0, bottom: 16 }}
      >
        {header}
        {accounts.map(renderRow)}
      </BottomSheet>
    )
  }

  return (
    <BottomSheet
      isPresented={visible}
      onDismiss={handleClose}
      contentPadding={0}
      heightFraction={0.75}
    >
      <View style={styles.container}>
        {header}
        <View style={styles.search}>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery("")}
            placeholder={t("screens.accounts.a11y.searchPlaceholder")}
          />
        </View>
        <FlatList
          style={styles.list}
          data={filtered}
          keyExtractor={(account) => account.id}
          renderItem={({ item }) => renderRow(item)}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              variant="compact"
              icon="search-outline"
              title={t("components.accountPicker.noResults")}
            />
          }
        />
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: { flex: 1 },
  search: { paddingHorizontal: 20, paddingBottom: 8 },
  list: { flex: 1 },
  listContent: { paddingBottom: 16 },
  row: {
    gap: 12,
    paddingVertical: 10,
  },
  rowContent: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  rowName: {
    ...theme.typography.bodyLarge,
    flex: 1,
    minWidth: 0,
    color: theme.colors.onSurface,
  },
  rowBalance: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.onSecondary,
  },
  addIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  addLabel: {
    flex: 1,
    ...theme.typography.bodyLarge,
    fontWeight: "600",
    color: theme.colors.primary,
  },
}))
