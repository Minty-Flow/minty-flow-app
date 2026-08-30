import type { Loan } from "~/types/loans"
import type {
  Recurrence,
  RecurrenceUnit,
  TransactionKind,
} from "~/types/transactions"

import { LoanCard } from "./loan-card"
import type { LoanDraft } from "./on-kind-change"
import { RecurrenceCard } from "./recurrence-card"

type Props = {
  kind: TransactionKind
  recurrence: Recurrence
  until: Date | null
  occurrenceCount: number | null
  onIntervalChange: (n: number) => void
  onUnitChange: (u: RecurrenceUnit) => void
  onUntilPress: () => void
  onUntilReset: () => void
  loanDraft: LoanDraft | null
  onLoanDraftChange: (draft: LoanDraft) => void
  linkedLoan: Loan | null
  linkableLoans: Loan[]
  onLinkLoan: (loanId: string) => void
  onUnlinkLoan: () => void
  onFillRemaining: () => void
  loanCurrencyCode: string
}

export function FormKindCard(props: Props) {
  switch (props.kind) {
    case "subscription":
    case "repetitive":
      return (
        <RecurrenceCard
          recurrence={props.recurrence}
          until={props.until}
          occurrenceCount={props.occurrenceCount}
          onIntervalChange={props.onIntervalChange}
          onUnitChange={props.onUnitChange}
          onUntilPress={props.onUntilPress}
          onUntilReset={props.onUntilReset}
        />
      )
    case "lent":
    case "borrowed":
      return (
        <LoanCard
          loanDraft={props.loanDraft}
          onLoanDraftChange={props.onLoanDraftChange}
          linkedLoan={props.linkedLoan}
          linkableLoans={props.linkableLoans}
          onLink={props.onLinkLoan}
          onUnlink={props.onUnlinkLoan}
          onFillRemaining={props.onFillRemaining}
          currencyCode={props.loanCurrencyCode}
        />
      )
    default:
      return null
  }
}
