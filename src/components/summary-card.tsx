import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Money } from "~/components/money"
import { IconSvg, type IconSvgName } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionWithRelations } from "~/database/services/transaction-service"
import { useTransfersPreferencesStore } from "~/stores/transfers-preferences.store"
import type { TransactionType } from "~/types/transactions"
import { TransactionTypeEnum } from "~/types/transactions"

const EMPTY_EXTRA_BY_CURRENCY: Record<string, number> = {}

interface SummarySectionProps {
  transactionsWithRelations: TransactionWithRelations[]
}

/**
 * SummarySection component provides a unified view for transaction totals.
 * Currency is derived from each transaction's account; type explains meaning.
 * When excludeFromTotals is false, transfer amounts are included (credits → income, debits → expense).
 */
export const SummarySection = ({
  transactionsWithRelations,
}: SummarySectionProps) => {
  const { t } = useTranslation()
  const excludeFromTotals = useTransfersPreferencesStore(
    (s) => s.excludeFromTotals,
  )

  const incomeRows = useMemo(
    () =>
      transactionsWithRelations.filter(
        (row) => row.transaction.type === TransactionTypeEnum.INCOME,
      ),
    [transactionsWithRelations],
  )
  const expenseRows = useMemo(
    () =>
      transactionsWithRelations.filter(
        (row) => row.transaction.type === TransactionTypeEnum.EXPENSE,
      ),
    [transactionsWithRelations],
  )

  const transferRows = useMemo(
    () =>
      transactionsWithRelations.filter(
        (row) =>
          row.transaction.type === TransactionTypeEnum.TRANSFER ||
          row.transaction.isTransfer,
      ),
    [transactionsWithRelations],
  )

  const extraIncomeByCurrency = useMemo(() => {
    if (excludeFromTotals || transferRows.length === 0) return {}
    const byCurrency: Record<string, number> = {}
    transferRows.forEach((row) => {
      const amount = row.transaction.amount
      if (amount <= 0) return
      const currency = row.account.currencyCode
      byCurrency[currency] = (byCurrency[currency] ?? 0) + amount
    })
    return byCurrency
  }, [excludeFromTotals, transferRows])

  const extraExpenseByCurrency = useMemo(() => {
    if (excludeFromTotals || transferRows.length === 0) return {}
    const byCurrency: Record<string, number> = {}
    transferRows.forEach((row) => {
      const amount = row.transaction.amount
      if (amount >= 0) return
      const currency = row.account.currencyCode
      byCurrency[currency] = (byCurrency[currency] ?? 0) + Math.abs(amount)
    })
    return byCurrency
  }, [excludeFromTotals, transferRows])

  return (
    <View style={styles.sectionContainer}>
      <Card
        type={TransactionTypeEnum.INCOME}
        label={t("screens.home.summary.income")}
        rows={incomeRows}
        extraByCurrency={extraIncomeByCurrency}
      />
      <Card
        type={TransactionTypeEnum.EXPENSE}
        label={t("screens.home.summary.expense")}
        rows={expenseRows}
        extraByCurrency={extraExpenseByCurrency}
      />
    </View>
  )
}

interface CardProps {
  type: TransactionType
  rows: TransactionWithRelations[]
  label: string
  /** Extra amounts to add per currency (e.g. transfer contributions when excludeFromTotals is false). */
  extraByCurrency?: Record<string, number>
}

const Card = ({
  type,
  rows,
  label,
  extraByCurrency = EMPTY_EXTRA_BY_CURRENCY,
}: CardProps) => {
  const { theme } = useUnistyles()
  const isIncome = type === TransactionTypeEnum.INCOME
  const icon: IconSvgName = isIncome ? "arrow-down-left" : "arrow-up-right"
  const colorStyle = isIncome ? styles.incomeText : styles.expenseText

  // Sum by currency (from account), then add extra (e.g. transfer amounts when not excluded)
  const currencyTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    rows.forEach((row) => {
      const currency = row.account.currencyCode
      totals[currency] = (totals[currency] || 0) + (row.transaction.amount || 0)
    })
    Object.entries(extraByCurrency).forEach(([currency, amount]) => {
      if (amount !== 0) totals[currency] = (totals[currency] ?? 0) + amount
    })
    return Object.entries(totals).sort(([a], [b]) => a.localeCompare(b))
  }, [rows, extraByCurrency])

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              isIncome ? styles.incomeBg : styles.expenseBg,
            ]}
          >
            <IconSvg
              name={icon}
              size={12}
              color={
                isIncome
                  ? theme.colors.customColors.income
                  : theme.colors.customColors.expense
              }
            />
          </View>
          <Text variant="small" style={styles.label}>
            {label.toUpperCase()}
          </Text>
        </View>

        <View style={styles.totalsList}>
          {currencyTotals.length > 0 ? (
            currencyTotals.map(([currency, amount]) => (
              <View key={currency} style={styles.currencyRow}>
                <Text variant="small" style={styles.currencyCode}>
                  {currency}
                </Text>
                <Money
                  value={amount}
                  currency={currency}
                  style={colorStyle}
                  variant="small"
                  tone={type}
                />
              </View>
            ))
          ) : (
            <View style={styles.currencyRow}>
              <Text variant="small" style={styles.currencyCode}>
                -
              </Text>
              <Money value={0} style={colorStyle} variant="small" />
            </View>
          )}
        </View>

        {/* Subtle indicator line at bottom */}
        <View
          style={[
            styles.indicator,
            isIncome ? styles.incomeIndicator : styles.expenseIndicator,
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  sectionContainer: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: theme.radius,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.customColors.semi,
    backgroundColor: theme.colors.surface,
    // minHeight: 110,
  },
  cardContent: {
    gap: 12,
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconContainer: {
    width: 20,
    height: 20,
    borderRadius: theme.radius / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  incomeBg: {
    backgroundColor: `${theme.colors.customColors.income}20`,
  },
  expenseBg: {
    backgroundColor: `${theme.colors.customColors.expense}20`,
  },
  label: {
    color: theme.colors.onSecondary,
    fontWeight: "700",
    fontSize: theme.typography.labelXSmall.fontSize,
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  totalsList: {
    gap: 4,
  },
  currencyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currencyCode: {
    color: theme.colors.onSecondary,
    fontWeight: "600",
    fontSize: theme.typography.labelMedium.fontSize,
    opacity: 0.6,
  },
  incomeText: {
    color: theme.colors.customColors.income,
  },
  expenseText: {
    color: theme.colors.customColors.expense,
  },
  indicator: {
    height: 2,
    width: "20%",
    borderRadius: 1,
    marginTop: 4,
  },
  incomeIndicator: {
    backgroundColor: theme.colors.customColors.income,
    // opacity: 0.4,
  },
  expenseIndicator: {
    backgroundColor: theme.colors.customColors.expense,
    // opacity: 0.4,
  },
}))
