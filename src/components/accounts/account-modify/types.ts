import type { Account } from "~/types/accounts"

export interface AccountModifyContentProps {
  accountId: string
  account?: Account
  transactionCount?: number
}
