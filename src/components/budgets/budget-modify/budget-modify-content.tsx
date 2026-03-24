import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigation, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { ChangeIconInline } from "~/components/change-icon-inline"
import { ColorVariantInline } from "~/components/color-variant-inline"
import { CurrencyAccountSelector } from "~/components/currency-account-selector"
import { InlineCategoryPicker } from "~/components/inline-category-picker"
import { SmartAmountInput } from "~/components/smart-amount-input"
import { Button } from "~/components/ui/button"
import { Chip } from "~/components/ui/chips"
import {
  DateTimePickerModal,
  useDateTimePicker,
} from "~/components/ui/date-time-picker"
import { IconSvg } from "~/components/ui/icon-svg"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Separator } from "~/components/ui/separator"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { ScrollIntoViewProvider } from "~/contexts/scroll-into-view-context"
import {
  createBudget,
  destroyBudget,
  duplicateBudget,
  updateBudget,
} from "~/database/services/budget-service"
import { useNavigationGuard } from "~/hooks/use-navigation-guard"
import type { TranslationKey } from "~/i18n/config"
import {
  type AddBudgetFormSchema,
  addBudgetSchema,
} from "~/schemas/budgets.schema"
import { getThemeStrict } from "~/styles/theme/registry"
import { BudgetPeriodEnum } from "~/types/budgets"
import { NewEnum } from "~/types/new"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

import { BudgetFormFooter } from "./budget-form-footer"
import { BudgetFormModals } from "./budget-form-modals"
import { budgetModifyStyles } from "./budget-modify.styles"
import type { BudgetModifyContentProps } from "./types"

// Period options for the chips selector — custom is last
const PERIOD_OPTIONS = [
  BudgetPeriodEnum.DAILY,
  BudgetPeriodEnum.WEEKLY,
  BudgetPeriodEnum.MONTHLY,
  BudgetPeriodEnum.YEARLY,
  BudgetPeriodEnum.CUSTOM,
] as const

