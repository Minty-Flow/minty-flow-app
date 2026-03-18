import type { TranslationKey } from "~/i18n/config"
import type { AccountType } from "~/types/accounts"
import { AccountTypeEnum } from "~/types/accounts"

type AccountPreset = {
  name: TranslationKey
  icon: string
  type: AccountType
}

export const AccountPresets: AccountPreset[] = [
  {
    name: "onboarding.accounts.presets.main",
    icon: "credit-card",
    type: AccountTypeEnum.CHECKING,
  },
  {
    name: "onboarding.accounts.presets.cash",
    icon: "wallet",
    type: AccountTypeEnum.OTHER,
  },
  {
    name: "onboarding.accounts.presets.savings",
    icon: "pig",
    type: AccountTypeEnum.SAVINGS,
  },
]
