import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { AccountTypeInline } from "~/components/accounts/account-type-inline"
import { ChangeIconInline } from "~/components/change-icon-inline"
import { ColorVariantInline } from "~/components/color-variant-inline"
import { CurrencySelectorModal } from "~/components/selector-modals/currency-selector-modal"
import { SmartAmountInput } from "~/components/smart-amount-input"
import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { InfoBanner } from "~/components/ui/info-banner"
import { Input } from "~/components/ui/input"
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
    archiveModalVisible,
    confirmNavigation,
    handleGoBack,
    setValue,
    handleSubmit,
    handleDelete,
    handleArchive,
    handleIconSelected,
    handleColorSelected,
    handleColorCleared,
    handleCurrencySelected,
    openDeleteModal,
    closeDeleteModal,
    closeUnsavedModal,
    openArchiveModal,
    closeArchiveModal,
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

  const isArchived = account?.isArchived ?? false

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
          <View style={accountModifyStyles.deleteSection}>
            <Button
              variant="ghost"
              onPress={openArchiveModal}
              style={accountModifyStyles.actionButton}
            >
              <IconSvg
                name={isArchived ? "archive-off" : "archive"}
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
              onDeletePress={openDeleteModal}
            />
          </View>
        )}
      </ScrollIntoViewProvider>

      <AccountFormFooter
        formName={formName}
        isAddMode={isAddMode}
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        isArchived={isArchived}
        onCancel={handleGoBack}
        onSave={handleSubmit}
      />

      <AccountFormModals
        deleteModalVisible={deleteModalVisible}
        archiveModalVisible={archiveModalVisible}
        unsavedModalVisible={unsavedModalVisible}
        isAddMode={isAddMode}
        account={account}
        transactionCount={transactionCount}
        onCloseDeleteModal={closeDeleteModal}
        onCloseArchiveModal={closeArchiveModal}
        onCloseUnsavedModal={closeUnsavedModal}
        onConfirmDelete={handleDelete}
        onConfirmArchive={handleArchive}
        onDiscardAndNavigate={() => {
          closeUnsavedModal()
          confirmNavigation()
        }}
      />
    </View>
  )
}
