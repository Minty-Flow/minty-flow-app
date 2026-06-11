import type { TranslationKey } from "~/i18n/config"
import { type AccountType, AccountTypeEnum } from "~/types/accounts"

export const accountTypesList: { type: AccountType; label: TranslationKey }[] =
  [
    { type: AccountTypeEnum.CHECKING, label: "common.account.types.checking" },
    { type: AccountTypeEnum.SAVINGS, label: "common.account.types.savings" },
    { type: AccountTypeEnum.CREDIT, label: "common.account.types.credit" },
    {
      type: AccountTypeEnum.INVESTMENT,
      label: "common.account.types.investment",
    },
    { type: AccountTypeEnum.OTHER, label: "common.account.types.other" },
  ]
