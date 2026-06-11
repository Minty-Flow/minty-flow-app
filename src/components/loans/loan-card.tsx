import { differenceInDays } from "date-fns"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { type DimensionValue, View as RNView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Money } from "~/components/money"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { on } from "~/database/events"
import { getLoanProgress } from "~/database/repos/loan-repo"
import { useAccount } from "~/stores/db/account.store"
import { useLanguageStore } from "~/stores/language.store"
import type { Loan } from "~/types/loans"
import { LoanTypeEnum } from "~/types/loans"
import { formatShortMonthDay } from "~/utils/time-utils"

interface LoanCardProps {
  loan: Loan
  onPress: () => void
}

export function LoanCard({ loan, onPress }: LoanCardProps) {
  const [paidAmount, setPaidAmount] = useState(0)
  const account = useAccount(loan.accountId)
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const isRTL = useLanguageStore((s) => s.isRTL)

  useEffect(() => {
    let cancelled = false
    const fetch = () =>
      getLoanProgress(loan.id, loan.loanType).then((v) => {
        if (!cancelled) setPaidAmount(v)
      })
    fetch()
    const unsub = on("transactions:dirty", fetch)
    return () => {
      cancelled = true
      unsub()
    }
  }, [loan.id, loan.loanType])

  const isLent = loan.loanType === LoanTypeEnum.LENT
  const paid = paidAmount ?? 0
  const principal = loan.principalAmount
  const progress = principal > 0 ? paid / principal : 0
  const clampedProgress = Math.min(progress, 1)
  const isPaid = progress >= 1
  const remaining = Math.max(principal - paid, 0)

  const accentColor = loan.colorScheme?.primary ?? theme.colors.primary
  const accentTint = loan.colorScheme?.secondary ?? `${theme.colors.primary}20`
  const mutedColor = theme.colors.onSecondary

  const dueText = (): string => {
    if (isPaid) return t("screens.settings.loans.card.settled")
    if (!loan.dueDate) return t("screens.settings.loans.card.noDueDate")
    const diff = differenceInDays(loan.dueDate, new Date())
    if (diff === 0) return t("screens.settings.loans.card.dueToday")
    if (diff === 1) return t("screens.settings.loans.card.dueTomorrow")
    if (diff > 1 && diff <= 14)
      return t("screens.settings.loans.card.dueInDays", { count: diff })
    return t("screens.settings.loans.card.dueDate", {
      date: formatShortMonthDay(loan.dueDate),
    })
  }

  const subtitleParts = [account?.name, dueText()].filter(Boolean)
  const subtitleColor =
    loan.isOverdue && !isPaid ? theme.colors.customColors.expense : mutedColor

  const badgeLabel = isPaid
    ? t("screens.settings.loans.card.statusPaid")
    : isLent
      ? t("screens.settings.loans.type.lent")
      : t("screens.settings.loans.type.borrowed")
  const badgeIcon =
    isLent || isPaid ? "arrow-up-right-outline" : "arrow-down-left-outline"
  const badgeColor = isPaid ? mutedColor : accentColor
  const badgeBg = isPaid ? theme.colors.secondary : accentTint

  const progressBarColor = isPaid ? mutedColor : accentColor
  const progressPercent = Number((clampedProgress * 100).toFixed(1))

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={loan.name}
    >
      <View style={styles.row1}>
        <View style={styles.row1Left}>
          <DynamicIcon
            icon={loan.icon}
            size={18}
            colorScheme={loan.colorScheme}
          />
          <View style={styles.nameBlock}>
            <Text variant="default" style={styles.name} numberOfLines={1}>
              {loan.name}
            </Text>
            <Text
              variant="small"
              style={[styles.subtitle, { color: subtitleColor }]}
              numberOfLines={1}
            >
              {subtitleParts.join(" · ")}
            </Text>
          </View>
        </View>

        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <IconSvg
            name={badgeIcon}
            size={12}
            color={badgeColor}
            style={isRTL ? styles.badgeIconRTL : undefined}
          />
          <Text
            variant="small"
            style={[
              styles.badgeText,
              { color: badgeColor },
              isRTL && styles.badgeTextRTL,
            ]}
          >
            {badgeLabel}
          </Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <RNView
          style={[
            styles.progressFill,
            {
              width: `${progressPercent}%` as DimensionValue,
              backgroundColor: progressBarColor,
            },
          ]}
        />
      </View>

      <View style={styles.row3}>
        <Text variant="small" style={styles.paidLabel}>
          {isLent
            ? t("screens.settings.loans.card.received")
            : t("screens.settings.loans.card.paidBack")}{" "}
          <Money
            value={paid}
            currency={account?.currencyCode ?? ""}
            variant="small"
            tone="transfer"
            hideSign
          />{" "}
          {t("screens.settings.loans.card.of")}{" "}
          <Money
            value={principal}
            currency={account?.currencyCode ?? ""}
            variant="small"
            tone="transfer"
            hideSign
          />
        </Text>

        {isPaid ? (
          <Text
            variant="small"
            style={[styles.rightText, { color: mutedColor }]}
          >
            {t("screens.settings.loans.card.settled")}
          </Text>
        ) : (
          <Money
            value={remaining}
            currency={account?.currencyCode ?? ""}
            variant="small"
            tone="transfer"
            hideSign
            style={{ color: accentColor }}
          />
        )}
      </View>
    </Pressable>
  )
}

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
  nameBlock: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...t.typography.bodyLarge,
    fontWeight: "600",
    color: t.colors.onSurface,
  },
  subtitle: {
    fontSize: t.typography.labelSmall.fontSize,
  },
  badge: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: t.typography.labelXSmall.fontSize,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  badgeTextRTL: {
    letterSpacing: 0,
  },
  badgeIconRTL: {
    transform: [{ scaleX: -1 }],
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
    fontSize: t.typography.labelMedium.fontSize,
    color: t.colors.onSecondary,
    flex: 1,
    marginRight: 8,
  },
  rightText: {
    fontSize: t.typography.labelMedium.fontSize,
    flexShrink: 0,
    fontWeight: "600",
  },
}))
