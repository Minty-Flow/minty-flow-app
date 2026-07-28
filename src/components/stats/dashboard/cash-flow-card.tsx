import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { CurrencyPeriodStats } from "~/types/stats"

import { StatCard } from "./stat-card"

interface InOutRowProps {
  totalIncome: number
  totalExpense: number
  currency: string
}

/** "● In $X   $Y Out ●" row — shared with the cash-flow detail summary */
export function InOutRow({
  totalIncome,
  totalExpense,
  currency,
}: InOutRowProps) {
  const { t } = useTranslation()

  return (
    <View style={styles.inOutRow}>
      <View style={styles.inOutColumn}>
        <View style={styles.inOutLabelRow}>
          <View style={[styles.dot, styles.dotIncome]} />
          <Text variant="muted" style={styles.inOutLabel}>
            {t("screens.stats.dashboard.in")}
          </Text>
        </View>
        <Money
          value={totalIncome}
          currency={currency}
          tone="transfer"
          visualTone="income"
          compact
          variant="small"
          style={styles.inOutAmount}
        />
      </View>

      <View style={[styles.inOutColumn, styles.inOutColumnRight]}>
        <View style={[styles.inOutLabelRow, styles.inOutLabelRowRight]}>
          <Text variant="muted" style={styles.inOutLabel}>
            {t("screens.stats.dashboard.out")}
          </Text>
          <View style={[styles.dot, styles.dotExpense]} />
        </View>
        <Money
          value={totalExpense}
          currency={currency}
          tone="transfer"
          visualTone="expense"
          compact
          variant="small"
          style={[styles.inOutAmount, styles.inOutAmountRight]}
        />
      </View>
    </View>
  )
}

interface CashFlowCardProps {
  current: CurrencyPeriodStats
  currency: string
  onPress: () => void
}

export function CashFlowCard({
  current,
  currency,
  onPress,
}: CashFlowCardProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const overspent = current.net < 0

  return (
    <StatCard
      title={t("screens.stats.dashboard.cashFlow")}
      icon="arrows-transfer-up-down-outline"
      onPress={onPress}
    >
      <View style={styles.headline}>
        <IconSvg
          name={overspent ? "trending-down-outline" : "pig-money-outline"}
          size={18}
          color={
            overspent
              ? theme.colors.semantic.expense
              : theme.colors.semantic.income
          }
        />
        <Text variant="muted" style={styles.headlineLabel} numberOfLines={1}>
          {overspent
            ? t("screens.stats.dashboard.overspent")
            : t("screens.stats.dashboard.saved")}
        </Text>
        <Money
          value={Math.abs(current.net)}
          currency={currency}
          tone="transfer"
          visualTone={overspent ? "expense" : "income"}
          compact
          variant="small"
          style={styles.headlineAmount}
        />
      </View>
      <InOutRow
        totalIncome={current.totalIncome}
        totalExpense={current.totalExpense}
        currency={currency}
      />
    </StatCard>
  )
}

const styles = StyleSheet.create((theme) => ({
  headline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headlineLabel: {
    fontSize: theme.typography.labelXSmall.fontSize,
  },
  headlineAmount: {
    fontWeight: "700",
    fontSize: theme.typography.bodyLarge.fontSize,
  },
  inOutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  inOutColumn: {
    flex: 1,
    gap: 4,
  },
  inOutColumnRight: {
    alignItems: "flex-end",
  },
  inOutLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  inOutLabelRowRight: {
    justifyContent: "flex-end",
  },
  inOutAmount: {
    fontSize: theme.typography.labelLarge.fontSize,
    fontWeight: "700",
  },
  inOutAmountRight: {
    textAlign: "right",
  },
  inOutLabel: {
    fontSize: theme.typography.labelXSmall.fontSize,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotIncome: {
    backgroundColor: theme.colors.semantic.income,
  },
  dotExpense: {
    backgroundColor: theme.colors.semantic.expense,
  },
}))
