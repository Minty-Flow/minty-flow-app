import { useNavigation } from "expo-router"
import {
  Suspense,
  use,
  useCallback,
  useLayoutEffect,
  useMemo,
  useReducer,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ExternalLink } from "~/components/external-link"
import { InfoModal } from "~/components/info-modal"
import { SearchInput } from "~/components/search-input"
import { SmartAmountInput } from "~/components/smart-amount-input"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { ExchangeRates } from "~/services/exchange-rates"
import { exchangeRatesService } from "~/services/exchange-rates"
import { useExchangeRatesPreferencesStore } from "~/stores/exchange-rates-preferences.store"

import {
  type EditorAction,
  type EditorState,
  editorReducer,
  INITIAL_EDITOR_STATE,
} from "../../../hooks/exchange-rates-editor.reducer"

const EXCHANGE_API_URL = "https://github.com/fawazahmed0/exchange-api"

function createRatesPromise(): Promise<{
  rates: ExchangeRates | null
  error: string | null
}> {
  return exchangeRatesService
    .tryFetchRates("usd")
    .then((result) => ({
      rates: result ?? null,
      error: result ? null : "Could not load rates. Check your connection.",
    }))
    .catch((e) => ({
      rates: null,
      error: e instanceof Error ? e.message : "Failed to load rates",
    }))
}

function getEffectiveRate(
  code: string,
  apiRates: Record<string, number> | null,
  customRates: Record<string, number>,
): number | null {
  const upper = code.toUpperCase()
  if (customRates[upper] !== undefined) {
    return customRates[upper]
  }
  const lower = code.toLowerCase()
  if (apiRates && typeof apiRates[lower] === "number") {
    return apiRates[lower]
  }
  return null
}

interface RateEntry {
  code: string
  displayCode: string
  rate: number
  isCustom: boolean
}

interface ExchangeRatesContentProps {
  ratesPromise: Promise<{ rates: ExchangeRates | null; error: string | null }>
  onRetry: () => void
  customRates: Record<string, number>
  setCustomRate: (code: string, rate: number) => void
  removeCustomRate: (code: string) => void
  editorState: EditorState
  dispatch: React.Dispatch<EditorAction>
}

function ExchangeRatesContent({
  ratesPromise,
  onRetry,
  customRates,
  setCustomRate,
  removeCustomRate,
  editorState,
  dispatch,
}: ExchangeRatesContentProps) {
  const { rates, error } = use(ratesPromise)
  const { searchQuery, editingCurrencyCode, draftRates } = editorState
  const { t } = useTranslation()

  const entries = useMemo((): RateEntry[] => {
    if (!rates?.rates) return []
    const upperCustom = Object.keys(customRates).reduce<Record<string, number>>(
      (acc, k) => {
        acc[k.toUpperCase()] = customRates[k]
        return acc
      },
      {},
    )
    const list: RateEntry[] = []
    const seen = new Set<string>()
    for (const [key, value] of Object.entries(rates.rates)) {
      const displayCode = key.toUpperCase()
      if (seen.has(displayCode)) continue
      seen.add(displayCode)
      const custom = upperCustom[displayCode]
      const rate = custom !== undefined ? custom : value
      list.push({
        code: key,
        displayCode,
        rate,
        isCustom: custom !== undefined,
      })
    }
    list.sort((a, b) => a.displayCode.localeCompare(b.displayCode))
    return list
  }, [rates, customRates])

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries
    const q = searchQuery.trim().toUpperCase()
    return entries.filter((e) => e.displayCode.includes(q))
  }, [entries, searchQuery])

  const handleSelectEntry = useCallback(
    (code: string, currentRate: number) => {
      dispatch({ type: "SELECT_ENTRY", code, rate: currentRate })
    },
    [dispatch],
  )

  const handleDraftChange = useCallback(
    (code: string, value: number) => {
      dispatch({ type: "DRAFT_CHANGE", code, value })
    },
    [dispatch],
  )

  const handleSaveRate = useCallback(
    (code: string, value: number) => {
      if (value <= 0) return
      setCustomRate(code, value)
      dispatch({ type: "CLEAR_DRAFT", code })
    },
    [setCustomRate, dispatch],
  )

  const handleResetToApiRate = useCallback(
    (code: string) => {
      removeCustomRate(code)
      dispatch({ type: "CLEAR_DRAFT", code })
    },
    [removeCustomRate, dispatch],
  )

  const renderItem = useCallback(
    ({ item }: { item: RateEntry }) => {
      const isEditing = editingCurrencyCode === item.displayCode
      const rate = getEffectiveRate(
        item.code,
        rates?.rates ?? null,
        customRates,
      )
      const displayRate = rate ?? 0
      const draftValue = draftRates[item.displayCode] ?? displayRate
      const isInvalidRate = draftValue <= 0

      return (
        <View style={styles.entryWrapper}>
          <Pressable
            style={[
              styles.entryRow,
              (isEditing || item.isCustom) && styles.entryRowSelected,
            ]}
            onPress={() => handleSelectEntry(item.displayCode, displayRate)}
          >
            <Text style={styles.entryEquals}>=</Text>
            <Text style={styles.entryAmount} numberOfLines={1}>
              {displayRate.toFixed(14)}
            </Text>
            <Text style={styles.entryCode}>{item.displayCode}</Text>
          </Pressable>
          {isEditing && (
            <View style={styles.inlineInput}>
              <SmartAmountInput
                value={draftValue}
                onChange={(value) => handleDraftChange(item.displayCode, value)}
                currencyCode={item.displayCode}
                label={`1 USD = ${draftValue.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${item.displayCode}`}
                placeholder="0"
                error={
                  isInvalidRate
                    ? t("screens.settings.exchangeRates.errors.invalidRate")
                    : undefined
                }
              />
              <View style={styles.saveButtonRow}>
                <Button
                  variant="outline"
                  onPress={() => handleResetToApiRate(item.displayCode)}
                  style={styles.resetButton}
                >
                  <Text>{t("common.actions.reset")}</Text>
                </Button>
                <Button
                  variant="default"
                  onPress={() => handleSaveRate(item.displayCode, draftValue)}
                  style={styles.saveButton}
                  disabled={isInvalidRate}
                >
                  <Text>{t("common.actions.save")}</Text>
                </Button>
              </View>
            </View>
          )}
        </View>
      )
    },
    [
      editingCurrencyCode,
      draftRates,
      rates?.rates,
      customRates,
      handleSelectEntry,
      handleDraftChange,
      handleSaveRate,
      handleResetToApiRate,
      t,
    ],
  )

  const listHeader = (
    <View style={styles.listHeader}>
      <ExternalLink href={EXCHANGE_API_URL} style={styles.apiCard}>
        <View style={styles.apiCardContent}>
          <Text style={styles.apiTitle}>
            {t("screens.settings.exchangeRates.apiTitle")}
          </Text>
          <Text style={styles.apiUrl}>{EXCHANGE_API_URL}</Text>
        </View>
      </ExternalLink>
      <SearchInput
        value={searchQuery}
        onChangeText={(query) => dispatch({ type: "SET_SEARCH", query })}
        onClear={() => dispatch({ type: "SET_SEARCH", query: "" })}
        placeholder={t("screens.settings.exchangeRates.searchPlaceholder")}
        containerStyle={styles.searchRow}
      />
      <Text style={styles.instruction}>
        {t("screens.settings.exchangeRates.instructionCaption")}
      </Text>
      <Text style={styles.baseHeading}>1 USD</Text>
    </View>
  )

  if (error && !rates) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>
            {t("common.actions.retry")}
          </Text>
        </Pressable>
      </View>
    )
  }

  return (
    <FlatList
      data={filteredEntries}
      keyExtractor={(item) => item.displayCode}
      renderItem={renderItem}
      ListHeaderComponent={listHeader}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      style={styles.list}
      contentInsetAdjustmentBehavior="automatic"
    />
  )
}

