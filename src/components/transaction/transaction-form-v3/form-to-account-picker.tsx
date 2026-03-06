/**
 * To-account picker block for the transaction form (transfers): trigger + inline list with search.
 * Optional scroll-into-view when scroll refs are passed.
 */

import { useRouter } from "expo-router"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Money } from "~/components/money"
import { IconSymbol } from "~/components/ui/icon-symbol"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useScrollIntoView } from "~/hooks/use-scroll-into-view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { Account } from "~/types/accounts"
import { NewEnum } from "~/types/new"

import { transactionFormStyles } from "./form.styles"

export interface FormToAccountPickerProps {
  accounts: Account[]
  toAccountId: string | undefined
  accountId: string
  setValue: (
    name: "toAccountId" | "accountId",
    value: string,
    opts: { shouldDirty: boolean },
  ) => void
  selectedToAccount: Account | null | undefined
  transactionType: string
}

export function FormToAccountPicker({
  accounts,
  toAccountId,
  accountId,
  setValue,
  selectedToAccount,
  transactionType,
}: FormToAccountPickerProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const { wrapperRef, scrollIntoView } = useScrollIntoView()
  const [toAccountPickerOpen, setToAccountPickerOpen] = useState(false)
  const [toAccountSearchQuery, setToAccountSearchQuery] = useState("")

  const filteredToAccountsForPicker = useMemo(() => {
    let list = accounts
    if (toAccountSearchQuery.trim()) {
      const lower = toAccountSearchQuery.toLowerCase()
      list = list.filter((a) => a.name.toLowerCase().includes(lower))
    }
    return list
  }, [accounts, toAccountSearchQuery])

  const handleToggle = () => {
    setToAccountPickerOpen((o) => {
      const next = !o
      if (next) {
        scrollIntoView()
        setToAccountSearchQuery("")
      }
      return next
    })
  }

  if (transactionType !== "transfer") return null

  return (
    <View native ref={wrapperRef} style={transactionFormStyles.fieldBlock}>
      <View style={transactionFormStyles.sectionLabelRow}>
        <Text variant="small" style={transactionFormStyles.sectionLabelInRow}>
          {t("components.transactionForm.fields.toAccount")}
        </Text>
        <Pressable
          onPress={() =>
            toAccountId && setValue("toAccountId", "", { shouldDirty: true })
          }
          style={[
            transactionFormStyles.clearButton,
            !toAccountId && transactionFormStyles.clearButtonDisabled,
          ]}
          pointerEvents={toAccountId ? "auto" : "none"}
          accessibilityLabel={t("screens.accounts.a11y.clearTo")}
          accessibilityState={{ disabled: !toAccountId }}
        >
          <Text variant="small" style={transactionFormStyles.clearButtonText}>
            {t("common.actions.clear")}
          </Text>
        </Pressable>
      </View>
      <Pressable
        style={[
          transactionFormStyles.accountTrigger,
          selectedToAccount && transactionFormStyles.accountTriggerSelected,
        ]}
        onPress={handleToggle}
        accessibilityLabel={
          toAccountPickerOpen
            ? t("common.actions.cancel")
            : t("screens.accounts.a11y.selectTo")
        }
      >
        {selectedToAccount ? (
          <>
            <DynamicIcon
              icon={selectedToAccount.icon || "wallet-bifold"}
              size={24}
              colorScheme={getThemeStrict(selectedToAccount.colorSchemeName)}
              variant="badge"
            />
            <View style={transactionFormStyles.accountTriggerContent}>
              <Text
                variant="default"
                style={transactionFormStyles.accountTriggerName}
                numberOfLines={1}
              >
                {selectedToAccount.name}
              </Text>
              <Money
                value={selectedToAccount.balance}
                currency={selectedToAccount.currencyCode}
                style={transactionFormStyles.accountTriggerBalance}
              />
            </View>
            <IconSymbol
              name={toAccountPickerOpen ? "chevron-up" : "chevron-right"}
              size={20}
              style={transactionFormStyles.chevronIcon}
            />
          </>
        ) : (
          <>
            <DynamicIcon
              icon="wallet-bifold"
              size={24}
              color={theme.colors.primary}
              variant="badge"
            />
            <Text
              variant="default"
              style={transactionFormStyles.accountTriggerPlaceholder}
              numberOfLines={1}
            >
              {t("screens.accounts.a11y.selectTo")}
            </Text>
            <IconSymbol
              name={toAccountPickerOpen ? "close" : "chevron-down"}
              size={20}
              style={transactionFormStyles.chevronIcon}
            />
          </>
        )}
      </Pressable>
      {toAccountPickerOpen && (
        <View native style={transactionFormStyles.inlineAccountPicker}>
          <Input
            placeholder={t("screens.accounts.a11y.searchPlaceholder")}
            value={toAccountSearchQuery}
            onChangeText={setToAccountSearchQuery}
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
            {filteredToAccountsForPicker.map((account) => (
              <Pressable
                key={account.id}
                style={[
                  transactionFormStyles.accountPickerRow,
                  account.id === toAccountId &&
                    transactionFormStyles.inlinePickerRowSelected,
                ]}
                onPress={() => {
                  setValue("toAccountId", account.id, { shouldDirty: true })
                  if (accountId === account.id) {
                    setValue("accountId", "", { shouldDirty: true })
                  }
                  setToAccountPickerOpen(false)
                }}
              >
                <DynamicIcon
                  icon={account.icon || "wallet-bifold"}
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
            {filteredToAccountsForPicker.length === 0 && (
              <Pressable
                style={transactionFormStyles.accountPickerRowAdd}
                onPress={() => {
                  router.push({
                    pathname: "/accounts/[accountId]/modify",
                    params: { accountId: NewEnum.NEW },
                  })
                  setToAccountPickerOpen(false)
                }}
                accessible
                accessibilityRole="button"
                accessibilityLabel={t("screens.accounts.a11y.add")}
              >
                <DynamicIcon
                  icon="plus"
                  size={24}
                  colorScheme={
                    theme?.colors as import("~/styles/theme/types").MintyColorScheme
                  }
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
    </View>
  )
}
