import { zodResolver } from "@hookform/resolvers/zod"
import { endOfDay } from "date-fns/endOfDay"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useEffect, useReducer, useRef, useState } from "react"
import { type Resolver, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"

import type { IconSvgName } from "~/components/icons"
import {
  deleteTransaction,
  deleteTransfer,
  restoreTransaction,
} from "~/database/services/ledger-service"
import {
  deleteLoanById,
  isLoanOpeningTransaction,
} from "~/database/services/loan-service"
import { destroyTransaction } from "~/database/services/trash-service"
import { useBalanceAtTransaction } from "~/hooks/use-balance-before"
import { useNavigationGuard } from "~/hooks/use-navigation-guard"
import { useRecurringRuleState } from "~/hooks/use-recurring-rule"
import type { TranslationKey } from "~/i18n/config"
import {
  type TransactionFormValues,
  transactionSchema,
} from "~/schemas/transactions.schema"
import { currencyRegistryService } from "~/services/currency-registry"
import { useTransactionLocationStore } from "~/stores/transaction-location.store"
import { NewEnum } from "~/types/new"
import {
  type TransactionItem,
  type TransactionKind,
  TransactionSubTypeEnum,
  TransactionTypeEnum,
} from "~/types/transactions"
import { logger } from "~/utils/logger"
import { rescaleMinorUnits } from "~/utils/money"
import { countOccurrencesBetween, parseRecurrence } from "~/utils/recurrence"
import { Toast } from "~/utils/toast"

import { EMPTY_ITEMS, EMPTY_TAG_IDS } from "./constants"
import {
  getDefaultValues,
  itemsTotal,
  mergeReducer,
  parseFormLocation,
} from "./form-utils"
import { KIND_ICONS } from "./kind-info"
import { onKindChange } from "./on-kind-change"
import { saveTransaction } from "./save-transaction"
import type {
  OverlayState,
  RecurringState,
  TransactionFormProps,
} from "./types"
import { useFormAttachments } from "./use-form-attachments"
import { useFormConversionRate } from "./use-form-conversion-rate"
import { useFormDatePicker } from "./use-form-date-picker"
import { useFormLocation } from "./use-form-location"

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
}: TransactionFormProps) {
  const router = useRouter()
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { id, billParticipantId } = useLocalSearchParams<{
    id: string
    /** Set when the bill splitter opened this form for a participant. */
    billParticipantId?: string
  }>()
  const isNew = id === NewEnum.NEW
  const locationEnabled = useTransactionLocationStore((s) => s.isEnabled)
  const autoAttach = useTransactionLocationStore((s) => s.autoAttach)
  const usdCurrency = currencyRegistryService.getCurrencyByCode("USD")
  const usdCode = usdCurrency?.code ?? "USD"
  const [overlays, setOverlays] = useReducer(mergeReducer<OverlayState>, {
    unsavedSheetVisible: false,
    editRecurringSheetVisible: false,
    deleteRecurringSheetVisible: false,
    deleteLoanSheetVisible: false,
    destroySheetVisible: false,
    notesModalVisible: false,
    locationPickerVisible: false,
    pendingEditPayload: null,
  })
  const { rule: recurringRule, loading: recurringRuleLoading } =
    useRecurringRuleState(transaction?.recurringId ?? null)
  const defaultValues = getDefaultValues(
    transaction,
    transactionType,
    initialTagIds,
    prefill,
    initialKind,
  )
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isDirty },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema) as Resolver<TransactionFormValues>,
    defaultValues,
  })
  // Recurring toggle states
  const amount = useWatch({ control, name: "amount" })
  const accountId = useWatch({ control, name: "accountId" })
  const toAccountId = useWatch({ control, name: "toAccountId" })
  const categoryId = useWatch({ control, name: "categoryId" })
  const date = useWatch({ control, name: "transactionDate" })
  const description = useWatch({ control, name: "description" })
  const tagIds = useWatch({ control, name: "tags" })
  const items = useWatch({ control, name: "items" }) ?? EMPTY_ITEMS
  const goalId = useWatch({ control, name: "goalId" })
  const budgetId = useWatch({ control, name: "budgetId" })
  const loanId = useWatch({ control, name: "loanId" })
  const locationString = useWatch({ control, name: "location" })
  const location = parseFormLocation(locationString)
  const subtype = useWatch({ control, name: "subtype" })
  const isRefund = subtype === TransactionSubTypeEnum.REFUND
  const watchedKind = useWatch({ control, name: "kind" })
  const kind = (watchedKind ?? "default") as TransactionKind
  const topTabType = useWatch({ control, name: "type" })
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
        : // An existing row that is not a transfer cannot become one: the
          // service refuses it and the other leg would be orphaned.
          !isNew &&
            transaction &&
            transaction.type !== TransactionTypeEnum.TRANSFER
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
  // Closed (fully repaid) loans can't take another repayment, so they are not
  // offered — except the one this transaction is already linked to.
  const accountLoans = accountId
    ? loans.filter(
        (l) => l.accountId === accountId && (!l.isClosed || l.id === loanId),
      )
    : []
  // Filter budgets by selected account AND category
  const accountBudgets = accountId
    ? budgets.filter(
        (b) =>
          b.accountIds.includes(accountId) &&
          categoryId &&
          b.categoryIds.includes(categoryId),
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
          getValues("amount") ?? 0,
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
  // State lags a render, so two quick taps both pass an `isSaving` check.
  const submitLatch = useRef(false)
  const isLoanKind = kind === "lent" || kind === "borrowed"
  // A new loan has no due date until the user picks one.
  const [hasLoanDueDate, setHasLoanDueDate] = useState(false)
  const [recurring, setRecurring] = useReducer(mergeReducer<RecurringState>, {
    recurrence: { interval: 1, unit: "month" },
    until: null,
    startDate: date,
  })
  // §3.4b: a cadence-only edit never touched react-hook-form, so Save stayed
  // disabled. The seeding effect stores the rule baseline in `seededCadence`;
  // diff the card against it and treat a change as dirty.
  const [seededCadence, setSeededCadence] = useState<RecurringState | null>(
    null,
  )
  const isCadenceDirty =
    seededCadence !== null &&
    (recurring.recurrence.interval !== seededCadence.recurrence.interval ||
      recurring.recurrence.unit !== seededCadence.recurrence.unit ||
      (recurring.until?.getTime() ?? null) !==
        (seededCadence.until?.getTime() ?? null))
  const hasUnsavedChanges = isDirty || isCadenceDirty
  const { allowNavigation } = useNavigationGuard({
    navigation,
    when: hasUnsavedChanges && !isSaving,
    onBlock: () => setOverlays({ unsavedSheetVisible: true }),
  })
  const { conversionRate, isConversionRateLoading, setConversionRate } =
    useFormConversionRate(
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
    discardAddedAttachments,
    clearAttachments,
    handleSelectFromFiles,
    handleTakePhoto,
    handleSelectMultipleMedia,
    handleSelectSinglePhoto,
  } = useFormAttachments(transaction, setValue)
  const {
    datePicker,
    setDatePicker,
    openDatePicker,
    confirmIosDate,
    handleSetNow,
    pickerElement: datePickerAndroidElement,
  } = useFormDatePicker(recurring, setRecurring, getValues, setValue)
  const { isCapturingLocation, handleLocationConfirm, handleClearLocation } =
    useFormLocation(isNew, locationEnabled, autoAttach, setValue, () =>
      setOverlays({ locationPickerVisible: false }),
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
  // A new rule keeps only the fields its template holds; goal, budget, loan
  // link, attachments and location belong to single transactions.
  const isNewRecurringRule = isNew && isRecurringKind
  const occurrenceCount = recurring.until
    ? countOccurrencesBetween(
        recurring.startDate,
        endOfDay(recurring.until),
        recurring.recurrence,
      )
    : null

  // RS-1: a new subscription/repetitive starts at the form's transactionDate
  // (`new Date()` at open, editable through the Date field).
  useEffect(() => {
    if (isNew && isRecurringKind && recurring.startDate !== date) {
      setRecurring({ startDate: date })
    }
  }, [isNew, isRecurringKind, date, recurring.startDate])
  // ES-8: seed the recurrence card from the stored rule exactly once when
  // editing a rule-linked instance. After this the user's card edits win.
  useEffect(() => {
    if (seededCadence) return
    if (!transaction?.recurringId || !recurringRule) return
    const to = recurringRule.range.to
    const seeded: RecurringState = {
      recurrence: parseRecurrence(recurringRule.rules[0] ?? ""),
      until: to >= new Date(2099, 0, 1).getTime() ? null : new Date(to),
      startDate: new Date(recurringRule.range.from), // RS-2 anchor
    }
    setSeededCadence(seeded)
    setRecurring(seeded)
  }, [transaction?.recurringId, recurringRule, seededCadence])
  // ES-4/5/8: kind is locked once a transaction is tied to a loan or a
  // recurring rule (recurrence editing lands in Slice 2, loan wiring in Slice 4).
  const canEditKind =
    isNew || (transaction?.loanId == null && transaction?.recurringId == null)
  const lockedFields: ReadonlySet<string> = new Set<string>(
    transaction?.loanId
      ? ["kind", "type", "accountId", "loanId", "toAccountId"]
      : [],
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
    // A new recurring rule cannot carry attachments (the rule template has no
    // place for them), and its form hides the section. Drop what was already
    // added so a hidden file is never saved or left behind.
    if (
      isNew &&
      (next === "subscription" || next === "repetitive") &&
      attachmentState.list.length > 0
    ) {
      clearAttachments()
      Toast.warn({
        title: t(
          "components.transactionForm.toast.attachmentsDroppedRecurring",
        ),
      })
    }
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
    // Leaving without a save (after a save the added list is already empty).
    discardAddedAttachments()
    allowNavigation()
    router.back()
  }
  // The edit-scope sheet saved the row: drop the files the user removed.
  const handleRecurringSaved = () => {
    flushRemovedAttachments()
    handleConfirmExit()
  }
  const onSubmit = async (data: TransactionFormValues) => {
    // Until the rule loads, a recurring row would save as a plain update.
    if (submitLatch.current || recurringRuleLoading) return
    submitLatch.current = true
    setIsSaving(true)
    // Promise methods, not try/finally, which React Compiler cannot compile.
    await saveTransaction(data, {
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
      attachments: attachmentState.list,
      hasLoanDueDate,
      billParticipantId,
      setOverlays,
      flushRemovedAttachments,
      allowNavigation,
    })
      .catch((error) => {
        logger.error("Failed to save transaction", {
          message: error instanceof Error ? error.message : String(error),
        })
        Toast.error({ title: t("components.transactionForm.toast.saveFailed") })
      })
      .finally(() => {
        submitLatch.current = false
        setIsSaving(false)
      })
  }
  const handleCancelPress = () => {
    if (hasUnsavedChanges) {
      setOverlays({ unsavedSheetVisible: true })
    } else {
      allowNavigation()
      router.back()
    }
  }
  const handleDeleteConfirm = () => {
    if (!transaction || recurringRuleLoading) return
    if (isLoanOpeningEntry) {
      setOverlays({ deleteLoanSheetVisible: true })
      return
    }
    if (transaction.recurringId && recurringRule) {
      setOverlays({ deleteRecurringSheetVisible: true })
      return
    }
    const promise =
      transaction.isTransfer && transaction.transferId
        ? deleteTransfer(transaction.id)
        : deleteTransaction(transaction.id)
    promise
      .then(() => {
        const trashedId = transaction.id
        Toast.success({
          title: t("components.transactionForm.toast.movedToTrash"),
          action: {
            label: t("common.actions.undo"),
            onPress: () => {
              restoreTransaction(trashedId).catch((error) => {
                logger.error("Failed to undo delete", { error })
                Toast.error({
                  title: t("components.transactionItem.failedToRestore"),
                })
              })
            },
          },
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
    setOverlays({ deleteLoanSheetVisible: false })
    try {
      await deleteLoanById(transaction.loanId)
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
    setOverlays({ destroySheetVisible: true })
  }
  const handleDestroyConfirm = async () => {
    if (!transaction) return
    setOverlays({ destroySheetVisible: false })
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
  const setTags = (ids: string[]) =>
    setValue("tags", ids, { shouldDirty: true })
  // The items' sum fills the amount; the user can still change it after.
  const setItems = (next: TransactionItem[]) => {
    setValue("items", next, { shouldDirty: true })
    if (next.length > 0)
      setValue("amount", itemsTotal(next), { shouldDirty: true })
  }
  const removeTag = (tagId: string) => {
    setValue(
      "tags",
      (tagIds ?? []).filter((id) => id !== tagId),
      { shouldDirty: true },
    )
  }
  const handleTransactionTypeChange = (type: TransactionFormValues["type"]) => {
    // Expense and income categories are disjoint, so a kept selection would
    // save the row under a category the user can no longer see.
    if (type !== getValues("type")) {
      setValue("categoryId", null, { shouldDirty: true })
      setValue("budgetId", null, { shouldDirty: true })
    }
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
        (b) => b.id === budgetId && b.categoryIds.includes(id),
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
  const toAccountErrorKey = errors.toAccountId?.message
  const toAccountError = toAccountErrorKey
    ? t(toAccountErrorKey as TranslationKey)
    : undefined

  return {
    // form primitives
    control,
    setValue,
    errors,
    isDirty,
    hasUnsavedChanges,
    isSaving: isSaving || recurringRuleLoading,
    isNew,
    // Built on press: `handleSubmit` reads the submit latch through `onSubmit`.
    submit: () => handleSubmit(onSubmit)(),

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
    hasLoanDueDate,
    setHasLoanDueDate,
    setKind,
    canEditKind,
    lockedFields,
    isLoanOpeningEntry,
    linkedLoan: loanForTransaction,

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
    toAccountError,

    // overlays
    overlays,
    setOverlays,

    // recurring
    recurring,
    setRecurring,
    occurrenceCount,
    isRecurringKind,
    isNewRecurringRule,
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
    allowNavigation,
    handleConfirmExit,
    handleRecurringSaved,
    handleCancelPress,
    handleDeleteConfirm,
    handleDeleteLoanConfirm,
    handleRestore,
    handleDestroy,
    handleDestroyConfirm,
    setTags,
    items,
    setItems,
    removeTag,
  }
}
