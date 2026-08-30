import { zodResolver } from "@hookform/resolvers/zod"
import { endOfDay } from "date-fns"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useEffect, useReducer, useRef, useState } from "react"
import { type Resolver, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import type { IconSvgName } from "~/components/icons"
import {
  createTransaction,
  createTransfer,
  deleteTransaction,
  deleteTransfer,
  destroyTransaction,
  editTransfer,
  restoreTransaction,
  updateTransaction,
} from "~/database/services/ledger-service"
import {
  createLoanWithOpeningEntry,
  deleteLoanById,
  isLoanOpeningTransaction,
} from "~/database/services/loan-service"
import { createRecurringRule } from "~/database/services/recurring-transaction-service"
import { getRepaymentTypeForLoan } from "~/domain/transaction-kind"
import { useBalanceAtTransaction } from "~/hooks/use-balance-before"
import { useNavigationGuard } from "~/hooks/use-navigation-guard"
import { useRecurringRule } from "~/hooks/use-recurring-rule"
import type { TranslationKey } from "~/i18n/config"
import {
  type TransactionFormValues,
  transactionSchema,
} from "~/schemas/transactions.schema"
import { currencyRegistryService } from "~/services/currency-registry"
import { synchronizePlannedTransactionNotifications } from "~/services/pending-transaction-notifications"
import { useTransactionLocationStore } from "~/stores/transaction-location.store"
import { NewEnum } from "~/types/new"
import {
  type TransactionKind,
  type TransactionLocation,
  TransactionSubTypeEnum,
  TransactionTypeEnum,
} from "~/types/transactions"
import { toStoredAttachment } from "~/utils/attachments"
import { logger } from "~/utils/logger"
import { rescaleMinorUnits } from "~/utils/money"
import {
  buildRRuleString,
  countOccurrencesBetween,
  parseRecurrence,
} from "~/utils/recurrence"
import { Toast } from "~/utils/toast"

import { EMPTY_TAG_IDS } from "./constants"
import { getDefaultValues, mergeReducer } from "./form-utils"
import { KIND_ICONS } from "./kind-info"
import { onKindChange } from "./on-kind-change"
import type {
  ModalState,
  RecurringState,
  TransactionFormV4Props,
} from "./types"
import { useFormAttachments } from "./use-form-attachments"
import { useFormConversionRate } from "./use-form-conversion-rate"
import { useFormDatePicker } from "./use-form-date-picker"
import { useFormLocation } from "./use-form-location"
import { buildTransactionPayload } from "./use-transaction-form.submit"

export function useTransactionForm({
  transaction,
  accounts,
  categories,
  goals,
  budgets,
  loans,
  transactionType,
  onTransactionTypeChange,
  initialTagIds = EMPTY_TAG_IDS,
  initialKind,
  prefill,
}: TransactionFormV4Props) {
  const router = useRouter()
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { id } = useLocalSearchParams<{
    id: string
  }>()
  const isNew = id === NewEnum.NEW
  const { isEnabled: locationEnabled, autoAttach } =
    useTransactionLocationStore()
  const usdCurrency = currencyRegistryService.getCurrencyByCode("USD")
  const usdCode = usdCurrency?.code ?? "USD"
  const [modals, setModals] = useReducer(mergeReducer<ModalState>, {
    unsavedModalVisible: false,
    editRecurringModalVisible: false,
    deleteRecurringModalVisible: false,
    deleteLoanModalVisible: false,
    destroyModalVisible: false,
    notesModalVisible: false,
    locationPickerVisible: false,
    pendingEditPayload: null,
  })
  const recurringRule = useRecurringRule(transaction?.recurringId ?? null)
  const defaultValues = getDefaultValues(
    transaction,
    accounts,
    transactionType,
    initialTagIds,
    prefill,
    initialKind,
  )
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema) as Resolver<TransactionFormValues>,
    defaultValues,
  })
  // Recurring toggle states
  const amount = watch("amount")
  const accountId = watch("accountId")
  const toAccountId = watch("toAccountId")
  const categoryId = watch("categoryId")
  const date = watch("transactionDate")
  const description = watch("description")
  const tagIds = watch("tags")
  const goalId = watch("goalId")
  const budgetId = watch("budgetId")
  const loanId = watch("loanId")
  const locationString = watch("location")
  const location: TransactionLocation | null =
    locationString != null && locationString !== ""
      ? (() => {
          try {
            return JSON.parse(locationString) as TransactionLocation
          } catch {
            return null
          }
        })()
      : null
  const isRefund = watch("subtype") === TransactionSubTypeEnum.REFUND
  const kind = (watch("kind") ?? "default") as TransactionKind
  const topTabType = watch("type")
  const tabLabels: [string, string, string] =
    kind === "lent" || kind === "borrowed"
      ? [
          t("common.transaction.tabs.lent"),
          t("common.transaction.tabs.borrowed"),
          "",
        ]
      : [
          t("common.transaction.types.expense"),
          t("common.transaction.types.income"),
          t("common.transaction.types.transfer"),
        ]
  const tabIcons: [IconSvgName, IconSvgName, IconSvgName] | undefined =
    kind === "lent" || kind === "borrowed"
      ? [KIND_ICONS.lent, KIND_ICONS.borrowed, "arrows-right-left-outline"]
      : undefined
  const tabHiddenSlots: number[] =
    kind === "lent" || kind === "borrowed"
      ? [2]
      : kind === "upcoming"
        ? [2]
        : []
  const selectedAccount = accounts.find((a) => a.id === accountId)
  // Filter goals to only those linked to the selected account
  const accountGoals = accountId
    ? goals.filter((g) => g.accountIds.includes(accountId))
    : []
  // Loans linkable from the selected account. Category is intentionally NOT
  // required to match: a loan is created against one account+category, but
  // linking a repayment must not force the user onto that exact category.
  const accountLoans = accountId
    ? loans.filter((l) => l.accountId === accountId)
    : []
  // Filter budgets by selected account AND category
  const accountBudgets = accountId
    ? budgets.filter(
        (b) =>
          b.accountIds.includes(accountId) &&
          (b.categoryIds.length === 0 ||
            (categoryId && b.categoryIds.includes(categoryId))),
      )
    : []
  // Clear goalId/budgetId/loanId when account changes and current selection is no longer valid
  const handleAccountChange = (newAccountId: string) => {
    const nextAccount = accounts.find((account) => account.id === newAccountId)
    if (
      selectedAccount &&
      nextAccount &&
      selectedAccount.currencyCode !== nextAccount.currencyCode
    ) {
      setValue(
        "amount",
        rescaleMinorUnits(
          amount ?? 0,
          selectedAccount.currencyCode,
          nextAccount.currencyCode,
        ),
        { shouldDirty: true },
      )
    }
    if (goalId) {
      const newGoals = newAccountId
        ? goals.filter((g) => g.accountIds.includes(newAccountId))
        : []
      if (!newGoals.some((g) => g.id === goalId)) {
        setValue("goalId", null, { shouldDirty: false })
      }
    }
    if (budgetId) {
      const newBudgets = newAccountId
        ? budgets.filter((b) => b.accountIds.includes(newAccountId))
        : []
      if (!newBudgets.some((b) => b.id === budgetId)) {
        setValue("budgetId", null, { shouldDirty: false })
      }
    }
    if (loanId) {
      const newLoans = newAccountId
        ? loans.filter((l) => l.accountId === newAccountId)
        : []
      if (!newLoans.some((l) => l.id === loanId)) {
        setValue("loanId", null, { shouldDirty: false })
      }
    }
  }
  const selectedToAccount =
    transactionType === TransactionTypeEnum.TRANSFER && toAccountId
      ? accounts.find((a) => a.id === toAccountId)
      : null
  const [isSaving, setIsSaving] = useState(false)
  const isLoanKind = kind === "lent" || kind === "borrowed"
  const { allowNavigation } = useNavigationGuard({
    navigation,
    when: isDirty && !isSaving,
    onBlock: () => setModals({ unsavedModalVisible: true }),
  })
  const [recurring, setRecurring] = useReducer(mergeReducer<RecurringState>, {
    recurrence: { interval: 1, unit: "month" },
    until: null,
    startDate: watch("transactionDate"),
  })
  const { conversionRate, setConversionRate } = useFormConversionRate(
    transactionType,
    selectedAccount,
    selectedToAccount,
    transaction,
    setValue,
  )
  const {
    attachmentState,
    setAttachmentState,
    removeAttachment,
    flushRemovedAttachments,
    handleSelectFromFiles,
    handleTakePhoto,
    handleSelectMultipleMedia,
    handleSelectSinglePhoto,
  } = useFormAttachments(transaction)
  const {
    datePicker,
    setDatePicker,
    openDatePicker,
    confirmIosDate,
    handleSetNow,
    pickerElement: datePickerAndroidElement,
  } = useFormDatePicker(recurring, setRecurring, watch, setValue)
  const { isCapturingLocation, handleLocationConfirm, handleClearLocation } =
    useFormLocation(isNew, locationEnabled, autoAttach, setValue, () =>
      setModals({ locationPickerVisible: false }),
    )
  const balanceAtTransaction = useBalanceAtTransaction(transaction)
  const derivedTransferTitle = (() => {
    if (
      transactionType !== TransactionTypeEnum.TRANSFER ||
      !selectedAccount ||
      !selectedToAccount
    )
      return ""
    return t("components.transactionForm.fields.transferTitleFull", {
      from: selectedAccount.name,
      to: selectedToAccount.name,
    })
  })()
  const isRecurringKind = kind === "subscription" || kind === "repetitive"
  const occurrenceCount = recurring.until
    ? countOccurrencesBetween(
        recurring.startDate,
        endOfDay(recurring.until),
        recurring.recurrence,
      )
    : null

  // RS-1: a new subscription/repetitive starts at the form's transactionDate
  // (which is `new Date()` at open for these kinds — Date field is hidden).
  useEffect(() => {
    if (isNew && isRecurringKind && recurring.startDate !== date) {
      setRecurring({ startDate: date })
    }
  }, [isNew, isRecurringKind, date, recurring.startDate])
  // ES-8: seed the recurrence card from the stored rule exactly once when
  // editing a rule-linked instance. After this the user's card edits win.
  const seededFromRuleRef = useRef(false)
  useEffect(() => {
    if (seededFromRuleRef.current) return
    if (!transaction?.recurringId || !recurringRule) return
    seededFromRuleRef.current = true
    const to = recurringRule.range.to
    setRecurring({
      recurrence: parseRecurrence(recurringRule.rules[0] ?? ""),
      until: to >= new Date(2099, 0, 1).getTime() ? null : new Date(to),
      startDate: new Date(recurringRule.range.from), // RS-2 anchor
    })
  }, [transaction?.recurringId, recurringRule])
  // ES-4/5/8: kind is locked once a transaction is tied to a loan or a
  // recurring rule (recurrence editing lands in Slice 2, loan wiring in Slice 4).
  const canEditKind =
    isNew || (transaction?.loanId == null && transaction?.recurringId == null)
  const lockedFields: ReadonlySet<string> = new Set<string>(
    transaction?.loanId ? ["kind", "type", "loanId", "toAccountId"] : [],
  )
  // LX-2: the loan's opening entry can't be deleted on its own — deleting it
  // deletes the loan. A repayment deletes normally (progress recomputes on read).
  const loanForTransaction = transaction?.loanId
    ? (loans.find((l) => l.id === transaction.loanId) ?? null)
    : null
  const isLoanOpeningEntry = !!(
    transaction &&
    loanForTransaction &&
    isLoanOpeningTransaction(transaction, loanForTransaction)
  )
  const setKind = (next: TransactionKind) => {
    if (!canEditKind || next === kind) return
    // ES-4: an existing transaction may not gain a loan link on edit.
    if (!isNew && (next === "lent" || next === "borrowed")) return
    const partials = onKindChange(kind, next, { recurring, toAccountId })
    if (partials.recurring) setRecurring(partials.recurring)
    if ("toAccountId" in partials) {
      setValue("toAccountId", partials.toAccountId, { shouldDirty: true })
    }
    setValue("kind", next, { shouldDirty: true })
    if (next === "lent" || next === "borrowed") {
      const newType =
        next === "lent"
          ? TransactionTypeEnum.EXPENSE
          : TransactionTypeEnum.INCOME
      setValue("type", newType, { shouldDirty: true })
      onTransactionTypeChange(newType)
    } else if (
      next === "upcoming" &&
      topTabType === TransactionTypeEnum.TRANSFER
    ) {
      setValue("type", TransactionTypeEnum.EXPENSE, { shouldDirty: true })
      onTransactionTypeChange(TransactionTypeEnum.EXPENSE)
    }
  }
  const handleConfirmExit = () => {
    allowNavigation()
    router.back()
  }
  const onSubmit = async (data: TransactionFormValues) => {
    if (isSaving) return
    setIsSaving(true)
    try {
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
        if (differentCurrencies) {
          if (
            conversionRate == null ||
            conversionRate <= 0 ||
            conversionRate === 1
          ) {
            Toast.error({
              title:
                conversionRate === 1
                  ? t("components.transactionForm.toast.rateLoading")
                  : t(
                      "components.transactionForm.toast.setDifferentCurrencies",
                    ),
            })
            return
          }
        }
        const effectiveDate = data.transactionDate
        const transferPayload = {
          fromAccountId: fromId,
          toAccountId: toId,
          amount: data.amount,
          ...(differentCurrencies &&
          conversionRate != null &&
          conversionRate > 0 &&
          conversionRate !== 1
            ? { conversionRate }
            : {}),
          transactionDate: isNew ? effectiveDate.getTime() : effectiveDate,
          title:
            data.title?.trim() ||
            derivedTransferTitle ||
            t("components.transactionForm.fields.transferTitle"),
          notes: data.description?.trim() || null,
        }
        if (isNew) {
          await createTransfer({
            ...transferPayload,
            transactionDate: effectiveDate.getTime(),
          })
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
      const effectiveDate = isRecurringKind
        ? recurring.startDate
        : data.transactionDate
      const attachmentsJson =
        attachmentState.list.length > 0
          ? JSON.stringify(attachmentState.list.map(toStoredAttachment))
          : null
      const payload = buildTransactionPayload(data, {
        isNew,
        transaction,
        selectedAccount,
        usdCode,
        attachmentsJson,
        effectiveDate,
        recurringEnabled: isNew && isRecurringKind,
      })
      if (isNew) {
        if (data.kind === "subscription" || data.kind === "repetitive") {
          try {
            const startDate = data.transactionDate
            const untilEod = recurring.until ? endOfDay(recurring.until) : null

            // RS-4: until before start -> no valid occurrences; block the save.
            if (
              untilEod &&
              countOccurrencesBetween(
                startDate,
                untilEod,
                recurring.recurrence,
              ) === 0
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
            const rangeEnd =
              untilEod?.getTime() ?? new Date(2099, 11, 31).getTime()
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
              message:
                recErr instanceof Error ? recErr.message : String(recErr),
            })
            Toast.error({
              title: t(
                "components.transactionForm.toast.recurringCreateFailed",
              ),
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
                // The single date field is the due date; the opening
                // cash-flow entry is dated now (the money moved today).
                dueDate: data.transactionDate.getTime(),
              },
              {
                title: data.title?.trim() || null,
                description: data.description?.trim() || null,
                transactionDate: new Date(),
                tags: data.tags ?? [],
                location: data.location ?? null,
              },
            )
            Toast.success({
              title: t("components.transactionForm.toast.transactionCreated"),
            })
            synchronizePlannedTransactionNotifications().catch(() => {})
          } catch (loanErr) {
            logger.error("Failed to save loan", {
              message:
                loanErr instanceof Error ? loanErr.message : String(loanErr),
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
          synchronizePlannedTransactionNotifications().catch(() => {})
          Toast.success({
            title: t("components.transactionForm.toast.transactionCreated"),
          })
        }
      } else if (transaction) {
        if (transaction.recurringId && recurringRule) {
          setModals({
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
            },
            editRecurringModalVisible: true,
          })
          return
        }
        await updateTransaction(transaction.id, payload)
        synchronizePlannedTransactionNotifications().catch(() => {})
        Toast.success({
          title: t("components.transactionForm.toast.transactionUpdated"),
        })
      }
      flushRemovedAttachments()
      allowNavigation()
      router.back()
    } catch (error) {
      logger.error("Failed to save transaction", {
        message: error instanceof Error ? error.message : String(error),
      })
      Toast.error({ title: t("components.transactionForm.toast.saveFailed") })
    } finally {
      setIsSaving(false)
    }
  }
  const handleCancelPress = () => {
    if (isDirty) {
      setModals({ unsavedModalVisible: true })
    } else {
      allowNavigation()
      router.back()
    }
  }
  const handleDeleteConfirm = () => {
    if (!transaction) return
    if (isLoanOpeningEntry) {
      setModals({ deleteLoanModalVisible: true })
      return
    }
    if (transaction.recurringId && recurringRule) {
      setModals({ deleteRecurringModalVisible: true })
      return
    }
    const promise =
      transaction.isTransfer && transaction.transferId
        ? deleteTransfer(transaction.id)
        : deleteTransaction(transaction.id)
    promise
      .then(() => {
        synchronizePlannedTransactionNotifications().catch(() => {})
        Toast.success({
          title: t("components.transactionForm.toast.movedToTrash"),
        })
        allowNavigation()
        router.back()
      })
      .catch((error) => {
        logger.error("Failed to move transaction to trash", { error })
        Toast.error({
          title: t("components.transactionForm.toast.moveToTrashFailed"),
        })
      })
  }
  const handleDeleteLoanConfirm = async () => {
    if (!transaction?.loanId) return
    setModals({ deleteLoanModalVisible: false })
    try {
      await deleteLoanById(transaction.loanId)
      synchronizePlannedTransactionNotifications().catch(() => {})
      Toast.success({
        title: t("components.transactionForm.toast.loanDeleted"),
      })
      allowNavigation()
      router.back()
    } catch (error) {
      logger.error("Failed to delete loan", { error })
      Toast.error({
        title: t("components.transactionForm.toast.moveToTrashFailed"),
      })
    }
  }
  const handleRestore = async () => {
    if (!transaction?.isDeleted) return
    try {
      await restoreTransaction(transaction.id)
      synchronizePlannedTransactionNotifications().catch(() => {})
      Toast.success({
        title: t("components.transactionForm.toast.restored"),
        description: t("components.transactionForm.toast.restoredDescription"),
      })
      allowNavigation()
      router.back()
    } catch {
      Toast.error({
        title: t("components.transactionForm.toast.restoreFailed"),
      })
    }
  }
  const handleDestroy = () => {
    if (!transaction) return
    setModals({ destroyModalVisible: true })
  }
  const handleDestroyConfirm = async () => {
    if (!transaction) return
    setModals({ destroyModalVisible: false })
    try {
      await destroyTransaction(transaction.id)
      Toast.success({
        title: t("common.toast.deleted"),
        description: t("components.transactionForm.toast.deletedDescription"),
      })
      allowNavigation()
      router.back()
    } catch {
      Toast.error({
        title: t("common.toast.error"),
        description: t("components.transactionForm.toast.deleteFailed"),
      })
    }
  }
  const addTag = (tagId: string) => {
    const current = tagIds ?? []
    if (current.includes(tagId)) return
    setValue("tags", [...current, tagId], { shouldDirty: true })
  }
  const removeTag = (tagId: string) => {
    setValue(
      "tags",
      (tagIds ?? []).filter((id) => id !== tagId),
      { shouldDirty: true },
    )
  }
  const clearTags = () => setValue("tags", [], { shouldDirty: true })
  const handleTransactionTypeChange = (type: TransactionFormValues["type"]) => {
    onTransactionTypeChange(type)
    setValue("type", type, { shouldDirty: true })
    // Clear goal when switching types (different goal types apply)
    setValue("goalId", null, { shouldDirty: false })
    // Clear title so placeholder takes over
    if (type === TransactionTypeEnum.TRANSFER) {
      setValue("title", "", { shouldDirty: false })
      setValue("toAccountId", toAccountId ?? "", { shouldDirty: false })
    }
  }
  const onTopTabChange = (type: TransactionFormValues["type"]) => {
    handleTransactionTypeChange(type)
    if (kind === "lent" || kind === "borrowed") {
      if (type === TransactionTypeEnum.EXPENSE) {
        setValue("kind", "lent", { shouldDirty: true })
      } else if (type === TransactionTypeEnum.INCOME) {
        setValue("kind", "borrowed", { shouldDirty: true })
      }
    }
  }
  const handleRefundToggle = () => {
    setValue("subtype", isRefund ? null : TransactionSubTypeEnum.REFUND, {
      shouldDirty: true,
    })
  }
  const handleCategorySelect = (id: string) => {
    setValue("categoryId", id, { shouldDirty: true })
    // Clear budget if it no longer matches the new category
    if (budgetId) {
      const valid = budgets.some(
        (b) =>
          b.id === budgetId &&
          (b.categoryIds.length === 0 || b.categoryIds.includes(id)),
      )
      if (!valid) {
        setValue("budgetId", null, { shouldDirty: false })
      }
    }
    // Loan is account-scoped only; a category change never invalidates it.
  }
  const handleCategoryClear = () => {
    setValue("categoryId", null, { shouldDirty: true })
    // Clear budget since it was category-filtered
    if (budgetId) {
      setValue("budgetId", null, { shouldDirty: false })
    }
  }
  const amountErrorKey = errors.amount?.message
  const accountErrorKey = errors.accountId?.message
  const titleErrorKey = errors.title?.message
  const descriptionErrorKey = errors.description?.message
  const amountError = amountErrorKey
    ? t(amountErrorKey as TranslationKey)
    : undefined
  const accountError = accountErrorKey
    ? t(accountErrorKey as TranslationKey)
    : undefined

  return {
    // form primitives
    control,
    watch,
    setValue,
    errors,
    isDirty,
    isSaving,
    isNew,
    submit: handleSubmit(onSubmit),

    // watched fields
    amount,
    accountId,
    toAccountId,
    categoryId,
    date,
    description,
    tagIds,
    goalId,
    budgetId,
    loanId,
    location,
    isRefund,

    // top-tab state machine
    tabLabels,
    tabIcons,
    tabHiddenSlots,
    topTabType,
    onTopTabChange,

    // kind
    kind,
    isLoanKind,
    setKind,
    canEditKind,
    lockedFields,
    isLoanOpeningEntry,

    // derived collections / selections
    selectedAccount,
    selectedToAccount,
    accountGoals,
    accountLoans,
    accountBudgets,
    balanceAtTransaction,
    derivedTransferTitle,

    // errors
    titleErrorKey,
    descriptionErrorKey,
    amountError,
    accountError,

    // modals
    modals,
    setModals,

    // recurring
    recurring,
    setRecurring,
    occurrenceCount,
    isRecurringKind,
    recurringRule,

    // conversion rate
    conversionRate,
    setConversionRate,

    // attachments
    attachmentState,
    setAttachmentState,
    removeAttachment,
    handleSelectFromFiles,
    handleTakePhoto,
    handleSelectMultipleMedia,
    handleSelectSinglePhoto,

    // date picker
    datePicker,
    setDatePicker,
    openDatePicker,
    confirmIosDate,
    handleSetNow,
    datePickerAndroidElement,

    // location
    locationEnabled,
    isCapturingLocation,
    handleLocationConfirm,
    handleClearLocation,

    // handlers
    handleAccountChange,
    handleTransactionTypeChange,
    handleRefundToggle,
    handleCategorySelect,
    handleCategoryClear,
    handleConfirmExit,
    handleCancelPress,
    handleDeleteConfirm,
    handleDeleteLoanConfirm,
    handleRestore,
    handleDestroy,
    handleDestroyConfirm,
    addTag,
    removeTag,
    clearTags,
  }
}
