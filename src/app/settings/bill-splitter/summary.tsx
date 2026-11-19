import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { ConfirmSheet } from "~/components/confirm-sheet"
import { FooterBar } from "~/components/footer-bar"
import { footerBarStyles } from "~/components/footer-bar.styles"
import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { Button } from "~/components/ui/button"
import { Chip } from "~/components/ui/chips"
import { EmptyState } from "~/components/ui/empty-state"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useActiveAccounts } from "~/database/drizzle/read-models/account-read-model"
import {
  getBillSummary,
  getBillTotal,
  getSettlementPlan,
  type SettlementAction,
  useBillSplitterStore,
} from "~/stores/bill-splitter.store"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import type { BillSummaryEntry, Participant } from "~/types/bill-splitter"
import { LoanTypeEnum } from "~/types/loans"
import { NewEnum } from "~/types/new"
import { Toast } from "~/utils/toast"
export default function SummaryScreen() {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const router = useRouter()
  const preferredCurrency = useMoneyFormattingStore((s) => s.preferredCurrency)
  const billCurrency = useBillSplitterStore((s) => s.currencyCode)
  const currency = billCurrency ?? preferredCurrency
  const participants = useBillSplitterStore((s) => s.participants)
  const items = useBillSplitterStore((s) => s.items)
  const payerId = useBillSplitterStore((s) => s.payerId)
  const selfId = useBillSplitterStore((s) => s.selfId)
  const accountId = useBillSplitterStore((s) => s.accountId)
  const setPayerId = useBillSplitterStore((s) => s.setPayerId)
  const setSelfId = useBillSplitterStore((s) => s.setSelfId)
  const recordedIds = useBillSplitterStore((s) => s.recordedIds)
  const clearBill = useBillSplitterStore((s) => s.clearBill)
  const setCurrencyCode = useBillSplitterStore((s) => s.setCurrencyCode)
  useEffect(() => {
    if (!billCurrency) setCurrencyCode(currency)
  }, [billCurrency, currency, setCurrencyCode])
  const summary = getBillSummary(items, participants)
  const totalBill = getBillTotal(items)
  // The user's own share of the bill
  const selfEntry = summary.find((s) => s.participantId === selfId) ?? null
  const plan = getSettlementPlan(items, participants, selfId, payerId)
  const hasItemPayers = items.some((i) => i.payerId)
  const actionFor = (participantId: string) =>
    plan.find((a) => a.participantId === participantId)
  const isRecorded = (participantId: string) =>
    recordedIds.includes(participantId)
  const allRecorded =
    plan.length > 0 && plan.every((a) => isRecorded(a.participantId))
  // Offer to clear only when the last entry is saved while the user is here,
  // not every time a finished bill is reopened.
  const [billDoneVisible, setBillDoneVisible] = useState(false)
  const wasAllRecorded = useRef(allRecorded)
  useEffect(() => {
    if (allRecorded && !wasAllRecorded.current) setBillDoneVisible(true)
    wasAllRecorded.current = allRecorded
  }, [allRecorded])
  // Picking "who you are" first also fills "who paid" with the same person,
  // the common case; the user can still change the payer after.
  const handleSelectSelf = (id: string | null) => {
    if (!payerId || payerId === selfId) setPayerId(id)
    setSelfId(id)
  }
  const accounts = useActiveAccounts()
  // An archived or deleted account would prefill the loan form with a dead id.
  const hasValidAccount = accounts.some((a) => a.id === accountId)
  const nextAction = plan.find((a) => !isRecorded(a.participantId))
  const handleAction = (action: SettlementAction) => {
    if (!accountId || !hasValidAccount) {
      Toast.warn({
        title: t("screens.settings.billSplitter.summary.noAccount"),
      })
      return
    }
    const description = t(
      "screens.settings.billSplitter.summary.loanDescription",
    )
    if (action.kind === "share") {
      router.push({
        pathname: "/transaction/[id]",
        params: {
          id: NewEnum.NEW,
          type: "expense",
          accountId,
          amount: action.amount.toString(),
          title: description,
          billParticipantId: action.participantId,
        },
      })
      return
    }
    router.push({
      pathname: "/settings/loans/[loanId]/modify",
      params: {
        loanId: NewEnum.NEW,
        prefillName: action.name,
        prefillDescription: description,
        prefillAccountId: accountId,
        prefillAmount: action.amount.toString(),
        prefillLoanType:
          action.kind === "lent" ? LoanTypeEnum.LENT : LoanTypeEnum.BORROWED,
        billParticipantId: action.participantId,
      },
    })
  }
  const actionHint = (action: SettlementAction) => {
    if (isRecorded(action.participantId))
      return t("screens.settings.billSplitter.summary.recorded")
    if (action.kind === "share")
      return t("screens.settings.billSplitter.summary.recordShare")
    if (action.kind === "borrowed")
      return t("screens.settings.billSplitter.summary.youOwe")
    return t("screens.settings.billSplitter.summary.owesYou")
  }
  const renderPeopleChips = (
    selectedId: string | null,
    onSelect: (id: string | null) => void,
  ) => (
    <FlatList
      horizontal
      data={participants}
      keyExtractor={(participant: Participant) => participant.id}
      renderItem={({ item: participant }) => {
        const isSelected = participant.id === selectedId
        return (
          <Chip
            label={participant.name}
            selected={isSelected}
            hideCheck
            onPress={() => onSelect(isSelected ? null : participant.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
          />
        )
      }}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipsRow}
    />
  )
  const renderItem = ({ item }: { item: BillSummaryEntry }) => {
    const isSelf = item.participantId === selfId
    const action = actionFor(item.participantId)
    const canAct = !!action && !isRecorded(item.participantId)
    return (
      <Pressable
        style={[styles.summaryCard, !canAct && styles.summaryCardInactive]}
        onPress={() => action && canAct && handleAction(action)}
        accessibilityRole="button"
        accessibilityHint={action ? actionHint(action) : undefined}
        disabled={!canAct}
      >
        <View style={styles.nameBlock}>
          <Text style={styles.nameText} numberOfLines={1}>
            {item.name}
            {isSelf ? ` (${t("common.you")})` : ""}
          </Text>
          {action ? (
            <Text variant="small" style={styles.hintText} numberOfLines={1}>
              {actionHint(action)}
            </Text>
          ) : null}
        </View>
        <View style={styles.amountContainer}>
          <Money
            value={item.owedAmount}
            currency={currency}
            hideSign
            style={styles.amountText}
          />
          {canAct ? (
            <IconSvg
              name="chevron-right-outline"
              size={16}
              color={theme.colors.onSecondary}
            />
          ) : null}
        </View>
      </Pressable>
    )
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={summary}
        keyExtractor={(item) => item.participantId}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <Text variant="h2" style={styles.title}>
              {t("screens.settings.billSplitter.summary.title")}
            </Text>

            <View style={styles.payerSection}>
              <Text style={styles.payerLabel}>
                {t("screens.settings.billSplitter.summary.whoAreYou.title")}
              </Text>
              {renderPeopleChips(selfId, handleSelectSelf)}
            </View>

            <View style={styles.payerSection}>
              <Text style={styles.payerLabel}>
                {t("screens.settings.billSplitter.summary.whoPaid")}
              </Text>
              {hasItemPayers ? (
                <Text variant="small" style={styles.hintText}>
                  {t("screens.settings.billSplitter.summary.whoPaidHint")}
                </Text>
              ) : null}
              {renderPeopleChips(payerId, setPayerId)}
            </View>

            {/* Total summary: total bill and, once a payer is chosen, their own share */}
            <View style={styles.totalsCard}>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>
                  {t("screens.settings.billSplitter.title")}
                </Text>
                <Money
                  value={totalBill}
                  currency={currency}
                  hideSign
                  style={styles.totalsAmount}
                />
              </View>
              {selfEntry ? (
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>
                    {t("screens.settings.billSplitter.summary.owedToYou")}
                  </Text>
                  <Money
                    value={selfEntry.owedAmount}
                    currency={currency}
                    hideSign
                    style={styles.totalsAmount}
                  />
                </View>
              ) : null}
            </View>
          </>
        }
        ListEmptyComponent={
          <EmptyState
            icon="list-details-outline"
            title={t("screens.settings.billSplitter.summary.noItems")}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Bottom action — disabled until payer is selected */}
      <FooterBar>
        <Button
          // One form per tap: pushing several at once stacks them.
          onPress={() => nextAction && handleAction(nextAction)}
          disabled={!nextAction}
          style={footerBarStyles.button}
        >
          <Text>
            {t("screens.settings.billSplitter.actions.generateLoans")}
          </Text>
        </Button>
      </FooterBar>

      <ConfirmSheet
        visible={billDoneVisible}
        onRequestClose={() => setBillDoneVisible(false)}
        onConfirm={clearBill}
        onConfirmed={() => router.back()}
        title={t("screens.settings.billSplitter.summary.billDone.title")}
        description={t(
          "screens.settings.billSplitter.summary.billDone.description",
        )}
        confirmLabel={t("common.actions.clear")}
        cancelLabel={t("screens.settings.billSplitter.summary.billDone.keep")}
        icon="check-outline"
      />
    </View>
  )
}
const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontSize: theme.typography.displaySmall.fontSize,
    fontWeight: "700",
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  listContent: {
    padding: 20,
    paddingBottom: 20,
    gap: 10,
  },
  separator: {
    height: 0,
  },
  // Payer chip selector
  payerSection: {
    marginBottom: 12,
    gap: 8,
  },
  payerLabel: {
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: "600",
    color: theme.colors.onSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 4,
  },
  // Totals summary card
  totalsCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: `${theme.colors.onSurface}08`,
    borderWidth: 1,
    borderColor: theme.colors.semantic.semi,
    gap: 8,
    marginBottom: 4,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalsLabel: {
    fontSize: theme.typography.labelLarge.fontSize,
    fontWeight: "500",
    color: theme.colors.onSecondary,
  },
  totalsAmount: {
    fontSize: theme.typography.labelLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  // Participant cards
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: `${theme.colors.onSurface}08`,
    borderWidth: 1,
    borderColor: theme.colors.semantic.semi,
  },
  summaryCardInactive: {
    opacity: 0.5,
  },
  nameBlock: {
    flex: 1,
    gap: 2,
  },
  hintText: {
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.onSecondary,
  },
  nameText: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  amountText: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
}))
