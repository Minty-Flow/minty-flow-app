import { DynamicIcon } from "~/components/dynamic-icon"
import { Chip } from "~/components/ui/chips"
import { View } from "~/components/ui/view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { Loan } from "~/types/loans"

import { transactionFormStyles } from "./form.styles"

type Props = {
  loans: Loan[]
  loanId: string | null | undefined
  onSelect: (id: string) => void
  onClear: () => void
}

export function FormLoanPicker({ loans, loanId, onSelect, onClear }: Props) {
  if (loans.length === 0) {
    return null
  }

  return (
    <View style={transactionFormStyles.fieldBlock}>
      <View style={transactionFormStyles.tagsWrapGrid}>
        {loans.map((loan) => {
          const isSelected = loan.id === loanId
          return (
            <Chip
              key={loan.id}
              label={loan.name}
              selected={isSelected}
              onPress={() => (isSelected ? onClear() : onSelect(loan.id))}
              leading={
                <DynamicIcon
                  icon={loan.icon || "banknotes"}
                  size={16}
                  colorScheme={getThemeStrict(loan.colorSchemeName)}
                  variant="badge"
                />
              }
            />
          )
        })}
      </View>
    </View>
  )
}
