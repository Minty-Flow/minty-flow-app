import {
  type Control,
  Controller,
  type FieldErrors,
  type UseFormSetValue,
} from "react-hook-form"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { ChangeIconInline } from "~/components/change-icon-inline"
import { ColorVariantInline } from "~/components/color-variant-inline"
import { ContactSelectorModal } from "~/components/selector-modals"
import { Input } from "~/components/ui/input"
import { Separator } from "~/components/ui/separator"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TranslationKey } from "~/i18n/config"
import type { AddTagsFormSchema } from "~/schemas/tags.schema"
import type { MintyColorScheme } from "~/styles/theme/types"
import { NewEnum } from "~/types/new"
import type { Tag, TagKindType } from "~/types/tags"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

interface FormTagFieldsProps {
  control: Control<AddTagsFormSchema>
  errors: FieldErrors<AddTagsFormSchema>
  formType: TagKindType
  formIcon?: string
  formColorSchemeName?: string
  currentColorScheme?: MintyColorScheme
  setValue: UseFormSetValue<AddTagsFormSchema>
  tag?: Tag
  isAddMode: boolean
}

export const FormTagFields = ({
  control,
  errors,
  formType,
  formIcon,
  formColorSchemeName,
  currentColorScheme,
  setValue,
  tag,
  isAddMode,
}: FormTagFieldsProps) => {
  const { t } = useTranslation()

  return (
    <View style={styles.form} key={tag?.id || NewEnum.NEW}>
      {/* Icon Selection – inline toggle (Icon / Emoji/Letter / Image) */}
      <ChangeIconInline
        currentIcon={formIcon}
        onIconSelected={(icon) => setValue("icon", icon, { shouldDirty: true })}
        colorScheme={currentColorScheme}
      />

      {/* Name Section */}
      <View style={styles.nameSection}>
        <Text variant="small" style={styles.label}>
          {formType === "contact"
            ? t("screens.settings.tags.form.nameLabelContact")
            : t("screens.settings.tags.form.nameLabelGeneric")}
        </Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={
                formType === "contact"
                  ? t("screens.settings.tags.form.placeholderContact")
                  : t("screens.settings.tags.form.placeholderGeneric")
              }
              error={!!errors.name}
              editable={true}
            />
          )}
        />
        {errors.name && (
          <Text variant="small" style={styles.errorText}>
            {t(errors.name.message as TranslationKey)}
          </Text>
        )}
      </View>

      {/* Settings List */}
      <View style={styles.settingsList}>
        {/* Person: contact selector – inline with search and scroll */}
        {formType === "contact" && (
          <ContactSelectorModal
            onContactSelected={(contact) => {
              if (contact.name) {
                setValue("name", contact.name, { shouldDirty: true })
              }
            }}
            onPermissionDenied={() => {
              Toast.warn({
                title: t("screens.settings.tags.form.contactPermission.denied"),
                description: t(
                  "screens.settings.tags.form.contactPermission.deniedDescription",
                ),
              })
              logger.warn("Contacts permission denied")
            }}
          />
        )}

        {/* Color Selection – inline panel */}
        <ColorVariantInline
          selectedSchemeName={formColorSchemeName || undefined}
          onColorSelected={(scheme) => {
            setValue("colorSchemeName", scheme, { shouldDirty: true })
          }}
          onClearSelection={() =>
            setValue("colorSchemeName", undefined, {
              shouldDirty: true,
            })
          }
        />
      </View>

      {/* Divider */}
      {!isAddMode && <Separator />}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  form: {
    gap: 30,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.onSurface,
    letterSpacing: 0.5,
  },
  nameSection: {
    gap: 10,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: 4,
    textAlign: "center",
  },
  settingsList: {
    gap: 0,
  },
}))
