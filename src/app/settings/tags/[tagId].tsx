import { zodResolver } from "@hookform/resolvers/zod"
import { withObservables } from "@nozbe/watermelondb/react"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { ActionButtons } from "~/components/tag/action-buttons"
import { DeleteSection } from "~/components/tag/delete-section"
import { FormTagFields } from "~/components/tag/form-tag-fields"
import { FormTagModals } from "~/components/tag/form-tag-modals"
import { LocationComingSoon } from "~/components/tag/location-coming-soon"
import { TypeTabs } from "~/components/tag/type-tabs"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { ScrollIntoViewProvider } from "~/contexts/scroll-into-view-context"
import type TagModel from "~/database/models/tag"
import {
  createTag,
  deleteTag,
  observeTagById,
  updateTag,
} from "~/database/services/tag-service"
import { modelToTag } from "~/database/utils/model-to-tag"
import { useNavigationGuard } from "~/hooks/use-navigation-guard"
import { type AddTagsFormSchema, addTagsSchema } from "~/schemas/tags.schema"
import { getThemeStrict } from "~/styles/theme/registry"
import { NewEnum } from "~/types/new"
import { type Tag, TagKindEnum, type TagKindType } from "~/types/tags"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

interface EditTagScreenProps {
  tagId: string
  tagModel?: TagModel
  tag?: Tag
}

const EditTagScreenInner = ({ tagId, tagModel, tag }: EditTagScreenProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  // Navigation guard: block leave when dirty, show confirm modal
  const navigation = useNavigation()
  const [unsavedModalVisible, setUnsavedModalVisible] = useState(false)

  const isAddMode = tagId === NewEnum.NEW || !tagId

  // Form state
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
      icon: tag?.icon || "tag",
      colorSchemeName: tag?.colorSchemeName || undefined,
    },
  })

  const formName = watch("name")
  const formIcon = watch("icon")
  const formColorSchemeName = watch("colorSchemeName")
  const formType = watch("type")

  const iconBasedType = (type?: TagKindType) => {
    if (type === TagKindEnum.CONTACT) return "account"
    if (type === TagKindEnum.LOCATION) return "map"
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
        await createTag({
          name: data.name,
          type: data.type,
          icon: data.icon,
          colorSchemeName: data.colorSchemeName,
        })
      } else {
        if (!tagModel) {
          Toast.error({
            title: t("common.toast.error"),
            description: t("screens.settings.tags.form.toast.notFound"),
          })
          return
        }
        await updateTag(tagModel, {
          name: data.name,
          type: data.type,
          icon: data.icon,
          colorSchemeName: data.colorSchemeName,
        })
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
      if (!tagModel) return
      await deleteTag(tagModel)

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
          <Text variant="default">
            {t("screens.settings.tags.form.loadingText")}
          </Text>
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
        {/* Type selector (Tabs) */}
        <TypeTabs
          value={formType}
          onValueChange={(value) => {
            setValue("type", value, { shouldDirty: true })
            setValue("icon", iconBasedType(value), { shouldDirty: true })
          }}
        />

        {formType === TagKindEnum.LOCATION ? (
          <LocationComingSoon />
        ) : (
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
        )}

        {!isAddMode && formType !== TagKindEnum.LOCATION && (
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

const EnhancedEditTagScreen = withObservables(
  ["tagId"],
  ({ tagId }: { tagId: string }) => ({
    tagModel: observeTagById(tagId),
  }),
)(({ tagId, tagModel }: { tagId: string; tagModel: TagModel }) => {
  const tag = tagModel ? modelToTag(tagModel) : undefined
  return (
    <EditTagScreenInner
      key={tagModel?.id || tagId}
      tagId={tagId}
      tagModel={tagModel}
      tag={tag}
    />
  )
})

export default function EditTagScreen() {
  const { tagId } = useLocalSearchParams<{
    tagId: string
  }>()
  if (tagId === NewEnum.NEW || !tagId)
    return <EditTagScreenInner tagId={NewEnum.NEW} />
  return <EnhancedEditTagScreen tagId={tagId} />
}
