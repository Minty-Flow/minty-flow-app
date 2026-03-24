import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigation, useRouter } from "expo-router"
import { useCallback, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { ChangeIconInline } from "~/components/change-icon-inline"
import { ColorVariantInline } from "~/components/color-variant-inline"
import { SmartAmountInput } from "~/components/smart-amount-input"
import { TabsMinty } from "~/components/tabs-minty"
import { FormAccountPicker } from "~/components/transaction/transaction-form-v3/form-account-picker"
import { FormCategoryPicker } from "~/components/transaction/transaction-form-v3/form-category-picker"
import { Button } from "~/components/ui/button"
import {
  DateTimePickerModal,
  useDateTimePicker,
} from "~/components/ui/date-time-picker"
import { IconSvg } from "~/components/ui/icon-svg"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Separator } from "~/components/ui/separator"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { ScrollIntoViewProvider } from "~/contexts/scroll-into-view-context"
import {
  createLoan,
  destroyLoan,
  updateLoan,
} from "~/database/services/loan-service"
import { createTransactionModel } from "~/database/services/transaction-service"
import { useNavigationGuard } from "~/hooks/use-navigation-guard"
import type { TranslationKey } from "~/i18n/config"
import { type AddLoanFormSchema, addLoanSchema } from "~/schemas/loans.schema"
import { getThemeStrict } from "~/styles/theme/registry"
import { type LoanType, LoanTypeEnum } from "~/types/loans"
import { NewEnum } from "~/types/new"
import { TransactionTypeEnum } from "~/types/transactions"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

import { LoanFormFooter } from "./loan-form-footer"
import { LoanFormModals } from "./loan-form-modals"
import { loanModifyStyles } from "./loan-modify.styles"
import type { LoanModifyContentProps } from "./types"

