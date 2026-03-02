/**
 * Transaction form v3 — Minimal page: account & category same pattern as tags.
 * - Amount: tap opens calculator sheet
 * - Account: dashed trigger → inline list with search; select closes
 * - Category: dashed trigger → inline list with search; select closes
 * - Tags: chips + inline dropdown with search (unchanged)
 * - Notes: expandable text area
 * Account/category each keep their own styles (card/cell), not chips.
 */

import { zodResolver } from "@hookform/resolvers/zod"
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker"
import * as DocumentPicker from "expo-document-picker"
import * as ImagePicker from "expo-image-picker"
import * as Location from "expo-location"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Controller, type Resolver, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Modal, Platform, ScrollView, useWindowDimensions } from "react-native"
import { EnrichedTextInput } from "react-native-enriched"
import { useUnistyles } from "react-native-unistyles"

import { ConfirmModal } from "~/components/confirm-modal"
import { DynamicIcon } from "~/components/dynamic-icon"
import { Money } from "~/components/money"
import { SmartAmountInput } from "~/components/smart-amount-input"
import { AttachmentPreviewModal } from "~/components/transaction/attachment-preview-modal"
import { DeleteRecurringModal } from "~/components/transaction/delete-recurring-modal"
import {
  EditRecurringModal,
  type RecurringEditPayload,
} from "~/components/transaction/edit-recurring-modal"
import { LocationPickerModal } from "~/components/transaction/location-picker-modal"
import { NotesModal } from "~/components/transaction/notes-modal"
import { TransactionTypeSelector } from "~/components/transaction/transaction-type-selector"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Button } from "~/components/ui/button"
import { IconSymbol } from "~/components/ui/icon-symbol"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { ScrollIntoViewProvider } from "~/contexts/scroll-into-view-context"
import { createRecurringRule } from "~/database/services/recurring-transaction-service"
import {
  createTransactionModel,
  deleteTransactionModel,
  destroyTransactionModel,
  restoreTransactionModel,
  updateTransactionModel,
} from "~/database/services/transaction-service"
import {
  createTransfer,
  deleteTransfer,
  editTransfer,
  getConversionRateForTransaction,
} from "~/database/services/transfer-service"
import { useBalanceAtTransaction } from "~/hooks/use-balance-before"
import { useNavigationGuard } from "~/hooks/use-navigation-guard"
import { useRecurringRule } from "~/hooks/use-recurring-rule"
import type { TranslationKey } from "~/i18n/config"
import {
  type TransactionFormValues,
  transactionSchema,
} from "~/schemas/transactions.schema"
import { exchangeRatesService } from "~/services"
import { useExchangeRatesPreferencesStore } from "~/stores/exchange-rates-preferences.store"
import { usePendingTransactionsStore } from "~/stores/pending-transactions.store"
import { useTransactionLocationStore } from "~/stores/transaction-location.store"
import { getThemeStrict } from "~/styles/theme/registry"
import { NewEnum } from "~/types/new"
import type {
  RecurringEndType,
  RecurringFrequency,
  TransactionAttachment,
  TransactionLocation,
} from "~/types/transactions"
import {
  getFileExtension,
  getFileIconForExtension,
  isImageExtension,
} from "~/utils/file-icon"
import { formatFileSize } from "~/utils/format-file-size"
import { logger } from "~/utils/logger"
import { openFileInExternalApp } from "~/utils/open-file"
import { startOfNextMinute } from "~/utils/pending-transactions"
import { buildRRuleString, countOccurrencesBetween } from "~/utils/recurrence"
import { formatCreatedAt } from "~/utils/time-utils"
import { Toast } from "~/utils/toast"

import { EMPTY_TAG_IDS, RECURRING_OPTIONS } from "./constants"
import { CATEGORY_CELL_SIZE, CATEGORY_GAP, H_PAD, styles } from "./form.styles"
import { FormAccountPicker } from "./form-account-picker"
import { FormLocationPicker } from "./form-location-picker"
import { FormTagsPicker } from "./form-tags-picker"
import { FormToAccountPicker } from "./form-to-account-picker"
import {
  getDefaultValues,
  getFieldError,
  getRecurrenceDisplayLabel,
} from "./form-utils"
import type { DatePickerTarget, TransactionFormV3Props } from "./types"

