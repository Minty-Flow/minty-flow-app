import { withObservables } from "@nozbe/watermelondb/react"
import { useRouter } from "expo-router"
import { useState, useTransition } from "react"
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
  const [saving, startTransition] = useTransition()

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

  const handleNext = () => {
    startTransition(async () => {
      const toCreate = AccountPresets.filter(
        (p) =>
          selectedKeys.has(`${p.icon}:${p.type}`) &&
          !existingKeys.has(`${p.icon}:${p.type}`),
      )
      if (toCreate.length > 0) {
        try {
          await Promise.all(
            toCreate.map((preset) =>
              createAccount({
                name: t(preset.name as TranslationKey),
                type: preset.type,
                icon: preset.icon,
                balance: 0,
                currencyCode: preferredCurrency,
                colorSchemeName: "",
                isPrimary: false,
                excludeFromBalance: false,
              }),
            ),
          )
        } catch (error) {
          logger.error("Error creating preset accounts", { error })
          Toast.error({
            title: t("common.toast.error"),
            description: t("common.toast.error"),
          })
          return
        }
      }
      router.push("/onboarding/expense-categories")
    })
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.subtitle}>{t("onboarding.accounts.hint")}</Text>

        <Text style={styles.sectionLabel}>
          {t("onboarding.accounts.suggested")}
        </Text>

        {AccountPresets.map((preset) => {
          const key = `${preset.icon}:${preset.type}`
          const isExisting = existingKeys.has(key)
          const isSelected = selectedKeys.has(key) || isExisting
          return (
            <Pressable
              key={key}
              style={[
                styles.presetItem,
                isSelected && styles.presetItemSelected,
              ]}
              onPress={() => togglePreset(key)}
              disabled={isExisting}
            >
              <View
                style={[
                  styles.iconCircle,
                  isSelected && styles.iconCircleSelected,
                ]}
              >
                <DynamicIcon icon={preset.icon} size={26} />
              </View>
              <Text style={styles.presetName}>
                {t(preset.name as TranslationKey)}
              </Text>
              <View
                style={[
                  styles.indicator,
                  isSelected && styles.indicatorSelected,
                ]}
              >
                {isSelected ? (
                  <IconSvg
                    name="check"
                    size={14}
                    color={styles.checkIconColor.color}
                  />
                ) : (
                  <IconSvg name="plus" size={16} />
                )}
              </View>
            </Pressable>
          )
        })}

        <Pressable
          style={styles.addNewButton}
          onPress={() => router.push(`/accounts/${NewEnum.NEW}/modify`)}
        >
          <View style={styles.addNewIconCircle}>
            <IconSvg name="plus" size={20} />
          </View>
          <Text style={styles.addNewText}>
            {t("onboarding.accounts.addNew")}
          </Text>
        </Pressable>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  subtitle: {
    fontSize: theme.typography.labelLarge.fontSize,
    color: theme.colors.onSecondary,
    lineHeight: 20,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: theme.typography.labelXSmall.fontSize,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: theme.colors.onSecondary,
    marginBottom: 10,
  },
  presetItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  presetItemSelected: {
    borderColor: theme.colors.primary,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleSelected: {
    backgroundColor: `${theme.colors.primary}20`,
  },
  presetName: {
    flex: 1,
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  indicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.onSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkIconColor: {
    color: theme.colors.onPrimary,
  },
  addNewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: theme.radius,
    padding: 16,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: `${theme.colors.onSecondary}50`,
    borderStyle: "dashed",
  },
  addNewIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  addNewText: {
    flex: 1,
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "500",
    color: theme.colors.onSurface,
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
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onPrimary,
  },
}))
