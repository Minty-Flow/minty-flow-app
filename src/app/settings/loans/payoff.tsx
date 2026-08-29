import { useNavigation } from "expo-router"
import { useLayoutEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { InfoModal } from "~/components/info-modal"
import { Money } from "~/components/money"
import { SmartAmountInput } from "~/components/smart-amount-input"
import { Chip } from "~/components/ui/chips"
import { EmptyState } from "~/components/ui/empty-state"
import { InfoBanner } from "~/components/ui/info-banner"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useAccounts } from "~/database/drizzle/read-models/account-read-model"
import { useAllLoans } from "~/database/drizzle/read-models/loan-read-model"
import { useTransactions } from "~/database/drizzle/read-models/transaction-read-model"
import {
  type LoanPlannerInput,
  useDebtPayoffStore,
} from "~/stores/debt-payoff.store"
import { LoanTypeEnum } from "~/types/loans"
import { debtPayoff, type PayoffLoanInput } from "~/utils/debt-payoff"
import { getLiveLoanProgress } from "~/utils/live-progress"
import { getLoanProgressModel } from "~/utils/planning-progress"
import { formatMonthTitle } from "~/utils/time-utils"

function parseAprPercent(text: string): number {
  const n = Number.parseFloat(text.replace(",", "."))
  return Number.isFinite(n) && n >= 0 ? n : 0
}

interface PayoffLoanRowProps {
  loanId: string
  name: string
  balanceMinor: number
  currencyCode: string
}

function PayoffLoanRow({
  loanId,
  name,
  balanceMinor,
  currencyCode,
}: PayoffLoanRowProps) {
  const { t } = useTranslation()
  const input = useDebtPayoffStore((s) => s.byLoanId[loanId])
  const setLoanInput = useDebtPayoffStore((s) => s.setLoanInput)
  const [aprText, setAprText] = useState(
    input?.aprPercent ? String(input.aprPercent) : "",
  )

  const commitApr = () => {
    setLoanInput(loanId, { aprPercent: parseAprPercent(aprText) })
  }

  return (
    <View style={styles.loanCard}>
      <View style={styles.loanHead}>
        <Text variant="default" style={styles.loanName} numberOfLines={1}>
          {name}
        </Text>
        <Money
          value={balanceMinor}
          currency={currencyCode}
          tone="expense"
          hideSign
        />
      </View>
      <View style={styles.field}>
        <Text variant="small" style={styles.fieldLabel}>
          {t("screens.settings.loans.payoff.aprLabel")}
        </Text>
        <Input
          keyboardType="numeric"
          value={aprText}
          onChangeText={setAprText}
          onBlur={commitApr}
          placeholder="0"
          returnKeyType="done"
        />
      </View>
      <View style={styles.field}>
        <SmartAmountInput
          label={t("screens.settings.loans.payoff.minLabel")}
          valueMinor={input?.minPaymentMinor ?? 0}
          onChangeMinor={(v) => setLoanInput(loanId, { minPaymentMinor: v })}
          currencyCode={currencyCode}
        />
      </View>
    </View>
  )
}

