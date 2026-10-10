import { useTranslation } from "react-i18next"

import { TypeInline } from "~/components/type-inline"
import type { AccountType } from "~/types/accounts"
import { accountTypesList } from "~/utils/account-types-list"

interface AccountTypeInlineProps {
  selectedType: AccountType
  onTypeSelected: (type: AccountType) => void
  /** When false, the row is not tappable and no chevron is shown. */
  editable?: boolean
}

/** Account type selector row. */
export function AccountTypeInline(props: AccountTypeInlineProps) {
  const { t } = useTranslation()
  return (
    <TypeInline
      {...props}
      icon="building-bank-outline"
      label={t("screens.accounts.form.typeLabel")}
      options={accountTypesList.map((item) => ({
        type: item.type,
        label: t(item.label),
      }))}
    />
  )
}
