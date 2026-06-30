import { useRouter } from "expo-router"
import { useMemo, useState } from "react"
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
import {
  getMonthRange,
  updateAccountsOrder,
} from "~/database/services-sqlite/account-service"
import { useActiveAccounts } from "~/stores/db/account.store"
import { useTransactions } from "~/stores/db/transaction.store"
import { useTransfersPreferencesStore } from "~/stores/transfers-preferences.store"
import type { Account } from "~/types/accounts"
import { NewEnum } from "~/types/new"
import {
  TransactionSubTypeEnum,
  TransactionTypeEnum,
} from "~/types/transactions"
import { logger } from "~/utils/logger"

function AccountsScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isReorderMode, setIsReorderMode] = useState(false)
  const [reorderedAccounts, setReorderedAccounts] = useState<Account[]>([])

  const excludeFromTotals = useTransfersPreferencesStore(
    (s) => s.excludeFromTotals,
  )
  const accounts = useActiveAccounts()

  const { fromDate, toDate } = useMemo(() => {
    const now = new Date()
    return getMonthRange(now.getFullYear(), now.getMonth())
  }, [])

  const { items: transactionsFull } = useTransactions({
    from: new Date(fromDate).toISOString(),
    to: new Date(toDate).toISOString(),
  })

  const accountsWithMonthTotals = useMemo(() => {
    const totalsByAccount = new Map<
      string,
      { in: number; out: number; net: number }
    >()
    for (const t of transactionsFull) {
      if (t.isDeleted || t.isPending) continue
      const cur = totalsByAccount.get(t.accountId) ?? {
        in: 0,
        out: 0,
        net: 0,
      }
      if (t.type === TransactionTypeEnum.INCOME) {
        if (
          t.subtype === TransactionSubTypeEnum.LOAN_BORROWED ||
          t.subtype === TransactionSubTypeEnum.LOAN_RECEIVED
        ) {
          continue
        }
        cur.in += t.amount
      } else if (t.type === TransactionTypeEnum.EXPENSE) {
        if (
          t.subtype === TransactionSubTypeEnum.LOAN_REPAYMENT ||
          t.subtype === TransactionSubTypeEnum.LOAN_LENT
        ) {
          continue
        }
        if (t.subtype === TransactionSubTypeEnum.REFUND) {
          cur.out -= t.amount
        } else {
          cur.out += t.amount
        }
      } else if (
        !excludeFromTotals &&
        (t.type === TransactionTypeEnum.TRANSFER || t.isTransfer)
      ) {
        if (t.amount > 0) cur.in += t.amount
        else cur.out += Math.abs(t.amount)
      }
      cur.net = cur.in - cur.out
      totalsByAccount.set(t.accountId, cur)
    }
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
  }, [accounts, transactionsFull, excludeFromTotals])

  const filteredAccounts = useMemo(
    () =>
      accountsWithMonthTotals.filter(
        (a) =>
          !searchQuery.trim() ||
          a.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [accountsWithMonthTotals, searchQuery],
  )

  const displayAccounts = isReorderMode ? reorderedAccounts : filteredAccounts

  const balancesByCurrency = displayAccounts
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
      [] as { currency: string; balance: number }[],
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

      <ReorderableListV2
        data={displayAccounts}
        keyExtractor={(item) => item.id}
        onReorder={(newAccounts) => setReorderedAccounts(newAccounts)}
        showButtons={isReorderMode}
        renderItem={({ item }) => {
          const cardProps: AccountCardProps = {
            account: item,
            monthIn: (item as typeof item & { monthIn?: number }).monthIn ?? 0,
            monthOut:
              (item as typeof item & { monthOut?: number }).monthOut ?? 0,
            monthNet:
              (item as typeof item & { monthNet?: number }).monthNet ?? 0,
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
                <IconSvg name="plus-outline" size={24} />
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
}))
