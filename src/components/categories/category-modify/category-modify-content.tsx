import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigation, useRouter } from "expo-router"
import { useState } from "react"
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
import {
  createCategory,
  deleteCategoryById,
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
import type { CategoryModifyContentProps } from "./types"
export function CategoryModifyContent({
  categoryModifyId,
  initialType,
  category,
}: CategoryModifyContentProps) {
  const { t } = useTranslation()
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
  const handleDelete = async () => {
    try {
      if (!category) {
        Toast.error({
          title: t("common.toast.error"),
          description: t("components.categories.form.toast.notFound"),
        })
        return
      }
      if (category.transactionCount > 0) {
        Toast.error({
          title: t("components.categories.form.toast.cannotDelete"),
          description: t(
            "components.categories.form.toast.cannotDeleteDescription",
            { count: category.transactionCount },
          ),
        })
        return
      }
      await deleteCategoryById(categoryModifyId)
      allowNavigation()
      // This is cleaner than replace because it actually removes the screens from history rather than stacking a new one on top. The number 2 matches exactly how deep you pushed from /settings/categories.
      router.dismiss(2)
    } catch (error) {
      logger.error("Error deleting category", { error })
      Toast.error({
        title: t("common.toast.error"),
        description: t("components.categories.form.toast.deleteFailed"),
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
  const currentColorScheme = getThemeStrict(formColorSchemeName)
  if (!isAddMode && !category) {
    return <RouteLoadingState />
  }
  return (
    <View style={modifyFormStyles.container}>
      <ScrollIntoViewProvider
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
            <FormDeleteButton
              label={t("components.categories.form.deleteLabel")}
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

      <CategoryFormSheets
        deleteSheetVisible={deleteSheetVisible}
        unsavedSheetVisible={unsavedSheetVisible}
        isAddMode={isAddMode}
        category={category}
        onCloseDeleteSheet={() => setDeleteSheetVisible(false)}
        onCloseUnsavedSheet={() => setUnsavedSheetVisible(false)}
        onConfirmDelete={handleDelete}
        onDiscardAndNavigate={() => {
          setUnsavedSheetVisible(false)
          allowNavigation()
          handleGoBack()
        }}
      />
    </View>
  )
}
