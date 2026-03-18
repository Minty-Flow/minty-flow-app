import { withObservables } from "@nozbe/watermelondb/react"
import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { AccountPresets } from "~/constants/pre-sets-accounts"
import {
  createAccount,
  observeAccounts,
} from "~/database/services/account-service"
import type { TranslationKey } from "~/i18n/config"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import type { Account } from "~/types/accounts"
import { NewEnum } from "~/types/new"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

interface AccountsScreenInnerProps {
  accounts: Account[]
}

function AccountsScreenInner({ accounts }: AccountsScreenInnerProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const preferredCurrency = useMoneyFormattingStore((s) => s.preferredCurrency)
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  const existingKeys = new Set(accounts.map((a) => `${a.icon}:${a.type}`))

  const togglePreset = (key: string) => {
    if (existingKeys.has(key)) return
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const handleNext = async () => {
    const toCreate = AccountPresets.filter(
      (p) =>
        selectedKeys.has(`${p.icon}:${p.type}`) &&
        !existingKeys.has(`${p.icon}:${p.type}`),
    )
    if (toCreate.length > 0) {
      setSaving(true)
      try {
        for (const preset of toCreate) {
          await createAccount({
            name: t(preset.name as TranslationKey),
            type: preset.type,
            icon: preset.icon,
            balance: 0,
            currencyCode: preferredCurrency,
            colorSchemeName: "",
            isPrimary: false,
            excludeFromBalance: false,
          })
        }
      } catch (error) {
        logger.error("Error creating preset accounts", { error })
        Toast.error({
          title: t("common.toast.error"),
          description: t("common.toast.error"),
        })
        setSaving(false)
        return
      }
      setSaving(false)
    }
    router.push("/onboarding/expense-categories")
  }

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.title}>{t("onboarding.accounts.title")}</Text>
      </View> */}

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hintRow}>
          <IconSvg name="info-circle" size={16} />
          <Text style={styles.hint}>{t("onboarding.accounts.hint")}</Text>
        </View>

        <Pressable
          style={styles.addNewButton}
          onPress={() => router.push(`/accounts/${NewEnum.NEW}/modify`)}
        >
          <IconSvg name="plus" size={24} />
          <Text style={styles.addNewText}>
            {t("onboarding.accounts.addNew")}
          </Text>
        </Pressable>

        {AccountPresets.map((preset) => {
          const key = `${preset.icon}:${preset.type}`
          const isExisting = existingKeys.has(key)
          const isSelected = selectedKeys.has(key)
          return (
            <Pressable
              key={key}
              style={styles.presetItem}
              onPress={() => togglePreset(key)}
              disabled={isExisting}
            >
              <DynamicIcon icon={preset.icon} size={28} />
              <View style={styles.presetText}>
                <Text style={styles.presetName}>
                  {t(preset.name as TranslationKey)}
                </Text>
              </View>
              {isExisting || isSelected ? (
                <View style={styles.checkmark}>
                  <IconSvg
                    name="check"
                    size={16}
                    color={styles.checkmarkIconColor.color}
                  />
                </View>
              ) : (
                <View style={styles.plusCircle}>
                  <IconSvg name="plus" size={20} />
                </View>
              )}
            </Pressable>
          )
        })}
      </ScrollView>

      <View style={styles.buttonRow}>
        <Button
          onPress={handleNext}
          disabled={saving}
          style={styles.nextButton}
        >
          <Text style={styles.nextButtonText}>
            {t("onboarding.actions.next")}
          </Text>
        </Button>
      </View>
    </View>
  )
}

const EnhancedAccountsScreen = withObservables([], () => ({
  accounts: observeAccounts(),
}))(AccountsScreenInner)

export default function OnboardingAccountsScreen() {
  return <EnhancedAccountsScreen />
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  hint: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.onSecondary,
    lineHeight: 18,
  },
  addNewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  addNewText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  presetItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    marginBottom: 8,
  },
  presetText: {
    flex: 1,
  },
  presetName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkIconColor: {
    color: theme.colors.onPrimary,
  },
  plusCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.onSecondary,
  },
  buttonRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.surface,
  },
  nextButton: {
    width: "100%",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onPrimary,
  },
}))
