import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { AccountTypeInline } from "~/components/accounts/account-type-inline"
import { ChangeIconInline } from "~/components/change-icon-inline"
import { ColorVariantInline } from "~/components/color-variant-inline"
import { IconSvg } from "~/components/icons"
import { FormNameField } from "~/components/modify-form/form-fields"
import { modifyFormStyles } from "~/components/modify-form/modify-form.styles"
import { ModifyFormFooter } from "~/components/modify-form/modify-form-footer"
import { RouteLoadingState } from "~/components/route-load-state"
import { CurrencySelectorSheet } from "~/components/selectors/currency-selector-sheet"
import { SmartAmountInput } from "~/components/smart-amount-input"
import { Button } from "~/components/ui/button"
import { InfoBanner } from "~/components/ui/info-banner"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { ScrollIntoViewProvider } from "~/contexts/scroll-into-view-context"
import type { TranslationKey } from "~/i18n/config"
import { NewEnum } from "~/types/new"

import { AccountDeleteSection } from "./account-delete-section"
import { AccountFormSheets } from "./account-form-sheets"
import { accountModifyStyles } from "./account-modify.styles"
import { AccountSwitchesSection } from "./account-switches-section"
import type { AccountModifyContentProps } from "./types"
import { useAccountForm } from "./use-account-form"

export function AccountModifyContent({
  accountId,
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
    unsavedSheetVisible,
    deleteSheetVisible,
    archiveSheetVisible,
    allowNavigation,
    handleGoBack,
    setValue,
    handleSubmit,
    handleDelete,
    handleArchive,
    handleIconSelected,
    handleColorSelected,
    handleColorCleared,
    handleCurrencySelected,
    openDeleteSheet,
    closeDeleteSheet,
    closeUnsavedSheet,
    openArchiveSheet,
    closeArchiveSheet,
  } = useAccountForm({ accountId, account })

  if (!isAddMode && !account) {
    return <RouteLoadingState />
  }

  const isArchived = account?.isArchived ?? false

  return (
    <View style={modifyFormStyles.container}>
      <ScrollIntoViewProvider
        scrollViewStyle={modifyFormStyles.scrollView}
        contentContainerStyle={modifyFormStyles.scrollContent}
      >
        <View style={modifyFormStyles.form} key={account?.id || NewEnum.NEW}>
          <ChangeIconInline
            currentIcon={formIcon}
            onIconSelected={handleIconSelected}
            colorScheme={currentColorScheme}
            iconSize={64}
          />

          <FormNameField
            control={control}
            label={t("screens.accounts.form.namePlaceholder")}
            placeholder={t("screens.accounts.form.placeholder")}
            error={errors.name}
          />

          <View style={accountModifyStyles.balanceSection}>
            <Controller
              control={control}
              name="balance"
              render={({ field: { value, onChange } }) => (
                <SmartAmountInput
                  valueMinor={value}
                  onChangeMinor={(v) => onChange(v)}
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
            <CurrencySelectorSheet
              selectedCurrencyCode={formCurrencyCode}
              onCurrencySelected={handleCurrencySelected}
              editable={isAddMode}
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

          <AccountSwitchesSection
            control={control}
            isAddMode={isAddMode}
            formIsPrimary={formIsPrimary}
          />

          {!isAddMode && isArchived && (
            <InfoBanner text={t("screens.accounts.form.archivedBannerText")} />
          )}
          {!isAddMode && !isArchived && (
            <InfoBanner text={t("screens.accounts.form.archiveBannerText")} />
          )}
        </View>

        {!isAddMode && (
          <View style={modifyFormStyles.deleteSection}>
            <Button
              variant="ghost"
              onPress={openArchiveSheet}
              style={modifyFormStyles.actionButton}
            >
              <IconSvg
                name={isArchived ? "archive-off-outline" : "archive-outline"}
                size={20}
                color={accountModifyStyles.archiveIcon.color}
              />
              <Text variant="default" style={accountModifyStyles.archiveText}>
                {isArchived
                  ? t("screens.accounts.form.unarchiveButton")
                  : t("screens.accounts.form.archiveButton")}
              </Text>
            </Button>

            <AccountDeleteSection
              account={account}
              onDeletePress={openDeleteSheet}
            />
          </View>
        )}
      </ScrollIntoViewProvider>

      <ModifyFormFooter
        formName={formName}
        isAddMode={isAddMode}
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        hideSave={isArchived}
        onCancel={handleGoBack}
        onSave={handleSubmit}
      />

      <AccountFormSheets
        deleteSheetVisible={deleteSheetVisible}
        archiveSheetVisible={archiveSheetVisible}
        unsavedSheetVisible={unsavedSheetVisible}
        isAddMode={isAddMode}
        account={account}
        transactionCount={transactionCount}
        onCloseDeleteSheet={closeDeleteSheet}
        onCloseArchiveSheet={closeArchiveSheet}
        onCloseUnsavedSheet={closeUnsavedSheet}
        onConfirmDelete={handleDelete}
        onConfirmArchive={handleArchive}
        onDiscardAndNavigate={() => {
          closeUnsavedSheet()
          allowNavigation()
          handleGoBack()
        }}
      />
    </View>
  )
}
