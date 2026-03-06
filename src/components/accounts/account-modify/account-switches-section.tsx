import type { Control, UseFormSetValue } from "react-hook-form"
import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { IconSymbol } from "~/components/ui/icon-symbol"
import { Pressable } from "~/components/ui/pressable"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { AddAccountsFormInput } from "~/schemas/accounts.schema"

import { accountModifyStyles } from "./account-modify.styles"

interface AccountSwitchesSectionProps {
  control: Control<AddAccountsFormInput>
  isAddMode: boolean
  formIsPrimary: boolean | undefined
  setValue: UseFormSetValue<AddAccountsFormInput>
}

export function AccountSwitchesSection({
  control,
  isAddMode,
  formIsPrimary,
  setValue,
}: AccountSwitchesSectionProps) {
  const { t } = useTranslation()

  return (
    <View style={accountModifyStyles.switchesSection}>
      <Controller
        control={control}
        name="excludeFromBalance"
        render={({ field: { value, onChange } }) => (
          <Pressable
            style={accountModifyStyles.switchRow}
            onPress={() => onChange(!value)}
            accessibilityRole="switch"
            accessibilityState={{ checked: value }}
          >
            <View style={accountModifyStyles.switchLeft}>
              <IconSymbol name="playlist-remove" size={24} />
              <Text variant="default" style={accountModifyStyles.switchLabel}>
                {t("screens.accounts.form.excludeFromBalanceLabel")}
              </Text>
            </View>

            <View pointerEvents="none">
              <Switch value={value} />
            </View>
          </Pressable>
        )}
      />

      {!isAddMode && (
        <View style={accountModifyStyles.primaryAccountBlock}>
          <Controller
            control={control}
            name="isPrimary"
            render={({ field: { value, onChange } }) => (
              <Pressable
                style={accountModifyStyles.switchRow}
                onPress={() => {
                  const next = !value
                  if (next) setValue("isArchived", false, { shouldDirty: true })
                  onChange(next)
                }}
                accessibilityRole="switch"
                accessibilityState={{ checked: value }}
              >
                <View style={accountModifyStyles.switchLeft}>
                  <IconSymbol name="star" size={24} />
                  <Text
                    variant="default"
                    style={accountModifyStyles.switchLabel}
                  >
                    {t("screens.accounts.form.primaryAccountLabel")}
                  </Text>
                </View>

                <View pointerEvents="none">
                  <Switch value={value} />
                </View>
              </Pressable>
            )}
          />
          {formIsPrimary && (
            <View style={accountModifyStyles.primaryAccountHintContainer}>
              <IconSymbol
                name="information"
                style={accountModifyStyles.primaryAccountHintIcon}
                size={14}
              />
              <Text
                variant="small"
                style={accountModifyStyles.primaryAccountHint}
              >
                {t("screens.accounts.form.primaryAccountHint")}
              </Text>
            </View>
          )}
        </View>
      )}

      {!isAddMode && (
        <Controller
          control={control}
          name="isArchived"
          render={({ field: { value, onChange } }) => (
            <Pressable
              style={accountModifyStyles.switchRow}
              onPress={() => {
                const next = !value
                if (next) setValue("isPrimary", false, { shouldDirty: true })
                onChange(next)
              }}
              accessibilityRole="switch"
              accessibilityState={{ checked: value }}
            >
              <View style={accountModifyStyles.switchLeft}>
                <IconSymbol name="archive-arrow-down" size={24} />
                <Text variant="default" style={accountModifyStyles.switchLabel}>
                  {t("screens.accounts.form.archiveLabel")}
                </Text>
              </View>

              <View pointerEvents="none">
                <Switch value={value} />
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  )
}
