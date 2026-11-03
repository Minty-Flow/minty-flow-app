import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigation, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { CategoryTypeInline } from "~/components/categories/category-type-inline"
import { ChangeIconInline } from "~/components/change-icon-inline"
import { ColorVariantInline } from "~/components/color-variant-inline"
import {
  FormDeleteButton,
  FormNameField,
} from "~/components/modify-form/form-fields"
import { modifyFormStyles } from "~/components/modify-form/modify-form.styles"
import { ModifyFormFooter } from "~/components/modify-form/modify-form-footer"
import { RouteLoadingState } from "~/components/route-load-state"
import { Separator } from "~/components/ui/separator"
import { View } from "~/components/ui/view"
import { ScrollIntoViewProvider } from "~/contexts/scroll-into-view-context"
import { useCategories } from "~/database/drizzle/read-models/category-read-model"
import {
  type BudgetLosingLastCategory,
  type CategoryDeleteImpact,
  CategoryHasLoansError,
  createCategory,
  deleteCategoryById,
  getBudgetsLosingLastCategory,
  getCategoryDeleteImpact,
  getLoansUsingCategory,
  updateCategoryById,
} from "~/database/services/category-service"
import { useNavigationGuard } from "~/hooks/use-navigation-guard"
import {
  type AddCategoriesFormSchema,
  addCategoriesSchema,
} from "~/schemas/categories.schema"
import { getThemeStrict } from "~/styles/theme/registry"
import { CategoryTypeEnum } from "~/types/categories"
import { NewEnum } from "~/types/new"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

