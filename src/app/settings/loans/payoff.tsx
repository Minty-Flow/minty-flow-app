import { useNavigation } from "expo-router"
import { useLayoutEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Modal, ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ConfirmModal } from "~/components/confirm-modal"
import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { SmartAmountInput } from "~/components/smart-amount-input"
import { Button } from "~/components/ui/button"
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
import type { TranslationKey } from "~/i18n/config"
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

const HELP_TERMS: { term: TranslationKey; body: TranslationKey }[] = [
  {
    term: "screens.settings.loans.payoff.help.aprTerm",
    body: "screens.settings.loans.payoff.help.aprBody",
  },
  {
    term: "screens.settings.loans.payoff.help.minTerm",
    body: "screens.settings.loans.payoff.help.minBody",
  },
  {
    term: "screens.settings.loans.payoff.help.snowballTerm",
    body: "screens.settings.loans.payoff.help.snowballBody",
  },
  {
    term: "screens.settings.loans.payoff.help.avalancheTerm",
    body: "screens.settings.loans.payoff.help.avalancheBody",
  },
]

function PayoffHelpModal({
  visible,
  onClose,
}: {
  visible: boolean
  onClose: () => void
}) {
  const { t } = useTranslation()
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={onClose}
          native
          disableRipple
        />
        <View style={styles.modalContent}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text variant="h3" style={styles.helpTitle}>
                {t("screens.settings.loans.payoff.helpTitle")}
              </Text>

              <Text variant="default" style={styles.helpSection}>
                {t("screens.settings.loans.payoff.help.purposeTitle")}
              </Text>
              <Text variant="p" style={styles.helpBody}>
                {t("screens.settings.loans.payoff.help.purposeBody")}
              </Text>

              <Text variant="default" style={styles.helpSection}>
                {t("screens.settings.loans.payoff.help.stepsTitle")}
              </Text>
              <Text variant="p" style={styles.helpBody}>
                {t("screens.settings.loans.payoff.help.stepsBody")}
              </Text>

              <Text variant="default" style={styles.helpSection}>
                {t("screens.settings.loans.payoff.help.termsTitle")}
              </Text>
              {HELP_TERMS.map(({ term, body }) => (
                <View key={term} style={styles.termRow}>
                  <Text variant="default" style={styles.termName}>
                    {t(term)}
                  </Text>
                  <Text variant="small" style={styles.helpBody}>
                    {t(body)}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <Button
              variant="default"
              onPress={onClose}
              style={styles.helpOkButton}
            >
              <Text variant="default">{t("common.actions.ok")}</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
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
  const resetStore = useDebtPayoffStore((s) => s.reset)
  const [helpOpen, setHelpOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  // Bumped on reset so each PayoffLoanRow remounts and re-seeds its local
  // APR text buffer from the (now-cleared) store.
  const [resetNonce, setResetNonce] = useState(0)

  const handleReset = () => {
    resetStore()
    setResetNonce((n) => n + 1)
  }

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
    <PayoffHelpModal visible={helpOpen} onClose={() => setHelpOpen(false)} />
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
            key={`${loan.id}:${resetNonce}`}
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
            key={`extra:${resetNonce}`}
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

        <Button
          variant="ghost"
          onPress={() => setResetOpen(true)}
          style={styles.resetButton}
        >
          <Text variant="default" style={styles.resetText}>
            {t("screens.settings.loans.payoff.reset")}
          </Text>
        </Button>
      </ScrollView>

      {helpModal}

      <ConfirmModal
        visible={resetOpen}
        onRequestClose={() => setResetOpen(false)}
        onConfirm={handleReset}
        title={t("screens.settings.loans.payoff.resetConfirmTitle")}
        description={t("screens.settings.loans.payoff.resetConfirmBody")}
        confirmLabel={t("screens.settings.loans.payoff.reset")}
        variant="destructive"
      />
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
  resetButton: { marginTop: 4 },
  resetText: { color: theme.colors.semantic.expense, fontWeight: "600" },
  modalRoot: { flex: 1 },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.shadow,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "85%",
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius ?? 16,
  },
  helpTitle: { fontWeight: "700", marginBottom: 8 },
  helpSection: {
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 4,
    color: theme.colors.onSurface,
  },
  helpBody: {
    color: theme.colors.onSurface,
    opacity: 0.8,
    lineHeight: 20,
  },
  termRow: { marginTop: 10, gap: 2 },
  termName: { fontWeight: "700", color: theme.colors.primary },
  helpOkButton: { marginTop: 16 },
}))
