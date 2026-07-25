# Stats Page — Finish & Improve Plan

## Context

`stats-redesign-plan.md` shipped the card-dashboard + 5-detail-screen redesign. It's functionally complete — every screen and card works, with graceful empty-state handling throughout — except two intentional "Soon" stubs (Recurring, Spending Map) that were explicitly deferred at the time ("placeholders only, per user"). No other TODOs/FIXMEs/stubs exist anywhere in `src/app/stats/`, `src/components/stats/**`, or `stats-service.ts`.

Two things worth knowing before touching any of this:

- `stats.expenseBySubtype` (recurring/one-time/unclassified split) and `stats.topTags` are already computed on every `CurrencyStats` result and rendered nowhere — free data for two of the items below. `stats.byAccount` is also computed and unused, but has no obvious UI slot.
- Spending Map has no cheap path: it needs a maps SDK (none installed) and unselected `location` transaction data. Building it would mean a new dependency and new aggregation for a feature most users haven't opted into — against this repo's no-speculative-work conventions.

## Phase 1 — Reactivity + docs parity (S)

1.1 Add a `categories:dirty` subscription to `src/hooks/use-stats.ts` (~line 150–162), mirroring the existing `unsub1..4` pattern. Category rename/recolor/delete should invalidate `categoryBreakdown` (feeds `TopCategoriesCard`, `StatsCategoryPie`) — today it only refreshes via pull-to-refresh or an unrelated dirty event firing first.

1.2 Skip `budgets:dirty` — no budget data flows into `CurrencyStats`/`StatsSupplement`; a listener for an event nothing consumes is dead code.

1.3 Skip focus-based refetch and a midnight-rollover timer. Pull-to-refresh already covers the manual case, and Budgets has the same class of staleness gap and deliberately left it as a documented gap rather than adding a timer — match that precedent instead of introducing a new pattern for Stats alone.

1.4 Add a `### Stats` section to `CLAUDE.md` (after Loans, before Bill Splitter, matching the existing domain-block style):
- Fetch-on-demand architecture — `fetchAllStatsData` / `fetchWrappedInsights` in `stats-service.ts`, no Zustand store (unlike every other domain).
- Dirty events it listens to (post-1.1): `transactions:dirty`, `accounts:dirty`, `tags:dirty`, `categories:dirty`, `db:reset`.
- Two intentional shortcuts in `stats-date-range.ts`, marked not-a-bug: pre-2000 `allTime` floor (line 105) and no previous-period comparison for `allTime`.
- **Known gap**: `computeForecast` and in-progress period stats (`thisWeek`/`thisMonth`/`allTime`) use `new Date()` at fetch time with no midnight-rollover refresh; stale if the app stays open past midnight. Same class as the Budgets "Known gap."

## Phase 2 — Fix the Wrapped empty-state gap (S)

`src/app/stats/wrapped.tsx` can render a fully blank scroll body for sparse-history users — `RhythmInsightCard` also returns `null` on all-zero data, so it's not just "half-empty," it can be completely empty below the header.

Compute `hasAnyInsight` from `topCategoryTrend` / `mostFrequent` / `medianPurchase` / `spendingByDayOfWeek` (any day with `avgExpense > 0`). When false, render a local empty state reusing `src/components/ui/empty-state.tsx` — the same primitive `StatsEmptyState` wraps — with copy like "Not enough activity yet for Wrapped insights this period." New i18n keys under `screens.stats.wrapped.*` in both `en.json`/`ar.json`; verify with `pnpm check-i18n-keys`.

Don't touch `StatsDetailShell`'s generic empty state — it correctly gates on `byCurrency` being empty (zero transactions at all) and is shared by 4 other screens with no concept of "wrapped insights." A second, narrower check local to the wrapped screen is the right size; leaking this into the shared shell would be over-engineering.

## Phase 3 — Finish the "Recurring" stub (M)

Build it — the data already exists (`computeExpenseBySubtype`, `stats-service.ts:613`), zero new queries.

- `src/components/stats/dashboard/recurring-card.tsx` — half-card shaped like `pace-card.tsx`: headline = recurring expense amount, support line = recurring as % of `current.totalExpense`. Swap into `stats-view.tsx`'s `halfRow`, replacing the `soon` `StatCard` (keep the `repeat-outline` icon).
- `src/app/stats/recurring.tsx` — new detail route via `StatsDetailShell`, showing the recurring/oneTime/unclassified split as progress-bar rows. Copy the row+track+fill pattern already used by `ByAccountList` in `src/app/stats/net-worth.tsx` — no new data fetch needed, `StatsDetailShell` already hands the screen `stats.expenseBySubtype`. Register in `src/app/_layout.tsx` next to the other 5 `stats/*` `<Stack.Screen>` entries.
- i18n: `screens.stats.recurring.*` (en + ar).

## Phase 4 — Descope the "Spending Map" stub (S)

Delete the `soon` `StatCard` block for Spending Map from `stats-view.tsx` and its now-orphaned i18n key, instead of building a real map. No maps SDK is installed, and the underlying `location` field is opt-in and not even selected by `fetchStatsTransactions` today — this isn't a "wire up existing data" win like Recurring, it's new aggregation on top of a rarely-enabled feature. A permanently-dimmed "Soon" card with no realistic path to "not soon" is worse than an empty slot.

This reverses half of `stats-redesign-plan.md`'s original "leave both as placeholders" call — flagged here for visibility rather than silently overridden.

## Phase 5 — Optional: Top Tags card (S/M)

`computeTopTags` (`stats-service.ts:627`) already returns the top 5 tags by expense on every `CurrencyStats` result, unused today. Cheapest genuinely new insight on the page: `src/components/stats/dashboard/top-tags-card.tsx`, same visual language as `TopCategoriesCard` (icon + tag name + amount rows). Candidate slot: replacing the Spending Map stub, or standalone under Insights — decoupled from Phase 4's decision, can ship independently or be skipped.

`stats.byAccount` (per-account expense/income *within the period*, distinct from `net-worth.tsx`'s live-balance list) is also computed and unused, but has no obvious UI slot in the current grid. Backlog only — don't build speculatively without a concrete slot decided first.

## Phase 6 — Explicitly out of scope

- `stats-date-range.ts:105` — pre-2000 `allTime` floor. Documented, intentional bound on bucket-array size.
- No previous-period comparison for `allTime` (`previousFrom === from` check in `fetchAllStatsData`). Documented, intentional.

Neither gets touched by this plan unless raised separately.

## Suggested order

Phase 1 → 2 (independent, no risk, quick wins) → 3 (real feature, uses free data) → 4 (deletion, needs a decision) → 5 (optional, decoupled from 4).

## Verification (per phase, once implemented)

1. `pnpm types` → `pnpm lint` → `pnpm check-i18n-keys`.
2. `pnpm unused-styles` after Phase 4's deletion.
3. Manual (`pnpm android`): Recurring card shows live data and opens its detail screen; Spending Map slot is gone and the grid still reads cleanly; Wrapped shows the new empty state on a sparse/new account instead of a blank screen; renaming a category live-updates Top Categories without needing pull-to-refresh.
