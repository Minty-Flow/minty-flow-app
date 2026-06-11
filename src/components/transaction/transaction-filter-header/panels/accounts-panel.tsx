import { ScrollView, View } from "react-native"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Chip } from "~/components/ui/chips"
import { IconSvg } from "~/components/ui/icon-svg"
import type { Account } from "~/types/accounts"

import { filterHeaderStyles } from "../filter-header.styles"
import { PanelClearButton } from "../panel-clear-button"
import { PanelDoneButton } from "../panel-done-button"
import { CHIPS_PER_ROW } from "../types"
import { chunk } from "../utils"

interface AccountsPanelProps {
  accounts: Account[]
  selectedIds: string[]
  onToggle: (id: string) => void
  onClear: () => void
  onDone: () => void
}

export function AccountsPanel({
  accounts,
  selectedIds,
  onToggle,
  onClear,
  onDone,
}: AccountsPanelProps) {
  return (
    <View>
      {chunk(accounts, CHIPS_PER_ROW).map((row) => (
        <ScrollView
          key={row.map((a) => a.id).join(",")}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={filterHeaderStyles.chipScrollRow}
          style={filterHeaderStyles.categoryRow}
        >
          {row.map((account) => (
            <Chip
              key={account.id}
              label={account.name}
              selected={selectedIds.includes(account.id)}
              onPress={() => onToggle(account.id)}
              leading={
                account.icon ? (
                  <DynamicIcon
                    icon={account.icon}
                    size={18}
                    colorScheme={account.colorScheme}
                    variant="raw"
                  />
                ) : (
                  <IconSvg name="wallet-outline" size={18} />
                )
              }
            />
          ))}
        </ScrollView>
      ))}

      <View style={filterHeaderStyles.panelHeader}>
        <View />
        <View style={filterHeaderStyles.panelHeaderActions}>
          <PanelClearButton
            onPress={onClear}
            disabled={selectedIds.length === 0}
          />
          <PanelDoneButton onPress={onDone} />
        </View>
      </View>
    </View>
  )
}
