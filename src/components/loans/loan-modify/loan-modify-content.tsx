import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigation, useRouter } from "expo-router"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { ChangeIconInline } from "~/components/change-icon-inline"
import { ColorVariantInline } from "~/components/color-variant-inline"
import { IconSvg } from "~/components/icons"
import {
  FormDeleteButton,
  FormNameField,
} from "~/components/modify-form/form-fields"
import { modifyFormStyles } from "~/components/modify-form/modify-form.styles"
import { ModifyFormFooter } from "~/components/modify-form/modify-form-footer"
import { RouteLoadingState } from "~/components/route-load-state"
import { SmartAmountInput } from "~/components/smart-amount-input"
import { TabsMinty } from "~/components/tabs-minty"
import { FormAccountPicker } from "~/components/transaction/transaction-form/form-account-picker"
import { FormCategoryPicker } from "~/components/transaction/transaction-form/form-category-picker"
import {
  DateTimePickerSheet,
  useDateTimePicker,
} from "~/components/ui/date-time-picker"
import { Input } from "~/components/ui/input"
import { ListItem } from "~/components/ui/list-item"
import { Pressable } from "~/components/ui/pressable"
import { Separator } from "~/components/ui/separator"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { ScrollIntoViewProvider } from "~/contexts/scroll-into-view-context"
import {
  createLoan,
  deleteLoanById,
  updateLoanById,
} from "~/database/services/loan-service"
import { useNavigationGuard } from "~/hooks/use-navigation-guard"
import type { TranslationKey } from "~/i18n/config"
import { type AddLoanFormSchema, addLoanSchema } from "~/schemas/loans.schema"
import { getThemeStrict } from "~/styles/theme/registry"
import { type LoanType, LoanTypeEnum } from "~/types/loans"
import { NewEnum } from "~/types/new"
import { logger } from "~/utils/logger"
import { rescaleMinorUnits } from "~/utils/money"
import { formatShortMonthDayYear } from "~/utils/time-utils"
import { Toast } from "~/utils/toast"

