import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { FormLocationPicker } from "~/components/location/form-location-picker"
import { SmartAmountInput } from "~/components/smart-amount-input"
import { Input } from "~/components/ui/input"
import { ListItem } from "~/components/ui/list-item"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { ScrollIntoViewProvider } from "~/contexts/scroll-into-view-context"
import type { TranslationKey } from "~/i18n/config"
import { TransactionTypeEnum } from "~/types/transactions"

import { transactionFormStyles } from "./form.styles"
import { FormAccountPicker } from "./form-account-picker"
import { FormAttachmentsSection } from "./form-attachments-section"
import { FormBudgetPicker } from "./form-budget-picker"
import { FormCategoryPicker } from "./form-category-picker"
import { FormConversionSection } from "./form-conversion-section"
import { FormDateSection } from "./form-date-section"
import { FormDeleteActions } from "./form-delete-actions"
import { FormFooter } from "./form-footer"
import { FormGoalPicker } from "./form-goal-picker"
import { FormLoanPicker } from "./form-loan-picker"
import { FormModals } from "./form-modals"
import { FormNotesSection } from "./form-notes-section"
import { FormRecurringSection } from "./form-recurring-section"
import { FormTagsPicker } from "./form-tags-picker"
import { FormToAccountPicker } from "./form-to-account-picker"
import { TransactionTopTabs } from "./transaction-top-tabs"
import type { TransactionFormV4Props } from "./types"
import { useTransactionForm } from "./use-transaction-form"

