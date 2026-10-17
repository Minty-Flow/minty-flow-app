/**
 * Account pickers for the transaction form: a trigger that opens the account picker sheet.
 * `FormAccountPicker` picks the (from) account, `FormToAccountPicker` the
 * transfer destination; both render the shared `AccountPickerField`.
 */
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { AccountPickerSheet } from "~/components/accounts/account-picker-sheet"
import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { Account } from "~/types/accounts"
import { TransactionTypeEnum } from "~/types/transactions"

import { transactionFormStyles } from "./form.styles"

type SetAccountValue = (
  name: "accountId" | "toAccountId",
  value: string,
  opts: {
    shouldDirty: boolean
  },
) => void

interface AccountPickerFieldProps {
  accounts: Account[]
  selectedId: string | undefined
  selectedAccount: Account | null | undefined
  /** Balance shown in the trigger for the selected account. */
  triggerBalance: number | undefined
  /** Placeholder + accessibility label while closed. */
  selectLabel: string
  error?: string
  onSelect: (accountId: string) => void
}

function AccountPickerField({
  accounts,
  selectedId,
  selectedAccount,
  triggerBalance,
  selectLabel,
  error,
  onSelect,
}: AccountPickerFieldProps) {
  const { theme } = useUnistyles()
  const [open, setOpen] = useState(false)
  return (
    <View native style={transactionFormStyles.fieldBlock}>
      <Pressable
        style={[
          transactionFormStyles.accountTrigger,
          selectedAccount && transactionFormStyles.accountTriggerSelected,
          error && selectedAccount && transactionFormStyles.accountTriggerError,
        ]}
        onPress={() => setOpen(true)}
        accessibilityLabel={selectLabel}
      >
        {selectedAccount ? (
          <>
            <DynamicIcon
              icon={selectedAccount.icon || "wallet-outline"}
              size={24}
              colorScheme={getThemeStrict(selectedAccount.colorSchemeName)}
              variant="badge"
            />
            <View style={transactionFormStyles.accountTriggerContent}>
              <Text
                variant="default"
                style={transactionFormStyles.accountTriggerName}
                numberOfLines={1}
              >
                {selectedAccount.name}
              </Text>
              <Money
                value={triggerBalance ?? selectedAccount.balance}
                currency={selectedAccount.currencyCode}
                style={transactionFormStyles.accountTriggerBalance}
              />
            </View>
            <ChevronIcon
              direction="trailing"
              size={20}
              style={transactionFormStyles.chevronIcon}
            />
          </>
        ) : (
          <>
            <DynamicIcon
              icon="wallet-outline"
              size={24}
              color={theme.colors.primary}
              variant="badge"
            />
            <Text
              variant="default"
              style={transactionFormStyles.accountTriggerPlaceholder}
              numberOfLines={1}
            >
              {selectLabel}
            </Text>
            <IconSvg
              name="chevron-down-outline"
              size={20}
              style={transactionFormStyles.chevronIcon}
            />
          </>
        )}
      </Pressable>
      <AccountPickerSheet
        visible={open}
        onClose={() => setOpen(false)}
        title={selectLabel}
        accounts={accounts}
        selectedId={selectedId}
        onSelect={onSelect}
      />
      {error ? (
        <Text style={transactionFormStyles.fieldError}>{error}</Text>
      ) : null}
    </View>
  )
}

interface FormAccountPickerProps {
  accounts: Account[]
  accountId: string
  toAccountId: string | undefined
  setValue: SetAccountValue
  selectedAccount: Account | null | undefined
  balanceAtTransaction: number | null
  transaction: {
    id: string
  } | null
  accountError: string | undefined
  /** Called after the selected account changes (new id or cleared). */
  onAccountChange?: (newAccountId: string) => void
}

export function FormAccountPicker({
  accounts,
  accountId,
  toAccountId,
  setValue,
  selectedAccount,
  balanceAtTransaction,
  transaction,
  accountError,
  onAccountChange,
}: FormAccountPickerProps) {
  const { t } = useTranslation()
  return (
    <AccountPickerField
      accounts={accounts}
      selectedId={accountId}
      selectedAccount={selectedAccount}
      triggerBalance={
        transaction && balanceAtTransaction !== null
          ? balanceAtTransaction
          : undefined
      }
      selectLabel={t("screens.accounts.a11y.select")}
      error={accountError}
      onSelect={(id) => {
        setValue("accountId", id, { shouldDirty: true })
        if (toAccountId === id) {
          setValue("toAccountId", "", { shouldDirty: true })
        }
        onAccountChange?.(id)
      }}
    />
  )
}

interface FormToAccountPickerProps {
  accounts: Account[]
  toAccountId: string | undefined
  accountId: string
  setValue: SetAccountValue
  selectedToAccount: Account | null | undefined
  transactionType: string
}

/** Transfer destination; renders nothing for non-transfer transactions. */
export function FormToAccountPicker({
  accounts,
  toAccountId,
  accountId,
  setValue,
  selectedToAccount,
  transactionType,
}: FormToAccountPickerProps) {
  const { t } = useTranslation()
  if (transactionType !== TransactionTypeEnum.TRANSFER) return null
  return (
    <AccountPickerField
      accounts={accounts}
      selectedId={toAccountId}
      selectedAccount={selectedToAccount}
      triggerBalance={undefined}
      selectLabel={t("screens.accounts.a11y.selectTo")}
      onSelect={(id) => {
        setValue("toAccountId", id, { shouldDirty: true })
        if (accountId === id) {
          setValue("accountId", "", { shouldDirty: true })
        }
      }}
    />
  )
}
