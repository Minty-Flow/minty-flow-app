import { endOfDay } from "date-fns/endOfDay"
import type { useRouter } from "expo-router"
import type { TFunction } from "i18next"

import {
  createTransaction,
  createTransfer,
  editTransfer,
  updateTransaction,
} from "~/database/services/ledger-service"
import { createLoanWithOpeningEntry } from "~/database/services/loan-service"
import {
  createRecurringRule,
  type RecurringTransactionTemplate,
} from "~/database/services/recurring-transaction-service"
import { getRepaymentTypeForLoan } from "~/domain/transaction-kind"
import type { TransactionFormValues } from "~/schemas/transactions.schema"
import { useBillSplitterStore } from "~/stores/bill-splitter.store"
import { TransactionTypeEnum } from "~/types/transactions"
import { toStoredAttachment } from "~/utils/attachments"
import { logger } from "~/utils/logger"
import { buildRRuleString, countOccurrencesBetween } from "~/utils/recurrence"
import { Toast } from "~/utils/toast"

import { checkTransferRate } from "./transfer-rate"
import type {
  AttachmentState,
  OverlayState,
  RecurringState,
  TransactionFormProps,
} from "./types"
import { buildTransactionPayload } from "./use-transaction-form.submit"

interface SaveContext
  extends Pick<
    TransactionFormProps,
    "accounts" | "categories" | "loans" | "transaction"
  > {
  t: TFunction
  router: ReturnType<typeof useRouter>
  isNew: boolean
  isRecurringKind: boolean
  isNewRecurringRule: boolean
  recurring: RecurringState
  recurringRule: RecurringTransactionTemplate | null
  selectedAccount: TransactionFormProps["accounts"][number] | undefined
  usdCode: string
  conversionRate: number | null
  isConversionRateLoading: boolean
  derivedTransferTitle: string
  attachments: AttachmentState["list"]
  hasLoanDueDate: boolean
  billParticipantId: string | undefined
  setOverlays: (update: Partial<OverlayState>) => void
  flushRemovedAttachments: () => void
  allowNavigation: () => void
}

/**
 * Validates and writes the submitted form, then leaves the screen. Returns
 * early when the form must stay open; a failed write may throw.
 */