export default function ExchangeRatesScreen() {
  const navigation = useNavigation()
  const customRates = useExchangeRatesPreferencesStore((s) => s.customRates)
  const setCustomRate = useExchangeRatesPreferencesStore((s) => s.setCustomRate)
  const removeCustomRate = useExchangeRatesPreferencesStore(
    (s) => s.removeCustomRate,
  )
  const { t } = useTranslation()

  const [ratesPromise, setRatesPromise] = useState(createRatesPromise)
  const [editorState, dispatch] = useReducer(
    editorReducer,
    INITIAL_EDITOR_STATE,
  )
  const [infoModalVisible, setInfoModalVisible] = useState(false)

  const handleRetry = useCallback(() => {
    setRatesPromise(createRatesPromise())
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          variant="ghost"
          onPress={() => setInfoModalVisible(true)}
          accessibilityLabel={t("screens.settings.exchangeRates.a11y.info")}
        >
          <IconSvg name="info-circle" size={24} />
        </Button>
      ),
    })
  }, [navigation, t])

  return (
    <>
      <Suspense
        fallback={
          <View style={styles.centered}>
            <ActivityIndicatorMinty size="large" />
            <Text style={styles.loadingText}>
              {t("screens.settings.exchangeRates.loading")}
            </Text>
          </View>
        }
      >
        <ExchangeRatesContent
          ratesPromise={ratesPromise}
          onRetry={handleRetry}
          customRates={customRates}
          setCustomRate={setCustomRate}
          removeCustomRate={removeCustomRate}
          editorState={editorState}
          dispatch={dispatch}
        />
      </Suspense>
      <InfoModal
        visible={infoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}
        title={t("screens.settings.exchangeRates.infoModal.title")}
        description={t("screens.settings.exchangeRates.infoModal.description")}
        okLabel={t("screens.settings.exchangeRates.infoModal.ok")}
      />
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  list: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  listContent: {
    paddingBottom: 40,
  },
  listHeader: {
    paddingBottom: 4,
  },
  apiCard: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  apiCardContent: {
    flexDirection: "column",
    backgroundColor: theme.colors.secondary,
  },
  apiTitle: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "700",
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  apiUrl: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.customColors.semi,
  },
  searchRow: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  instruction: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.customColors.semi,
    marginHorizontal: 20,
    marginBottom: 16,
    lineHeight: 18,
  },
  baseHeading: {
    ...theme.typography.headlineMedium,
    color: theme.colors.onSurface,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  entryWrapper: {
    marginBottom: 4,
  },
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  entryRowSelected: {
    backgroundColor: theme.colors.secondary,
  },
  entryEquals: {
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.onSurface,
    marginRight: 8,
  },
  entryAmount: {
    flex: 1,
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.onSurface,
  },
  entryCode: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  inlineInput: {
    paddingHorizontal: 0,
    paddingBottom: 8,
  },
  saveButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 12,
  },
  resetButton: {},
  saveButton: {},
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
  },
  loadingText: {
    marginTop: 12,
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.customColors.semi,
  },
  errorText: {
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.error,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onPrimary,
  },
}))
