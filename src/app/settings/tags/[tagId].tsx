import { zodResolver } from "@hookform/resolvers/zod"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { ActionButtons } from "~/components/tag/action-buttons"
import { DeleteSection } from "~/components/tag/delete-section"
import { FormTagFields } from "~/components/tag/form-tag-fields"
import { FormTagModals } from "~/components/tag/form-tag-modals"
import { TypeTabs } from "~/components/tag/type-tabs"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import type { IconSvgName } from "~/components/ui/icon-svg"
import { View } from "~/components/ui/view"
import { ScrollIntoViewProvider } from "~/contexts/scroll-into-view-context"
import {
  createTag,
  deleteTagById,
  updateTagById,
} from "~/database/services-sqlite/tag-service"
import { useNavigationGuard } from "~/hooks/use-navigation-guard"
import { type AddTagsFormSchema, addTagsSchema } from "~/schemas/tags.schema"
import { useTag } from "~/stores/db/tag.store"
import { getThemeStrict } from "~/styles/theme/registry"
import { NewEnum } from "~/types/new"
import { type Tag, TagKindEnum, type TagKindType } from "~/types/tags"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

interface EditTagScreenInnerProps {
  tagId: string
  tag?: Tag
}

function EditTagScreenInner({ tagId, tag }: EditTagScreenInnerProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const navigation = useNavigation()
  const [unsavedModalVisible, setUnsavedModalVisible] = useState(false)

  const isAddMode = tagId === NewEnum.NEW || !tagId

  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isDirty, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(addTagsSchema),
    defaultValues: {
      name: tag?.name ?? "",
      type: tag?.type || TagKindEnum.GENERIC,
      icon: tag?.icon || "tag-outline",
      colorSchemeName: tag?.colorSchemeName || undefined,
    },
  })

  const formName = watch("name")
  const formIcon = watch("icon")
  const formColorSchemeName = watch("colorSchemeName")
  const formType = watch("type")

  const iconBasedType = (type?: TagKindType): IconSvgName => {
    if (type === TagKindEnum.CONTACT) return "address-book-outline"
    if (type === TagKindEnum.LOCATION) return "map-outline"
    return "tag"
  }

  const handleConfirm = useCallback(() => {
    router.back()
  }, [router])

  const handleBlock = useCallback(() => {
    setUnsavedModalVisible(true)
  }, [])

  const { confirmNavigation, allowNavigation } = useNavigationGuard({
    navigation,
    when: isDirty && !isSubmitting,
    onConfirm: handleConfirm,
    onBlock: handleBlock,
  })

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const onSubmit = async (data: AddTagsFormSchema) => {
    try {
      if (isAddMode) {
        await createTag(data)
      } else {
        await updateTagById(tagId, data)
      }
      allowNavigation()
      router.back()
    } catch (error) {
      logger.error("Error saving tag", { error })
      Toast.error({
        title: t("common.toast.error"),
        description: isAddMode
          ? t("screens.settings.tags.form.toast.createFailed")
          : t("screens.settings.tags.form.toast.updateFailed"),
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTagById(tagId)
      allowNavigation()
      router.back()
    } catch (error) {
      logger.error("Error deleting tag", { error })
      Toast.error({
        title: t("common.toast.error"),
        description: t("screens.settings.tags.form.toast.deleteFailed"),
      })
    }
  }

  const currentColorScheme = getThemeStrict(formColorSchemeName)

  if (!isAddMode && !tag) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicatorMinty />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollIntoViewProvider
        scrollViewStyle={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <TypeTabs
          value={formType}
          onValueChange={(value) => {
            setValue("type", value, { shouldDirty: true })
            setValue("icon", iconBasedType(value), { shouldDirty: true })
          }}
        />

        <FormTagFields
          control={control}
          errors={errors}
          formType={formType}
          formIcon={formIcon}
          formColorSchemeName={formColorSchemeName}
          currentColorScheme={currentColorScheme}
          setValue={setValue}
          tag={tag}
          isAddMode={isAddMode}
        />

        {!isAddMode && (
          <DeleteSection onDeletePress={() => setDeleteModalVisible(true)} />
        )}
      </ScrollIntoViewProvider>

      <ActionButtons
        onCancelPress={() => router.back()}
        onSavePress={handleFormSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        isAddMode={isAddMode}
        isDirty={isDirty}
        formName={formName}
      />

      <FormTagModals
        deleteModalVisible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        tag={tag}
        handleDelete={handleDelete}
        unsavedModalVisible={unsavedModalVisible}
        setUnsavedModalVisible={setUnsavedModalVisible}
        confirmNavigation={confirmNavigation}
      />
    </View>
  )
}

export default function EditTagScreen() {
  const { tagId } = useLocalSearchParams<{ tagId: string }>()
  const tag = useTag(tagId ?? "")

  if (tagId === NewEnum.NEW || !tagId) {
    return <EditTagScreenInner tagId={NewEnum.NEW} />
  }

  return <EditTagScreenInner key={tagId} tagId={tagId} tag={tag} />
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
}))
