import { useEffect, useRef } from "react"

import { promoteLoanToLongTerm } from "~/database/services/loan-service"
import type { Loan } from "~/types/loans"
import { logger } from "~/utils/logger"

/**
 * A one-time loan that has been partially repaid (0 < progress < 1) becomes a
 * long-term progress-tracked loan. The promotion is one-way (LP-4) and only
 * needs to happen once, so a fired id is remembered for the session.
 *
 * ponytail: reconcile-on-read rather than same-transaction as the repayment —
 * the write queue serialises loan writes anyway, and this covers every path
 * that can create a repayment (form, action modal, future).
 */
export function useLoanTermReconcile(loans: Loan[]): void {
  const promoted = useRef<Set<string>>(new Set())

  useEffect(() => {
    for (const loan of loans) {
      if (
        loan.term === "one_time" &&
        loan.progress > 0 &&
        loan.progress < 1 &&
        !promoted.current.has(loan.id)
      ) {
        promoted.current.add(loan.id)
        promoteLoanToLongTerm(loan.id).catch((error) => {
          promoted.current.delete(loan.id)
          logger.error("Failed to promote loan to long-term", { error })
        })
      }
    }
  }, [loans])
}
