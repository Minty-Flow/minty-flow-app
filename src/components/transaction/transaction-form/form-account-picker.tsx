/**
 * Account pickers for the transaction form: trigger + inline list with search.
 * `FormAccountPicker` picks the (from) account, `FormToAccountPicker` the
 * transfer destination; both render the shared `AccountPickerField`.
 */
import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useScrollIntoView } from "~/hooks/use-scroll-into-view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { Account } from "~/types/accounts"
import { NewEnum } from "~/types/new"
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
  const router = useRouter()
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const { wrapperRef, scrollIntoView } = useScrollIntoView()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const filteredAccounts = (() => {
    if (!searchQuery.trim()) return accounts
    const lower = searchQuery.toLowerCase()
    return accounts.filter((a) => a.name.toLowerCase().includes(lower))
  })()
  const handleToggle = () => {
    if (!open) {
      scrollIntoView()
      setSearchQuery("")
    }
    setOpen((o) => !o)
  }
  return (
    <View native ref={wrapperRef} style={transactionFormStyles.fieldBlock}>
      <Pressable
        style={[
          transactionFormStyles.accountTrigger,
          selectedAccount && transactionFormStyles.accountTriggerSelected,
          error && selectedAccount && transactionFormStyles.accountTriggerError,
        ]}
        onPress={handleToggle}
        accessibilityLabel={open ? t("common.actions.cancel") : selectLabel}
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
              direction={open ? "up" : "trailing"}
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
              name={open ? "x-outline" : "chevron-down-outline"}
              size={20}
              style={transactionFormStyles.chevronIcon}
            />
          </>
        )}
      </Pressable>
      {open && (
        <View native style={transactionFormStyles.inlineAccountPicker}>
          <View native style={transactionFormStyles.searchFieldWrap}>
            <Input
              placeholder={t("screens.accounts.a11y.searchPlaceholder")}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.colors.semantic.semi}
            />
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {filteredAccounts.map((account) => (
              <Pressable
                key={account.id}
                style={[
                  transactionFormStyles.accountPickerRow,
                  account.id === selectedId &&
                    transactionFormStyles.inlinePickerRowSelected,
                ]}
                onPress={() => {
                  onSelect(account.id)
                  setOpen(false)
                }}
              >
                <DynamicIcon
                  icon={account.icon || "wallet-outline"}
                  size={24}
                  colorScheme={getThemeStrict(account.colorSchemeName)}
                  variant="badge"
                />
                <View
                  style={transactionFormStyles.accountPickerRowContent}
                  native
                >
                  <Text
                    variant="default"
                    style={transactionFormStyles.accountPickerRowName}
                    numberOfLines={1}
                  >
                    {account.name}
                  </Text>
                  <Money
                    value={account.balance}
                    currency={account.currencyCode}
                    style={transactionFormStyles.accountPickerRowBalance}
                  />
                </View>
              </Pressable>
            ))}
            {filteredAccounts.length === 0 ? (
              <Pressable
                style={transactionFormStyles.accountPickerRowAdd}
                onPress={() => {
                  router.push({
                    pathname: "/accounts/[accountId]/modify",
                    params: { accountId: NewEnum.NEW },
                  })
                  setOpen(false)
                }}
                accessibilityLabel={t("screens.accounts.a11y.add")}
              >
                <DynamicIcon
                  icon="plus-outline"
                  size={24}
                  colorScheme={theme.colors}
                  variant="badge"
                />
                <Text
                  variant="default"
                  style={transactionFormStyles.accountPickerRowAddLabel}
                  numberOfLines={1}
                >
                  {t("screens.accounts.a11y.add")}
                </Text>
              </Pressable>
            ) : null}
          </ScrollView>
        </View>
      )}
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