export async function saveTransaction(
  data: TransactionFormValues,
  {
    t,
    router,
    accounts,
    categories,
    loans,
    transaction,
    isNew,
    isRecurringKind,
    isNewRecurringRule,
    recurring,
    recurringRule,
    selectedAccount,
    usdCode,
    conversionRate,
    isConversionRateLoading,
    derivedTransferTitle,
    attachments,
    hasLoanDueDate,
    billParticipantId,
    setOverlays,
    flushRemovedAttachments,
    allowNavigation,
  }: SaveContext,
): Promise<void> {
  // ─── Transfer ─────────────────────────────────────────────────────────
  if (data.type === TransactionTypeEnum.TRANSFER) {
    const fromId = data.accountId
    const toId = data.toAccountId ?? ""
    if (!toId) {
      Toast.error({
        title: t("components.transactionForm.toast.selectDestination"),
      })
      return
    }
    if (fromId === toId) {
      Toast.error({
        title: t("components.transactionForm.toast.fromToDifferent"),
      })
      return
    }
    const fromAccount = accounts.find((a) => a.id === fromId)
    const toAccount = accounts.find((a) => a.id === toId)
    const differentCurrencies =
      fromAccount &&
      toAccount &&
      fromAccount.currencyCode !== toAccount.currencyCode
    const rateCheck = checkTransferRate({
      differentCurrencies: !!differentCurrencies,
      conversionRate,
      isLoading: isConversionRateLoading,
    })
    if (!rateCheck.ok) {
      Toast.error({
        title:
          rateCheck.reason === "loading"
            ? t("components.transactionForm.toast.rateLoading")
            : t("components.transactionForm.toast.setDifferentCurrencies"),
      })
      return
    }
    const effectiveDate = data.transactionDate
    const transferPayload = {
      fromAccountId: fromId,
      toAccountId: toId,
      amount: data.amount,
      ...(rateCheck.conversionRate != null
        ? { conversionRate: rateCheck.conversionRate }
        : {}),
      transactionDate: isNew ? effectiveDate.getTime() : effectiveDate,
      title:
        data.title?.trim() ||
        derivedTransferTitle ||
        t("components.transactionForm.fields.transferTitle"),
      notes: data.description?.trim() || null,
    }
    if (isNew) {
      await createTransfer(
        {
          ...transferPayload,
          transactionDate: effectiveDate.getTime(),
        },
        // A future-dated transfer is pending like any other row.
        { isPending: data.isPending },
      )
      Toast.success({
        title: t("components.transactionForm.toast.transferCreated"),
      })
    } else if (transaction) {
      await editTransfer(transaction.id, {
        ...transferPayload,
        transactionDate: effectiveDate,
      })
      Toast.success({
        title: t("components.transactionForm.toast.transferUpdated"),
      })
    }
    allowNavigation()
    router.back()
    return
  }
  // Only a new rule starts at the recurrence card's start date. An edited
  // instance keeps its own date; `recurring.startDate` is the rule's first
  // date there.
  const effectiveDate =
    isNew && isRecurringKind ? recurring.startDate : data.transactionDate
  const attachmentsJson =
    attachments.length > 0
      ? JSON.stringify(attachments.map(toStoredAttachment))
      : null
  const payload = buildTransactionPayload(data, {
    isNew,
    transaction,
    selectedAccount,
    usdCode,
    attachmentsJson,
    effectiveDate,
    recurringEnabled: isNewRecurringRule,
  })
  if (isNew) {
    if (data.kind === "subscription" || data.kind === "repetitive") {
      try {
        const startDate = data.transactionDate
        const untilEod = recurring.until ? endOfDay(recurring.until) : null

        // RS-4: until before start -> no valid occurrences; block the save.
        if (
          untilEod &&
          countOccurrencesBetween(startDate, untilEod, recurring.recurrence) ===
            0
        ) {
          Toast.error({
            title: t(
              "components.transactionForm.toast.recurringUntilBeforeStart",
            ),
          })
          return
        }

        const rruleStr = buildRRuleString({
          interval: recurring.recurrence.interval,
          unit: recurring.recurrence.unit,
          startDate,
          until: recurring.until,
        })
        const rangeEnd = untilEod?.getTime() ?? new Date(2099, 11, 31).getTime()
        await createRecurringRule({
          amount: data.amount,
          type: data.type,
          accountId: data.accountId,
          categoryId: data.categoryId ?? null,
          title: data.title?.trim() ?? null,
          description: data.description?.trim() ?? null,
          subtype: data.subtype ?? null,
          tags: data.tags ?? [],
          kind: data.kind,
          range: {
            from: startDate.getTime(),
            to: rangeEnd,
          },
          rules: [rruleStr],
        })
        Toast.success({
          title: t("components.transactionForm.toast.recurringCreated"),
        })
      } catch (recErr) {
        logger.error("Failed to create recurring rule", {
          message: recErr instanceof Error ? recErr.message : String(recErr),
        })
        Toast.error({
          title: t("components.transactionForm.toast.recurringCreateFailed"),
        })
        return
      }
    } else if (data.kind === "lent" || data.kind === "borrowed") {
      try {
        if (!data.categoryId) {
          Toast.error({
            title: t("components.transactionForm.toast.loanNeedsCategory"),
          })
          return
        }
        const categoryName = categories.find(
          (c) => c.id === data.categoryId,
        )?.name
        const loanName =
          data.title?.trim() ||
          categoryName ||
          t("components.transactionForm.loan.nameLabel")
        await createLoanWithOpeningEntry(
          {
            name: loanName,
            principalAmount: data.amount,
            loanType: data.kind,
            term: "one_time",
            accountId: data.accountId,
            categoryId: data.categoryId,
            // The date field is the optional due date; the opening
            // cash-flow entry is dated now (the money moved today).
            dueDate: hasLoanDueDate ? data.transactionDate.getTime() : null,
          },
          {
            title: data.title?.trim() || null,
            description: data.description?.trim() || null,
            transactionDate: new Date(),
            tags: data.tags ?? [],
            location: data.location ?? null,
            extra: payload.extra ?? null,
          },
        )
        Toast.success({
          title: t("components.transactionForm.toast.transactionCreated"),
        })
      } catch (loanErr) {
        logger.error("Failed to save loan", {
          message: loanErr instanceof Error ? loanErr.message : String(loanErr),
        })
        Toast.error({
          title: t("components.transactionForm.toast.saveFailed"),
        })
        return
      }
    } else {
      // LP-1: a repayment linked via the loan picker can't overshoot.
      if (data.loanId) {
        const loan = loans.find((l) => l.id === data.loanId)
        if (
          loan &&
          data.type === getRepaymentTypeForLoan(loan.loanType) &&
          data.amount > loan.remainingAmount
        ) {
          Toast.error({
            title: t(
              "components.transactionForm.toast.loanAmountExceedsRemaining",
            ),
          })
          return
        }
      }
      await createTransaction(payload)
      Toast.success({
        title: t("components.transactionForm.toast.transactionCreated"),
      })
    }
  } else if (transaction) {
    if (transaction.recurringId && recurringRule) {
      setOverlays({
        pendingEditPayload: {
          amount: payload.amount,
          type: payload.type,
          transactionDate: payload.transactionDate,
          categoryId: payload.categoryId ?? null,
          accountId: payload.accountId,
          title: payload.title,
          description: payload.description,
          isPending: payload.isPending,
          requiresManualConfirmation: payload.requiresManualConfirmation,
          tags: payload.tags ?? [],
          extra: payload.extra,
          subtype: payload.subtype,
          goalId: payload.goalId,
          budgetId: payload.budgetId,
          loanId: payload.loanId,
          location: payload.location,
        },
        editRecurringSheetVisible: true,
      })
      return
    }
    await updateTransaction(transaction.id, payload)
    Toast.success({
      title: t("components.transactionForm.toast.transactionUpdated"),
    })
  }
  flushRemovedAttachments()
  if (isNew && billParticipantId)
    useBillSplitterStore.getState().markRecorded(billParticipantId)
  allowNavigation()
  router.back()
}
