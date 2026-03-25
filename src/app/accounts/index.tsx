import { withObservables } from "@nozbe/watermelondb/react"
import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import {
  AccountCard,
  type AccountCardProps,
} from "~/components/accounts/account-card"
import { Money } from "~/components/money"
import { PrivacyEyeControl } from "~/components/privacy-eye-control"
import { ReorderableListV2 } from "~/components/reorderable-list-v2"
import { SearchInput } from "~/components/search-input"
import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type AccountModel from "~/database/models/account"
import type { AccountWithMonthTotals } from "~/database/services/account-service"
import {
  observeAccountModels,
  observeAccountsWithMonthTotals,
  updateAccountsOrder,
} from "~/database/services/account-service"
import { modelToAccount } from "~/database/utils/model-to-account"
import { useTransfersPreferencesStore } from "~/stores/transfers-preferences.store"
import { NewEnum } from "~/types/new"
import { logger } from "~/utils/logger"

interface AccountsScreenInnerProps {
  accountModels: AccountModel[]
  accountsWithMonthTotals: AccountWithMonthTotals[]
}

const AccountsScreenInner = ({
  accountModels,
  accountsWithMonthTotals,
}: AccountsScreenInnerProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isReorderMode, setIsReorderMode] = useState(false)
  const [reorderedModels, setReorderedModels] = useState<AccountModel[]>([])

  // Filter on models (source of truth for order/search)
  const filteredModels = accountModels.filter((model) => {
    if (!searchQuery.trim()) return true
    return model.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const displayModels = isReorderMode ? reorderedModels : filteredModels

  // Accounts with month totals for display (match by id to preserve order)
  const displayAccounts = displayModels.map((model) => {
    const withTotals = accountsWithMonthTotals.find((a) => a.id === model.id)
    return (
      withTotals ?? {
        ...modelToAccount(model),
        monthIn: 0,
        monthOut: 0,
        monthNet: 0,
      }
    )
  })

  // Balance calculation (domain only)
  const balancesByCurrency = displayAccounts.reduce(
    (acc, account) => {
      const existing = acc.find(
        (item) => item.currency === account.currencyCode,
      )
      if (existing) {
        existing.balance += account.balance
      } else {
        acc.push({
          currency: account.currencyCode,
          balance: account.balance,
        })
      }
      return acc
    },
    [] as { currency: string; balance: number }[],
  )

  const handleToggleReorder = () => {
    // Clear search first
    if (searchQuery.length > 0) {
      setSearchQuery("")
    }

    if (!isReorderMode) {
      setReorderedModels(accountModels) // use the full list here
    }

    setIsReorderMode((prev) => !prev)
  }

  const handleSaveReorder = async () => {
    try {
      await updateAccountsOrder(reorderedModels)
      setIsReorderMode(false)
      setReorderedModels([])
    } catch (error) {
      logger.error("Failed to save account order", { error })
    }
  }

  const handleCancelReorder = () => {
    setIsReorderMode(false)
    setReorderedModels([])
  }

  const handleReorder = (newModels: AccountModel[]) => {
    setReorderedModels(newModels)
  }

  const handleAddAccount = () => {
    router.push({
      pathname: "/accounts/[accountId]/modify",
      params: { accountId: NewEnum.NEW },
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="h4">{t("navigation.tabs.accounts")}</Text>

        <View style={styles.actionButtons}>
          {isReorderMode ? (
            <>
              <Button variant="ghost" size="icon" onPress={handleCancelReorder}>
                <IconSvg name="x" size={24} />
              </Button>
              <Button variant="ghost" size="icon" onPress={handleSaveReorder}>
                <IconSvg name="check" size={24} />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" onPress={handleToggleReorder}>
                <IconSvg name="arrow-move-vertical" size={24} />
              </Button>

              <PrivacyEyeControl />
            </>
          )}
        </View>
      </View>

      <View style={styles.header}>
        <Text variant="small" style={styles.sectionLabel}>
          {t("screens.accounts.totalBalance")}
        </Text>

        <View style={styles.balanceContainer}>
          {balancesByCurrency.map((item) => (
            <View key={item.currency} style={styles.balanceRow}>
              <Text variant="default" style={styles.currencyLabel}>
                {item.currency}
              </Text>
              <Money
                value={item.balance}
                variant="h3"
                currency={item.currency}
                style={styles.balanceAmount}
              />
            </View>
          ))}
        </View>

        <View style={styles.accountsCountContainer}>
          <Text variant="small" style={styles.sectionLabel}>
            {t("screens.accounts.countLabel")}
          </Text>
          <Text variant="small" style={styles.accountsCount}>
            {filteredModels.length}
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <SearchInput
          placeholder={t("screens.accounts.a11y.searchPlaceholder")}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery("")}
          editable={!isReorderMode}
        />
      </View>

      <ReorderableListV2
        data={displayModels}
        keyExtractor={(item) => item.id}
        onReorder={handleReorder}
        showButtons={isReorderMode}
        renderItem={({ item }) => {
          const accountWithTotals = displayAccounts.find(
            (a) => a.id === item.id,
          )
          const cardProps: AccountCardProps = {
            account: accountWithTotals ?? modelToAccount(item),
            monthIn: accountWithTotals?.monthIn ?? 0,
            monthOut: accountWithTotals?.monthOut ?? 0,
            monthNet: accountWithTotals?.monthNet ?? 0,
            isReorderMode,
          }
          return <AccountCard {...cardProps} />
        }}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          !isReorderMode ? (
            <View style={styles.footer}>
              <Button onPress={handleAddAccount} variant="secondary">
                <IconSvg name="plus" size={24} />
                <Text variant="default">
                  {t("screens.accounts.addNewAccount")}
                </Text>
              </Button>
            </View>
          ) : null
        }
      />
    </View>
  )
}

// Watermelon binding: models for order/search, with month totals for cards
const enhance = withObservables(
  ["excludeFromTotals"],
  ({ excludeFromTotals = true }: { excludeFromTotals?: boolean }) => ({
    accountModels: observeAccountModels(),
    accountsWithMonthTotals: observeAccountsWithMonthTotals(excludeFromTotals),
  }),
)

const EnhancedAccountsScreen = enhance(AccountsScreenInner)

function AccountsScreen() {
  const excludeFromTotals = useTransfersPreferencesStore(
    (s) => s.excludeFromTotals,
  )
  return <EnhancedAccountsScreen excludeFromTotals={excludeFromTotals} />
}

export default AccountsScreen

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    marginHorizontal: 20,
  },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingBottom: 100,
    gap: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 50,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 5,
  },
  header: {},
  balanceContainer: { gap: 5 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.customColors.semi,
    letterSpacing: 0.8,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  currencyLabel: {
    fontSize: 14,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "600",
  },
  accountsCountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBlock: 10,
  },
  accountsCount: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.customColors.semi,
  },
  searchContainer: {
    marginBottom: 10,
  },
  footer: {
    marginBottom: 40,
  },
}))
