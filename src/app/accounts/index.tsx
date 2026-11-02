import { useRouter } from "expo-router"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import {
  AccountCard,
  type AccountCardProps,
} from "~/components/accounts/account-card"
import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { PrivacyEyeControl } from "~/components/privacy-eye-control"
import { ReorderableList } from "~/components/reorderable-list"
import { RouteLoadingState } from "~/components/route-load-state"
import { SearchInput } from "~/components/search-input"
import { Button } from "~/components/ui/button"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useActiveAccounts } from "~/database/drizzle/read-models/account-read-model"
import { useAccountPeriodTotals } from "~/database/drizzle/read-models/progress-read-model"
import { updateAccountsOrder } from "~/database/services/account-service"
import { useDayKey } from "~/hooks/use-time-reactivity"
import { useTransfersPreferencesStore } from "~/stores/transfers-preferences.store"
import type { Account } from "~/types/accounts"
import { NewEnum } from "~/types/new"
import { logger } from "~/utils/logger"
import { getMonthRange } from "~/utils/time-utils"
import { Toast } from "~/utils/toast"

/**
 * Local month bounds for "now". `_dayKey` is a cache key, not data: React
 * Compiler drops memo dependencies the computation does not read, so the day
 * has to be an argument for the range to re-derive after a rollover.
 */
function currentMonthRange(_dayKey: string) {
  const now = new Date()
  return getMonthRange(now.getFullYear(), now.getMonth())
}

function AccountsScreen() {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isReorderMode, setIsReorderMode] = useState(false)
  const [reorderedAccounts, setReorderedAccounts] = useState<Account[]>([])
  const excludeFromTotals = useTransfersPreferencesStore(
    (s) => s.excludeFromTotals,
  )
  const accounts = useActiveAccounts()
  const dayKey = useDayKey()
  const { fromDate, toDate } = useMemo(
    () => currentMonthRange(dayKey),
    [dayKey],
  )
  const { totals: totalsByAccount, isReady: totalsReady } =
    useAccountPeriodTotals(
      new Date(fromDate),
      new Date(toDate),
      excludeFromTotals,
    )
  if (!totalsReady) return <RouteLoadingState />
  const accountsWithMonthTotals = (() => {
    return accounts.map((account) => {
      const totals = totalsByAccount.get(account.id) ?? {
        in: 0,
        out: 0,
        net: 0,
      }
      return {
        ...account,
        monthIn: totals.in,
        monthOut: totals.out,
        monthNet: totals.net,
      }
    })
  })()
  const filteredAccounts = accountsWithMonthTotals.filter(
    (a) =>
      !searchQuery.trim() ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  const displayAccounts = isReorderMode ? reorderedAccounts : filteredAccounts
  // The headline is the user's whole balance: a search or a reorder in
  // progress must not change it.
  const balancesByCurrency = accountsWithMonthTotals
    .filter((account) => !account.excludeFromBalance)
    .reduce(
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
      [] as {
        currency: string
        balance: number
      }[],
    )
  const handleToggleReorder = () => {
    if (searchQuery.length > 0) setSearchQuery("")
    if (!isReorderMode) setReorderedAccounts(accountsWithMonthTotals)
    setIsReorderMode((prev) => !prev)
  }
  const handleSaveReorder = async () => {
    try {
      await updateAccountsOrder(reorderedAccounts)
      setIsReorderMode(false)
      setReorderedAccounts([])
    } catch (error) {
      logger.error("Failed to save account order", { error })
      Toast.error({ title: t("common.toast.error") })
    }
  }
  const handleCancelReorder = () => {
    setIsReorderMode(false)
    setReorderedAccounts([])
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
                <IconSvg name="x-outline" size={24} />
              </Button>
              <Button variant="ghost" size="icon" onPress={handleSaveReorder}>
                <IconSvg name="check" size={24} />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" onPress={handleToggleReorder}>
                <IconSvg name="arrow-move-vertical-outline" size={24} />
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
            {filteredAccounts.length}
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

      <ReorderableList
        data={displayAccounts}
        keyExtractor={(item) => item.id}
        onReorder={(newAccounts) => setReorderedAccounts(newAccounts)}
        showButtons={isReorderMode}
        renderItem={({ item }) => {
          const cardProps: AccountCardProps = {
            account: item,
            monthIn:
              (
                item as typeof item & {
                  monthIn?: number
                }
              ).monthIn ?? 0,
            monthOut:
              (
                item as typeof item & {
                  monthOut?: number
                }
              ).monthOut ?? 0,
            monthNet:
              (
                item as typeof item & {
                  monthNet?: number
                }
              ).monthNet ?? 0,
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
              <Pressable
                style={styles.newAccountButton}
                onPress={handleAddAccount}
              >
                <IconSvg
                  name="plus-outline"
                  size={32}
                  color={theme.colors.onSecondary}
                />
                <Text variant="default" style={styles.newAccountText}>
                  {t("screens.accounts.addNewAccount")}
                </Text>
              </Pressable>
            </View>
          ) : null
        }
      />
    </View>
  )
}
export default AccountsScreen
const styles = StyleSheet.create((theme, rt) => ({
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
    marginTop: rt.insets.top + 12,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 5,
  },
  header: {},
  balanceContainer: { gap: 5 },
  sectionLabel: {
    fontSize: theme.typography.labelSmall.fontSize,
    fontWeight: "600",
    color: theme.colors.semantic.semi,
    letterSpacing: 0.8,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  currencyLabel: {
    fontSize: theme.typography.labelLarge.fontSize,
  },
  balanceAmount: {
    ...theme.typography.displaySmall,
    fontWeight: "600",
  },
  accountsCountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBlock: 10,
  },
  accountsCount: {
    ...theme.typography.labelLarge,
    fontWeight: "600",
    color: theme.colors.semantic.semi,
  },
  searchContainer: {
    marginBottom: 10,
  },
  footer: {
    marginBottom: 40,
  },
  // Same look as the "new account" row on the All accounts screen.
  newAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 20,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
  },
  newAccountText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },
}))
