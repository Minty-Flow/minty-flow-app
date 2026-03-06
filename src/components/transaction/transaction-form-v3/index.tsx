import { zodResolver } from "@hookform/resolvers/zod"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useReducer,
  useState,
} from "react"
import { Controller, type Resolver, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { SmartAmountInput } from "~/components/smart-amount-input"
import { TransactionTypeSelector } from "~/components/transaction/transaction-type-selector"
import { Input } from "~/components/ui/input"
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
} from "~/database/services/transfer-service"
import { useBalanceAtTransaction } from "~/hooks/use-balance-before"
import { useNavigationGuard } from "~/hooks/use-navigation-guard"
import { useRecurringRule } from "~/hooks/use-recurring-rule"
import type { TranslationKey } from "~/i18n/config"
import {
  type TransactionFormValues,
  transactionSchema,
} from "~/schemas/transactions.schema"
import { synchronizePlannedTransactionNotifications } from "~/services/pending-transaction-notifications"
import { usePendingTransactionsStore } from "~/stores/pending-transactions.store"
import { useTransactionLocationStore } from "~/stores/transaction-location.store"
import type {
  RecurringEndType,
  RecurringFrequency,
  TransactionLocation,
} from "~/types/transactions"
import { logger } from "~/utils/logger"
import { buildRRuleString, countOccurrencesBetween } from "~/utils/recurrence"
import { Toast } from "~/utils/toast"