import { CategoryFormSheets } from "./category-form-sheets"
import { CategoryMoveRow } from "./category-move-row"
import type { CategoryModifyContentProps } from "./types"
export function CategoryModifyContent({
  categoryModifyId,
  initialType,
  category,
}: CategoryModifyContentProps) {
  const { t } = useTranslation()
  const [footerHeight, setFooterHeight] = useState(0)
  const router = useRouter()
  const isAddMode = categoryModifyId === NewEnum.NEW || !categoryModifyId
  const handleGoBack = () => {
    router.back()
  }
  const categoryType = isAddMode
    ? initialType || category?.type || CategoryTypeEnum.EXPENSE
    : category?.type || CategoryTypeEnum.EXPENSE
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isDirty, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(addCategoriesSchema),
    defaultValues: {
      name: category?.name || "",
      icon: category?.icon || "category-outline",
      type: categoryType,
      colorSchemeName: category?.colorSchemeName || undefined,
    },
  })
  const formName = watch("name")
  const formIcon = watch("icon")
  const formColorSchemeName = watch("colorSchemeName")
  const formType = watch("type")
  const navigation = useNavigation()
  const [unsavedSheetVisible, setUnsavedSheetVisible] = useState(false)
  const { allowNavigation } = useNavigationGuard({
    navigation,
    when: isDirty && !isSubmitting,
    onBlock: () => setUnsavedSheetVisible(true),
  })
  const [deleteSheetVisible, setDeleteSheetVisible] = useState(false)
  const [budgetsLosingCategory, setBudgetsLosingCategory] = useState<
    BudgetLosingLastCategory[]
  >([])
  const [deleteImpact, setDeleteImpact] = useState<CategoryDeleteImpact | null>(
    null,
  )
  const [moveToCategoryId, setMoveToCategoryId] = useState<string | null>(null)
  const allCategories = useCategories()
  const moveTargets = allCategories.filter(
    (c) => c.type === category?.type && c.id !== categoryModifyId,
  )
  const moveTarget = moveTargets.find((c) => c.id === moveToCategoryId)
  const hasContentToMove =
    (deleteImpact?.transactionCount ?? 0) +
      (deleteImpact?.recurringRuleCount ?? 0) >
    0

  useEffect(() => {
    if (isAddMode || !categoryModifyId) return
    getCategoryDeleteImpact(categoryModifyId)
      .then(setDeleteImpact)
      .catch((error) => logger.error("Error reading category usage", { error }))
  }, [isAddMode, categoryModifyId])

  const onSubmit = async (data: AddCategoriesFormSchema) => {
    const trimmedName = data.name.trim()
    try {
      if (isAddMode) {
        await createCategory({
          name: trimmedName,
          type: data.type,
          icon: data.icon,
          colorSchemeName: data.colorSchemeName,
        })
        allowNavigation()
        handleGoBack()
      } else {
        await updateCategoryById(categoryModifyId, {
          name: trimmedName,
          icon: data.icon,
          colorSchemeName: data.colorSchemeName,
        })
        allowNavigation()
        handleGoBack()
      }
    } catch (error) {
      logger.error("Error saving category", { error })
      Toast.error({
        title: t("common.toast.error"),
        description: isAddMode
          ? t("components.categories.form.toast.createFailed")
          : t("components.categories.form.toast.updateFailed"),
      })
    }
  }
  const handleSubmit = handleFormSubmit(onSubmit)
  const handleDeletePress = async () => {
    try {
      const loanNames = await getLoansUsingCategory(categoryModifyId)
      if (loanNames.length > 0) {
        Toast.error({
          title: t("components.categories.form.toast.cannotDelete"),
          description: t("components.categories.form.toast.cannotDeleteLoans", {
            names: loanNames.join(", "),
          }),
        })
        return
      }
      setBudgetsLosingCategory(
        await getBudgetsLosingLastCategory(categoryModifyId),
      )
      setDeleteSheetVisible(true)
    } catch (error) {
      logger.error("Error checking category before delete", { error })
      Toast.error({
        title: t("common.toast.error"),
        description: t("components.categories.form.toast.deleteFailed"),
      })
    }
  }
  const handleDelete = async () => {
    try {
      if (!category) {
        Toast.error({
          title: t("common.toast.error"),
          description: t("components.categories.form.toast.notFound"),
        })
        return false
      }
      await deleteCategoryById(categoryModifyId, {
        moveToCategoryId: moveTarget?.id,
      })
    } catch (error) {
      logger.error("Error deleting category", { error })
      Toast.error({
        title: t("common.toast.error"),
        description:
          error instanceof CategoryHasLoansError
            ? t("components.categories.form.toast.cannotDeleteLoans", {
                names: error.loanNames.join(", "),
              })
            : t("components.categories.form.toast.deleteFailed"),
      })
      return false
    }
  }
  // Runs once the delete sheet has closed: leaving earlier tears it down mid-animation.
  const handleDeleted = () => {
    allowNavigation()
    // This is cleaner than replace because it actually removes the screens from history rather than stacking a new one on top. The number 2 matches exactly how deep you pushed from /settings/categories.
    router.dismiss(2)
  }
  const handleIconSelected = (icon: string | null) => {
    setValue("icon", icon, { shouldDirty: true })
  }
  const handleColorSelected = (schemeName: string) => {
    setValue("colorSchemeName", schemeName, { shouldDirty: true })
  }
  const handleColorCleared = () => {
    setValue("colorSchemeName", null, { shouldDirty: true })
  }
  const currentColorScheme = getThemeStrict(formColorSchemeName)
  if (!isAddMode && !category) {
    return <RouteLoadingState />
  }
  return (
    <View style={modifyFormStyles.container}>
      <ScrollIntoViewProvider
        keyboardInset={footerHeight}
        scrollViewStyle={modifyFormStyles.scrollView}
        contentContainerStyle={modifyFormStyles.scrollContent}
      >
        <View style={modifyFormStyles.form} key={category?.id || NewEnum.NEW}>
          <ChangeIconInline
            currentIcon={formIcon}
            onIconSelected={handleIconSelected}
            colorScheme={currentColorScheme}
          />

          <FormNameField
            control={control}
            label={t("components.categories.form.nameLabel")}
            placeholder={t("components.categories.form.namePlaceholder")}
            error={errors.name}
          />

          <View>
            <CategoryTypeInline
              selectedType={formType}
              onTypeSelected={(type) =>
                setValue("type", type, { shouldDirty: true })
              }
              editable={isAddMode}
            />

            <ColorVariantInline
              selectedSchemeName={formColorSchemeName || undefined}
              onColorSelected={handleColorSelected}
              onClearSelection={handleColorCleared}
            />
          </View>

          {!isAddMode && <Separator />}
        </View>

        {!isAddMode && (
          <View style={modifyFormStyles.deleteSection}>
            {hasContentToMove && moveTargets.length > 0 ? (
              <CategoryMoveRow
                targets={moveTargets}
                selectedId={moveTarget?.id ?? null}
                onChange={setMoveToCategoryId}
              />
            ) : null}
            <FormDeleteButton
              label={t("components.categories.form.deleteLabel")}
              onPress={handleDeletePress}
            />
          </View>
        )}
      </ScrollIntoViewProvider>

      <ModifyFormFooter
        onHeightChange={setFooterHeight}
        formName={formName}
        isAddMode={isAddMode}
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        onCancel={handleGoBack}
        onSave={handleSubmit}
      />

      <CategoryFormSheets
        deleteSheetVisible={deleteSheetVisible}
        unsavedSheetVisible={unsavedSheetVisible}
        isAddMode={isAddMode}
        category={category}
        budgetsLosingCategory={budgetsLosingCategory}
        recurringRuleCount={deleteImpact?.recurringRuleCount ?? 0}
        moveTargetName={moveTarget?.name}
        onCloseDeleteSheet={() => setDeleteSheetVisible(false)}
        onCloseUnsavedSheet={() => setUnsavedSheetVisible(false)}
        onConfirmDelete={handleDelete}
        onDeleted={handleDeleted}
        onDiscardAndNavigate={() => {
          allowNavigation()
          handleGoBack()
        }}
      />
    </View>
  )
}