export default function DebtPayoffScreen() {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const loans = useAllLoans()
  const accounts = useAccounts()
  const { items: allTransactions } = useTransactions({})
  const byLoanId = useDebtPayoffStore((s) => s.byLoanId)
  const extraPerMonthMinor = useDebtPayoffStore((s) => s.extraPerMonthMinor)
  const strategy = useDebtPayoffStore((s) => s.strategy)
  const setExtraPerMonth = useDebtPayoffStore((s) => s.setExtraPerMonth)
  const setStrategy = useDebtPayoffStore((s) => s.setStrategy)
  const [helpOpen, setHelpOpen] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => setHelpOpen(true)}
          style={styles.helpButton}
          accessibilityLabel={t("screens.settings.loans.payoff.helpTitle")}
        >
          <IconSvg name="info-circle" size={22} />
        </Pressable>
      ),
    })
  }, [navigation, t])

  const currencyByAccountId = useMemo(
    () => new Map(accounts.map((a) => [a.id, a.currencyCode])),
    [accounts],
  )

  const outstanding = useMemo(() => {
    return loans
      .filter((l) => l.loanType === LoanTypeEnum.BORROWED)
      .map((loan) => {
        const paid = getLiveLoanProgress(
          loan,
          allTransactions.filter((tx) => tx.loanId === loan.id),
        )
        const { remaining } = getLoanProgressModel(loan, paid)
        return {
          loan,
          balanceMinor: remaining,
          currencyCode: currencyByAccountId.get(loan.accountId) ?? "",
        }
      })
      .filter((x) => x.balanceMinor > 0 && x.currencyCode !== "")
  }, [loans, allTransactions, currencyByAccountId])

  // The projection sums balances, so it runs in a single currency: the one
  // most borrowed loans share. Loans in other currencies are listed as
  // excluded rather than silently folded in at a made-up rate.
  const planCurrency = useMemo(() => {
    const counts = new Map<string, number>()
    for (const { currencyCode } of outstanding) {
      counts.set(currencyCode, (counts.get(currencyCode) ?? 0) + 1)
    }
    let best: string | null = null
    let bestCount = 0
    for (const [code, count] of counts) {
      if (count > bestCount) {
        best = code
        bestCount = count
      }
    }
    return best
  }, [outstanding])

  const included = outstanding.filter((x) => x.currencyCode === planCurrency)
  const excludedCount = outstanding.length - included.length

  const payoffLoans: PayoffLoanInput[] = included.map(
    ({ loan, balanceMinor }) => {
      const planner: LoanPlannerInput = byLoanId[loan.id] ?? {
        aprPercent: 0,
        minPaymentMinor: 0,
      }
      return {
        id: loan.id,
        name: loan.name,
        balanceMinor,
        aprPercent: planner.aprPercent,
        minPaymentMinor: planner.minPaymentMinor,
      }
    },
  )

  const showToggle = payoffLoans.length > 1

  const active = debtPayoff({
    loans: payoffLoans,
    extraPerMonthMinor,
    strategy,
  })
  const snowball = debtPayoff({
    loans: payoffLoans,
    extraPerMonthMinor,
    strategy: "snowball",
  })
  const avalanche = debtPayoff({
    loans: payoffLoans,
    extraPerMonthMinor,
    strategy: "avalanche",
  })

  const helpModal = (
    <InfoModal
      visible={helpOpen}
      onRequestClose={() => setHelpOpen(false)}
      title={t("screens.settings.loans.payoff.helpTitle")}
      description={t("screens.settings.loans.payoff.helpBody")}
    />
  )

  if (outstanding.length === 0 || planCurrency === null) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="scale-outline"
          title={t("screens.settings.loans.payoff.empty")}
        />
        {helpModal}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {included.map(({ loan, balanceMinor, currencyCode }) => (
          <PayoffLoanRow
            key={loan.id}
            loanId={loan.id}
            name={loan.name}
            balanceMinor={balanceMinor}
            currencyCode={currencyCode}
          />
        ))}

        <Text variant="small" style={styles.ratesNote}>
          {t("screens.settings.loans.payoff.ratesNote")}
        </Text>

        <View style={styles.extraWrap}>
          <SmartAmountInput
            label={t("screens.settings.loans.payoff.extraLabel")}
            valueMinor={extraPerMonthMinor}
            onChangeMinor={setExtraPerMonth}
            currencyCode={planCurrency}
          />
        </View>

        {showToggle && (
          <View style={styles.chipRow}>
            <Chip
              label={t("screens.settings.loans.payoff.snowball")}
              selected={strategy === "snowball"}
              hideCheck
              onPress={() => setStrategy("snowball")}
            />
            <Chip
              label={t("screens.settings.loans.payoff.avalanche")}
              selected={strategy === "avalanche"}
              hideCheck
              onPress={() => setStrategy("avalanche")}
            />
          </View>
        )}

        <View style={styles.headline}>
          <Text variant="small" style={styles.headlineCaption}>
            {t("screens.settings.loans.payoff.debtFreeBy")}
          </Text>
          <Text variant="h2" style={styles.headlineValue}>
            {active.payoffDate
              ? formatMonthTitle(active.payoffDate)
              : t("screens.settings.loans.payoff.never")}
          </Text>
        </View>

        <View style={styles.interestBlock}>
          <View style={styles.interestRow}>
            <Text variant="default" style={styles.interestLabel}>
              {t("screens.settings.loans.payoff.snowball")}
            </Text>
            <Money
              value={snowball.totalInterestMinor}
              currency={planCurrency}
              tone="expense"
              hideSign
            />
          </View>
          <View style={styles.interestRow}>
            <Text variant="default" style={styles.interestLabel}>
              {t("screens.settings.loans.payoff.avalanche")}
            </Text>
            <Money
              value={avalanche.totalInterestMinor}
              currency={planCurrency}
              tone="expense"
              hideSign
            />
          </View>
          <Text variant="small" style={styles.interestCaption}>
            {t("screens.settings.loans.payoff.interestCaption")}
          </Text>
        </View>

        {!active.hasRates && (
          <InfoBanner text={t("screens.settings.loans.payoff.addRatesNote")} />
        )}

        {excludedCount > 0 && (
          <Text variant="small" style={styles.excludedNote}>
            {t("screens.settings.loans.payoff.excludedNote", {
              count: excludedCount,
            })}
          </Text>
        )}
      </ScrollView>

      {helpModal}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  content: { padding: 20, paddingBottom: 64, gap: 16 },
  loanCard: {
    borderWidth: 1,
    borderColor: theme.colors.semantic.semi,
    borderRadius: theme.radius,
    padding: 14,
    gap: 12,
  },
  loanHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  loanName: { flex: 1, fontWeight: "600", color: theme.colors.onSurface },
  field: { gap: 6 },
  helpButton: { padding: 6, marginRight: 4 },
  fieldLabel: {
    color: theme.colors.onSurface,
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "700",
  },
  ratesNote: { color: theme.colors.onSurface, opacity: 0.6 },
  extraWrap: { marginTop: 4 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  headline: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 4,
  },
  headlineCaption: {
    color: theme.colors.onSurface,
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: "700",
  },
  headlineValue: { color: theme.colors.primary, fontWeight: "700" },
  interestBlock: {
    borderWidth: 1,
    borderColor: theme.colors.semantic.semi,
    borderRadius: theme.radius,
    padding: 14,
    gap: 8,
  },
  interestRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  interestLabel: { color: theme.colors.onSurface },
  interestCaption: {
    color: theme.colors.onSurface,
    opacity: 0.6,
    marginTop: 2,
  },
  excludedNote: { color: theme.colors.onSurface, opacity: 0.6 },
}))
