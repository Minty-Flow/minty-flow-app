import { router } from "expo-router"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { Money } from "~/components/money"
import { useStatsInitFromParams } from "~/components/stats/stats-detail-shell"
import { StatsPeriodHeader } from "~/components/stats/stats-period-header"
import { TransactionItem } from "~/components/transaction/transaction-item"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useStats } from "~/database/drizzle/read-models/stats-read-model"
import {
  type TransactionWithRelations,
  useTransactions,
} from "~/database/drizzle/read-models/transaction-read-model"
import { useSingleOpenSwipeable } from "~/hooks/use-transaction-list-state"
import { TransactionKindEnum } from "~/types/transactions"
import { formatRangeLabel } from "~/utils/stats-date-range"

/** Expense total per currency, in first-seen order. */
function totalsByCurrency(rows: TransactionWithRelations[]) {
  const totals = new Map<string, number>()
  for (const row of rows) {
    const currency = row.account?.currencyCode
    if (!currency) continue
    totals.set(currency, (totals.get(currency) ?? 0) + Math.abs(row.amount))
  }
  return [...totals]
}

export default function StatsRecurringScreen() {
  const { t } = useTranslation()
  const {
    dateRange,
    activePreset,
    activeYear,
    activeMonth,
    setMonthRange,
    setCustomRange,
    navigate,
  } = useStats(useStatsInitFromParams())
  const { items } = useTransactions({
    from: dateRange.from.toISOString(),
    to: dateRange.to.toISOString(),
    recurringOnly: true,
  })
  const { onWillOpen, closeOpen } = useSingleOpenSwipeable()
  const openTransaction = useCallback(
    (id: string) =>
      router.push({ pathname: "/transaction/[id]", params: { id } }),
    [],
  )

  const expenses = items.filter((row) => row.type === "expense")
  const subscriptions = expenses.filter(
    (row) => row.kind === TransactionKindEnum.SUBSCRIPTION,
  )
  const repetitive = expenses.filter(
    (row) => row.kind !== TransactionKindEnum.SUBSCRIPTION,
  )

  const section = (title: string, rows: TransactionWithRelations[]) =>
    rows.length > 0 ? (
      <View style={styles.section}>
        <Text variant="h4" style={styles.sectionTitle}>
          {title}
        </Text>
        {rows.map((row) => (
          <TransactionItem
            key={row.id}
            transactionWithRelations={row}
            onPress={() => openTransaction(row.id)}
            onDelete={closeOpen}
            onWillOpen={onWillOpen}
          />
        ))}
      </View>
    ) : null

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      <StatsPeriodHeader
        activeYear={activeYear}
        activeMonth={activeMonth}
        activePreset={activePreset}
        dateRange={dateRange}
        setMonthRange={setMonthRange}
        setCustomRange={setCustomRange}
        navigate={navigate}
      />

      <View style={styles.header}>
        <Text variant="muted">
          {t("screens.stats.recurring.spentIn", {
            period: formatRangeLabel(dateRange),
          })}
        </Text>
        {expenses.length === 0 ? (
          <Text variant="muted">{t("screens.stats.recurring.empty")}</Text>
        ) : (
          totalsByCurrency(expenses).map(([currency, total]) => (
            <Money
              key={currency}
              value={total}
              currency={currency}
              tone="transfer"
              visualTone="expense"
              variant="h2"
              compact
              style={styles.total}
            />
          ))
        )}
      </View>

      {section(t("screens.stats.recurring.subscriptions"), subscriptions)}
      {section(t("screens.stats.recurring.repetitive"), repetitive)}
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    gap: 12,
    paddingTop: 8,
    paddingBottom: 40,
  },
  header: {
    gap: 4,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  total: {
    fontWeight: "700",
  },
  section: {
    gap: 4,
  },
  sectionTitle: {
    fontWeight: "700",
    paddingHorizontal: 20,
  },
}))
