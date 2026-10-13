import type { UpdateAccountsFormSchema } from "~/schemas/accounts.schema"

/**
 * What the edit form sends to `updateAccount`.
 *
 * `balance` is a request to change the balance, and `updateAccount` answers it
 * with an adjustment transaction. The value the form holds is the one from when
 * it opened, so sending it on every save would undo any change that happened
 * while the form was open (an auto-confirmed subscription, say). Send it only
 * when the user edited the field.
 */
export function buildAccountUpdate(
  data: UpdateAccountsFormSchema,
  { balanceEdited }: { balanceEdited: boolean },
): Partial<UpdateAccountsFormSchema> {
  return {
    name: data.name,
    type: data.type,
    currencyCode: data.currencyCode,
    icon: data.icon,
    colorSchemeName: data.colorSchemeName,
    isPrimary: data.isPrimary,
    excludeFromBalance: data.excludeFromBalance,
    ...(balanceEdited ? { balance: data.balance } : {}),
  }
}