export function LoanModifyContent({
  loanModifyId,
  loan,
  loanModel,
  accounts,
  categories,
  prefill,
}: LoanModifyContentProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { theme } = useUnistyles()

  const isAddMode = loanModifyId === NewEnum.NEW || !loanModifyId

  const handleGoBack = useCallback(() => {
    router.back()
  }, [router])

  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isDirty, isSubmitting },
    watch,
    setValue,
  } = useForm<AddLoanFormSchema>({
    resolver: zodResolver(addLoanSchema),
    defaultValues: {
      loanType: loan?.loanType ?? prefill?.loanType ?? LoanTypeEnum.LENT,
      name: loan?.name ?? prefill?.name ?? "",
      description: loan?.description ?? prefill?.description ?? null,
      icon: loan?.icon ?? "scale",
      colorSchemeName: loan?.colorSchemeName ?? undefined,
      accountId: loan?.accountId ?? prefill?.accountId ?? "",
      categoryId: loan?.categoryId ?? "",
      principalAmount: loan?.principalAmount ?? prefill?.principalAmount ?? 0,
      dueDate: loan?.dueDate ? loan.dueDate.getTime() : null,
    },
  })

  const formLoanType = watch("loanType")
  const formName = watch("name")
  const formIcon = watch("icon")
  const formColorSchemeName = watch("colorSchemeName")
  const formAccountId = watch("accountId")
  const formCategoryId = watch("categoryId")
  const formDueDate = watch("dueDate")

  // Filter categories by the loan type currently selected in the form:
  // LENT loans create an expense transaction → show expense categories
  // BORROWED loans create an income transaction → show income categories
  const filteredCategories = useMemo(
    () =>
      categories.filter((cat) =>
        formLoanType === LoanTypeEnum.LENT
          ? cat.type === "expense"
          : cat.type === "income",
      ),
    [categories, formLoanType],
  )

  // Derive currency code from the selected account
  const selectedAccount = useMemo(
    () => accounts.find((a) => a.id === formAccountId) ?? null,
    [accounts, formAccountId],
  )
  const currencyCode = selectedAccount?.currencyCode ?? ""

  // Adapter: FormAccountPicker expects (name: "accountId"|"toAccountId", ...)
  // but AddLoanFormSchema has no toAccountId — just ignore that branch.
  const setAccountPickerValue = useCallback(
    (
      name: "accountId" | "toAccountId",
      value: string,
      opts: { shouldDirty: boolean },
    ) => {
      if (name === "accountId") {
        setValue("accountId", value, opts)
      }
    },
    [setValue],
  )

  const navigation = useNavigation()
  const [unsavedModalVisible, setUnsavedModalVisible] = useState(false)
  const { confirmNavigation, allowNavigation } = useNavigationGuard({
    navigation,
    when: isDirty && !isSubmitting,
    onConfirm: handleGoBack,
    onBlock: () => setUnsavedModalVisible(true),
  })

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const dueDatePicker = useDateTimePicker({
    onConfirm: (date) =>
      setValue("dueDate", date.getTime(), { shouldDirty: true }),
  })

  const onSubmit = async (data: AddLoanFormSchema) => {
    const trimmedName = data.name.trim()

    try {
      if (isAddMode) {
        const newLoan = await createLoan({
          ...data,
          name: trimmedName,
          description: data.description ?? null,
          dueDate: data.dueDate ?? null,
          icon: data.icon ?? null,
          colorSchemeName: data.colorSchemeName ?? null,
        })

        try {
          // Create the initial cash-flow transaction linked to the new loan.
          // LENT money leaves the account (expense); BORROWED money arrives (income).
          await createTransactionModel({
            amount: data.principalAmount,
            type:
              data.loanType === LoanTypeEnum.LENT
                ? TransactionTypeEnum.EXPENSE
                : TransactionTypeEnum.INCOME,
            transactionDate: new Date(),
            accountId: data.accountId,
            categoryId: data.categoryId,
            title: t("screens.settings.loans.initialTransaction.title", {
              name: trimmedName,
            }),
            description: null,
            isPending: false,
            tags: [],
            loanId: newLoan.id,
          })
        } catch (txError) {
          // The loan was created successfully — losing the starting transaction is
          // recoverable, so log the error and show a toast but still navigate back.
          logger.error("Error creating initial loan transaction", {
            error: txError,
          })
          Toast.error({
            title: t("common.toast.error"),
          })
        }

        allowNavigation()
        handleGoBack()
      } else {
        if (!loanModel) {
          Toast.error({
            title: t("common.toast.error"),
            description: t("screens.settings.loans.form.loadingText"),
          })
          return
        }

        await updateLoan(loanModel, {
          ...data,
          name: trimmedName,
          description: data.description ?? null,
          dueDate: data.dueDate ?? null,
          icon: data.icon ?? null,
          colorSchemeName: data.colorSchemeName ?? null,
        })

        allowNavigation()
        handleGoBack()
      }
    } catch (error) {
      logger.error("Error saving loan", { error })
      Toast.error({
        title: t("common.toast.error"),
      })
    }
  }

  const handleSubmit = handleFormSubmit(onSubmit)

  const handleDelete = async () => {
    try {
      if (!loanModel || !loan) {
        Toast.error({
          title: t("common.toast.error"),
          description: t("screens.settings.loans.form.loadingText"),
        })
        return
      }

      await destroyLoan(loanModel)

      allowNavigation()
      router.dismiss(2)
    } catch (error) {
      logger.error("Error deleting loan", { error })
      Toast.error({
        title: t("common.toast.error"),
      })
    }
  }

  const handleIconSelected = (icon: string | null) => {
    setValue("icon", icon, { shouldDirty: true })
  }

  const handleColorSelected = (schemeName: string) => {
    setValue("colorSchemeName", schemeName, { shouldDirty: true })
  }

  const handleColorCleared = () => {
    setValue("colorSchemeName", undefined, { shouldDirty: true })
  }

  const handleClearDate = () => {
    setValue("dueDate", null, { shouldDirty: true })
  }

  const currentColorScheme = getThemeStrict(formColorSchemeName)

  const formattedDueDate = formDueDate
    ? new Date(formDueDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null

  if (!isAddMode && !loan) {
    return (
      <View style={loanModifyStyles.container}>
        <View style={loanModifyStyles.loadingContainer}>
          <Text variant="default">
            {t("screens.settings.loans.form.loadingText")}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={loanModifyStyles.container}>
      <ScrollIntoViewProvider
        scrollViewStyle={loanModifyStyles.scrollView}
        contentContainerStyle={loanModifyStyles.scrollContent}
      >
        <View style={loanModifyStyles.form} key={loan?.id ?? NewEnum.NEW}>
          {/* Loan type selector: Lent / Borrowed */}
          <TabsMinty<LoanType>
            items={[
              {
                value: LoanTypeEnum.LENT,
                label: t("screens.settings.loans.type.lent"),
                icon: "caret-up",
              },
              {
                value: LoanTypeEnum.BORROWED,
                label: t("screens.settings.loans.type.borrowed"),
                icon: "caret-down",
              },
            ]}
            activeValue={formLoanType}
            onValueChange={(v) => {
              setValue("loanType", v, { shouldDirty: true })
              // Reset category selection — the valid set changes when loan type changes
              setValue("categoryId", "", { shouldDirty: true })
            }}
            variant="segmented"
          />

          {/* Icon picker */}
          <ChangeIconInline
            currentIcon={formIcon}
            onIconSelected={handleIconSelected}
            colorScheme={currentColorScheme}
          />

          {/* Name section */}
          <View style={loanModifyStyles.nameSection}>
            <Text variant="small" style={loanModifyStyles.label}>
              {t("screens.settings.goals.form.nameLabel")}
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t("screens.settings.goals.form.namePlaceholder")}
                  error={!!errors.name}
                />
              )}
            />
            {errors.name && (
              <Text variant="small" style={loanModifyStyles.errorText}>
                {t(errors.name.message as TranslationKey)}
              </Text>
            )}
          </View>

          {/* Settings list */}
          <View style={loanModifyStyles.settingsList}>
            {/* Account picker */}
            <FormAccountPicker
              accounts={accounts}
              accountId={formAccountId}
              toAccountId={undefined}
              setValue={setAccountPickerValue}
              selectedAccount={selectedAccount}
              balanceAtTransaction={null}
              transaction={null}
              accountError={
                errors.accountId
                  ? t(errors.accountId.message as TranslationKey)
                  : undefined
              }
            />

            {/* Principal amount input */}
            <View style={loanModifyStyles.amountSection}>
              <Controller
                control={control}
                name="principalAmount"
                render={({ field: { onChange, value } }) => (
                  <SmartAmountInput
                    value={value}
                    onChange={onChange}
                    currencyCode={currencyCode || undefined}
                    label={t("screens.settings.loans.form.amountLabel")}
                    error={
                      errors.principalAmount
                        ? t(errors.principalAmount.message as TranslationKey)
                        : undefined
                    }
                  />
                )}
              />
            </View>

            {/* Category picker — single selection, filtered by loan type */}
            <FormCategoryPicker
              categories={filteredCategories}
              categoryId={formCategoryId || null}
              onSelect={(id) =>
                setValue("categoryId", id, { shouldDirty: true })
              }
              onClear={() => setValue("categoryId", "", { shouldDirty: true })}
            />
            {errors.categoryId && (
              <Text
                variant="small"
                style={[loanModifyStyles.errorText, { paddingHorizontal: 20 }]}
              >
                {t(errors.categoryId.message as TranslationKey)}
              </Text>
            )}

            {/* Color variant picker */}
            <ColorVariantInline
              selectedSchemeName={formColorSchemeName ?? undefined}
              onColorSelected={handleColorSelected}
              onClearSelection={handleColorCleared}
            />

            {/* Due date — optional pressable row */}
            <Pressable
              style={loanModifyStyles.dueDateSettingsRow}
              onPress={() =>
                dueDatePicker.open(
                  formDueDate ? new Date(formDueDate) : new Date(),
                )
              }
            >
              <View style={loanModifyStyles.dueDateLeft}>
                <IconSvg name="calendar" size={24} />
                <Text variant="default" style={loanModifyStyles.switchLabel}>
                  {t("screens.settings.goals.form.targetDateLabel")}
                </Text>
              </View>
              <View style={loanModifyStyles.dueDateRight}>
                {formattedDueDate ? (
                  <>
                    <Text
                      variant="default"
                      style={loanModifyStyles.dueDateText}
                    >
                      {formattedDueDate}
                    </Text>
                    <Pressable
                      onPress={handleClearDate}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      accessibilityLabel={t("common.actions.clear")}
                    >
                      <IconSvg
                        name="x"
                        size={20}
                        color={theme.colors.onSecondary}
                      />
                    </Pressable>
                  </>
                ) : (
                  <Text
                    variant="default"
                    style={loanModifyStyles.dueDatePlaceholder}
                  >
                    {t("screens.settings.loans.card.noDueDate")}
                  </Text>
                )}
              </View>
            </Pressable>
          </View>

          {/* Description input — optional */}
          <View style={loanModifyStyles.descriptionSection}>
            <Text variant="small" style={loanModifyStyles.label}>
              {t("screens.settings.goals.form.descriptionLabel")}
            </Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value ?? ""}
                  onChangeText={(text) => onChange(text || null)}
                  onBlur={onBlur}
                  placeholder={t(
                    "screens.settings.goals.form.descriptionPlaceholder",
                  )}
                  multiline
                  numberOfLines={3}
                />
              )}
            />
          </View>

          {!isAddMode && <Separator />}
        </View>

        {/* Delete button — edit mode only */}
        {!isAddMode && (
          <View style={loanModifyStyles.deleteSection}>
            <Button
              variant="ghost"
              onPress={() => setDeleteModalVisible(true)}
              style={loanModifyStyles.actionButton}
            >
              <IconSvg
                name="trash"
                size={20}
                color={loanModifyStyles.deleteIcon.color}
              />
              <Text variant="default" style={loanModifyStyles.deleteText}>
                {t("screens.settings.goals.form.deleteLabel")}
              </Text>
            </Button>
          </View>
        )}
      </ScrollIntoViewProvider>

      <LoanFormFooter
        formName={formName}
        isAddMode={isAddMode}
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        onCancel={handleGoBack}
        onSave={handleSubmit}
      />

      <LoanFormModals
        deleteModalVisible={deleteModalVisible}
        unsavedModalVisible={unsavedModalVisible}
        isAddMode={isAddMode}
        loan={loan}
        onCloseDeleteModal={() => setDeleteModalVisible(false)}
        onCloseUnsavedModal={() => setUnsavedModalVisible(false)}
        onConfirmDelete={handleDelete}
        onDiscardAndNavigate={() => {
          setUnsavedModalVisible(false)
          confirmNavigation()
        }}
      />

      <DateTimePickerModal {...dueDatePicker.modalProps} />
    </View>
  )
}
