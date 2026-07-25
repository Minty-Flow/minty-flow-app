# Recurring + Spending Map — Implementation Plan

## Context

Two Stats dashboard cards remain dimmed `soon` placeholders (`src/app/(tabs)/stats-view.tsx`): **Recurring** (half-width) and **Spending Map** (full-width), both deferred at the original redesign ("placeholders only, per user" — see `docs/stats-redesign-plan.md`). This plan finishes both with real cards and detail screens, following the same pattern every other Stats card already uses (`StatCard` → `router.push('/stats/xxx')` → `StatsDetailShell`-wrapped detail route).

**Recurring** has two different data sources that look similar but aren't: `stats.expenseBySubtype` (already computed, free, but purely historical — "past expenses tagged recurring") vs. the `recurring_transactions` table (no repo layer, JSON-blob columns, no existing "upcoming occurrences" or "active rules" query anywhere in the app). This plan uses a hybrid: free data for the card, a small new query for the detail screen's active-rules list, with an approximate (not calendar-exact) monthly-equivalent multiplier.

**Spending Map** does not need a new dependency. The app already has a working non-native map pattern — `src/components/location/form-location-picker.tsx` renders an interactive Leaflet.js + OpenStreetMap map via `WebView` (already installed: `react-native-webview`) with zero native config or API key. This plan extends that pattern for multi-pin rendering rather than adding `react-native-maps`. Location data itself is opt-in and off by default (`useTransactionLocationStore`), so coverage will be low for most users — the plan includes two distinct empty states (location tracking disabled vs. enabled-but-no-pins-yet), and the dashboard card shows a real pin-count + top-address preview via a small parallel query.

## Part A — Recurring

**A1.** `src/utils/recurrence.ts` — add `nextNOccurrences(ruleStrings, range, anchor, n)`: bounded loop around the existing `nextAbsoluteOccurrence`, advancing anchor each call, stopping at `n` results or on `null`. Same file, no new imports. (S)

**A2.** `src/database/services-sqlite/recurring-transaction-service.ts` — add `listActiveRecurringRules(anchor = new Date())`:
- Base query: `SELECT * FROM recurring_transactions WHERE disabled = 0` — same predicate `synchronizeAllRecurringTransactions` already uses.
- Reuse the file's existing private `parseTemplate` / `parseTimeRange` / `parseRules` helpers.
- Batch-join `accounts` and `categories` for currency/name/icon, same `IN (...)` placeholder pattern `stats-service.ts` already uses.
- Per rule: `nextOccurrence` via `nextAbsoluteOccurrence`; `monthlyEquivalent` = amount × an approximate frequency multiplier read off the parsed RRule (`DAILY ×30.44`, `WEEKLY ×4.345`, biweekly `×2.17`, `MONTHLY ×1`, `YEARLY ÷12`) — add this multiplier helper to `recurrence.ts` alongside A1, marked with a `ponytail:` comment naming it as a deliberate approximation, not calendar-exact projection.
- Return sorted by `nextOccurrence` ascending.
(M)

**A3.** `src/components/stats/dashboard/recurring-card.tsx` — new half-width `StatCard` (`icon="repeat-outline"`). Body: `stats.expenseBySubtype.recurring` vs `.oneTime` as a compact 2-segment ratio bar — copy `TopCategoriesCard`'s track/fill pattern (`src/components/stats/dashboard/top-categories-card.tsx`). Zero new data — pure props from the already-fetched `CurrencyStats`, matching every other card's "no self-fetch" rule. (S)

