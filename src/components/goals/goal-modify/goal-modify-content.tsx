import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigation, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { ChangeIconInline } from "~/components/change-icon-inline"
import { ColorVariantInline } from "~/components/color-variant-inline"
import { CurrencyAccountSelector } from "~/components/currency-account-selector"
import { SmartAmountInput } from "~/components/smart-amount-input"
import { TabsMinty } from "~/components/tabs-minty"
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
  archiveGoal,
  createGoal,
  destroyGoal,
  unarchiveGoal,
  updateGoal,
} from "~/database/services/goal-service"
import { useNavigationGuard } from "~/hooks/use-navigation-guard"
import type { TranslationKey } from "~/i18n/config"
import { type AddGoalFormSchema, addGoalSchema } from "~/schemas/goals.schema"
import { getThemeStrict } from "~/styles/theme/registry"
import { type GoalType, GoalTypeEnum } from "~/types/goals"
import { NewEnum } from "~/types/new"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

import { GoalFormFooter } from "./goal-form-footer"
import { GoalFormModals } from "./goal-form-modals"
import { goalModifyStyles } from "./goal-modify.styles"
import type { GoalModifyContentProps } from "./types"

export function GoalModifyContent({
  goalModifyId,
  goal,
  goalModel,
  accounts,
}: GoalModifyContentProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { theme } = useUnistyles()

  const isAddMode = goalModifyId === NewEnum.NEW || !goalModifyId

  const handleGoBack = useCallback(() => {
    router.back()
  }, [router])

  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isDirty, isSubmitting },
    watch,
    setValue,
  } = useForm<AddGoalFormSchema>({
    resolver: zodResolver(addGoalSchema),
    defaultValues: {
      goalType: goal?.goalType ?? GoalTypeEnum.SAVINGS,
      name: goal?.name ?? "",
      description: goal?.description ?? null,
      icon: goal?.icon ?? "target",
      colorSchemeName: goal?.colorSchemeName ?? undefined,
      currencyCode: goal?.currencyCode ?? "",
      accountIds: goal?.accountIds ?? [],
      targetAmount: goal?.targetAmount ?? 0,
      targetDate: goal?.targetDate ? goal.targetDate.getTime() : null,
    },
  })

  const formGoalType = watch("goalType")
  const formName = watch("name")
  const formIcon = watch("icon")
  const formColorSchemeName = watch("colorSchemeName")
  const formCurrencyCode = watch("currencyCode")
  const formAccountIds = watch("accountIds")
  const formTargetDate = watch("targetDate")

  const navigation = useNavigation()

  const [unsavedModalVisible, setUnsavedModalVisible] = useState(false)
  const { confirmNavigation, allowNavigation } = useNavigationGuard({
    navigation,
    when: isDirty && !isSubmitting,
    onConfirm: handleGoBack,
    onBlock: () => setUnsavedModalVisible(true),
  })

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [archiveModalVisible, setArchiveModalVisible] = useState(false)

  const targetDatePicker = useDateTimePicker({
    onConfirm: (date) =>
      setValue("targetDate", date.getTime(), { shouldDirty: true }),
  })

  const onSubmit = async (data: AddGoalFormSchema) => {
    const trimmedName = data.name.trim()

    try {
      if (isAddMode) {
        await createGoal({
          ...data,
          name: trimmedName,
        })

        allowNavigation()
        handleGoBack()
      } else {
        if (!goalModel) {
          Toast.error({
            title: t("common.toast.error"),
            description: t("screens.settings.goals.form.toast.notFound"),
          })
          return
        }

        await updateGoal(goalModel, {
          ...data,
          name: trimmedName,
        })

        allowNavigation()
        handleGoBack()
      }
    } catch (error) {
      logger.error("Error saving goal", { error })
      Toast.error({
        title: t("common.toast.error"),
        description: isAddMode
          ? t("screens.settings.goals.form.toast.createFailed")
          : t("screens.settings.goals.form.toast.updateFailed"),
      })
    }
  }

  const handleSubmit = handleFormSubmit(onSubmit)

  const handleDelete = async () => {
    try {
      if (!goalModel || !goal) {
        Toast.error({
          title: t("common.toast.error"),
          description: t("screens.settings.goals.form.toast.notFound"),
        })
        return
      }

      await destroyGoal(goalModel)

      allowNavigation()
      // Dismiss 2 levels: the edit screen and the goal detail screen
      router.dismiss(2)
    } catch (error) {
      logger.error("Error deleting goal", { error })
      Toast.error({
        title: t("common.toast.error"),
        description: t("screens.settings.goals.form.toast.deleteFailed"),
      })
    }
  }

  const handleArchive = async () => {
    try {
      if (!goalModel || !goal) return
      if (goal.isArchived) {
        await unarchiveGoal(goalModel)
        Toast.success({
          title: t("screens.settings.goals.unarchiveSuccess"),
        })
      } else {
        await archiveGoal(goalModel)
        Toast.success({
          title: t("screens.settings.goals.archiveSuccess"),
        })
      }
      allowNavigation()
      router.back()
    } catch (error) {
      logger.error("Error archiving goal", { error })
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

  const handleClearDate = () => {
    setValue("targetDate", null, { shouldDirty: true })
  }

  const handleGoalTypeChange = useCallback(
    (v: GoalType) => setValue("goalType", v, { shouldDirty: true }),
    [setValue],
  )

  const currentColorScheme = getThemeStrict(formColorSchemeName)

  const formattedTargetDate = formTargetDate
    ? new Date(formTargetDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null

  if (!isAddMode && !goal) {
    return (
      <View style={goalModifyStyles.container}>
        <View style={goalModifyStyles.loadingContainer}>
          <Text variant="default">
            {t("screens.settings.goals.form.loadingText")}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={goalModifyStyles.container}>
      <ScrollIntoViewProvider
        scrollViewStyle={goalModifyStyles.scrollView}
        contentContainerStyle={goalModifyStyles.scrollContent}
      >
        <View style={goalModifyStyles.form} key={goal?.id ?? NewEnum.NEW}>
          {/* Goal type selector */}
          <TabsMinty<GoalType>
            items={[
              {
                value: GoalTypeEnum.SAVINGS,
                label: t("screens.settings.goals.form.goalType.savings"),
                icon: "caret-down",
              },
              {
                value: GoalTypeEnum.EXPENSE,
                label: t("screens.settings.goals.form.goalType.expense"),
                icon: "caret-up",
              },
            ]}
            activeValue={formGoalType}
            onValueChange={handleGoalTypeChange}
            variant="segmented"
          />

          {/* Icon picker */}
          <ChangeIconInline
            currentIcon={formIcon}
            onIconSelected={handleIconSelected}
            colorScheme={currentColorScheme}
          />

          {/* Name input */}
          <View style={goalModifyStyles.nameSection}>
            <Text variant="small" style={goalModifyStyles.label}>
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
              <Text variant="small" style={goalModifyStyles.errorText}>
                {t(errors.name.message as TranslationKey)}
              </Text>
            )}
          </View>

          {/* Description input (optional, multiline) */}
          <View style={goalModifyStyles.descriptionSection}>
            <Text variant="small" style={goalModifyStyles.label}>
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

          {/* Currency and account selector */}
          <View>
            <CurrencyAccountSelector
              accounts={accounts}
              selectedCurrency={formCurrencyCode || null}
              selectedAccountIds={formAccountIds}
              onCurrencyChange={(code) => {
                setValue("currencyCode", code, { shouldDirty: true })
              }}
              onAccountIdsChange={(ids) => {
                setValue("accountIds", ids, { shouldDirty: true })
              }}
            />
          </View>

          {/* Target amount */}
          <View style={goalModifyStyles.targetAmountSection}>
            <Controller
              control={control}
              name="targetAmount"
              render={({ field: { onChange, value } }) => (
                <SmartAmountInput
                  value={value}
                  onChange={onChange}
                  currencyCode={formCurrencyCode || undefined}
                  label={t("screens.settings.goals.form.targetAmountLabel")}
                  error={
                    errors.targetAmount
                      ? t(errors.targetAmount.message as TranslationKey)
                      : undefined
                  }
                />
              )}
            />
          </View>

          {/* Target date — Pressable row that opens a date picker modal */}
          <Pressable
            style={goalModifyStyles.targetDateSettingsRow}
            onPress={() =>
              targetDatePicker.open(
                formTargetDate ? new Date(formTargetDate) : new Date(),
              )
            }
          >
            <View style={goalModifyStyles.targetDateLeft}>
              <IconSvg name="calendar" size={24} />
              <Text variant="default" style={goalModifyStyles.switchLabel}>
                {t("screens.settings.goals.form.targetDateLabel")}
              </Text>
            </View>
            <View style={goalModifyStyles.targetDateRight}>
              {formattedTargetDate ? (
                <>
                  <Text
                    variant="default"
                    style={goalModifyStyles.targetDateText}
                  >
                    {formattedTargetDate}
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
                  style={goalModifyStyles.targetDatePlaceholder}
                >
                  {t("screens.settings.goals.card.noDeadline")}
                </Text>
              )}
            </View>
          </Pressable>

          {/* Color variant picker */}
          <ColorVariantInline
            selectedSchemeName={formColorSchemeName ?? undefined}
            onColorSelected={handleColorSelected}
            onClearSelection={handleColorCleared}
          />

          {!isAddMode && <Separator />}
        </View>

        {/* Archive / delete buttons — edit mode only */}
        {!isAddMode && (
          <View style={goalModifyStyles.deleteSection}>
            <Button
              variant="ghost"
              onPress={() => setArchiveModalVisible(true)}
              style={goalModifyStyles.actionButton}
            >
              <IconSvg
                name={goal?.isArchived ? "archive-off" : "archive"}
                size={20}
                color={goalModifyStyles.archiveIcon.color}
              />
              <Text variant="default" style={goalModifyStyles.archiveText}>
                {goal?.isArchived
                  ? t("screens.settings.goals.form.unarchiveLabel")
                  : t("screens.settings.goals.form.archiveLabel")}
              </Text>
            </Button>
            <Button
              variant="ghost"
              onPress={() => setDeleteModalVisible(true)}
              style={goalModifyStyles.actionButton}
            >
              <IconSvg
                name="trash"
                size={20}
                color={goalModifyStyles.deleteIcon.color}
              />
              <Text variant="default" style={goalModifyStyles.deleteText}>
                {t("screens.settings.goals.form.deleteLabel")}
              </Text>
            </Button>
          </View>
        )}
      </ScrollIntoViewProvider>

      <GoalFormFooter
        formName={formName}
        isAddMode={isAddMode}
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        onCancel={handleGoBack}
        onSave={handleSubmit}
      />

      <GoalFormModals
        deleteModalVisible={deleteModalVisible}
        archiveModalVisible={archiveModalVisible}
        unsavedModalVisible={unsavedModalVisible}
        isAddMode={isAddMode}
        goal={goal}
        onCloseDeleteModal={() => setDeleteModalVisible(false)}
        onCloseArchiveModal={() => setArchiveModalVisible(false)}
        onCloseUnsavedModal={() => setUnsavedModalVisible(false)}
        onConfirmDelete={handleDelete}
        onConfirmArchive={handleArchive}
        onDiscardAndNavigate={() => {
          setUnsavedModalVisible(false)
          confirmNavigation()
        }}
      />

      <DateTimePickerModal {...targetDatePicker.modalProps} />
    </View>
  )
}