export function TransactionFormV4(props: TransactionFormV4Props) {
  const { transaction, accounts, categories, tags, transactionType } = props
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const f = useTransactionForm(props)

  return (
    <View style={transactionFormStyles.container}>
      <View style={transactionFormStyles.header}>
        <TransactionTopTabs
          labels={f.tabLabels}
          value={f.topTabType}
          onChange={f.onTopTabChange}
          hiddenSlots={f.tabHiddenSlots}
          lockedTo={f.tabLockedTo}
        />
      </View>

      <ScrollIntoViewProvider
        contentContainerStyle={transactionFormStyles.content}
        scrollViewProps={{
          keyboardShouldPersistTaps: "handled",
          showsVerticalScrollIndicator: false,
        }}
      >
        <View style={transactionFormStyles.form}>
          {/* Title */}
          <View style={transactionFormStyles.nameSection}>
            <Controller
              control={f.control}
              name="title"
              render={({ field: { value, onChange } }) => (
                <Input
                  value={value ?? ""}
                  onChangeText={onChange}
                  placeholder={
                    f.derivedTransferTitle ||
                    t("common.transaction.untitledTransaction")
                  }
                  variant="title"
                  placeholderTextColor={theme.colors.semantic.semi}
                />
              )}
            />
            {f.titleErrorKey ? (
              <Text style={transactionFormStyles.fieldError}>
                {t(f.titleErrorKey as TranslationKey)}
              </Text>
            ) : null}
          </View>

          {/* Amount */}
          <View style={transactionFormStyles.balanceSection}>
            <SmartAmountInput
              valueMinor={f.amount ?? 0}
              onChangeMinor={(value) =>
                f.setValue("amount", value, { shouldDirty: true })
              }
              currencyCode={f.selectedAccount?.currencyCode ?? "USD"}
              error={f.amountError}
              label={t("components.transactionForm.fields.amountLabel")}
              placeholder="0"
              type={transactionType}
            />
          </View>

          {transactionType === TransactionTypeEnum.EXPENSE &&
            !f.recurring.enabled && (
              <ListItem
                style={transactionFormStyles.switchRow}
                onPress={f.handleRefundToggle}
                accessibilityRole="switch"
                accessibilityState={{ checked: f.isRefund }}
                disabled={f.recurring.enabled}
              >
                <View style={transactionFormStyles.switchLeft}>
                  <DynamicIcon
                    icon="receipt-refund-outline"
                    size={20}
                    color={theme.colors.primary}
                    variant="badge"
                  />
                  <Text
                    variant="default"
                    style={transactionFormStyles.switchLabel}
                  >
                    {t("components.transactionForm.fields.refundLabel")}
                  </Text>
                </View>
                <Switch value={f.isRefund} disabled={f.recurring.enabled} />
              </ListItem>
            )}

          <FormAccountPicker
            accounts={accounts}
            accountId={f.accountId}
            toAccountId={f.toAccountId}
            setValue={f.setValue}
            selectedAccount={f.selectedAccount}
            balanceAtTransaction={f.balanceAtTransaction}
            transaction={transaction}
            accountError={f.accountError}
            onAccountChange={f.handleAccountChange}
          />

          <FormToAccountPicker
            accounts={accounts}
            toAccountId={f.toAccountId}
            accountId={f.accountId}
            setValue={f.setValue}
            selectedToAccount={f.selectedToAccount}
            transactionType={transactionType}
          />

          {/* Conversion: only when transfer + different currencies */}
          {transactionType === TransactionTypeEnum.TRANSFER &&
            f.selectedAccount &&
            f.selectedToAccount &&
            f.selectedAccount.currencyCode !==
              f.selectedToAccount.currencyCode && (
              <FormConversionSection
                amount={f.amount ?? 0}
                conversionRate={f.conversionRate}
                onConversionRateChange={f.setConversionRate}
                selectedAccount={f.selectedAccount}
                selectedToAccount={f.selectedToAccount}
              />
            )}

          {/* Category: hidden for transfers */}
          {transactionType !== TransactionTypeEnum.TRANSFER && (
            <FormCategoryPicker
              categories={categories}
              categoryId={f.categoryId}
              onSelect={f.handleCategorySelect}
              onClear={f.handleCategoryClear}
            />
          )}

          {/* Goal: hidden for transfers, filtered by selected account */}
          {transactionType !== TransactionTypeEnum.TRANSFER && (
            <FormGoalPicker
              goals={f.accountGoals}
              goalId={f.goalId}
              onSelect={(id) => f.setValue("goalId", id, { shouldDirty: true })}
              onClear={() => f.setValue("goalId", null, { shouldDirty: true })}
            />
          )}

          {/* Budget: hidden for transfers, filtered by account + category */}
          {transactionType !== TransactionTypeEnum.TRANSFER && (
            <FormBudgetPicker
              budgets={f.accountBudgets}
              budgetId={f.budgetId}
              onSelect={(id) =>
                f.setValue("budgetId", id, { shouldDirty: true })
              }
              onClear={() =>
                f.setValue("budgetId", null, { shouldDirty: true })
              }
            />
          )}

          {/* Loan: hidden for transfers, filtered by selected account AND category */}
          {transactionType !== TransactionTypeEnum.TRANSFER && (
            <FormLoanPicker
              loans={f.accountLoans}
              loanId={f.loanId}
              onSelect={(id) => f.setValue("loanId", id, { shouldDirty: true })}
              onClear={() => f.setValue("loanId", null, { shouldDirty: true })}
            />
          )}

          <FormTagsPicker
            tags={tags}
            tagIds={f.tagIds}
            setValue={f.setValue}
            addTag={f.addTag}
            removeTag={f.removeTag}
          />

          {/* Date + Pending: hidden when recurring is enabled */}
          {!f.recurring.enabled && (
            <FormDateSection
              date={f.date}
              control={f.control}
              onDatePress={() => f.openDatePicker("transaction")}
              onSetNow={f.handleSetNow}
            />
          )}

          <FormNotesSection
            description={f.description}
            descriptionErrorKey={f.descriptionErrorKey}
            notesModalVisible={f.modals.notesModalVisible}
            onOpenModal={() => f.setModals({ notesModalVisible: true })}
            onCloseModal={() => f.setModals({ notesModalVisible: false })}
            onSave={(html) =>
              f.setValue("description", html, { shouldDirty: true })
            }
          />

          <FormAttachmentsSection
            list={f.attachmentState.list}
            preview={f.attachmentState.preview}
            fileToOpen={f.attachmentState.fileToOpen}
            toRemove={f.attachmentState.toRemove}
            addFilesExpanded={f.attachmentState.addFilesExpanded}
            onToggleAddFiles={() =>
              f.setAttachmentState({
                addFilesExpanded: !f.attachmentState.addFilesExpanded,
              })
            }
            onClosePreview={() => f.setAttachmentState({ preview: null })}
            onCancelFileOpen={() => f.setAttachmentState({ fileToOpen: null })}
            onPreview={(a) => f.setAttachmentState({ preview: a })}
            onOpenExternal={(a) => f.setAttachmentState({ fileToOpen: a })}
            onRemoveRequest={(a) => f.setAttachmentState({ toRemove: a })}
            onRemoveConfirm={f.removeAttachment}
            onRemoveCancel={() => f.setAttachmentState({ toRemove: null })}
            onSelectFromFiles={f.handleSelectFromFiles}
            onTakePhoto={f.handleTakePhoto}
            onSelectMultipleMedia={f.handleSelectMultipleMedia}
            onSelectSinglePhoto={f.handleSelectSinglePhoto}
          />

          {!f.isRefund && (
            <FormRecurringSection
              enabled={f.recurring.enabled}
              frequency={f.recurring.frequency}
              startDate={f.recurring.startDate}
              endDate={f.recurring.endDate}
              endAfterOccurrences={f.recurring.endAfterOccurrences}
              endsOnPickerExpanded={f.recurring.endsOnPickerExpanded}
              endsOnType={f.endsOnType}
              recurringEndDateOccurrenceCount={
                f.recurringEndDateOccurrenceCount
              }
              onToggle={f.handleRecurringToggle}
              onFrequencyChange={(freq) => f.setRecurring({ frequency: freq })}
              onStartDatePress={() => f.openDatePicker("recurringStart")}
              onEndPickerToggle={() =>
                f.setRecurring({
                  endsOnPickerExpanded: !f.recurring.endsOnPickerExpanded,
                })
              }
              onEndTypeNever={() =>
                f.setRecurring({
                  endDate: null,
                  endAfterOccurrences: null,
                  endsOnPickerExpanded: false,
                })
              }
              onEndTypeDate={() => {
                f.setRecurring({
                  endAfterOccurrences: null,
                  endsOnPickerExpanded: false,
                })
                f.openDatePicker("recurringEnd")
              }}
              onEndTypeOccurrences={() =>
                f.setRecurring({
                  endDate: null,
                  endAfterOccurrences: f.recurring.endAfterOccurrences ?? 4,
                })
              }
              onOccurrencePreset={(n) =>
                f.setRecurring({ endAfterOccurrences: n })
              }
            />
          )}

          {f.locationEnabled && (
            <View style={transactionFormStyles.fieldBlock}>
              <Text variant="small" style={transactionFormStyles.sectionLabel}>
                {t("components.transactionForm.fields.location")}
              </Text>
              <FormLocationPicker
                location={f.location}
                isCapturingLocation={f.isCapturingLocation}
                onPress={() => f.setModals({ locationPickerVisible: true })}
                onClear={f.handleClearLocation}
              />
            </View>
          )}

          {!f.isNew && transaction && (
            <FormDeleteActions
              transaction={transaction}
              isSaving={f.isSaving}
              onRestore={f.handleRestore}
              onDelete={f.handleDeleteConfirm}
              onDestroy={f.handleDestroy}
            />
          )}
        </View>
      </ScrollIntoViewProvider>

      <FormFooter
        isNew={f.isNew}
        isSaving={f.isSaving}
        isDirty={f.isDirty}
        onCancel={f.handleCancelPress}
        onSave={f.submit}
      />

      {f.datePickerAndroidElement}

      <FormModals
        modals={f.modals}
        setModals={f.setModals}
        datePicker={f.datePicker}
        location={f.location}
        transaction={transaction}
        recurringRule={f.recurringRule}
        onConfirmExit={f.handleConfirmExit}
        onDestroyConfirm={f.handleDestroyConfirm}
        onLocationConfirm={f.handleLocationConfirm}
        onIosDateConfirm={f.confirmIosDate}
        onDatePickerClose={() => f.setDatePicker({ visible: false })}
      />
    </View>
  )
}
