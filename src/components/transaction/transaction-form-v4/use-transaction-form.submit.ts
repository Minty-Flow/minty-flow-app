import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"
import type { TransactionFormValues } from "~/schemas/transactions.schema"
import type { Account } from "~/types/accounts"
import type { TransactionKind } from "~/types/transactions"

export interface BuildPayloadCtx {
  isNew: boolean
  transaction: TransactionWithRelations | null
  selectedAccount: Account | undefined
  usdCode: string
  attachmentsJson: string | null
  effectiveDate: Date
  requireConfirmation: boolean
  recurringEnabled: boolean
}

/**
 * Pure payload assembly for the plain (non-transfer, non-recurring, non-loan)
 * create / update path. Moved verbatim from the form's `onSubmit`; the only
 * added behaviour is the bidirectional CSI-2 `kind`/`isPending` resolution at
 * the end (a future-dated / pending-toggled default becomes `kind: "upcoming"`,
 * and `kind: "upcoming"` forces `isPending`).
 */
export function buildTransactionPayload(
  data: TransactionFormValues,
  ctx: BuildPayloadCtx,
) {
  const {
    isNew,
    transaction,
    selectedAccount,
    usdCode,
    attachmentsJson,
    effectiveDate,
    requireConfirmation,
    recurringEnabled,
  } = ctx

  const builtExtra: Record<string, string> = isNew
    ? {}
    : { ...(transaction?.extra ?? {}) }
  if (attachmentsJson !== null) {
    builtExtra.attachments = attachmentsJson
  } else {
    delete builtExtra.attachments
  }
  const isFuture = effectiveDate.getTime() > Date.now()
  const effectiveIsPending = data.isPending ?? false
  const requiresManualConfirmation = recurringEnabled
    ? undefined
    : transaction
      ? (transaction.requiresManualConfirmation ??
        (isFuture ? requireConfirmation : undefined))
      : effectiveIsPending
        ? requireConfirmation
        : undefined
  const payload = {
    amount: data.amount,
    currency: selectedAccount?.currencyCode ?? usdCode,
    type: data.type,
    transactionDate: effectiveDate,
    categoryId: data.categoryId ?? null,
    accountId: data.accountId,
    title: data.title?.trim() ?? null,
    description: data.description?.trim() ?? undefined,
    isPending: effectiveIsPending,
    requiresManualConfirmation,
    tags: data.tags ?? [],
    goalId: data.goalId ?? null,
    budgetId: data.budgetId ?? null,
    loanId: data.loanId ?? null,
    location: data.location,
    extra: Object.keys(builtExtra).length > 0 ? builtExtra : undefined,
    subtype: data.subtype ?? undefined,
  }

  // CSI-2 bidirectional kind resolution — closes the window opened by Task 5:
  // `createTransaction` throws in __DEV__ on `{ kind: "default", isPending: true }`.
  const resolvedIsPending = effectiveIsPending
  const resolvedKind: TransactionKind =
    data.kind === "upcoming"
      ? "upcoming"
      : resolvedIsPending && (data.kind ?? "default") === "default"
        ? "upcoming"
        : (data.kind ?? "default")
  return {
    ...payload,
    kind: resolvedKind,
    isPending: resolvedKind === "upcoming" ? true : resolvedIsPending,
  }
}
