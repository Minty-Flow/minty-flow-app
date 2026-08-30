import type { IconSvgName } from "~/components/icons"
import type { TranslationKey } from "~/i18n/config"
import type { TransactionKind } from "~/types/transactions"

export const KIND_ORDER: TransactionKind[] = [
  "default",
  "upcoming",
  "subscription",
  "repetitive",
  "lent",
  "borrowed",
]

export const KIND_LABEL_KEYS: Record<TransactionKind, TranslationKey> = {
  default: "common.transaction.kinds.default",
  upcoming: "common.transaction.kinds.upcoming",
  subscription: "common.transaction.kinds.subscription",
  repetitive: "common.transaction.kinds.repetitive",
  lent: "common.transaction.kinds.lent",
  borrowed: "common.transaction.kinds.borrowed",
}

/** Shared kind glyphs — the info modal is the source of truth; reuse elsewhere. */
export const KIND_ICONS: Record<TransactionKind, IconSvgName> = {
  default: "check-outline",
  upcoming: "calendar-outline",
  subscription: "calendar-repeat-outline",
  repetitive: "repeat-outline",
  lent: "arrow-up-circle-outline",
  borrowed: "arrow-down-circle-outline",
}

export const KIND_INFO_KEYS: Record<TransactionKind, TranslationKey> = {
  default: "components.transactionForm.kind.info.default",
  upcoming: "components.transactionForm.kind.info.upcoming",
  subscription: "components.transactionForm.kind.info.subscription",
  repetitive: "components.transactionForm.kind.info.repetitive",
  lent: "components.transactionForm.kind.info.lent",
  borrowed: "components.transactionForm.kind.info.borrowed",
}