export function BudgetModifyContent({
  budgetModifyId,
  budget,
  budgetModel,
  accounts,
  categories,
}: BudgetModifyContentProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const isAddMode = budgetModifyId === NewEnum.NEW || !budgetModifyId

  const handleGoBack = useCallback(() => {
    router.back()
  }, [router])

  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isDirty, isSubmitting },
    watch,
    setValue,
  } = useForm<AddBudgetFormSchema>({
    resolver: zodResolver(addBudgetSchema),
    defaultValues: {
      name: budget?.name ?? "",
      icon: budget?.icon ?? "chart-pie",
      colorSchemeName: budget?.colorSchemeName ?? undefined,
      currencyCode: budget?.currencyCode ?? "",
      accountIds: budget?.accountIds ?? [],
      amount: budget?.amount ?? 0,
      period: budget?.period ?? BudgetPeriodEnum.MONTHLY,
      startDate: budget?.startDate ? budget.startDate.getTime() : Date.now(),
      endDate: budget?.endDate ? budget.endDate.getTime() : null,
      categoryIds: budget?.categoryIds ?? [],
      alertThreshold: budget?.alertThreshold ?? null,
      isActive: budget?.isActive ?? true,
    },
  })

  const formName = watch("name")
  const formIcon = watch("icon")
  const formColorSchemeName = watch("colorSchemeName")
  const watchedCurrencyCode = watch("currencyCode")
  const watchedAccountIds = watch("accountIds")
  const watchedPeriod = watch("period")
  const watchedCategoryIds = watch("categoryIds")
  const watchedAlertThreshold = watch("alertThreshold")
  const watchedStartDate = watch("startDate")
  const watchedEndDate = watch("endDate")

  const navigation = useNavigation()
  const [unsavedModalVisible, setUnsavedModalVisible] = useState(false)
  const { confirmNavigation, allowNavigation } = useNavigationGuard({
    navigation,
    when: isDirty && !isSubmitting,
    onConfirm: handleGoBack,
    onBlock: () => setUnsavedModalVisible(true),
  })

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const startDatePicker = useDateTimePicker({
    onConfirm: (date) =>
      setValue("startDate", date.getTime(), { shouldDirty: true }),
  })
  const endDatePicker = useDateTimePicker({
    onConfirm: (date) =>
      setValue("endDate", date.getTime(), { shouldDirty: true }),
  })

  const onSubmit = async (data: AddBudgetFormSchema) => {
    const trimmedName = data.name.trim()

    try {
      if (isAddMode) {
        await createBudget({ ...data, name: trimmedName })

        allowNavigation()
        handleGoBack()
      } else {
        if (!budgetModel) {
          Toast.error({
            title: t("common.toast.error"),
            description: t("screens.settings.budgets.form.toast.notFound"),
          })
          return
        }

        await updateBudget(budgetModel, { ...data, name: trimmedName })

        allowNavigation()
        handleGoBack()
      }
    } catch (error) {
      logger.error("Error saving budget", { error })
      Toast.error({
        title: t("common.toast.error"),
        description: t(
          isAddMode
            ? "screens.settings.budgets.form.toast.createFailed"
            : "screens.settings.budgets.form.toast.updateFailed",
        ),
      })
    }
  }

  const handleSubmit = handleFormSubmit(onSubmit)

  const handleDelete = async () => {
    try {
      if (!budgetModel || !budget) {
        Toast.error({
          title: t("common.toast.error"),
          description: t("screens.settings.budgets.form.toast.notFound"),
        })
        return
      }

      await destroyBudget(budgetModel)

      allowNavigation()
      router.dismiss(2)
    } catch (error) {
      logger.error("Error deleting budget", { error })
      Toast.error({
        title: t("common.toast.error"),
        description: t("screens.settings.budgets.form.toast.deleteFailed"),
      })
    }
  }

  const handleDuplicate = async () => {
    try {
      if (!budget) {
        Toast.error({
          title: t("common.toast.error"),
          description: t("screens.settings.budgets.form.toast.notFound"),
        })
        return
      }

      await duplicateBudget(budget)

      Toast.success({
        title: t("screens.settings.budgets.form.duplicateSuccess"),
      })
      allowNavigation()
      router.back()
    } catch (error) {
      logger.error("Error duplicating budget", { error })
      Toast.error({ title: t("common.toast.error") })
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

  const currentColorScheme = getThemeStrict(formColorSchemeName)

  // Formatted display strings for the date rows
  const formattedStartDate = watchedStartDate
    ? new Date(watchedStartDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null

  const formattedEndDate = watchedEndDate
    ? new Date(watchedEndDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null

  if (!isAddMode && !budget) {
    return (
      <View style={budgetModifyStyles.container}>
        <View style={budgetModifyStyles.loadingContainer}>
          <Text variant="default">
            {t("screens.settings.budgets.form.loadingText")}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={budgetModifyStyles.container}>
      <ScrollIntoViewProvider
        scrollViewStyle={budgetModifyStyles.scrollView}
        contentContainerStyle={budgetModifyStyles.scrollContent}
      >
        <View style={budgetModifyStyles.form} key={budget?.id ?? NewEnum.NEW}>
          {/* Icon picker */}
          <ChangeIconInline
            currentIcon={formIcon}
            onIconSelected={handleIconSelected}
            colorScheme={currentColorScheme}
          />

          {/* Name section */}
          <View style={budgetModifyStyles.nameSection}>
            <Text variant="small" style={budgetModifyStyles.label}>
              {t("screens.settings.budgets.form.nameLabel")}
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t(
                    "screens.settings.budgets.form.namePlaceholder",
                  )}
                  error={!!errors.name}
                />
              )}
            />
            {errors.name && (
              <Text variant="small" style={budgetModifyStyles.errorText}>
                {t(errors.name.message as TranslationKey)}
              </Text>
            )}
          </View>

          {/* Settings list: currency/accounts, amount, category, color, period, date pickers, isActive, alert threshold */}
          <View style={budgetModifyStyles.settingsList}>
            {/* Currency + Accounts selector */}
            <CurrencyAccountSelector
              accounts={accounts}
              selectedCurrency={watchedCurrencyCode || null}
              selectedAccountIds={watchedAccountIds}
              onCurrencyChange={(c) =>
                setValue("currencyCode", c, { shouldDirty: true })
              }
              onAccountIdsChange={(ids) =>
                setValue("accountIds", ids, { shouldDirty: true })
              }
            />

            {/* Amount input */}
            <View style={budgetModifyStyles.amountSection}>
              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, value } }) => (
                  <SmartAmountInput
                    value={value}
                    onChange={onChange}
                    currencyCode={watchedCurrencyCode || undefined}
                    label={t("screens.settings.budgets.form.amountLabel")}
                    error={
                      errors.amount
                        ? t(errors.amount.message as TranslationKey)
                        : undefined
                    }
                  />
                )}
              />
            </View>

            {/* Category picker row */}
            <InlineCategoryPicker
              categories={categories}
              selectedIds={watchedCategoryIds}
              onSelectionChange={(ids) =>
                setValue("categoryIds", ids, { shouldDirty: true })
              }
              label={t("screens.settings.budgets.form.categoryLabel")}
            />

            {/* Color selector */}
            <ColorVariantInline
              selectedSchemeName={formColorSchemeName ?? undefined}
              onColorSelected={handleColorSelected}
              onClearSelection={handleColorCleared}
            />

            {/* Period chips row */}
            <View style={budgetModifyStyles.periodSection}>
              <Text variant="small" style={budgetModifyStyles.periodLabel}>
                {t("screens.settings.budgets.form.periodLabel")}
              </Text>
              <View style={budgetModifyStyles.periodChipsRow}>
                {PERIOD_OPTIONS.map((period) => (
                  <Chip
                    key={period}
                    label={t(`screens.settings.budgets.periods.${period}`)}
                    selected={watchedPeriod === period}
                    onPress={() =>
                      setValue("period", period, { shouldDirty: true })
                    }
                  />
                ))}
              </View>
            </View>

            {/* Custom period date pickers — only shown when period === 'custom' */}
            {watchedPeriod === BudgetPeriodEnum.CUSTOM && (
              <>
                {/* Start Date row */}
                <Pressable
                  style={budgetModifyStyles.switchRow}
                  onPress={() =>
                    startDatePicker.open(new Date(watchedStartDate))
                  }
                >
                  <View style={budgetModifyStyles.switchLeft}>
                    <IconSvg name="calendar" size={24} />
                    <Text
                      variant="default"
                      style={budgetModifyStyles.switchLabel}
                    >
                      {t("screens.settings.budgets.form.startDateLabel")}
                    </Text>
                  </View>
                  <Text
                    variant="default"
                    style={budgetModifyStyles.switchLabel}
                  >
                    {formattedStartDate ?? "—"}
                  </Text>
                </Pressable>

                {/* End Date row */}
                <Pressable
                  style={budgetModifyStyles.switchRow}
                  onPress={() =>
                    endDatePicker.open(
                      watchedEndDate ? new Date(watchedEndDate) : new Date(),
                    )
                  }
                >
                  <View style={budgetModifyStyles.switchLeft}>
                    <IconSvg name="calendar" size={24} />
                    <Text
                      variant="default"
                      style={budgetModifyStyles.switchLabel}
                    >
                      {t("screens.settings.budgets.form.endDateLabel")}
                    </Text>
                  </View>
                  <Text
                    variant="default"
                    style={budgetModifyStyles.switchLabel}
                  >
                    {formattedEndDate ?? "—"}
                  </Text>
                </Pressable>
                {errors.endDate && (
                  <Text variant="small" style={budgetModifyStyles.errorText}>
                    {t(errors.endDate.message as TranslationKey)}
                  </Text>
                )}
              </>
            )}

            {/* Alert threshold input (optional %) */}
            <View style={budgetModifyStyles.amountSection}>
              <Text variant="small" style={budgetModifyStyles.label}>
                {t("screens.settings.budgets.form.alertThresholdLabel")}
              </Text>
              <Controller
                control={control}
                name="alertThreshold"
                render={({ field: { onChange, onBlur } }) => (
                  <Input
                    value={
                      watchedAlertThreshold != null
                        ? String(watchedAlertThreshold)
                        : ""
                    }
                    onChangeText={(text) => {
                      if (text === "") {
                        onChange(null)
                        return
                      }
                      const parsed = Number.parseFloat(text)
                      onChange(Number.isNaN(parsed) ? null : parsed)
                    }}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    placeholder="80"
                    error={!!errors.alertThreshold}
                  />
                )}
              />
              {errors.alertThreshold && (
                <Text variant="small" style={budgetModifyStyles.errorText}>
                  {t(errors.alertThreshold.message as TranslationKey)}
                </Text>
              )}
            </View>

            {/* isActive toggle row */}
            <View style={budgetModifyStyles.switchRow}>
              <View style={budgetModifyStyles.switchLeft}>
                <IconSvg name="circle-dot" size={24} />
                <Text variant="default" style={budgetModifyStyles.switchLabel}>
                  {t("screens.settings.budgets.form.isActiveLabel")}
                </Text>
              </View>
              <Controller
                control={control}
                name="isActive"
                render={({ field: { onChange, value } }) => (
                  <Switch value={value} onValueChange={onChange} />
                )}
              />
            </View>
          </View>

          {!isAddMode && <Separator />}
        </View>

        {/* Delete + Duplicate buttons (edit mode only) */}
        {!isAddMode && (
          <View style={budgetModifyStyles.deleteSection}>
            <Button
              variant="ghost"
              onPress={() => setDeleteModalVisible(true)}
              style={budgetModifyStyles.actionButton}
            >
              <IconSvg
                name="trash"
                size={20}
                color={budgetModifyStyles.deleteIcon.color}
              />
              <Text variant="default" style={budgetModifyStyles.deleteText}>
                {t("screens.settings.budgets.form.deleteLabel")}
              </Text>
            </Button>
            <Button
              variant="ghost"
              onPress={handleDuplicate}
              style={budgetModifyStyles.actionButton}
            >
              <IconSvg
                name="copy"
                size={20}
                color={budgetModifyStyles.switchLabel.color}
              />
              <Text variant="default" style={budgetModifyStyles.switchLabel}>
                {t("screens.settings.budgets.form.duplicateLabel")}
              </Text>
            </Button>
          </View>
        )}
      </ScrollIntoViewProvider>

      <BudgetFormFooter
        formName={formName}
        isAddMode={isAddMode}
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        onCancel={handleGoBack}
        onSave={handleSubmit}
      />

      <BudgetFormModals
        deleteModalVisible={deleteModalVisible}
        unsavedModalVisible={unsavedModalVisible}
        isAddMode={isAddMode}
        budget={budget}
        onCloseDeleteModal={() => setDeleteModalVisible(false)}
        onCloseUnsavedModal={() => setUnsavedModalVisible(false)}
        onConfirmDelete={handleDelete}
        onDiscardAndNavigate={() => {
          setUnsavedModalVisible(false)
          confirmNavigation()
        }}
      />

      <DateTimePickerModal {...startDatePicker.modalProps} />
      <DateTimePickerModal {...endDatePicker.modalProps} />
    </View>
  )
}
