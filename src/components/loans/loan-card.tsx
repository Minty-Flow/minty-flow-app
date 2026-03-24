import { withObservables } from "@nozbe/watermelondb/react"
import { useTranslation } from "react-i18next"
import { View as RNView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Money } from "~/components/money"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type AccountModel from "~/database/models/account"
import { observeAccountById } from "~/database/services/account-service"
import { observeLoanPaymentProgress } from "~/database/services/loan-service"
import type { Loan } from "~/types/loans"
import { LoanTypeEnum } from "~/types/loans"

interface LoanCardProps {
  loan: Loan
  onPress: () => void
  paidAmount: number
  account: AccountModel
}

function LoanCardInner({ loan, onPress, paidAmount, account }: LoanCardProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  const isLent = loan.loanType === LoanTypeEnum.LENT
  const paid = paidAmount ?? 0
  const principal = loan.principalAmount
  const progress = principal > 0 ? paid / principal : 0
  const clampedProgress = Math.min(progress, 1)
  const isPaid = progress >= 1
  const remaining = Math.max(principal - paid, 0)

  // Due date display string
  const dueDateLabel = (): string | null => {
    if (!loan.dueDate) return null
    return t("screens.settings.loans.card.dueDate", {
      date: loan.dueDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    })
  }

  const progressBarColor = isPaid
    ? theme.colors.customColors.income
    : theme.colors.primary

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={loan.name}
    >
      {/* Row 1: icon + name + type badge + overdue badge */}
      <View style={styles.row1}>
        <View style={styles.row1Left}>
          <DynamicIcon
            icon={loan.icon}
            size={18}
            colorScheme={loan.colorScheme}
          />
          <Text variant="default" style={styles.name} numberOfLines={1}>
            {loan.name}
          </Text>
        </View>

        <View style={styles.row1Right}>
          {/* Loan type badge — Lent or Borrowed */}
          <View style={styles.typeBadge}>
            <Text variant="small" style={styles.typeBadgeText}>
              {isLent
                ? t("screens.settings.loans.type.lent")
                : t("screens.settings.loans.type.borrowed")}
            </Text>
          </View>

          {/* Overdue badge */}
          {loan.isOverdue && !isPaid && (
            <View style={styles.overdueBadge}>
              <IconSvg
                name="alert-circle"
                size={12}
                color={theme.colors.customColors.expense}
              />
              <Text variant="small" style={styles.overdueText}>
                {t("screens.settings.loans.card.overdue")}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Row 2: Progress bar */}
      <View style={styles.progressTrack}>
        <RNView
          style={[
            styles.progressFill,
            {
              width: `${(clampedProgress * 100).toFixed(1)}%` as `${number}%`,
              backgroundColor: progressBarColor,
            },
          ]}
        />
      </View>

      {/* Row 3: paid/principal amounts + due date or remaining */}
      <View style={styles.row3}>
        <Text variant="small" style={styles.paidLabel}>
          {isLent
            ? t("screens.settings.loans.card.received")
            : t("screens.settings.loans.card.paid")}
          :{" "}
          <Money
            value={paid}
            currency={account.currencyCode}
            variant="small"
            tone="transfer"
            hideSign
          />{" "}
          {t("screens.settings.loans.card.of")}{" "}
          <Money
            value={principal}
            currency={account.currencyCode}
            variant="small"
            tone="transfer"
            hideSign
          />
        </Text>

        <Text variant="small" style={styles.remainingLabel}>
          {isPaid ? null : (
            <>
              <Money
                value={remaining}
                currency={account.currencyCode}
                variant="small"
                tone="transfer"
                hideSign
              />{" "}
              {t("screens.settings.loans.card.remaining")}
            </>
          )}
        </Text>
      </View>

      {/* Row 4: Due date chip (only when present and not overdue) */}
      {loan.dueDate && !loan.isOverdue && !isPaid && (
        <View style={styles.dueDateRow}>
          <IconSvg name="calendar" size={12} color={theme.colors.onSecondary} />
          <Text variant="small" style={styles.dueDateText}>
            {dueDateLabel()}
          </Text>
        </View>
      )}
    </Pressable>
  )
}

export const LoanCard = withObservables(
  ["loan"],
  ({ loan }: { loan: Loan }) => ({
    paidAmount: observeLoanPaymentProgress(loan.id, loan.loanType),
    account: observeAccountById(loan.accountId),
  }),
)(LoanCardInner)

const styles = StyleSheet.create((t) => ({
  card: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radius,
    borderWidth: 1,
    borderColor: t.colors.customColors.semi,
    padding: 14,
    gap: 10,
  },
  row1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row1Left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: t.colors.onSurface,
    flex: 1,
  },
  row1Right: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  typeBadge: {
    backgroundColor: t.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: t.radius,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: t.colors.onSecondary,
  },
  overdueBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: `${t.colors.customColors.expense}20`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: t.radius,
  },
  overdueText: {
    fontSize: 10,
    fontWeight: "600",
    color: t.colors.customColors.expense,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: t.colors.secondary,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  row3: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paidLabel: {
    fontSize: 12,
    color: t.colors.onSecondary,
    flex: 1,
    marginRight: 8,
  },
  remainingLabel: {
    fontSize: 12,
    color: t.colors.onSecondary,
    flexShrink: 0,
  },
  dueDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dueDateText: {
    fontSize: 11,
    color: t.colors.onSecondary,
    opacity: 0.7,
  },
}))
