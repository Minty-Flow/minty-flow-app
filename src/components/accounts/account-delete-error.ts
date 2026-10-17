import type { TFunction } from "i18next"

import { AccountHasLoansError } from "~/database/services/account-service"

/** Toast text for a failed account delete. A blocked delete names the loans. */
export function getAccountDeleteErrorDescription(
  error: unknown,
  t: TFunction,
): string {
  if (error instanceof AccountHasLoansError) {
    return t("screens.accounts.form.toast.deleteBlockedByLoans", {
      names: error.loanNames.join(", "),
    })
  }
  return t("screens.accounts.form.toast.deleteFailed")
}