import { LoanFormSheets } from "./loan-form-sheets"
import { loanModifyStyles } from "./loan-modify.styles"
import type { LoanModifyContentProps } from "./types"
export function LoanModifyContent({
  loanModifyId,
  loan,
  accounts,
  categories,
  prefill,
}: LoanModifyContentProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { theme } = useUnistyles()
  const isAddMode = loanModifyId === NewEnum.NEW || !loanModifyId
  const handleGoBack = () => {
    router.back()
  }
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
      term: loan?.term ?? prefill?.term ?? "one_time",
      name: loan?.name ?? prefill?.name ?? "",
      description: loan?.description ?? prefill?.description ?? null,
      icon: loan?.icon ?? "scale-outline",
      colorSchemeName: loan?.colorSchemeName ?? undefined,
      accountId: loan?.accountId ?? prefill?.accountId ?? "",
      categoryId: loan?.categoryId ?? "",
      principalAmount: loan?.principalAmount ?? prefill?.principalAmount ?? 0,
      dueDate: loan?.dueDate ? loan.dueDate.getTime() : null,
    },
  })
  const formLoanType = watch("loanType")
  const formTerm = watch("term") ?? "one_time"
  const formName = watch("name")
  const formIcon = watch("icon")
  const formColorSchemeName = watch("colorSchemeName")
  const formAccountId = watch("accountId")
  const formPrincipalAmount = watch("principalAmount")
  const formCategoryId = watch("categoryId")
  const formDueDate = watch("dueDate")
  // Filter categories by the loan type currently selected in the form:
  // LENT loans create an expense transaction → show expense categories
  // BORROWED loans create an income transaction → show income categories
  const filteredCategories = categories.filter((cat) =>
    formLoanType === LoanTypeEnum.LENT
      ? cat.type === "expense"
      : cat.type === "income",
  )
  // Derive currency code from the selected account
  const selectedAccount = accounts.find((a) => a.id === formAccountId) ?? null
  const currencyCode = selectedAccount?.currencyCode ?? ""
  // Adapter: FormAccountPicker expects (name: "accountId"|"toAccountId", ...)
  // but AddLoanFormSchema has no toAccountId — just ignore that branch.
  const setAccountPickerValue = (
    name: "accountId" | "toAccountId",
    value: string,
    opts: {
      shouldDirty: boolean
    },
  ) => {
    if (name === "accountId") {
      const nextAccount = accounts.find((account) => account.id === value)
      if (
        selectedAccount &&
        nextAccount &&
        selectedAccount.currencyCode !== nextAccount.currencyCode
      ) {
        setValue(
          "principalAmount",
          rescaleMinorUnits(
            formPrincipalAmount,
            selectedAccount.currencyCode,
            nextAccount.currencyCode,
          ),
          opts,
        )
      }
      setValue("accountId", value, opts)
    }
  }
  const navigation = useNavigation()
  const [unsavedSheetVisible, setUnsavedSheetVisible] = useState(false)
  const { allowNavigation } = useNavigationGuard({
    navigation,
    when: isDirty && !isSubmitting,
    onBlock: () => setUnsavedSheetVisible(true),
  })
  const [deleteSheetVisible, setDeleteSheetVisible] = useState(false)
  const dueDatePicker = useDateTimePicker({
    onConfirm: (date) =>
      setValue("dueDate", date.getTime(), { shouldDirty: true }),
  })
  const onSubmit = async (data: AddLoanFormSchema) => {
    const trimmedName = data.name.trim()
    try {
      if (isAddMode) {
        await createLoan({
          ...data,
          name: trimmedName,
          description: data.description ?? null,
          dueDate: data.dueDate ?? null,
          icon: data.icon ?? null,
          colorSchemeName: data.colorSchemeName ?? null,
          initialTransactionTitle: t(
            "screens.settings.loans.initialTransaction.title",
            { name: trimmedName },
          ),
        })
        allowNavigation()
        handleGoBack()
      } else {
        await updateLoanById(loanModifyId, {
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
      if (!loan) {
        Toast.error({
          title: t("common.toast.error"),
        })
        return
      }
      await deleteLoanById(loanModifyId)
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
    ? formatShortMonthDayYear(formDueDate)
    : null
  if (!isAddMode && !loan) {
    return <RouteLoadingState />
  }
  return (
    <View style={modifyFormStyles.container}>
      <ScrollIntoViewProvider
        scrollViewStyle={modifyFormStyles.scrollView}
        contentContainerStyle={modifyFormStyles.scrollContent}
      >
        <View style={modifyFormStyles.form} key={loan?.id ?? NewEnum.NEW}>
          {/* Loan type selector: Lent / Borrowed */}
          <TabsMinty<LoanType>
            items={[
              {
                value: LoanTypeEnum.LENT,
                label: t("screens.settings.loans.type.lent"),
                icon: "caret-up-outline",
              },
              {
                value: LoanTypeEnum.BORROWED,
                label: t("screens.settings.loans.type.borrowed"),
                icon: "caret-down-outline",
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

          {/* Term — chosen on the Loans screen tab, read-only here */}
          <View style={modifyFormStyles.nameSection}>
            <Text variant="small" style={modifyFormStyles.label}>
              {t("screens.settings.loans.term.label")}
            </Text>
            <Text variant="default" style={loanModifyStyles.switchLabel}>
              {formTerm === "long_term"
                ? t("screens.settings.loans.term.longTerm")
                : t("screens.settings.loans.term.oneTime")}
            </Text>
          </View>

          {/* Icon picker */}
          <ChangeIconInline
            currentIcon={formIcon}
            onIconSelected={handleIconSelected}
            colorScheme={currentColorScheme}
          />

          {/* Name section */}
          <FormNameField
            control={control}
            label={t("screens.settings.loans.form.nameLabel")}
            placeholder={t("screens.settings.loans.form.namePlaceholder")}
            error={errors.name}
          />

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
                    valueMinor={value}
                    onChangeMinor={onChange}
                    currencyCode={currencyCode}
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
              categoryType={
                formLoanType === LoanTypeEnum.LENT ? "expense" : "income"
              }
              categoryId={formCategoryId || null}
              onSelect={(id) =>
                setValue("categoryId", id, { shouldDirty: true })
              }
              onClear={() => setValue("categoryId", "", { shouldDirty: true })}
            />
            {errors.categoryId && (
              <Text
                variant="small"
                style={[modifyFormStyles.errorText, { paddingHorizontal: 20 }]}
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
            <ListItem
              style={loanModifyStyles.dueDateSettingsRow}
              onPress={() =>
                dueDatePicker.open(
                  formDueDate ? new Date(formDueDate) : new Date(),
                )
              }
            >
              <View style={loanModifyStyles.dueDateLeft}>
                <IconSvg name="calendar-month" size={24} />
                <Text variant="default" style={loanModifyStyles.switchLabel}>
                  {t("screens.settings.loans.form.dueDateLabel")}
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
                        name="x-outline"
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
            </ListItem>
          </View>

          {/* Description input — optional */}
          <View style={loanModifyStyles.descriptionSection}>
            <Text variant="small" style={modifyFormStyles.label}>
              {t("screens.settings.loans.form.descriptionLabel")}
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
                    "screens.settings.loans.form.descriptionPlaceholder",
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
          <View style={modifyFormStyles.deleteSection}>
            <FormDeleteButton
              label={t("screens.settings.loans.form.deleteLabel")}
              onPress={() => setDeleteSheetVisible(true)}
            />
          </View>
        )}
      </ScrollIntoViewProvider>

      <ModifyFormFooter
        formName={formName}
        isAddMode={isAddMode}
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        onCancel={handleGoBack}
        onSave={handleSubmit}
      />

      <LoanFormSheets
        deleteSheetVisible={deleteSheetVisible}
        unsavedSheetVisible={unsavedSheetVisible}
        isAddMode={isAddMode}
        loan={loan}
        onCloseDeleteSheet={() => setDeleteSheetVisible(false)}
        onCloseUnsavedSheet={() => setUnsavedSheetVisible(false)}
        onConfirmDelete={handleDelete}
        onDiscardAndNavigate={() => {
          setUnsavedSheetVisible(false)
          allowNavigation()
          handleGoBack()
        }}
      />

      {dueDatePicker.pickerElement}
      <DateTimePickerSheet {...dueDatePicker.sheetProps} />
    </View>
  )
}
