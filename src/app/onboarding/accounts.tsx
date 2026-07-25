import { useRouter } from "expo-router"
import { useState, useTransition } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { Button } from "~/components/ui/button"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { AccountPresets } from "~/constants/pre-sets-accounts"
import { createAccount } from "~/database/services-sqlite/account-service"
import type { TranslationKey } from "~/i18n/config"
import { useActiveAccounts } from "~/stores/db/account.store"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import { NewEnum } from "~/types/new"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

export default function OnboardingAccountsScreen() {
  const accounts = useActiveAccounts()
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

        <View style={styles.cardList}>
          {AccountPresets.map((preset) => {
            const key = `${preset.icon}:${preset.type}`
            const isExisting = existingKeys.has(key)
            const isSelected = selectedKeys.has(key) || isExisting
            return (
              <Pressable
                key={key}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                  isExisting && styles.cardAdded,
                ]}
                onPress={() => togglePreset(key)}
                disabled={isExisting}
              >
                <DynamicIcon icon={preset.icon} size={32} />
                <View style={styles.cardText}>
                  <Text
                    style={[
                      styles.cardName,
                      isSelected && styles.cardNameSelected,
                    ]}
                  >
                    {t(preset.name as TranslationKey)}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <IconSvg
                      name="check"
                      size={18}
                      color={styles.checkColor.color}
                    />
                  </View>
                )}
              </Pressable>
            )
          })}
        </View>

        <Pressable
          style={styles.addNewButton}
          onPress={() => router.push(`/accounts/${NewEnum.NEW}/modify`)}
        >
          <View style={styles.addNewIconWrap}>
            <IconSvg name="plus-outline" size={24} />
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
    marginBottom: 12,
  },
  cardList: {
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
  },
  cardSelected: {
    backgroundColor: `${theme.colors.primary}18`,
  },
  cardAdded: {
    opacity: 0.45,
  },
  cardText: {
    flex: 1,
  },
  cardName: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  cardNameSelected: {
    color: theme.colors.primary,
  },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkColor: {
    color: theme.colors.onPrimary,
  },
  addNewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: theme.radius,
    borderWidth: 1.5,
    borderColor: `${theme.colors.onSecondary}40`,
    borderStyle: "dashed",
  },
  addNewIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