**A4.** `src/app/stats/recurring.tsx` — new detail screen, mirrors `src/app/stats/wrapped.tsx`'s `WrappedContent` shape exactly: local `useState<ActiveRecurringRule[]>`, fetch in a `useEffect` with a `fetchIdRef` race guard, `useDebouncedCallback` (`src/hooks/use-debounced-callback.ts`), subscribe to `on("recurring_transactions:dirty", refetch)` from `~/database/events` — NOT keyed on `dateRange`, since active rules aren't period-scoped (unlike Wrapped). Layout:
- Top: `expenseBySubtype` recurring-vs-one-time bar (from the shell's `stats`, free) — same visual language as A3.
- Below: plain row list of active rules (title, category icon, next-due date, monthly-equivalent amount) — plain `View`/`Text`/`Money` rows like `ByAccountList` in `src/app/stats/net-worth.tsx`, no new list component.
- Empty state: no active rules → `Text variant="muted"`, no bespoke empty-state component needed.
(M)

**A5.** Wire-up (S):
- `src/app/(tabs)/stats-view.tsx` — replace the `soon` Recurring `StatCard` in the `halfRow` with `<RecurringCard stats={stats} onPress={() => pushDetail("/stats/recurring")} />`.
- `src/app/_layout.tsx` (~line 101+) — register `stats/recurring` `<Stack.Screen>` next to the other 5 stats detail routes, title from `screens.stats.recurring.title`.
- i18n: `screens.stats.recurring.*` (title key follows the existing `screens.stats.{netWorth,calendar,wrapped}.title` pattern; add screen-specific strings like `noActiveRules`, row labels) in both `en.json` and `ar.json`; run `pnpm check-i18n-keys`.

## Part B — Spending Map

**B1.** `src/database/services-sqlite/stats-service.ts` — add a `locationSummary: { pinCount: number; topAddress: string | null } | null` field to `CurrencyStats`, computed by a small parallel query added to `fetchAllStatsData`'s existing `Promise.all` (same tier as `fetchPendingSummary`). Does not touch `fetchStatsTransactions`/`StatsRawRow` — the shared hot path stays untouched. (S)

**B2.** `src/database/services-sqlite/stats-service.ts` — add `fetchSpendingMapData(range)`, structurally identical to `fetchWrappedInsights`: own SQL query (`location IS NOT NULL`, plus the standard deleted/pending/transfer filters), own return type `SpendingMapData[]` (one per currency, each with parsed pins: `{ latitude, longitude, address, amount, title, date }[]`). Inline `try/catch JSON.parse` for the `location` column at this single call site (matches the existing precedent of no shared parse helper for what's currently only 1-2 call sites). (M)

**B3.** `src/components/stats/spending-map-webview.tsx` — new. Extend `form-location-picker.tsx`'s HTML-builder pattern (not `location-picker-modal.tsx` — that one's a single-pin picker, wrong shape). New `buildMultiPinHtml(pins, primaryColor)`: same Leaflet/OSM `<script>`/`<style>` skeleton, loop `L.marker(...).bindPopup(...)` per pin, re-enable `zoomControl`/`dragging`/`scrollWheelZoom` (the form preview explicitly disables these), `map.fitBounds()` over all pins instead of a fixed center. Cap rendered pins at ~200 for WebView responsiveness, marked with a `ponytail:` comment (ceiling + upgrade path: real clustering if reports of slowness come in) rather than building pagination now. (M)

**B4.** `src/components/stats/dashboard/spending-map-card.tsx` — new full-width `StatCard`, reuses the existing "map" icon the current stub references. Body: pin count + top address text from B1's `locationSummary` — no map render in the compact card, just text, consistent with how `CalendarCard` degrades to a text fallback when empty. (S)

**B5.** `src/app/stats/spending-map.tsx` — new detail screen, same local-fetch pattern as A4 but keyed on `dateRange` (the map IS period-scoped, unlike Recurring's rule list). Layout: map (B3's WebView component) first, then a ranked list of top locations underneath — group pins by address string, sum expense, sort desc (same fetched data, no new query). Two empty states:
1. `useTransactionLocationStore().isEnabled === false` → actionable card: "Enable location tracking" → `router.push("/settings/preferences/transaction-location")`.
2. `isEnabled === true` but zero pins in range → plain "No location-tagged transactions yet" text.
(M)

**B6.** Wire-up (S):
- `src/app/(tabs)/stats-view.tsx` — replace the `soon` Spending Map `StatCard` with `<SpendingMapCard stats={stats} onPress={() => pushDetail("/stats/spending-map")} />`.
- `src/app/_layout.tsx` — register `stats/spending-map` `<Stack.Screen>`.
- i18n: `screens.stats.spendingMap.*` (title already exists as a card-title key; add `enableLocationCta`, `noPinsYet`, list labels) in both `en.json`/`ar.json`; run `pnpm check-i18n-keys`.

## Suggested order

A1 → A2 → A3 → A4 → A5 (Recurring end-to-end first, it's the smaller/self-contained half) → B1 → B2 → B3 → B4 → B5 → B6 (Spending Map). Each part is independently shippable; do Recurring fully before starting Spending Map to keep diffs reviewable.

## Verification

1. `pnpm types` → `pnpm lint` → `pnpm check-i18n-keys` after each part.
2. `pnpm android` manual pass:
   - Recurring card shows the recurring/one-time ratio and opens the detail screen; detail screen lists active rules with correct next-due dates and monthly-equivalent amounts; disabling a rule (via the existing edit/delete-recurring modals elsewhere in the app) removes it from the list without a manual refresh (via the `recurring_transactions:dirty` subscription).
   - Spending Map card shows pin count + top address (or the right empty affordance if location tracking is off); detail screen renders pins on the Leaflet map, fits bounds correctly, and the "top locations" list matches what's plotted; toggling location tracking off in Settings and back navigates correctly to/from the CTA.
   - Both new routes appear correctly in `_layout.tsx`'s stack (back navigation, header title from i18n).
