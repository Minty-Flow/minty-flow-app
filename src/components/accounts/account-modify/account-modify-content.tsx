import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { AccountTypeInline } from "~/components/accounts/account-type-inline"
import { ChangeIconInline } from "~/components/change-icon-inline"
import { ColorVariantInline } from "~/components/color-variant-inline"
import { CurrencySelectorModal } from "~/components/selector-modals"
import { SmartAmountInput } from "~/components/smart-amount-input"
import { Input } from "~/components/ui/input"
import { Separator } from "~/components/ui/separator"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { ScrollIntoViewProvider } from "~/contexts/scroll-into-view-context"
import type { TranslationKey } from "~/i18n/config"
import { NewEnum } from "~/types/new"

import { AccountDeleteSection } from "./account-delete-section"
import { AccountFormFooter } from "./account-form-footer"
import { AccountFormModals } from "./account-form-modals"
import { accountModifyStyles } from "./account-modify.styles"
import { AccountSwitchesSection } from "./account-switches-section"
import type { AccountModifyContentProps } from "./types"
import { useAccountForm } from "./use-account-form"

export function AccountModifyContent({
  accountId,
  accountModel,
  account,
  transactionCount = 0,
}: AccountModifyContentProps) {
  const { t } = useTranslation()
  const {
    isAddMode,
    control,
    errors,
    isDirty,
    isSubmitting,
    formName,
    formIcon,
    formColorSchemeName,
    formType,
    formCurrencyCode,
    formIsPrimary,
    currentColorScheme,
    unsavedModalVisible,
    deleteModalVisible,
    confirmNavigation,
    handleGoBack,
    setValue,
    handleSubmit,
    handleDelete,
    handleIconSelected,
    handleColorSelected,
    handleColorCleared,
    handleCurrencySelected,
    openDeleteModal,
    closeDeleteModal,
    closeUnsavedModal,
  } = useAccountForm({ accountId, accountModel, account })

  if (!isAddMode && !account) {
    return (
      <View style={accountModifyStyles.container}>
        <View style={accountModifyStyles.loadingContainer}>
          <Text variant="default">
            {t("screens.accounts.form.loadingText")}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={accountModifyStyles.container}>
      <ScrollIntoViewProvider
        scrollViewStyle={accountModifyStyles.scrollView}
        contentContainerStyle={accountModifyStyles.scrollContent}
      >
        <View style={accountModifyStyles.form} key={account?.id || NewEnum.NEW}>
          <ChangeIconInline
            currentIcon={formIcon}
            onIconSelected={handleIconSelected}
            colorScheme={currentColorScheme}
            iconSize={64}
          />

          <View style={accountModifyStyles.nameSection}>
            <Text variant="small" style={accountModifyStyles.label}>
              {t("screens.accounts.form.namePlaceholder")}
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t("screens.accounts.form.placeholder")}
                  error={!!errors.name}
                />
              )}
            />
            {errors.name && (
              <Text variant="small" style={accountModifyStyles.errorText}>
                {t(errors.name.message as TranslationKey)}
              </Text>
            )}
          </View>

          <View style={accountModifyStyles.balanceSection}>
            <Controller
              control={control}
              name="balance"
              render={({ field: { value, onChange } }) => (
                <SmartAmountInput
                  value={Number(value) || 0}
                  onChange={(v) => onChange(v)}
                  currencyCode={formCurrencyCode}
                  label={t("screens.accounts.form.initialBalance")}
                  placeholder="0"
                  error={
                    errors.balance?.message
                      ? t(errors.balance.message as TranslationKey)
                      : undefined
                  }
                />
              )}
            />
          </View>

          <View style={accountModifyStyles.settingsList}>
            <CurrencySelectorModal
              selectedCurrencyCode={formCurrencyCode}
              onCurrencySelected={handleCurrencySelected}
            />

            <AccountTypeInline
              selectedType={formType}
              onTypeSelected={(type) =>
                setValue("type", type, { shouldDirty: true })
              }
            />

            <ColorVariantInline
              selectedSchemeName={formColorSchemeName || undefined}
              onColorSelected={handleColorSelected}
              onClearSelection={handleColorCleared}
            />
          </View>

          <Separator />

          <AccountSwitchesSection
            control={control}
            isAddMode={isAddMode}
            formIsPrimary={formIsPrimary}
            setValue={setValue}
          />

          {!isAddMode && <Separator />}
        </View>

        {!isAddMode && (
          <AccountDeleteSection
            account={account}
            onDeletePress={openDeleteModal}
          />
        )}
      </ScrollIntoViewProvider>

      <AccountFormFooter
        formName={formName}
        isAddMode={isAddMode}
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        onCancel={handleGoBack}
        onSave={handleSubmit}
      />

      <AccountFormModals
        deleteModalVisible={deleteModalVisible}
        unsavedModalVisible={unsavedModalVisible}
        isAddMode={isAddMode}
        account={account}
        transactionCount={transactionCount}
        onCloseDeleteModal={closeDeleteModal}
        onCloseUnsavedModal={closeUnsavedModal}
        onConfirmDelete={handleDelete}
        onDiscardAndNavigate={() => {
          closeUnsavedModal()
          confirmNavigation()
        }}
      />
    </View>
  )
}
