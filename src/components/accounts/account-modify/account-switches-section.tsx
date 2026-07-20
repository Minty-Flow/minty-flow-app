import type { Control } from "react-hook-form"
import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { IconSvg } from "~/components/icons"
import { ListItem } from "~/components/ui/list-item"
import { Separator } from "~/components/ui/separator"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { AddAccountsFormInput } from "~/schemas/accounts.schema"

import { accountModifyStyles } from "./account-modify.styles"

interface AccountSwitchesSectionProps {
  control: Control<AddAccountsFormInput>
  isAddMode: boolean
  formIsPrimary: boolean | undefined
}

export function AccountSwitchesSection({
  control,
  isAddMode,
  formIsPrimary,
}: AccountSwitchesSectionProps) {
  const { t } = useTranslation()

  return (
    <View style={accountModifyStyles.switchesSection}>
      <Separator />

      <Controller
        control={control}
        name="excludeFromBalance"
        render={({ field: { value, onChange } }) => (
          <ListItem
            style={accountModifyStyles.switchRow}
            onPress={() => onChange(!value)}
            accessibilityRole="switch"
            accessibilityState={{ checked: value }}
          >
            <View style={accountModifyStyles.switchLeft}>
              <IconSvg name="playlist-x-outline" size={24} />
              <Text variant="default" style={accountModifyStyles.switchLabel}>
                {t("screens.accounts.form.excludeFromBalanceLabel")}
              </Text>
            </View>

            <Switch value={value} />
          </ListItem>
        )}
      />

      {!isAddMode && (
        <View style={accountModifyStyles.primaryAccountBlock}>
          <Controller
            control={control}
            name="isPrimary"
            render={({ field: { value, onChange } }) => (
              <ListItem
                style={accountModifyStyles.switchRow}
                onPress={() => onChange(!value)}
                accessibilityRole="switch"
                accessibilityState={{ checked: value }}
              >
                <View style={accountModifyStyles.switchLeft}>
                  <IconSvg name="star-outline" size={24} />
                  <Text
                    variant="default"
                    style={accountModifyStyles.switchLabel}
                  >
                    {t("screens.accounts.form.primaryAccountLabel")}
                  </Text>
                </View>

                <Switch value={value} />
              </ListItem>
            )}
          />
          {formIsPrimary && (
            <View style={accountModifyStyles.primaryAccountHintContainer}>
              <IconSvg
                name="info-circle-outline"
                color={accountModifyStyles.primaryAccountHintIcon.color}
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
          {!isAddMode && <Separator />}
        </View>
      )}
    </View>
  )
}
