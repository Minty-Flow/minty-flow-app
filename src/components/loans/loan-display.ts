import type { TFunction } from "i18next"

import type { IconSvgName } from "~/components/icons"
import type { UnistylesTheme } from "~/styles/theme/types"
import type { Account } from "~/types/accounts"
import type { Loan } from "~/types/loans"
import { getLoanProgressModel } from "~/utils/planning-progress"
import { formatShortMonthDay } from "~/utils/time-utils"

/**
 * Progress plus the labels and colors a loan is shown with (card and detail):
 * due text, term, status badge, accent colors.
 */
export function getLoanDisplay(
  loan: Loan,
  account: Account | undefined,
  t: TFunction,
  theme: UnistylesTheme,
) {
  const model = getLoanProgressModel(loan, loan.repaidAmount)
  const { isLent, isPaid, dueDays } = model

  const accentColor = loan.colorScheme?.primary ?? theme.colors.primary
  const accentTint = loan.colorScheme?.secondary ?? `${theme.colors.primary}20`
  const mutedColor = theme.colors.onSecondary

  const dueText = (): string => {
    if (isPaid) return t("screens.settings.loans.card.settled")
    if (dueDays === null || !loan.dueDate)
      return t("screens.settings.loans.card.noDueDate")
    if (dueDays === 0) return t("screens.settings.loans.card.dueToday")
    if (dueDays === 1) return t("screens.settings.loans.card.dueTomorrow")
    if (dueDays > 1 && dueDays <= 14)
      return t("screens.settings.loans.card.dueInDays", { count: dueDays })
    return t("screens.settings.loans.card.dueDate", {
      date: formatShortMonthDay(loan.dueDate),
    })
  }

  const termLabel =
    loan.term === "long_term"
      ? t("screens.settings.loans.term.longTerm")
      : t("screens.settings.loans.term.oneTime")

  const badgeIcon: IconSvgName =
    isLent || isPaid ? "arrow-up-right-outline" : "arrow-down-left-outline"

  return {
    ...model,
    accentColor,
    mutedColor,
    subtitleParts: [account?.name, termLabel, dueText()].filter(Boolean),
    subtitleColor:
      loan.isOverdue && !isPaid ? theme.colors.semantic.expense : mutedColor,
    badgeLabel: isPaid
      ? t("screens.settings.loans.card.statusPaid")
      : isLent
        ? t("screens.settings.loans.type.lent")
        : t("screens.settings.loans.type.borrowed"),
    badgeIcon,
    badgeColor: isPaid ? mutedColor : accentColor,
    badgeBg: isPaid ? theme.colors.secondary : accentTint,
    progressBarColor: isPaid ? mutedColor : accentColor,
    // A one-time loan is open or covered — no partial progress. Only a
    // long-term loan (which a partial Collect/Settle promotes it to) shows a
    // progress bar.
    isLongTerm: loan.term === "long_term",
  }
}
