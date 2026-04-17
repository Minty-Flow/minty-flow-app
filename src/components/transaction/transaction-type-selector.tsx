import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TranslationKey } from "~/i18n/config"
import { type TransactionType, TransactionTypeEnum } from "~/types/transactions"

import { IconSvg, type IconSvgName } from "../ui/icon-svg"

interface TransactionTypeSelectorProps {
  value: TransactionType
  onChange: (type: TransactionType) => void
}

const TYPE_CONFIG: Record<
  TransactionType,
  { labelKey: TranslationKey; icon: IconSvgName }
> = {
  [TransactionTypeEnum.EXPENSE]: {
    labelKey: "common.transaction.types.expense",
    icon: "chevrons-up",
  },
  [TransactionTypeEnum.INCOME]: {
    labelKey: "common.transaction.types.income",
    icon: "chevrons-down",
  },
  [TransactionTypeEnum.TRANSFER]: {
    labelKey: "common.transaction.types.transfer",
    icon: "transfer",
  },
}

const TYPES: TransactionType[] = [
  TransactionTypeEnum.EXPENSE,
  TransactionTypeEnum.INCOME,
  TransactionTypeEnum.TRANSFER,
]

export const TransactionTypeSelector = ({
  value,
  onChange,
}: TransactionTypeSelectorProps) => {
  const { t } = useTranslation()
  return (
    <View style={styles.segmented}>
      {TYPES.map((type) => {
        const config = TYPE_CONFIG[type]
        const isSelected = value === type
        return (
          <Pressable
            key={type}
            onPress={() => onChange(type)}
            style={[styles.segment, isSelected && styles.active]}
          >
            <IconSvg
              name={config.icon}
              color={isSelected ? styles.activeText.color : undefined}
            />
            <Text
              style={[styles.segmentLabel, isSelected && styles.activeText]}
            >
              {t(config.labelKey)}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  segmented: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 8,
    padding: 4,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: theme.radius,
  },

  segmentLabel: {
    ...theme.typography.bodyLarge,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },

  active: {
    backgroundColor: theme.colors.primary,
  },
  activeText: {
    color: theme.colors.onPrimary,
  },
}))
