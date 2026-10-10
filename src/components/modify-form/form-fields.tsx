import {
  type Control,
  Controller,
  type FieldError,
  type FieldValues,
  type Path,
} from "react-hook-form"
import { useTranslation } from "react-i18next"

import { IconSvg } from "~/components/icons"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TranslationKey } from "~/i18n/config"

import { modifyFormStyles } from "./modify-form.styles"

interface FormNameFieldProps<T extends FieldValues> {
  control: Control<T>
  label: string
  placeholder: string
  error: FieldError | undefined
}

/** Labelled "name" text input of a create / edit form, with its validation error. */
export function FormNameField<T extends FieldValues & { name: string }>({
  control,
  label,
  placeholder,
  error,
}: FormNameFieldProps<T>) {
  const { t } = useTranslation()
  return (
    <View style={modifyFormStyles.nameSection}>
      <Text variant="small" style={modifyFormStyles.label}>
        {label}
      </Text>
      <Controller
        control={control}
        name={"name" as Path<T>}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            error={!!error}
          />
        )}
      />
      {error && (
        <Text variant="small" style={modifyFormStyles.errorText}>
          {t(error.message as TranslationKey)}
        </Text>
      )}
    </View>
  )
}

/** Red "Delete …" button placed in a form's `deleteSection`. */
export function FormDeleteButton({
  label,
  onPress,
}: {
  label: string
  onPress: () => void
}) {
  return (
    <Button
      variant="ghost"
      onPress={onPress}
      style={modifyFormStyles.actionButton}
    >
      <IconSvg
        name="trash-outline"
        size={20}
        color={modifyFormStyles.deleteIcon.color}
      />
      <Text variant="default" style={modifyFormStyles.deleteText}>
        {label}
      </Text>
    </Button>
  )
}
