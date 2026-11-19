import { router } from "expo-router"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { SectionList } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { Money } from "~/components/money"
import { useStatsInitFromParams } from "~/components/stats/stats-detail-shell"
import { StatsPeriodHeader } from "~/components/stats/stats-period-header"
import { TransactionItem } from "~/components/transaction/transaction-item"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useStatsRange } from "~/database/drizzle/read-models/stats-read-model"
import {
  type TransactionWithRelations,
  useTransactions,
} from "~/database/drizzle/read-models/transaction-read-model"
import { useSingleOpenSwipeable } from "~/hooks/use-transaction-list-state"
import { TransactionKindEnum } from "~/types/transactions"
import { formatRangeLabel } from "~/utils/stats-date-range"

/** Confirmed expense total per currency; upcoming rows are listed, not counted. */
function totalsByCurrency(rows: TransactionWithRelations[]) {
  const totals = new Map<string, number>()
  for (const row of rows) {
    const currency = row.account?.currencyCode
    if (!currency) continue
    // Upcoming-only currencies still show, as 0.
    const amount = row.isPending ? 0 : Math.abs(row.amount)
    totals.set(currency, (totals.get(currency) ?? 0) + amount)
  }
  return [...totals]
}

const keyExtractor = (row: TransactionWithRelations) => row.id

export default function StatsRecurringScreen() {
  const { t } = useTranslation()
  const range = useStatsRange(useStatsInitFromParams())
  const { dateRange } = range
  const { items } = useTransactions({
    from: dateRange.from.toISOString(),
    to: dateRange.to.toISOString(),
    recurringOnly: true,
  })
  const { onWillOpen, closeOpen } = useSingleOpenSwipeable()
  const renderItem = useCallback(
    ({ item }: { item: TransactionWithRelations }) => (
      <TransactionItem
        transactionWithRelations={item}
        onPress={() =>
          router.push({
            pathname: "/transaction/[id]",
            params: { id: item.id },
          })
        }
        onDelete={closeOpen}
        onWillOpen={onWillOpen}
      />
    ),
    [closeOpen, onWillOpen],
  )

  const expenses = items.filter((row) => row.type === "expense")
  const totals = totalsByCurrency(expenses)
  const sections = [
    {
      title: t("screens.stats.recurring.subscriptions"),
      data: expenses.filter(
        (row) => row.kind === TransactionKindEnum.SUBSCRIPTION,
      ),
    },
    {
      title: t("screens.stats.recurring.repetitive"),
      data: expenses.filter(
        (row) => row.kind !== TransactionKindEnum.SUBSCRIPTION,
      ),
    },
  ].filter((section) => section.data.length > 0)

  return (
    <SectionList
      contentInsetAdjustmentBehavior="automatic"
      style={styles.list}
      contentContainerStyle={styles.content}
      sections={sections}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section }) => (
        <Text variant="h4" style={styles.sectionTitle}>
          {section.title}
        </Text>
      )}
      ListHeaderComponent={
        <>
          <StatsPeriodHeader {...range} />
          <View style={styles.header}>
            <Text variant="muted">
              {t("screens.stats.recurring.spentIn", {
                period: formatRangeLabel(dateRange),
              })}
            </Text>
            {totals.map(([currency, total]) => (
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
            ))}
          </View>
        </>
      }
      ListEmptyComponent={
        <Text variant="muted" style={styles.empty}>
          {t("screens.stats.recurring.empty")}
        </Text>
      }
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  list: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
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
  sectionTitle: {
    fontWeight: "700",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  empty: {
    paddingHorizontal: 20,
  },
}))