export function TransactionFormV3({
  transaction,
  accounts,
  categories,
  tags,
  transactionType,
  onTransactionTypeChange,
  initialTagIds = EMPTY_TAG_IDS,
}: TransactionFormV3Props) {
  const router = useRouter()
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { width: windowWidth } = useWindowDimensions()
  const { theme } = useUnistyles()
  const { id } = useLocalSearchParams<{ id: string }>()
  const isNew = id === NewEnum.NEW
  const requireConfirmation = usePendingTransactionsStore(
    (s) => s.requireConfirmation,
  )
  const { isEnabled: locationEnabled, autoAttach } =
    useTransactionLocationStore()

  const [unsavedModalVisible, setUnsavedModalVisible] = useState(false)
  const [editRecurringModalVisible, setEditRecurringModalVisible] =
    useState(false)
  const [deleteRecurringModalVisible, setDeleteRecurringModalVisible] =
    useState(false)
  const [pendingEditPayload, setPendingEditPayload] =
    useState<RecurringEditPayload | null>(null)

  const recurringRule = useRecurringRule(transaction?.recurringId ?? null)
  const [destroyModalVisible, setDestroyModalVisible] = useState(false)

  const defaultValues = useMemo(
    () =>
      getDefaultValues(transaction, accounts, transactionType, initialTagIds),
    [transaction?.id, transaction, accounts, transactionType, initialTagIds],
  )

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema) as Resolver<TransactionFormValues>,
    defaultValues,
  })

  useLayoutEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const handleGoBack = useCallback(() => {
    router.back()
  }, [router])

  const amount = watch("amount")
  const accountId = watch("accountId")
  const toAccountId = watch("toAccountId")
  const categoryId = watch("categoryId")
  const date = watch("transactionDate")
  const description = watch("description")
  const tagIds = watch("tags")
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
  const [isCapturingLocation, setIsCapturingLocation] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const { allowNavigation } = useNavigationGuard({
    navigation,
    when: isDirty && !isSaving,
    onConfirm: handleGoBack,
    onBlock: () => setUnsavedModalVisible(true),
  })
  const [notesModalVisible, setNotesModalVisible] = useState(false)
  const [locationPickerVisible, setLocationPickerVisible] = useState(false)
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [datePickerMode, setDatePickerMode] = useState<"date" | "time">("date")
  const [tempDate, setTempDate] = useState(date)
  const [conversionRate, setConversionRate] = useState<number | null>(null)
  const [conversionRateOpen, setConversionRateOpen] = useState(false)
  const accountSelectionInitialMount = useRef(true)

  const [recurringFrequency, setRecurringFrequency] =
    useState<RecurringFrequency>("daily")
  const [recurringEnabled, setRecurringEnabled] = useState(false)
  const [recurringStartDate, setRecurringStartDate] = useState<Date>(
    () => new Date(),
  )
  const [recurringEndDate, setRecurringEndDate] = useState<Date | null>(null)
  const [recurringEndAfterOccurrences, setRecurringEndAfterOccurrences] =
    useState<number | null>(null)
  const [endsOnPickerExpanded, setEndsOnPickerExpanded] = useState(false)
  const [addFilesExpanded, setAddFilesExpanded] = useState(false)
  const [previewAttachment, setPreviewAttachment] =
    useState<TransactionAttachment | null>(null)
  const [fileToOpen, setFileToOpen] = useState<TransactionAttachment | null>(
    null,
  )
  const [attachmentToRemove, setAttachmentToRemove] =
    useState<TransactionAttachment | null>(null)
  const [attachments, setAttachments] = useState<TransactionAttachment[]>(
    () => {
      if (!transaction?.extra?.attachments) return []
      try {
        const parsed = JSON.parse(transaction.extra.attachments) as unknown
        if (!Array.isArray(parsed)) return []
        return parsed.map(
          (a: {
            uri: string
            name: string
            size: number
            addedAt: string
            ext: string
          }) => ({
            ...a,
            addedAt: new Date(a.addedAt),
          }),
        )
      } catch {
        return []
      }
    },
  )

  const datePickerTargetRef = useRef<DatePickerTarget>("transaction")

  const endsOnType: RecurringEndType =
    recurringEndAfterOccurrences !== null
      ? "occurrences"
      : recurringEndDate !== null
        ? "date"
        : "never"

  const recurringEndDateOccurrenceCount = useMemo(() => {
    if (endsOnType !== "date" || !recurringEndDate || !recurringFrequency)
      return null
    return countOccurrencesBetween(
      recurringStartDate,
      recurringEndDate,
      recurringFrequency,
    )
  }, [endsOnType, recurringEndDate, recurringFrequency, recurringStartDate])

  const ENDS_ON_OCCURRENCE_PRESETS = [2, 4, 6, 8, 10, 12, 14]

  const handleRecurringToggle = useCallback(
    (next: boolean) => {
      setRecurringEnabled(next)
      if (next) {
        setRecurringStartDate(watch("transactionDate"))
      }
    },
    [watch],
  )

  const selectedAccount = accounts.find((a) => a.id === accountId)
  const selectedToAccount =
    transactionType === "transfer" && toAccountId
      ? accounts.find((a) => a.id === toAccountId)
      : null

  const balanceAtTransaction = useBalanceAtTransaction(transaction)

  // Default transfer title: "From [From account] to [To account]" when both are selected
  const title = watch("title")
  useLayoutEffect(() => {
    if (
      transactionType !== "transfer" ||
      !selectedAccount ||
      !selectedToAccount ||
      !isNew
    )
      return
    const derivedTitle = `From ${selectedAccount.name} to ${selectedToAccount.name}`
    if (title === "" || title === "Transfer" || title === derivedTitle) {
      setValue("title", derivedTitle, { shouldDirty: false })
    }
  }, [
    transactionType,
    isNew,
    selectedAccount,
    selectedToAccount,
    title,
    setValue,
  ])

  // Load saved conversion rate when editing a transfer (from transfers table or legacy extra)
  useEffect(() => {
    if (!transaction || transactionType !== "transfer") return
    let cancelled = false
    getConversionRateForTransaction(transaction).then((rate) => {
      if (!cancelled && rate != null) setConversionRate(rate)
    })
    return () => {
      cancelled = true
    }
  }, [transaction?.id, transactionType, transaction])

  // Clear conversion rate when user changes from/to account so we refetch
  useEffect(() => {
    if (transactionType !== "transfer") return
    if (accountSelectionInitialMount.current) {
      accountSelectionInitialMount.current = false
      return
    }
    setConversionRate(null)
  }, [transactionType])

  const conversionRatePairRef = useRef<{
    from: string
    to: string
  } | null>(null)

  // When the currency pair (from/to) changes, clear rate so we refetch for the new pair
  useEffect(() => {
    if (
      transactionType !== "transfer" ||
      !selectedAccount ||
      !selectedToAccount
    )
      return
    const fromCurrency = selectedAccount.currencyCode
    const toCurrency = selectedToAccount.currencyCode
    if (fromCurrency === toCurrency) return
    const prev = conversionRatePairRef.current
    conversionRatePairRef.current = { from: fromCurrency, to: toCurrency }
    if (prev && (prev.from !== fromCurrency || prev.to !== toCurrency)) {
      setConversionRate(null)
    }
  }, [
    transactionType,
    selectedAccount?.id,
    selectedToAccount?.id,
    selectedAccount?.currencyCode,
    selectedToAccount?.currencyCode,
    selectedAccount,
    selectedToAccount,
  ])

  // Fetch conversion rate when transfer has different currencies (rate is null or pair changed)
  const getCustomRate = useExchangeRatesPreferencesStore((s) => s.getCustomRate)
  useEffect(() => {
    if (
      transactionType !== "transfer" ||
      !selectedAccount ||
      !selectedToAccount ||
      conversionRate !== null
    )
      return
    const fromCurrency = selectedAccount.currencyCode
    const toCurrency = selectedToAccount.currencyCode
    if (fromCurrency === toCurrency) return

    let cancelled = false
    const resolve = async () => {
      // Custom rates are stored as "amount per 1 USD". So 1 USD = getCustomRate(X) of X.
      // We need: rate = toCurrency per 1 fromCurrency (same as Flutter: creditAmount = amount * conversionRate).
      const fromUpper = fromCurrency.toUpperCase()
      const toUpper = toCurrency.toUpperCase()
      const fromPerUsd = getCustomRate(fromCurrency)
      const toPerUsd = getCustomRate(toCurrency)

      let custom: number | undefined
      if (fromUpper === "USD") {
        custom = toPerUsd
      } else if (toUpper === "USD") {
        custom =
          fromPerUsd != null && fromPerUsd !== 0 ? 1 / fromPerUsd : undefined
      } else if (fromPerUsd != null && toPerUsd != null && fromPerUsd !== 0) {
        // Pivot through USD: (1/fromPerUsd) = USD per 1 from; × toPerUsd = to per 1 from
        custom = toPerUsd / fromPerUsd
      } else if (fromPerUsd != null || toPerUsd != null) {
        logger.warn(
          "Custom rate only set for one side of the pair; falling back to API",
          { fromCurrency, toCurrency },
        )
      }

      if (cancelled) return
      if (custom !== undefined) {
        setConversionRate(custom)
        return
      }
      const rate = await exchangeRatesService.getRate(fromCurrency, toCurrency)
      if (!cancelled && rate != null) setConversionRate(rate)
    }
    resolve()
    return () => {
      cancelled = true
    }
  }, [
    transactionType,
    selectedAccount?.id,
    selectedToAccount?.id,
    selectedAccount?.currencyCode,
    selectedToAccount?.currencyCode,
    conversionRate,
    getCustomRate,
    selectedAccount,
    selectedToAccount,
  ])

  const openDatePicker = useCallback(
    (target: DatePickerTarget = "transaction") => {
      datePickerTargetRef.current = target
      const current =
        target === "recurringStart"
          ? recurringStartDate
          : target === "recurringEnd"
            ? (recurringEndDate ?? new Date())
            : watch("transactionDate")
      setTempDate(current)
      if (Platform.OS === "android") {
        DateTimePickerAndroid.open({
          value: current,
          mode: "date",
          display: "calendar",
          onChange: (_evt, selectedDate) => {
            if (selectedDate && _evt.type === "set") {
              setTempDate(selectedDate)
              DateTimePickerAndroid.open({
                value: selectedDate,
                mode: "time",
                display: "spinner",
                onChange: (evt, timeDate) => {
                  if (timeDate && evt.type === "set") {
                    const t = datePickerTargetRef.current
                    if (t === "recurringStart") setRecurringStartDate(timeDate)
                    else if (t === "recurringEnd") setRecurringEndDate(timeDate)
                    else {
                      setValue("transactionDate", timeDate, {
                        shouldDirty: true,
                      })
                      setValue(
                        "isPending",
                        timeDate.getTime() > startOfNextMinute().getTime(),
                        { shouldDirty: true },
                      )
                    }
                  }
                },
              })
            }
          },
        })
      } else {
        setDatePickerMode("date")
        setDatePickerVisible(true)
      }
    },
    [watch, setValue, recurringStartDate, recurringEndDate],
  )

  const handleIosDateChange = useCallback(
    (_evt: DateTimePickerEvent, selectedDate?: Date) => {
      if (selectedDate) setTempDate(selectedDate)
    },
    [],
  )

  const confirmIosDate = useCallback(() => {
    if (datePickerMode === "time") {
      const t = datePickerTargetRef.current
      if (t === "recurringStart") setRecurringStartDate(tempDate)
      else if (t === "recurringEnd") setRecurringEndDate(tempDate)
      else {
        setValue("transactionDate", tempDate, { shouldDirty: true })
        setValue(
          "isPending",
          tempDate.getTime() > startOfNextMinute().getTime(),
          { shouldDirty: true },
        )
      }
      setDatePickerVisible(false)
    } else {
      setDatePickerMode("time")
    }
  }, [datePickerMode, tempDate, setValue])

  const onSubmit = async (data: TransactionFormValues) => {
    if (isSaving) return
    setIsSaving(true)
    try {
      // ─── Transfer: create or edit both legs via transfer service ─────────
      if (data.type === "transfer") {
        const fromId = data.accountId
        const toId = data.toAccountId ?? ""
        if (!toId) {
          Toast.error({
            title: t("components.transactionForm.toast.selectDestination"),
          })
          setIsSaving(false)
          return
        }
        if (fromId === toId) {
          Toast.error({
            title: t("components.transactionForm.toast.fromToDifferent"),
          })
          setIsSaving(false)
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
                  ? "Rate is still loading, please wait"
                  : "Please set the converted amount for different currencies",
            })
            setIsSaving(false)
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
          title: data.title?.trim() || "Transfer",
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
          await editTransfer(transaction, {
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

      // Build extra: on edit merge with existing so we don't wipe other keys
      const builtExtra: Record<string, string> = isNew
        ? {}
        : { ...(transaction?.extra ?? {}) }
      if (attachments.length > 0) {
        builtExtra.attachments = JSON.stringify(attachments)
      } else {
        delete builtExtra.attachments
      }

      // When recurring is on we only create the rule (Bug #1 fix); no transaction here.
      const effectiveDate = recurringEnabled
        ? recurringStartDate
        : data.transactionDate
      const isFuture = effectiveDate.getTime() > Date.now()
      // For non-recurring: derive pending from form (no forced true when recurring).
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
        currency: selectedAccount?.currencyCode ?? "USD",
        type: data.type,
        transactionDate: effectiveDate,
        categoryId: data.categoryId ?? null,
        accountId: data.accountId,
        title: data.title?.trim() || "Untitled Transaction",
        description: data.description?.trim() ?? undefined,
        isPending: effectiveIsPending,
        requiresManualConfirmation,
        tags: data.tags ?? [],
        location: data.location,
        extra: Object.keys(builtExtra).length > 0 ? builtExtra : undefined,
        subtype: transaction?.subtype ?? undefined,
      }
      if (isNew) {
        if (recurringEnabled && recurringFrequency) {
          // Bug #1 fix: only create the rule; scheduler generates all instances (including first)
          try {
            const rruleStr = buildRRuleString({
              frequency: recurringFrequency,
              startDate: recurringStartDate,
              endDate: recurringEndDate,
              count: recurringEndAfterOccurrences,
            })
            const rangeEnd =
              recurringEndDate?.getTime() ?? new Date(2099, 11, 31).getTime()
            await createRecurringRule({
              amount: data.amount,
              type: data.type,
              accountId: data.accountId,
              categoryId: data.categoryId ?? null,
              title: data.title?.trim() || "Untitled Transaction",
              description: data.description?.trim() ?? undefined,
              subtype: transaction?.subtype ?? undefined,
              tags: data.tags ?? [],
              range: {
                from: recurringStartDate.getTime(),
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
            setIsSaving(false)
            return
          }
        } else {
          await createTransactionModel(payload)
          Toast.success({
            title: t("components.transactionForm.toast.transactionCreated"),
          })
        }
      } else if (transaction) {
        if (transaction.recurringId && recurringRule) {
          setPendingEditPayload({
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
          })
          setEditRecurringModalVisible(true)
          setIsSaving(false)
          return
        }
        await updateTransactionModel(transaction, payload)
        Toast.success({
          title: t("components.transactionForm.toast.transactionUpdated"),
        })
      }
      allowNavigation()
      router.back()
    } catch (error) {
      logger.error("Failed to save transaction", {
        message: error instanceof Error ? error.message : String(error),
      })
      Toast.error({ title: t("components.transactionForm.toast.saveFailed") })
    }
    setIsSaving(false)
  }

  const handleCancelPress = useCallback(() => {
    if (isDirty) {
      setUnsavedModalVisible(true)
    } else {
      allowNavigation()
      handleGoBack()
    }
  }, [isDirty, handleGoBack, allowNavigation])

  const handleDeleteConfirm = useCallback(() => {
    if (!transaction) return
    if (transaction.recurringId && recurringRule) {
      setDeleteRecurringModalVisible(true)
      return
    }
    const promise =
      transaction.isTransfer && transaction.transferId
        ? deleteTransfer(transaction)
        : deleteTransactionModel(transaction)
    promise
      .then(() => {
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
  }, [transaction, recurringRule, router, allowNavigation, t])

  const handleRestore = useCallback(async () => {
    if (!transaction?.isDeleted) return
    try {
      await restoreTransactionModel(transaction)
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
  }, [transaction, router, allowNavigation, t])

  const handleDestroy = useCallback(() => {
    if (!transaction) return
    setDestroyModalVisible(true)
  }, [transaction])

  const handleDestroyConfirm = useCallback(async () => {
    if (!transaction) return
    setDestroyModalVisible(false)
    try {
      await destroyTransactionModel(transaction)
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
  }, [transaction, router, allowNavigation, t])

  const addTag = useCallback(
    (tagId: string) => {
      const current = tagIds ?? []
      if (current.includes(tagId)) return
      setValue("tags", [...current, tagId], { shouldDirty: true })
    },
    [tagIds, setValue],
  )

  const removeTag = useCallback(
    (tagId: string) => {
      setValue(
        "tags",
        (tagIds ?? []).filter((id) => id !== tagId),
        { shouldDirty: true },
      )
    },
    [tagIds, setValue],
  )

  const addAttachment = useCallback((a: TransactionAttachment) => {
    setAttachments((prev) => [...prev, a])
  }, [])

  const removeAttachment = useCallback((uri: string) => {
    setAttachments((prev) => prev.filter((x) => x.uri !== uri))
  }, [])

  const handleSelectFromFiles = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      })
      if (result.canceled) return
      const file = result.assets[0]
      const ext = getFileExtension(file.name)
      addAttachment({
        uri: file.uri,
        name: file.name,
        size: file.size ?? 0,
        addedAt: new Date(),
        ext,
      })
    } catch (e) {
      logger.error("Document picker error", { e })
      Toast.error({
        title: t("components.transactionForm.toast.couldNotSelectFile"),
      })
    }
  }, [addAttachment, t])

  const handleTakePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== "granted") {
      Toast.error({
        title: "Permission required",
        description: "Camera access is needed to take a photo.",
      })
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    })
    if (result.canceled || !result.assets[0]) return
    const asset = result.assets[0]
    const name = asset.fileName ?? `photo-${Date.now()}.jpg`
    const ext = getFileExtension(name)
    addAttachment({
      uri: asset.uri,
      name,
      size: asset.fileSize ?? 0,
      addedAt: new Date(),
      ext,
    })
  }, [addAttachment])

  const handleSelectMultipleMedia = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Toast.error({
        title: "Permission required",
        description: "Photo library access is needed.",
      })
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      quality: 0.8,
    })
    if (result.canceled || result.assets.length === 0) return
    for (const asset of result.assets) {
      const name =
        asset.fileName ??
        `media-${Date.now()}.${asset.type === "video" ? "mp4" : "jpg"}`
      const ext = getFileExtension(name)
      addAttachment({
        uri: asset.uri,
        name,
        size: asset.fileSize ?? 0,
        addedAt: new Date(),
        ext,
      })
    }
  }, [addAttachment])

  // Auto-attach location on new transaction when preference is enabled
  const hasAutoAttachedRef = useRef(false)
  useEffect(() => {
    if (!isNew || !locationEnabled || !autoAttach || hasAutoAttachedRef.current)
      return
    hasAutoAttachedRef.current = true

    let cancelled = false
    const attach = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync()
        if (status !== Location.PermissionStatus.GRANTED) return
        setIsCapturingLocation(true)
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        })
        if (cancelled) return
        setValue(
          "location",
          JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
          { shouldDirty: true },
        )
      } catch {
        // Silent failure — user can still add location manually
      } finally {
        if (!cancelled) setIsCapturingLocation(false)
      }
    }
    attach()
    return () => {
      cancelled = true
    }
  }, [isNew, locationEnabled, autoAttach, setValue])

  const handleLocationConfirm = useCallback(
    (loc: TransactionLocation) => {
      setValue("location", JSON.stringify(loc), { shouldDirty: true })
      setLocationPickerVisible(false)
    },
    [setValue],
  )

  const handleClearLocation = useCallback(() => {
    setValue("location", undefined, { shouldDirty: true })
  }, [setValue])

  const handleSelectSinglePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Toast.error({
        title: "Permission required",
        description: "Photo library access is needed.",
      })
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: false,
      quality: 0.8,
    })
    if (result.canceled || !result.assets[0]) return
    const asset = result.assets[0]
    const name = asset.fileName ?? `photo-${Date.now()}.jpg`
    const ext = getFileExtension(name)
    addAttachment({
      uri: asset.uri,
      name,
      size: asset.fileSize ?? 0,
      addedAt: new Date(),
      ext,
    })
  }, [addAttachment])

  const amountErrorKey = getFieldError("amount", errors.amount?.message)
  const accountErrorKey = getFieldError("accountId", errors.accountId?.message)
  const titleErrorKey = errors.title?.message
  const descriptionErrorKey = errors.description?.message
  const amountError = amountErrorKey
    ? t(amountErrorKey as TranslationKey)
    : undefined
  const accountError = accountErrorKey
    ? t(accountErrorKey as TranslationKey)
    : undefined

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TransactionTypeSelector
          value={transactionType}
          onChange={(type) => {
            onTransactionTypeChange(type)
            setValue("type", type, { shouldDirty: true })
          }}
        />
      </View>

      <ScrollIntoViewProvider
        contentContainerStyle={styles.content}
        scrollViewProps={{
          keyboardShouldPersistTaps: "handled",
          showsVerticalScrollIndicator: false,
        }}
      >
        <View style={styles.form}>
          <View style={styles.nameSection}>
            <Controller
              control={control}
              name="title"
              render={({ field: { value, onChange } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder={t(
                    "components.transactionForm.fields.titlePlaceholder",
                  )}
                  placeholderTextColor={theme.colors.customColors.semi}
                />
              )}
            />
            {titleErrorKey ? (
              <Text style={styles.fieldError}>
                {t(titleErrorKey as TranslationKey)}
              </Text>
            ) : null}
          </View>

          {/* Amount: smart inline input + optional full calculator */}
          <View style={styles.balanceSection}>
            <SmartAmountInput
              value={amount ?? 0}
              onChange={(value) =>
                setValue("amount", value, { shouldDirty: true })
              }
              currencyCode={selectedAccount?.currencyCode}
              error={amountError}
              label={t("components.transactionForm.fields.amountLabel")}
              placeholder="0"
              type={transactionType}
            />
          </View>

          <FormAccountPicker
            accounts={accounts}
            accountId={accountId}
            toAccountId={toAccountId}
            setValue={setValue}
            selectedAccount={selectedAccount}
            balanceAtTransaction={balanceAtTransaction}
            transaction={transaction}
            accountError={accountError}
            transactionType={transactionType}
          />

          <FormToAccountPicker
            accounts={accounts}
            toAccountId={toAccountId}
            accountId={accountId}
            setValue={setValue}
            selectedToAccount={selectedToAccount}
            transactionType={transactionType}
          />

          {/* Conversion: toggle shows amount = converted amount; inside toggle: rate (chosen/deduced) + SmartAmountInput to edit converted. */}
          {transactionType === "transfer" &&
            selectedAccount &&
            selectedToAccount &&
            selectedAccount.currencyCode !== selectedToAccount.currencyCode && (
              <View style={styles.fieldBlock}>
                <View style={styles.sectionLabelRow}>
                  <Text variant="small" style={styles.sectionLabelInRow}>
                    Conversion
                  </Text>
                </View>
                {(() => {
                  const amountNum =
                    typeof amount === "number"
                      ? amount
                      : Number.parseFloat(String(amount ?? "")) || 0
                  const convertedAmount = (conversionRate ?? 0) * amountNum
                  return (
                    <>
                      {/* Toggle row: amount = converted amount */}
                      <Pressable
                        style={[
                          styles.conversionRateRow,
                          conversionRateOpen &&
                            styles.conversionRateRowSelected,
                        ]}
                        onPress={() => setConversionRateOpen((open) => !open)}
                      >
                        <Money
                          value={amountNum}
                          currency={selectedAccount.currencyCode}
                          style={styles.conversionRateAmount}
                        />
                        <Text style={styles.conversionRateEquals}>=</Text>
                        <Money
                          value={convertedAmount}
                          currency={selectedToAccount.currencyCode}
                          style={styles.conversionRateAmount}
                        />
                      </Pressable>
                      {conversionRateOpen && (
                        <>
                          {/* Inside toggle: chosen / deduced rate (1 from = rate to) */}
                          <View style={styles.conversionRateSummaryRow}>
                            <Text style={styles.conversionRateSummaryLabel}>
                              Rate
                            </Text>
                            <View style={styles.conversionRateSummaryValues}>
                              <Money
                                value={1}
                                currency={selectedAccount.currencyCode}
                                style={styles.conversionRateAmount}
                              />
                              <Text style={styles.conversionRateEquals}>=</Text>
                              <Text style={styles.conversionOutcomeRate}>
                                {(conversionRate ?? 0).toLocaleString(
                                  undefined,
                                  { maximumFractionDigits: 6 },
                                )}{" "}
                                {selectedToAccount.currencyCode}
                              </Text>
                            </View>
                          </View>
                          {/* Formula: amount × rate = converted (read-only) */}
                          <View style={styles.conversionOutcomeRow}>
                            <View style={styles.conversionOutcomeLeft}>
                              <Money
                                value={amountNum}
                                currency={selectedAccount.currencyCode}
                                style={styles.conversionOutcomeAmount}
                              />
                            </View>
                            <Text style={styles.conversionRateEquals}>×</Text>
                            <Text style={styles.conversionOutcomeRate}>
                              {(conversionRate ?? 0).toLocaleString(undefined, {
                                maximumFractionDigits: 6,
                              })}
                            </Text>
                            <Text style={styles.conversionRateEquals}>=</Text>
                            <Money
                              value={convertedAmount}
                              currency={selectedToAccount.currencyCode}
                              style={styles.conversionOutcomeAmount}
                            />
                          </View>
                          {/* SmartAmountInput to change the converted amount (deduces rate on change) */}
                          <View style={styles.conversionInputRow}>
                            <SmartAmountInput
                              value={convertedAmount}
                              onChange={(value) => {
                                if (
                                  amountNum > 0 &&
                                  typeof value === "number"
                                ) {
                                  setConversionRate(value / amountNum)
                                }
                              }}
                              currencyCode={selectedToAccount.currencyCode}
                              label={t(
                                "components.transactionForm.fields.convertedAmountLabel",
                              )}
                              placeholder="0"
                            />
                          </View>
                        </>
                      )}
                    </>
                  )
                })()}
              </View>
            )}

          {/* Category: hidden for transfer (transfers have no category) */}
          {transactionType !== "transfer" && (
            <View style={styles.fieldBlock}>
              <View style={styles.sectionLabelRow}>
                <Text variant="small" style={styles.sectionLabelInRow}>
                  Category
                </Text>
                <Pressable
                  onPress={() =>
                    categoryId &&
                    setValue("categoryId", null, { shouldDirty: true })
                  }
                  style={[
                    styles.clearButton,
                    !categoryId && styles.clearButtonDisabled,
                  ]}
                  pointerEvents={categoryId ? "auto" : "none"}
                  accessibilityLabel={t(
                    "components.transactionForm.a11y.clearCategory",
                  )}
                  accessibilityState={{ disabled: !categoryId }}
                >
                  <Text variant="small" style={styles.clearButtonText}>
                    Clear
                  </Text>
                </Pressable>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScrollContent}
              >
                {categories.length === 0 ? (
                  <View
                    style={[styles.categoryGrid, { width: CATEGORY_CELL_SIZE }]}
                  >
                    <Pressable
                      style={styles.categoryCell}
                      onPress={() => router.push("/settings/categories")}
                      accessible
                      accessibilityRole="button"
                      accessibilityLabel={t(
                        "components.transactionForm.a11y.addCategories",
                      )}
                    >
                      <DynamicIcon
                        icon="plus"
                        size={32}
                        colorScheme={
                          theme?.colors as import("~/styles/theme/types").MintyColorScheme
                        }
                        variant="badge"
                      />
                      <Text
                        variant="small"
                        style={styles.categoryCellLabel}
                        numberOfLines={1}
                      >
                        Add categories
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.categoryGrid,
                      {
                        width: Math.max(
                          windowWidth - H_PAD * 2,
                          Math.ceil(categories.length / 2) *
                            (CATEGORY_CELL_SIZE + CATEGORY_GAP) -
                            CATEGORY_GAP,
                        ),
                      },
                    ]}
                  >
                    {categories.map((category) => {
                      const isSelected = category.id === categoryId
                      return (
                        <Pressable
                          key={category.id}
                          style={[
                            styles.categoryCell,
                            isSelected && styles.categoryCellSelected,
                          ]}
                          onPress={() =>
                            setValue("categoryId", category.id, {
                              shouldDirty: true,
                            })
                          }
                          accessible
                          accessibilityRole="button"
                          accessibilityLabel={t(
                            "components.transactionForm.a11y.selectCategory",
                            {
                              name: category.name,
                            },
                          )}
                          accessibilityState={{ selected: isSelected }}
                        >
                          <DynamicIcon
                            icon={category.icon || "shape"}
                            size={32}
                            colorScheme={getThemeStrict(
                              category.colorSchemeName,
                            )}
                            variant="badge"
                          />
                          <Text
                            variant="small"
                            style={styles.categoryCellLabel}
                            numberOfLines={1}
                          >
                            {category.name}
                          </Text>
                        </Pressable>
                      )
                    })}
                  </View>
                )}
              </ScrollView>
            </View>
          )}

          <FormTagsPicker
            tags={tags}
            tagIds={tagIds}
            setValue={setValue}
            addTag={addTag}
            removeTag={removeTag}
          />

          {/* Transaction date and Pending: hidden when recurring is on (rule controls date and they're always auto-confirmed) */}
          {!recurringEnabled && (
            <>
              <View style={styles.fieldBlock}>
                <View style={styles.sectionLabelRow}>
                  <Text variant="small" style={styles.sectionLabelInRow}>
                    {t("components.transactionForm.fields.transactionDate")}
                  </Text>
                  <Pressable
                    onPress={() => {
                      const now = new Date()
                      setValue("transactionDate", now, { shouldDirty: true })
                      setValue(
                        "isPending",
                        now.getTime() > startOfNextMinute().getTime(),
                        { shouldDirty: true },
                      )
                    }}
                    style={styles.clearButton}
                    accessibilityLabel={t(
                      "components.transactionForm.a11y.setDateTimeNow",
                    )}
                  >
                    <Text variant="small" style={styles.clearButtonText}>
                      Now
                    </Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.inlineDateRow}
                  onPress={() => openDatePicker("transaction")}
                >
                  <DynamicIcon
                    icon="calendar"
                    size={20}
                    color={theme.colors.primary}
                    variant="badge"
                  />
                  <Text variant="default" style={styles.inlineDateText}>
                    {formatCreatedAt(date)}
                  </Text>
                  <IconSymbol
                    name="chevron-right"
                    size={20}
                    style={[
                      styles.chevronIcon,
                      { color: theme.colors.primary },
                    ]}
                  />
                </Pressable>
              </View>

              <Controller
                control={control}
                name="isPending"
                render={({ field: { value, onChange } }) => {
                  const txDate = watch("transactionDate")
                  const isFuture =
                    txDate && txDate.getTime() > startOfNextMinute().getTime()
                  return (
                    <Pressable
                      style={styles.switchRow}
                      onPress={() => !isFuture && onChange(!(value ?? false))}
                      accessibilityRole="switch"
                      accessibilityState={{
                        checked: value ?? false,
                        disabled: isFuture,
                      }}
                    >
                      <View style={styles.switchLeft}>
                        <DynamicIcon
                          icon="clock"
                          size={20}
                          color={theme.colors.primary}
                          variant="badge"
                        />
                        <Text variant="default" style={styles.switchLabel}>
                          Pending
                        </Text>
                      </View>
                      <View pointerEvents="none">
                        <Switch
                          value={value ?? false}
                          onValueChange={onChange}
                          disabled={isFuture}
                        />
                      </View>
                    </Pressable>
                  )
                }}
              />
            </>
          )}

          {/* Notes: pressable opens modal; formatted preview inside the same pressable */}
          <View style={styles.fieldBlock}>
            <Text variant="small" style={styles.sectionLabel}>
              Notes
            </Text>
            <Pressable
              style={styles.notesPressable}
              onPress={() => setNotesModalVisible(true)}
              accessibilityLabel={t("components.transactionForm.fields.notes")}
              accessibilityHint={t(
                "components.transactionForm.a11y.openNotesEditor",
              )}
            >
              <View style={styles.notesHeaderRow}>
                <DynamicIcon
                  icon="clipboard"
                  size={20}
                  color={theme.colors.primary}
                  variant="badge"
                />
                <Text
                  variant="default"
                  style={
                    description?.trim()
                      ? styles.fieldValue
                      : styles.fieldPlaceholder
                  }
                  numberOfLines={1}
                >
                  {description?.trim() ? "Tap to edit notes" : "Add notes..."}
                </Text>
                <IconSymbol
                  name="chevron-right"
                  size={20}
                  style={styles.chevronIcon}
                />
              </View>
              {description?.trim() ? (
                <View style={styles.notesFullPreviewWrap} pointerEvents="none">
                  <EnrichedTextInput
                    key={description}
                    defaultValue={description}
                    editable={false}
                    scrollEnabled={false}
                    style={{
                      color: theme.colors.onSurface,
                      backgroundColor: "transparent",
                      fontSize: 14,
                    }}
                    htmlStyle={{
                      ul: { bulletColor: theme.colors.onSurface },
                      ol: { markerColor: theme.colors.onSurface },
                      ulCheckbox: { boxColor: theme.colors.onSurface },
                    }}
                  />
                </View>
              ) : null}
            </Pressable>
            {descriptionErrorKey ? (
              <Text style={styles.fieldError}>
                {t(descriptionErrorKey as TranslationKey)}
              </Text>
            ) : null}
          </View>

          <NotesModal
            visible={notesModalVisible}
            initialValue={description ?? ""}
            onSave={(html) => {
              setValue("description", html, { shouldDirty: true })
            }}
            onRequestClose={() => setNotesModalVisible(false)}
          />

          {/* File attachments (extra) */}
          <View style={styles.fieldBlock}>
            <Text variant="small" style={styles.sectionLabel}>
              {t("components.transactionForm.fields.fileAttachments")}
            </Text>

            {attachments.length > 0 && (
              <View style={styles.attachmentsList}>
                {attachments.map((a) => (
                  <View key={a.uri} style={styles.attachmentRow}>
                    <Pressable
                      style={styles.attachmentRowMain}
                      onPress={() => {
                        if (isImageExtension(a.ext)) {
                          setPreviewAttachment(a)
                        } else {
                          setFileToOpen(a)
                        }
                      }}
                    >
                      <DynamicIcon
                        icon={getFileIconForExtension(a.ext)}
                        size={24}
                        color={theme.colors.primary}
                        variant="badge"
                      />
                      <View style={styles.attachmentInfo}>
                        <Text
                          variant="default"
                          style={styles.attachmentName}
                          numberOfLines={1}
                        >
                          {a.name}
                        </Text>
                        <Text variant="muted" style={styles.attachmentMeta}>
                          {formatCreatedAt(a.addedAt)} •{" "}
                          {formatFileSize(a.size)}
                        </Text>
                      </View>
                    </Pressable>
                    <Button
                      variant="ghost"
                      size="icon"
                      style={styles.attachmentRemoveBtn}
                      onPress={() => setAttachmentToRemove(a)}
                      accessibilityLabel={t(
                        "components.transactionForm.attachments.a11y.removeAttachment",
                      )}
                      hitSlop={8}
                    >
                      <IconSymbol name="close" size={20} />
                    </Button>
                  </View>
                ))}
              </View>
            )}
            <Pressable
              style={styles.notesHeader}
              onPress={() => setAddFilesExpanded((e) => !e)}
              accessibilityLabel={t(
                "components.transactionForm.attachments.a11y.addFiles",
              )}
              accessibilityHint={
                addFilesExpanded
                  ? t(
                      "components.transactionForm.attachments.a11y.addFilesCollapseHint",
                    )
                  : t(
                      "components.transactionForm.attachments.a11y.addFilesExpandHint",
                    )
              }
            >
              <IconSymbol
                name="plus"
                size={20}
                color={theme.colors.customColors.semi}
              />
              <Text variant="default" style={styles.addFilesLabel}>
                Add files
              </Text>
              <IconSymbol
                name={addFilesExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                style={styles.chevronIcon}
              />
            </Pressable>
            {addFilesExpanded && (
              <View style={styles.addFilesOptionsContainer}>
                <Pressable
                  style={styles.addFilesOptionRow}
                  onPress={handleSelectFromFiles}
                >
                  <DynamicIcon
                    icon="file-document"
                    size={20}
                    color={theme.colors.primary}
                    variant="badge"
                  />
                  <Text variant="default" style={styles.addFilesOptionLabel}>
                    Select from files
                  </Text>
                  <IconSymbol
                    name="chevron-right"
                    size={20}
                    style={styles.chevronIcon}
                  />
                </Pressable>
                <Pressable
                  style={styles.addFilesOptionRow}
                  onPress={handleTakePhoto}
                >
                  <DynamicIcon
                    icon="camera"
                    size={20}
                    color={theme.colors.primary}
                    variant="badge"
                  />
                  <Text variant="default" style={styles.addFilesOptionLabel}>
                    Take a photo
                  </Text>
                  <IconSymbol
                    name="chevron-right"
                    size={20}
                    style={styles.chevronIcon}
                  />
                </Pressable>
                <Pressable
                  style={styles.addFilesOptionRow}
                  onPress={handleSelectMultipleMedia}
                >
                  <DynamicIcon
                    icon="image-multiple"
                    size={20}
                    color={theme.colors.primary}
                    variant="badge"
                  />
                  <Text variant="default" style={styles.addFilesOptionLabel}>
                    Select multiple media
                  </Text>
                  <IconSymbol
                    name="chevron-right"
                    size={20}
                    style={styles.chevronIcon}
                  />
                </Pressable>
                <Pressable
                  style={[
                    styles.addFilesOptionRow,
                    styles.addFilesOptionRowLast,
                  ]}
                  onPress={handleSelectSinglePhoto}
                >
                  <DynamicIcon
                    icon="image"
                    size={20}
                    color={theme.colors.primary}
                    variant="badge"
                  />
                  <Text variant="default" style={styles.addFilesOptionLabel}>
                    Select a photo
                  </Text>
                  <IconSymbol
                    name="chevron-right"
                    size={20}
                    style={styles.chevronIcon}
                  />
                </Pressable>
              </View>
            )}
          </View>

          {/* Recurring */}
          <View style={styles.fieldBlock}>
            <View style={styles.recurringSwitchRow}>
              <View style={styles.switchLeft}>
                <DynamicIcon
                  icon="repeat"
                  size={20}
                  color={theme.colors.primary}
                  variant="badge"
                />
                <Text variant="default" style={styles.switchLabel}>
                  Recurring transaction
                </Text>
              </View>
              <Switch
                value={recurringEnabled}
                onValueChange={handleRecurringToggle}
              />
            </View>

            {recurringEnabled && (
              <View>
                <View style={styles.recurringSubSection}>
                  <Text variant="small" style={styles.recurringSubLabel}>
                    Recurrence
                  </Text>
                  <View style={styles.recurringToggleRow}>
                    {RECURRING_OPTIONS.map((option) => {
                      const isSelected = recurringFrequency === option.id
                      const displayLabel = getRecurrenceDisplayLabel(
                        option.id,
                        recurringStartDate,
                      )
                      return (
                        <Pressable
                          key={option.label}
                          style={[
                            styles.recurringToggleButton,
                            isSelected && styles.recurringToggleButtonSelected,
                          ]}
                          onPress={() => setRecurringFrequency(option.id)}
                          accessibilityRole="button"
                          accessibilityState={{ selected: isSelected }}
                          accessibilityLabel={`${displayLabel}${isSelected ? t("components.transactionForm.a11y.selectedSuffix") : ""}`}
                        >
                          <Text
                            variant="default"
                            style={[
                              styles.recurringToggleLabel,
                              isSelected && styles.recurringToggleLabelSelected,
                            ]}
                            numberOfLines={1}
                          >
                            {displayLabel}
                          </Text>
                        </Pressable>
                      )
                    })}
                  </View>
                </View>

                <View style={styles.recurringSubSection}>
                  <Text variant="small" style={styles.recurringSubLabel}>
                    Starts on
                  </Text>
                  <Pressable
                    style={styles.recurringDateRow}
                    onPress={() => openDatePicker("recurringStart")}
                  >
                    <DynamicIcon
                      icon="calendar"
                      size={20}
                      color={theme.colors.primary}
                      variant="badge"
                    />
                    <Text variant="default" style={styles.inlineDateText}>
                      {formatCreatedAt(recurringStartDate)}
                    </Text>
                    <IconSymbol
                      name="chevron-right"
                      size={20}
                      style={styles.chevronIcon}
                    />
                  </Pressable>
                </View>

                <View style={styles.recurringSubSection}>
                  <Text variant="small" style={styles.recurringSubLabel}>
                    Ends on
                  </Text>
                  <Pressable
                    style={styles.recurringDateRow}
                    onPress={() => setEndsOnPickerExpanded((e) => !e)}
                  >
                    <DynamicIcon
                      icon="calendar"
                      size={20}
                      color={theme.colors.primary}
                      variant="badge"
                    />
                    <Text
                      variant="default"
                      style={[
                        styles.inlineDateText,
                        endsOnType === "never" && styles.fieldPlaceholder,
                      ]}
                    >
                      {endsOnType === "never"
                        ? "Never"
                        : endsOnType === "date" && recurringEndDate
                          ? `${formatCreatedAt(recurringEndDate)}${recurringEndDateOccurrenceCount != null ? ` · ${recurringEndDateOccurrenceCount} time${recurringEndDateOccurrenceCount === 1 ? "" : "s"}` : ""}`
                          : endsOnType === "occurrences" &&
                              recurringEndAfterOccurrences !== null
                            ? `${recurringEndAfterOccurrences} times`
                            : "Never"}
                    </Text>
                    <IconSymbol
                      name={
                        endsOnPickerExpanded ? "chevron-up" : "chevron-right"
                      }
                      size={20}
                      style={styles.chevronIcon}
                    />
                  </Pressable>
                  {endsOnPickerExpanded && (
                    <View style={styles.endsOnPickerContainer}>
                      <Pressable
                        style={styles.endsOnOptionRow}
                        onPress={() => {
                          setRecurringEndDate(null)
                          setRecurringEndAfterOccurrences(null)
                          setEndsOnPickerExpanded(false)
                        }}
                      >
                        <Text
                          variant="default"
                          style={styles.endsOnOptionLabel}
                        >
                          Never
                        </Text>
                        <IconSymbol
                          name="chevron-right"
                          size={20}
                          style={styles.chevronIcon}
                        />
                      </Pressable>
                      <Pressable
                        style={styles.endsOnOptionRow}
                        onPress={() => {
                          setRecurringEndAfterOccurrences(null)
                          setEndsOnPickerExpanded(false)
                          openDatePicker("recurringEnd")
                        }}
                      >
                        <Text
                          variant="default"
                          style={styles.endsOnOptionLabel}
                        >
                          On a date
                        </Text>
                        <IconSymbol
                          name="chevron-right"
                          size={20}
                          style={styles.chevronIcon}
                        />
                      </Pressable>
                      <Pressable
                        style={[
                          styles.endsOnOptionRow,
                          styles.endsOnOptionRowLast,
                        ]}
                        onPress={() => {
                          setRecurringEndDate(null)
                          setRecurringEndAfterOccurrences(
                            recurringEndAfterOccurrences ?? 4,
                          )
                        }}
                      >
                        <Text
                          variant="default"
                          style={styles.endsOnOptionLabel}
                        >
                          Occurrences
                        </Text>
                        <IconSymbol
                          name="chevron-right"
                          size={20}
                          style={styles.chevronIcon}
                        />
                      </Pressable>
                      {recurringEndAfterOccurrences !== null && (
                        <View style={styles.occurrencePresetsRow}>
                          {ENDS_ON_OCCURRENCE_PRESETS.map((n) => (
                            <Pressable
                              key={n}
                              style={[
                                styles.occurrencePresetButton,
                                recurringEndAfterOccurrences === n &&
                                  styles.recurringToggleButtonSelected,
                              ]}
                              onPress={() => {
                                setRecurringEndAfterOccurrences(n)
                              }}
                            >
                              <Text
                                variant="default"
                                style={[
                                  styles.recurringToggleLabel,
                                  recurringEndAfterOccurrences === n &&
                                    styles.recurringToggleLabelSelected,
                                ]}
                              >
                                {n} times
                              </Text>
                            </Pressable>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>

          {locationEnabled && (
            <View style={styles.fieldBlock}>
              <Text variant="small" style={styles.sectionLabel}>
                Location
              </Text>
              <FormLocationPicker
                location={location}
                isCapturingLocation={isCapturingLocation}
                onPress={() => setLocationPickerVisible(true)}
                onClear={handleClearLocation}
              />
            </View>
          )}

          {!isNew && transaction && (
            <View style={styles.deleteButtonBlock}>
              {transaction.isDeleted ? (
                <>
                  <Button
                    variant="ghost"
                    onPress={handleRestore}
                    disabled={isSaving}
                    accessibilityLabel={t(
                      "screens.settings.trash.a11y.restore",
                    )}
                    accessibilityRole="button"
                  >
                    <IconSymbol name="delete-restore" size={20} />
                    <Text variant="default">Restore</Text>
                  </Button>
                  <Button
                    variant="ghost"
                    onPress={handleDestroy}
                    disabled={isSaving}
                    accessibilityLabel={t(
                      "screens.settings.trash.a11y.destroyPermanently",
                    )}
                    accessibilityRole="button"
                  >
                    <IconSymbol
                      name="trash-can"
                      size={20}
                      style={styles.deleteButtonColor}
                    />
                    <Text variant="default" style={styles.deleteButtonColor}>
                      {t("common.modals.deletePermanently")}
                    </Text>
                  </Button>
                </>
              ) : !transaction.isDeleted ? (
                <Button
                  variant="ghost"
                  style={styles.deleteButton}
                  onPress={handleDeleteConfirm}
                  disabled={isSaving}
                  accessibilityLabel={t(
                    "screens.settings.trash.a11y.moveToTrash",
                  )}
                  accessibilityRole="button"
                >
                  <IconSymbol
                    name="trash-can"
                    size={20}
                    style={styles.deleteButtonColor}
                  />
                  <Text variant="default" style={styles.deleteButtonColor}>
                    Move to trash
                  </Text>
                </Button>
              ) : null}
            </View>
          )}
        </View>
      </ScrollIntoViewProvider>

      {/* <KeyboardStickyViewMinty> */}
      <View style={styles.footer}>
        <Button
          variant="secondary"
          size="lg"
          onPress={handleCancelPress}
          style={styles.footerButton}
          disabled={isSaving}
        >
          <Text style={styles.cancelText}>{t("common.actions.cancel")}</Text>
        </Button>
        <Button
          variant="default"
          size="lg"
          onPress={handleSubmit(onSubmit)}
          style={styles.footerButton}
          disabled={isSaving || (!isNew && !isDirty)}
        >
          {isSaving ? (
            <ActivityIndicatorMinty
              size="small"
              color={theme.colors.onPrimary}
              style={styles.saveSpinner}
            />
          ) : (
            <Text style={styles.saveText}>
              {isNew
                ? t("components.transactionForm.create")
                : t("components.transactionForm.save")}
            </Text>
          )}
        </Button>
      </View>
      {/* </KeyboardStickyViewMinty> */}

      {Platform.OS === "ios" && datePickerVisible && (
        <Modal
          visible
          transparent
          animationType="slide"
          onRequestClose={() => setDatePickerVisible(false)}
          accessibilityViewIsModal
        >
          <Pressable
            style={styles.datePickerOverlay}
            onPress={() => setDatePickerVisible(false)}
          />
          <View
            style={[
              styles.datePickerModal,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View
              style={[
                styles.datePickerHeader,
                { borderBottomColor: `${theme.colors.customColors.semi}20` },
              ]}
            >
              <Pressable
                onPress={() => setDatePickerVisible(false)}
                style={styles.datePickerCancel}
              >
                <Text
                  style={[
                    styles.datePickerCancelText,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {t("common.actions.cancel")}
                </Text>
              </Pressable>
              <Pressable onPress={confirmIosDate} style={styles.datePickerDone}>
                <Text
                  style={[
                    styles.datePickerDoneText,
                    { color: theme.colors.primary },
                  ]}
                >
                  {datePickerMode === "date"
                    ? t("common.actions.next")
                    : t("common.actions.add")}
                </Text>
              </Pressable>
            </View>
            <View style={styles.datePickerBody}>
              <DateTimePicker
                value={tempDate}
                mode={datePickerMode}
                display="spinner"
                onChange={handleIosDateChange}
                textColor={theme.colors.onSurface}
              />
            </View>
          </View>
        </Modal>
      )}

      <AttachmentPreviewModal
        attachment={previewAttachment}
        onClose={() => setPreviewAttachment(null)}
      />

      <LocationPickerModal
        visible={locationPickerVisible}
        initialLocation={location}
        onConfirm={handleLocationConfirm}
        onRequestClose={() => setLocationPickerVisible(false)}
      />

      <ConfirmModal
        visible={!!fileToOpen}
        onRequestClose={() => setFileToOpen(null)}
        onConfirm={async () => {
          if (fileToOpen) {
            try {
              await openFileInExternalApp(fileToOpen.uri, fileToOpen.ext)
            } catch {
              // ignore
            }
            setFileToOpen(null)
          }
        }}
        title={t("components.transactionForm.openFile.title", {
          name:
            fileToOpen?.name ??
            t("components.transactionForm.attachments.openFileModal"),
        })}
        description={t("components.transactionForm.openFile.description")}
        confirmLabel={t("common.actions.confirm")}
        cancelLabel={t("common.actions.cancel")}
      />

      <ConfirmModal
        visible={!!attachmentToRemove}
        onRequestClose={() => setAttachmentToRemove(null)}
        onConfirm={() => {
          if (attachmentToRemove) {
            removeAttachment(attachmentToRemove.uri)
            setAttachmentToRemove(null)
          }
        }}
        title={t("components.transactionForm.removeAttachment.title")}
        description={t(
          "components.transactionForm.removeAttachment.description",
        )}
        confirmLabel={t("common.actions.delete")}
        cancelLabel={t("common.actions.cancel")}
        variant="destructive"
      />
      <ConfirmModal
        visible={unsavedModalVisible}
        onRequestClose={() => setUnsavedModalVisible(false)}
        onConfirm={() => {
          setUnsavedModalVisible(false)
          allowNavigation()
          handleGoBack()
        }}
        title={t("common.modals.closeWithoutSaving")}
        description={t("common.form.unsavedDescription")}
        confirmLabel={t("common.form.discard")}
        cancelLabel={t("common.actions.cancel")}
        variant="default"
      />

      <ConfirmModal
        visible={destroyModalVisible}
        onRequestClose={() => setDestroyModalVisible(false)}
        onConfirm={handleDestroyConfirm}
        title={t("common.modals.deletePermanently")}
        description={t("components.transactionForm.destroyModal.description")}
        confirmLabel={t("common.actions.delete")}
        cancelLabel={t("common.actions.cancel")}
        variant="destructive"
        icon="trash-can"
      />

      {transaction?.recurringId && recurringRule && (
        <>
          <DeleteRecurringModal
            visible={deleteRecurringModalVisible}
            transaction={transaction}
            recurringRule={recurringRule}
            onRequestClose={() => setDeleteRecurringModalVisible(false)}
            onDeleted={() => {
              allowNavigation()
              router.back()
            }}
          />
          <EditRecurringModal
            visible={editRecurringModalVisible}
            transaction={transaction}
            recurringRule={recurringRule}
            pendingPayload={pendingEditPayload}
            onRequestClose={() => {
              setEditRecurringModalVisible(false)
              setPendingEditPayload(null)
            }}
            onSaved={() => {
              allowNavigation()
              router.back()
            }}
          />
        </>
      )}
    </View>
  )
}