import { EMPTY_TAG_IDS } from "./constants"
import { transactionFormStyles } from "./form.styles"
import { FormAccountPicker } from "./form-account-picker"
import { FormAttachmentsSection } from "./form-attachments-section"
import { FormCategoryPicker } from "./form-category-picker"
import { FormConversionSection } from "./form-conversion-section"
import { FormDateSection } from "./form-date-section"
import { FormDeleteActions } from "./form-delete-actions"
import { FormFooter } from "./form-footer"
import { FormLocationPicker } from "./form-location-picker"
import { FormModals } from "./form-modals"
import { FormNotesSection } from "./form-notes-section"
import { FormRecurringSection } from "./form-recurring-section"
import { FormTagsPicker } from "./form-tags-picker"
import { FormToAccountPicker } from "./form-to-account-picker"
import { getDefaultValues, getFieldError, mergeReducer } from "./form-utils"
import type {
  ModalState,
  RecurringState,
  TransactionFormV3Props,
} from "./types"
import { useFormAttachments } from "./use-form-attachments"
import { useFormConversionRate } from "./use-form-conversion-rate"
import { useFormDatePicker } from "./use-form-date-picker"
import { useFormLocation } from "./use-form-location"

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
  const { theme } = useUnistyles()
  const { id } = useLocalSearchParams<{ id: string }>()
  const isNew = id === "new"
  const requireConfirmation = usePendingTransactionsStore(
    (s) => s.requireConfirmation,
  )
  const { isEnabled: locationEnabled, autoAttach } =
    useTransactionLocationStore()

  const [modals, setModals] = useReducer(mergeReducer<ModalState>, {
    unsavedModalVisible: false,
    editRecurringModalVisible: false,
    deleteRecurringModalVisible: false,
    destroyModalVisible: false,
    notesModalVisible: false,
    locationPickerVisible: false,
    pendingEditPayload: null,
  })

  const recurringRule = useRecurringRule(transaction?.recurringId ?? null)

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

  const selectedAccount = accounts.find((a) => a.id === accountId)
  const selectedToAccount =
    transactionType === "transfer" && toAccountId
      ? accounts.find((a) => a.id === toAccountId)
      : null

  const [isSaving, setIsSaving] = useState(false)
  const { allowNavigation } = useNavigationGuard({
    navigation,
    when: isDirty && !isSaving,
    onConfirm: () => router.back(),
    onBlock: () => setModals({ unsavedModalVisible: true }),
  })

  const [recurring, setRecurring] = useReducer(mergeReducer<RecurringState>, {
    enabled: false,
    frequency: "daily" as RecurringFrequency,
    startDate: new Date(),
    endDate: null,
    endAfterOccurrences: null,
    endsOnPickerExpanded: false,
  })

  const { conversionRate, setConversionRate } = useFormConversionRate(
    transactionType,
    selectedAccount,
    selectedToAccount,
    transaction,
  )

  const {
    attachmentState,
    setAttachmentState,
    removeAttachment,
    handleSelectFromFiles,
    handleTakePhoto,
    handleSelectMultipleMedia,
    handleSelectSinglePhoto,
  } = useFormAttachments(transaction)

  const {
    datePicker,
    setDatePicker,
    openDatePicker,
    handleIosDateChange,
    confirmIosDate,
    handleSetNow,
  } = useFormDatePicker(recurring, setRecurring, watch, setValue)

  const { isCapturingLocation, handleLocationConfirm, handleClearLocation } =
    useFormLocation(isNew, locationEnabled, autoAttach, setValue, () =>
      setModals({ locationPickerVisible: false }),
    )

  const balanceAtTransaction = useBalanceAtTransaction(transaction)

  const derivedTransferTitle = useMemo(() => {
    if (
      transactionType !== "transfer" ||
      !selectedAccount ||
      !selectedToAccount
    )
      return ""
    return t("components.transactionForm.fields.transferTitleFull", {
      from: selectedAccount.name,
      to: selectedToAccount.name,
    })
  }, [transactionType, selectedAccount, selectedToAccount, t])

  const endsOnType: RecurringEndType =
    recurring.endAfterOccurrences !== null
      ? "occurrences"
      : recurring.endDate !== null
        ? "date"
        : "never"

  const recurringEndDateOccurrenceCount = useMemo(() => {
    if (endsOnType !== "date" || !recurring.endDate || !recurring.frequency)
      return null
    return countOccurrencesBetween(
      recurring.startDate,
      recurring.endDate,
      recurring.frequency,
    )
  }, [endsOnType, recurring.endDate, recurring.frequency, recurring.startDate])

  const handleRecurringToggle = useCallback(
    (next: boolean) => {
      setRecurring({
        enabled: next,
        ...(next ? { startDate: watch("transactionDate") } : {}),
      })
    },
    [watch],
  )

  const handleConfirmExit = useCallback(() => {
    allowNavigation()
    router.back()
  }, [allowNavigation, router])

  const onSubmit = async (data: TransactionFormValues) => {
    if (isSaving) return
    setIsSaving(true)
    try {
      // ─── Transfer ─────────────────────────────────────────────────────────
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

      // Build extra
      const builtExtra: Record<string, string> = isNew
        ? {}
        : { ...(transaction?.extra ?? {}) }
      if (attachmentState.list.length > 0) {
        builtExtra.attachments = JSON.stringify(attachmentState.list)
      } else {
        delete builtExtra.attachments
      }

      const effectiveDate = recurring.enabled
        ? recurring.startDate
        : data.transactionDate
      const isFuture = effectiveDate.getTime() > Date.now()
      const effectiveIsPending = data.isPending ?? false
      const requiresManualConfirmation = recurring.enabled
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
        if (recurring.enabled && recurring.frequency) {
          try {
            const rruleStr = buildRRuleString({
              frequency: recurring.frequency,
              startDate: recurring.startDate,
              endDate: recurring.endDate,
              count: recurring.endAfterOccurrences,
            })
            const rangeEnd =
              recurring.endDate?.getTime() ?? new Date(2099, 11, 31).getTime()
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
                from: recurring.startDate.getTime(),
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
          setIsSaving(false)
          return
        }
        await updateTransactionModel(transaction, payload)
        synchronizePlannedTransactionNotifications().catch(() => {})
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
      setModals({ unsavedModalVisible: true })
    } else {
      allowNavigation()
      router.back()
    }
  }, [isDirty, allowNavigation, router])

  const handleDeleteConfirm = useCallback(() => {
    if (!transaction) return
    if (transaction.recurringId && recurringRule) {
      setModals({ deleteRecurringModalVisible: true })
      return
    }
    const promise =
      transaction.isTransfer && transaction.transferId
        ? deleteTransfer(transaction)
        : deleteTransactionModel(transaction)
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
  }, [transaction, recurringRule, router, allowNavigation, t])

  const handleRestore = useCallback(async () => {
    if (!transaction?.isDeleted) return
    try {
      await restoreTransactionModel(transaction)
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
  }, [transaction, router, allowNavigation, t])

  const handleDestroy = useCallback(() => {
    if (!transaction) return
    setModals({ destroyModalVisible: true })
  }, [transaction])

  const handleDestroyConfirm = useCallback(async () => {
    if (!transaction) return
    setModals({ destroyModalVisible: false })
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
    <View style={transactionFormStyles.container}>
      <View style={transactionFormStyles.header}>
        <TransactionTypeSelector
          value={transactionType}
          onChange={(type) => {
            onTransactionTypeChange(type)
            setValue("type", type, { shouldDirty: true })
          }}
        />
      </View>

      <ScrollIntoViewProvider
        contentContainerStyle={transactionFormStyles.content}
        scrollViewProps={{
          keyboardShouldPersistTaps: "handled",
          showsVerticalScrollIndicator: false,
        }}
      >
        <View style={transactionFormStyles.form}>
          {/* Title */}
          <View style={transactionFormStyles.nameSection}>
            <Controller
              control={control}
              name="title"
              render={({ field: { value, onChange } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder={
                    derivedTransferTitle ||
                    t("components.transactionForm.fields.titlePlaceholder")
                  }
                  placeholderTextColor={theme.colors.customColors.semi}
                />
              )}
            />
            {titleErrorKey ? (
              <Text style={transactionFormStyles.fieldError}>
                {t(titleErrorKey as TranslationKey)}
              </Text>
            ) : null}
          </View>

          {/* Amount */}
          <View style={transactionFormStyles.balanceSection}>
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

          {/* Conversion: only when transfer + different currencies */}
          {transactionType === "transfer" &&
            selectedAccount &&
            selectedToAccount &&
            selectedAccount.currencyCode !== selectedToAccount.currencyCode && (
              <FormConversionSection
                amount={amount ?? 0}
                conversionRate={conversionRate}
                onConversionRateChange={setConversionRate}
                selectedAccount={selectedAccount}
                selectedToAccount={selectedToAccount}
              />
            )}

          {/* Category: hidden for transfers */}
          {transactionType !== "transfer" && (
            <FormCategoryPicker
              categories={categories}
              categoryId={categoryId}
              onSelect={(id) =>
                setValue("categoryId", id, { shouldDirty: true })
              }
              onClear={() =>
                setValue("categoryId", null, { shouldDirty: true })
              }
            />
          )}

          <FormTagsPicker
            tags={tags}
            tagIds={tagIds}
            setValue={setValue}
            addTag={addTag}
            removeTag={removeTag}
          />

          {/* Date + Pending: hidden when recurring is enabled */}
          {!recurring.enabled && (
            <FormDateSection
              date={date}
              control={control}
              onDatePress={() => openDatePicker("transaction")}
              onSetNow={handleSetNow}
            />
          )}

          <FormNotesSection
            description={description}
            descriptionErrorKey={descriptionErrorKey}
            notesModalVisible={modals.notesModalVisible}
            onOpenModal={() => setModals({ notesModalVisible: true })}
            onCloseModal={() => setModals({ notesModalVisible: false })}
            onSave={(html) =>
              setValue("description", html, { shouldDirty: true })
            }
          />

          <FormAttachmentsSection
            list={attachmentState.list}
            preview={attachmentState.preview}
            fileToOpen={attachmentState.fileToOpen}
            toRemove={attachmentState.toRemove}
            addFilesExpanded={attachmentState.addFilesExpanded}
            onToggleAddFiles={() =>
              setAttachmentState({
                addFilesExpanded: !attachmentState.addFilesExpanded,
              })
            }
            onClosePreview={() => setAttachmentState({ preview: null })}
            onCancelFileOpen={() => setAttachmentState({ fileToOpen: null })}
            onPreview={(a) => setAttachmentState({ preview: a })}
            onOpenExternal={(a) => setAttachmentState({ fileToOpen: a })}
            onRemoveRequest={(a) => setAttachmentState({ toRemove: a })}
            onRemoveConfirm={removeAttachment}
            onRemoveCancel={() => setAttachmentState({ toRemove: null })}
            onSelectFromFiles={handleSelectFromFiles}
            onTakePhoto={handleTakePhoto}
            onSelectMultipleMedia={handleSelectMultipleMedia}
            onSelectSinglePhoto={handleSelectSinglePhoto}
          />

          <FormRecurringSection
            enabled={recurring.enabled}
            frequency={recurring.frequency}
            startDate={recurring.startDate}
            endDate={recurring.endDate}
            endAfterOccurrences={recurring.endAfterOccurrences}
            endsOnPickerExpanded={recurring.endsOnPickerExpanded}
            endsOnType={endsOnType}
            recurringEndDateOccurrenceCount={recurringEndDateOccurrenceCount}
            onToggle={handleRecurringToggle}
            onFrequencyChange={(f) => setRecurring({ frequency: f })}
            onStartDatePress={() => openDatePicker("recurringStart")}
            onEndPickerToggle={() =>
              setRecurring({
                endsOnPickerExpanded: !recurring.endsOnPickerExpanded,
              })
            }
            onEndTypeNever={() =>
              setRecurring({
                endDate: null,
                endAfterOccurrences: null,
                endsOnPickerExpanded: false,
              })
            }
            onEndTypeDate={() => {
              setRecurring({
                endAfterOccurrences: null,
                endsOnPickerExpanded: false,
              })
              openDatePicker("recurringEnd")
            }}
            onEndTypeOccurrences={() =>
              setRecurring({
                endDate: null,
                endAfterOccurrences: recurring.endAfterOccurrences ?? 4,
              })
            }
            onOccurrencePreset={(n) => setRecurring({ endAfterOccurrences: n })}
          />

          {locationEnabled && (
            <View style={transactionFormStyles.fieldBlock}>
              <Text variant="small" style={transactionFormStyles.sectionLabel}>
                Location
              </Text>
              <FormLocationPicker
                location={location}
                isCapturingLocation={isCapturingLocation}
                onPress={() => setModals({ locationPickerVisible: true })}
                onClear={handleClearLocation}
              />
            </View>
          )}

          {!isNew && transaction && (
            <FormDeleteActions
              transaction={transaction}
              isSaving={isSaving}
              onRestore={handleRestore}
              onDelete={handleDeleteConfirm}
              onDestroy={handleDestroy}
            />
          )}
        </View>
      </ScrollIntoViewProvider>

      <FormFooter
        isNew={isNew}
        isSaving={isSaving}
        isDirty={isDirty}
        onCancel={handleCancelPress}
        onSave={handleSubmit(onSubmit)}
      />

      <FormModals
        modals={modals}
        setModals={setModals}
        datePicker={datePicker}
        location={location}
        transaction={transaction}
        recurringRule={recurringRule}
        onConfirmExit={handleConfirmExit}
        onDestroyConfirm={handleDestroyConfirm}
        onLocationConfirm={handleLocationConfirm}
        onIosDateConfirm={confirmIosDate}
        onIosDateChange={handleIosDateChange}
        onDatePickerClose={() => setDatePicker({ visible: false })}
      />
    </View>
  )
}
