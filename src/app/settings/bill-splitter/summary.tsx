import { useRouter } from "expo-router"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { FlatList, ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Money } from "~/components/money"
import { Button } from "~/components/ui/button"
import { EmptyState } from "~/components/ui/empty-state"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  getBillSummary,
  getBillTotal,
  useBillSplitterStore,
} from "~/stores/bill-splitter.store"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import type { BillSummaryEntry } from "~/types/bill-splitter"
import { LoanTypeEnum } from "~/types/loans"
import { NewEnum } from "~/types/new"
import { Toast } from "~/utils/toast"

export default function SummaryScreen() {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const router = useRouter()
  const currency = useMoneyFormattingStore((s) => s.preferredCurrency)

  const participants = useBillSplitterStore((s) => s.participants)
  const items = useBillSplitterStore((s) => s.items)
  const payerId = useBillSplitterStore((s) => s.payerId)
  const accountId = useBillSplitterStore((s) => s.accountId)
  const setPayerId = useBillSplitterStore((s) => s.setPayerId)

  const summary = useMemo(
    () => getBillSummary(items, participants),
    [items, participants],
  )

  const totalBill = useMemo(() => getBillTotal(items), [items])

  // Amount the payer themselves owes (their own share of the bill)
  const payerEntry = useMemo(
    () => summary.find((s) => s.participantId === payerId) ?? null,
    [summary, payerId],
  )

  const handleGenerateLoan = useCallback(
    (entry: BillSummaryEntry) => {
      if (!accountId) {
        Toast.warn({
          title: t("screens.settings.billSplitter.summary.noAccount"),
        })
        return
      }
      if (!payerId) {
        Toast.warn({
          title: t("screens.settings.billSplitter.summary.noPayer"),
        })
        return
      }

      router.push({
        pathname: "/settings/loans/[loanId]/modify",
        params: {
          loanId: NewEnum.NEW,
          prefillName: entry.name,
          prefillDescription: t(
            "screens.settings.billSplitter.summary.loanDescription",
          ),
          prefillAccountId: accountId,
          prefillAmount: entry.owedAmount.toString(),
          prefillLoanType: LoanTypeEnum.LENT,
        },
      })
    },
    [accountId, payerId, router, t],
  )

  const renderItem = useCallback(
    ({ item }: { item: BillSummaryEntry }) => {
      const isPayer = item.participantId === payerId

      return (
        <Pressable
          style={[styles.summaryCard, isPayer && styles.summaryCardPayer]}
          onPress={() => !isPayer && handleGenerateLoan(item)}
          disabled={isPayer}
        >
          <Text style={styles.nameText} numberOfLines={1}>
            {item.name}
            {isPayer ? ` (${t("common.you")})` : ""}
          </Text>
          <View style={styles.amountContainer}>
            <Money
              value={item.owedAmount}
              currency={currency}
              hideSign
              style={styles.amountText}
            />
            {!isPayer ? (
              <IconSvg
                name="chevron-right"
                size={16}
                color={theme.colors.onSecondary}
              />
            ) : null}
          </View>
        </Pressable>
      )
    },
    [payerId, currency, theme, handleGenerateLoan, t],
  )

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

            {/* Inline payer chip selector */}
            <View style={styles.payerSection}>
              <Text style={styles.payerLabel}>
                {t("screens.settings.billSplitter.summary.whoAreYou.title")}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
              >
                {participants.map((p) => {
                  const isSelected = p.id === payerId
                  return (
                    <Pressable
                      key={p.id}
                      onPress={() => setPayerId(isSelected ? null : p.id)}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {p.name}
                      </Text>
                    </Pressable>
                  )
                })}
              </ScrollView>
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
              {payerEntry ? (
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>
                    {t("screens.settings.billSplitter.summary.owedToYou")}
                  </Text>
                  <Money
                    value={payerEntry.owedAmount}
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
            icon="list-details"
            title={t("screens.settings.billSplitter.summary.noItems")}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Bottom action — disabled until payer is selected */}
      <View style={styles.footer}>
        <Button
          onPress={() => {
            const debtors = summary.filter(
              (s) => s.participantId !== payerId && s.owedAmount > 0,
            )
            if (debtors.length === 0) return
            handleGenerateLoan(debtors[0])
          }}
          disabled={!payerId}
          style={styles.footerButton}
        >
          <Text>
            {t("screens.settings.billSplitter.actions.generateLoans")}
          </Text>
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  listContent: {
    padding: 20,
    paddingBottom: 120,
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
    fontSize: 13,
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
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: `${theme.colors.onSurface}10`,
    borderWidth: 1,
    borderColor: theme.colors.customColors.semi,
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
  chipTextSelected: {
    color: theme.colors.onPrimary,
  },

  // Totals summary card
  totalsCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: `${theme.colors.onSurface}08`,
    borderWidth: 1,
    borderColor: theme.colors.customColors.semi,
    gap: 8,
    marginBottom: 4,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalsLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.onSecondary,
  },
  totalsAmount: {
    fontSize: 14,
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
    borderColor: theme.colors.customColors.semi,
  },
  summaryCardPayer: {
    opacity: 0.5,
  },
  nameText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
  },
  footerButton: {
    width: "100%",
  },
}))
