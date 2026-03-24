/**
 * Account (from) picker block for the transaction form: trigger + inline list with search.
 * Optional scroll-into-view when scroll refs are passed.
 */

import { useRouter } from "expo-router"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { View as RNView, ScrollView } from "react-native"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Money } from "~/components/money"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { IconSvg } from "~/components/ui/icon-svg"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useScrollIntoView } from "~/hooks/use-scroll-into-view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { Account } from "~/types/accounts"
import { NewEnum } from "~/types/new"

import { transactionFormStyles } from "./form.styles"

interface FormAccountPickerProps {
  accounts: Account[]
  accountId: string
  toAccountId: string | undefined
  setValue: (
    name: "accountId" | "toAccountId",
    value: string,
    opts: { shouldDirty: boolean },
  ) => void
  selectedAccount: Account | null | undefined
  balanceAtTransaction: number | null
  transaction: { id: string } | null
  accountError: string | undefined
  /** Called after the selected account changes (new id or cleared). */
  onAccountChange?: (newAccountId: string) => void
  /** Used for styling only; can be omitted. */
  transactionType?: string
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
  transactionType: _transactionType,
}: FormAccountPickerProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const { wrapperRef, scrollIntoView } = useScrollIntoView()
  const [accountPickerOpen, setAccountPickerOpen] = useState(false)
  const [accountSearchQuery, setAccountSearchQuery] = useState("")

  const filteredAccountsForPicker = useMemo(() => {
    if (!accountSearchQuery.trim()) return accounts
    const lower = accountSearchQuery.toLowerCase()
    return accounts.filter((a) => a.name.toLowerCase().includes(lower))
  }, [accounts, accountSearchQuery])

  const handleToggle = () => {
    setAccountPickerOpen((o) => {
      const next = !o
      if (next) {
        scrollIntoView()
        setAccountSearchQuery("")
      }
      return next
    })
  }

  return (
    <RNView ref={wrapperRef} style={transactionFormStyles.fieldBlock}>
      <View style={transactionFormStyles.sectionLabelRow}>
        <Text variant="small" style={transactionFormStyles.sectionLabelInRow}>
          {t("components.transactionForm.fields.account")}
        </Text>
        <Pressable
          onPress={() => {
            if (!accountId) return
            setValue("accountId", "", { shouldDirty: true })
            onAccountChange?.("")
          }}
          style={[
            transactionFormStyles.clearButton,
            !accountId && transactionFormStyles.clearButtonDisabled,
          ]}
          pointerEvents={accountId ? "auto" : "none"}
          accessibilityLabel={t("screens.accounts.a11y.clear")}
          accessibilityState={{ disabled: !accountId }}
        >
          <Text variant="small" style={transactionFormStyles.clearButtonText}>
            {t("common.actions.clear")}
          </Text>
        </Pressable>
      </View>
      <Pressable
        style={[
          transactionFormStyles.accountTrigger,
          selectedAccount && transactionFormStyles.accountTriggerSelected,
          accountError &&
            selectedAccount &&
            transactionFormStyles.accountTriggerError,
        ]}
        onPress={handleToggle}
        accessibilityLabel={
          accountPickerOpen
            ? t("common.actions.cancel")
            : t("screens.accounts.a11y.select")
        }
      >
        {selectedAccount ? (
          <>
            <DynamicIcon
              icon={selectedAccount.icon || "wallet"}
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
                value={
                  transaction && balanceAtTransaction !== null
                    ? balanceAtTransaction
                    : selectedAccount.balance
                }
                currency={selectedAccount.currencyCode}
                style={transactionFormStyles.accountTriggerBalance}
              />
            </View>
            <ChevronIcon
              direction={accountPickerOpen ? "up" : "trailing"}
              size={20}
              style={transactionFormStyles.chevronIcon}
            />
          </>
        ) : (
          <>
            <DynamicIcon
              icon="wallet"
              size={24}
              color={theme.colors.primary}
              variant="badge"
            />
            <Text
              variant="default"
              style={transactionFormStyles.accountTriggerPlaceholder}
              numberOfLines={1}
            >
              {t("screens.accounts.a11y.select")}
            </Text>
            <IconSvg
              name={accountPickerOpen ? "x" : "chevron-down"}
              size={20}
              style={transactionFormStyles.chevronIcon}
            />
          </>
        )}
      </Pressable>
      {accountPickerOpen && (
        <View native style={transactionFormStyles.inlineAccountPicker}>
          <Input
            placeholder={t("screens.accounts.a11y.searchPlaceholder")}
            value={accountSearchQuery}
            onChangeText={setAccountSearchQuery}
            placeholderTextColor={theme.colors.customColors.semi}
            style={transactionFormStyles.pickerSearchInput}
          />
          <ScrollView
            style={transactionFormStyles.pickerList}
            contentContainerStyle={transactionFormStyles.pickerListContent}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >
            {filteredAccountsForPicker.map((account) => (
              <Pressable
                key={account.id}
                style={[
                  transactionFormStyles.accountPickerRow,
                  account.id === accountId &&
                    transactionFormStyles.inlinePickerRowSelected,
                ]}
                onPress={() => {
                  setValue("accountId", account.id, { shouldDirty: true })
                  if (toAccountId === account.id) {
                    setValue("toAccountId", "", { shouldDirty: true })
                  }
                  onAccountChange?.(account.id)
                  setAccountPickerOpen(false)
                }}
              >
                <DynamicIcon
                  icon={account.icon || "wallet"}
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
            {filteredAccountsForPicker.length === 0 && (
              <Pressable
                style={transactionFormStyles.accountPickerRowAdd}
                onPress={() => {
                  router.push({
                    pathname: "/accounts/[accountId]/modify",
                    params: { accountId: NewEnum.NEW },
                  })
                  setAccountPickerOpen(false)
                }}
                accessibilityLabel={t("screens.accounts.a11y.add")}
              >
                <DynamicIcon
                  icon="plus"
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
            )}
          </ScrollView>
        </View>
      )}
      {accountError ? (
        <Text style={transactionFormStyles.fieldError}>{accountError}</Text>
      ) : null}
    </RNView>
  )
}
