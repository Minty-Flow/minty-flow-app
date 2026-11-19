import { router } from "expo-router"
import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Money } from "~/components/money"
import { StatsDetailShell } from "~/components/stats/stats-detail-shell"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { RecurringCommitment } from "~/database/drizzle/read-models/stats-extras-data"
import { useRecurringSummary } from "~/database/drizzle/read-models/stats-read-model"
import { formatFriendlyDate } from "~/utils/time-utils"

function RecurringRow({
  item,
  currency,
}: {
  item: RecurringCommitment
  currency: string
}) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const { latestTransactionId } = item
  const every = t("screens.stats.recurring.every", {
    count: item.recurrence.interval,
    unit: t(
      `components.transactionForm.recurrence.unit.${item.recurrence.unit}`,
      { count: item.recurrence.interval },
    ),
  })

  return (
    <Pressable
      style={styles.row}
      disabled={!latestTransactionId}
      onPress={() =>
        latestTransactionId &&
        router.push({
          pathname: "/transaction/[id]",
          params: { id: latestTransactionId },
        })
      }
      accessibilityRole="button"
    >
      <DynamicIcon
        icon={item.categoryIcon ?? "repeat-outline"}
        size={18}
        color={theme.colors.primary}
        variant="raw"
      />
      <View style={styles.rowText}>
        <Text numberOfLines={1}>
          {item.title ??
            item.categoryName ??
            t("screens.stats.recurring.untitled")}
        </Text>
        <Text variant="muted" numberOfLines={1}>
          {t("screens.stats.recurring.schedule", {
            every,
            date: formatFriendlyDate(item.nextDate),
          })}
        </Text>
      </View>
      <Money
        value={item.amount}
        currency={currency}
        tone="transfer"
        visualTone="expense"
        compact
      />
    </Pressable>
  )
}

function RecurringSection({
  title,
  items,
  currency,
}: {
  title: string
  items: RecurringCommitment[]
  currency: string
}) {
  if (items.length === 0) return null
  return (
    <View style={styles.section}>
      <Text variant="h4" style={styles.sectionTitle}>
        {title}
      </Text>
      <View style={styles.card}>
        {items.map((item) => (
          <RecurringRow key={item.id} item={item} currency={currency} />
        ))}
      </View>
    </View>
  )
}

function RecurringContent({ currency }: { currency: string }) {
  const { t } = useTranslation()
  const summary = useRecurringSummary(currency)
  if (!summary) return null
  const isEmpty =
    summary.subscriptions.length === 0 && summary.repetitive.length === 0

  return (
    <>
      <View style={styles.header}>
        <Text variant="muted">{t("screens.stats.recurring.perMonth")}</Text>
        <Money
          value={summary.monthlyTotal}
          currency={currency}
          tone="transfer"
          visualTone="expense"
          variant="h2"
          compact
          style={styles.total}
        />
      </View>

      {isEmpty ? (
        <Text variant="muted">{t("screens.stats.recurring.empty")}</Text>
      ) : (
        <>
          <RecurringSection
            title={t("screens.stats.recurring.subscriptions")}
            items={summary.subscriptions}
            currency={currency}
          />
          <RecurringSection
            title={t("screens.stats.recurring.repetitive")}
            items={summary.repetitive}
            currency={currency}
          />
        </>
      )}
    </>
  )
}

export default function StatsRecurringScreen() {
  // shortcut: the currency toggle lists currencies with activity in the
  // dashboard's period, so a rule in an idle currency is only reachable once
  // it has generated a transaction there.
  return (
    <StatsDetailShell showPeriodHeader={false}>
      {({ stats }) => <RecurringContent currency={stats.currency} />}
    </StatsDetailShell>
  )
}

const styles = StyleSheet.create((theme) => ({
  header: {
    gap: 4,
    paddingVertical: 8,
  },
  total: {
    fontWeight: "700",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontWeight: "700",
  },
  card: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
}))
