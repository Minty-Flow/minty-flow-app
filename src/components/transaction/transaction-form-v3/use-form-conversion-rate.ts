import { useEffect, useRef, useState } from "react"

import { getConversionRateForTransaction } from "~/database/services-sqlite/transfer-service"
import { currencyRegistryService } from "~/services/currency-registry"
import { exchangeRatesService } from "~/services/exchange-rates"
import { useExchangeRatesPreferencesStore } from "~/stores/exchange-rates-preferences.store"
import type { Account } from "~/types/accounts"
import type { Transaction, TransactionType } from "~/types/transactions"
import { logger } from "~/utils/logger"

export function useFormConversionRate(
  transactionType: TransactionType,
  selectedAccount: Account | undefined,
  selectedToAccount: Account | null | undefined,
  transaction: Transaction | null,
) {
  const [conversionRate, setConversionRate] = useState<number | null>(null)
  const accountSelectionInitialMount = useRef(true)
  const conversionRatePairRef = useRef<{ from: string; to: string } | null>(
    null,
  )
  const getCustomRate = useExchangeRatesPreferencesStore((s) => s.getCustomRate)

  // Load saved conversion rate when editing a transfer
  useEffect(() => {
    if (!transaction || transactionType !== "transfer") return
    let cancelled = false
    getConversionRateForTransaction(transaction).then((rate) => {
      if (!cancelled && rate != null) setConversionRate(rate)
    })
    return () => {
      cancelled = true
    }
  }, [transaction?.id, transactionType, transaction])

  // Clear conversion rate when user changes from/to account
  useEffect(() => {
    if (transactionType !== "transfer") return
    if (accountSelectionInitialMount.current) {
      accountSelectionInitialMount.current = false
      return
    }
    setConversionRate(null)
  }, [transactionType])

  // Clear rate on currency pair change
  useEffect(() => {
    if (
      transactionType !== "transfer" ||
      !selectedAccount ||
      !selectedToAccount
    )
      return
    const fromCurrency = selectedAccount.currencyCode
    const toCurrency = selectedToAccount.currencyCode
    if (fromCurrency === toCurrency) return
    const prev = conversionRatePairRef.current
    conversionRatePairRef.current = { from: fromCurrency, to: toCurrency }
    if (prev && (prev.from !== fromCurrency || prev.to !== toCurrency)) {
      setConversionRate(null)
    }
  }, [
    transactionType,
    selectedAccount?.id,
    selectedToAccount?.id,
    selectedAccount?.currencyCode,
    selectedToAccount?.currencyCode,
    selectedAccount,
    selectedToAccount,
  ])
  const usdCurrency = currencyRegistryService.getCurrencyByCode("USD")
  const useCode = usdCurrency?.code ?? "USD"

  // Fetch conversion rate when transfer has different currencies
  useEffect(() => {
    if (
      transactionType !== "transfer" ||
      !selectedAccount ||
      !selectedToAccount ||
      conversionRate !== null
    )
      return
    const fromCurrency = selectedAccount.currencyCode
    const toCurrency = selectedToAccount.currencyCode
    if (fromCurrency === toCurrency) return
    let cancelled = false
    const resolve = async () => {
      const fromUpper = fromCurrency.toUpperCase()
      const toUpper = toCurrency.toUpperCase()
      const fromPerUsd = getCustomRate(fromCurrency)
      const toPerUsd = getCustomRate(toCurrency)
      let custom: number | undefined
      if (fromUpper === useCode) {
        custom = toPerUsd
      } else if (toUpper === useCode) {
        custom =
          fromPerUsd != null && fromPerUsd !== 0 ? 1 / fromPerUsd : undefined
      } else if (fromPerUsd != null && toPerUsd != null && fromPerUsd !== 0) {
        custom = toPerUsd / fromPerUsd
      } else if (fromPerUsd != null || toPerUsd != null) {
        logger.warn(
          "Custom rate only set for one side of the pair; falling back to API",
          { fromCurrency, toCurrency },
        )
      }
      if (cancelled) return
      if (custom !== undefined) {
        setConversionRate(custom)
        return
      }
      const rate = await exchangeRatesService.getRate(fromCurrency, toCurrency)
      if (!cancelled && rate != null) setConversionRate(rate)
    }
    resolve()
    return () => {
      cancelled = true
    }
  }, [
    transactionType,
    selectedAccount?.id,
    selectedToAccount?.id,
    selectedAccount?.currencyCode,
    selectedToAccount?.currencyCode,
    conversionRate,
    getCustomRate,
    selectedAccount,
    selectedToAccount,
    useCode,
  ])

  return { conversionRate, setConversionRate }
}
