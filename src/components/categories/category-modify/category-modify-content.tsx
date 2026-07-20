import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigation, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { CategoryTypeInline } from "~/components/categories/category-type-inline"
import { ChangeIconInline } from "~/components/change-icon-inline"
import { ColorVariantInline } from "~/components/color-variant-inline"
import { IconSvg } from "~/components/icons"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Separator } from "~/components/ui/separator"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { ScrollIntoViewProvider } from "~/contexts/scroll-into-view-context"
import {
  createCategory,
  deleteCategoryById,
  updateCategoryById,
} from "~/database/services-sqlite/category-service"
import { useNavigationGuard } from "~/hooks/use-navigation-guard"
import type { TranslationKey } from "~/i18n/config"
import {
  type AddCategoriesFormSchema,
  addCategoriesSchema,
} from "~/schemas/categories.schema"
import { getThemeStrict } from "~/styles/theme/registry"
import { NewEnum } from "~/types/new"
import { TransactionTypeEnum } from "~/types/transactions"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

import { CategoryFormFooter } from "./category-form-footer"
import { CategoryFormModals } from "./category-form-modals"
import { categoryModifyStyles } from "./category-modify.styles"
import type { CategoryModifyContentProps } from "./types"

export function CategoryModifyContent({
  categoryModifyId,
  initialType,
  category,
}: CategoryModifyContentProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const isAddMode = categoryModifyId === NewEnum.NEW || !categoryModifyId

  const handleGoBack = useCallback(() => {
    router.back()
  }, [router])

  const TransactionType = isAddMode
    ? initialType || category?.type || TransactionTypeEnum.EXPENSE
    : category?.type || TransactionTypeEnum.EXPENSE

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
      type: TransactionType,
      colorSchemeName: category?.colorSchemeName || undefined,
    },
  })

  const formName = watch("name")
  const formIcon = watch("icon")
  const formColorSchemeName = watch("colorSchemeName")
  const formType = watch("type")

  const navigation = useNavigation()
  const [unsavedModalVisible, setUnsavedModalVisible] = useState(false)
  const { allowNavigation } = useNavigationGuard({
    navigation,
    when: isDirty && !isSubmitting,
    onBlock: () => setUnsavedModalVisible(true),
  })

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

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
    return (
      <View style={categoryModifyStyles.container}>
        <View style={categoryModifyStyles.loadingContainer}>
          <ActivityIndicatorMinty />
        </View>
      </View>
    )
  }

  return (
    <View style={categoryModifyStyles.container}>
      <ScrollIntoViewProvider
        scrollViewStyle={categoryModifyStyles.scrollView}
        contentContainerStyle={categoryModifyStyles.scrollContent}
      >
        <View
          style={categoryModifyStyles.form}
          key={category?.id || NewEnum.NEW}
        >
          <ChangeIconInline
            currentIcon={formIcon}
            onIconSelected={handleIconSelected}
            colorScheme={currentColorScheme}
          />

          <View style={categoryModifyStyles.nameSection}>
            <Text variant="small" style={categoryModifyStyles.label}>
              {t("components.categories.form.nameLabel")}
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t("components.categories.form.namePlaceholder")}
                  error={!!errors.name}
                />
              )}
            />
            {errors.name && (
              <Text variant="small" style={categoryModifyStyles.errorText}>
                {t(errors.name.message as TranslationKey)}
              </Text>
            )}
          </View>

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
          <View style={categoryModifyStyles.deleteSection}>
            <Button
              variant="ghost"
              onPress={() => setDeleteModalVisible(true)}
              style={categoryModifyStyles.actionButton}
            >
              <IconSvg
                name="trash-outline"
                size={20}
                color={categoryModifyStyles.deleteIcon.color}
              />
              <Text variant="default" style={categoryModifyStyles.deleteText}>
                {t("components.categories.form.deleteLabel")}
              </Text>
            </Button>
          </View>
        )}
      </ScrollIntoViewProvider>

      <CategoryFormFooter
        formName={formName}
        isAddMode={isAddMode}
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        onCancel={handleGoBack}
        onSave={handleSubmit}
      />

      <CategoryFormModals
        deleteModalVisible={deleteModalVisible}
        unsavedModalVisible={unsavedModalVisible}
        isAddMode={isAddMode}
        category={category}
        onCloseDeleteModal={() => setDeleteModalVisible(false)}
        onCloseUnsavedModal={() => setUnsavedModalVisible(false)}
        onConfirmDelete={handleDelete}
        onDiscardAndNavigate={() => {
          setUnsavedModalVisible(false)
          allowNavigation()
          handleGoBack()
        }}
      />
    </View>
  )
}
