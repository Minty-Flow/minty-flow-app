/**
 * Single-select account picker in a bottom sheet. Tapping an account selects it
 * and closes the sheet. Search appears only when the list is long enough to need
 * it; shorter lists size the sheet to their content.
 */
import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import {
  PICKER_SEARCH_MIN_ROWS,
  PickerSheet,
} from "~/components/selectors/picker-sheet"
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
  const showSearch = accounts.length > PICKER_SEARCH_MIN_ROWS

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

  return (
    <PickerSheet
      visible={visible}
      onClose={handleClose}
      title={title}
      search={
        showSearch
          ? {
              value: query,
              onChange: setQuery,
              placeholder: t("screens.accounts.a11y.searchPlaceholder"),
            }
          : undefined
      }
      data={filtered}
      keyExtractor={(account) => account.id}
      renderRow={renderRow}
      empty={
        accounts.length === 0 ? (
          <ListItem style={styles.row} onPress={handleAddAccount}>
            <View style={styles.addIcon}>
              <IconSvg name="plus-outline" size={20} />
            </View>
            <Text style={styles.addLabel}>
              {t("screens.accounts.a11y.add")}
            </Text>
          </ListItem>
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

const styles = StyleSheet.create((theme) => ({
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
