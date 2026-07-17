# Stats Page Redesign — Card Dashboard + 5 Detail Screens

## Context

Current Stats tab is a long per-currency scroll (hero cards, line chart, balance chart, averages, pie). Replace with a card-grid dashboard per mockups: each card is a compact summary that navigates to its own drill-down screen. Recurring + Spending Map cards ship as dimmed "Soon" placeholders.

The data layer already computes almost everything needed (`CurrencyStats` in `src/types/stats.ts`: periodStats, previousPeriodStats, dailyData, categoryBreakdown, balanceTimeline, spendingByDayOfWeek, forecast, topTransactions, byAccount). Only the Wrapped screen needs new aggregations.

**User decisions:** currency switcher chip when >1 currency (single grid); custom Skia sankey for cash-flow; all 4 wrapped insights; reuse pie/DeltaBadge/chart infra, delete obsolete stats components.

## Main grid layout (mockups 1–2)

Header (unchanged pattern): `MonthYearPicker` + range label + "More options" → `DateRangePresetModal`.

1. Row: **CASH FLOW** (half) — "Overspent/Saved $X" + trend icon, "● In $A  $B Out ●" | **PACE** (half) — "Total spent", big expense amount + delta %, "Avg / day $X"
2. **TOP CATEGORIES** (full) — top 3 rows: name, amount, thin progress bar in category color
3. "Insights" section header
4. **Wrapped** teaser — "Your {month}, wrapped", "{n} entries · biggest $X", chevron
5. **NET WORTH** (full) — big total, "↗ $X in {period}" green, mini sparkline
6. Row: **CALENDAR** (half, mini heatmap or "No spending in this window.") | **RECURRING** (half, Soon placeholder)
7. **SPENDING MAP** (full, Soon placeholder)

Soon placeholders: opacity ~0.5, "Soon" badge, not pressable.

## Navigation / param strategy

- Detail routes are file-routed: `src/app/stats/{cash-flow,categories,wrapped,net-worth,calendar}.tsx` + 5 `<Stack.Screen>` entries in `src/app/_layout.tsx` (existing pattern, ~line 101+).
- Cards `router.push({ pathname, params: { preset, from, to } })` (ISO strings). Each detail screen seeds its own `useStats(init)` from `useLocalSearchParams` — independent fetch, no shared store, no sync-back (accepted simplification).
- Net worth + Calendar ignore incoming month params, seed `thisYear` (mockups default "By year"). `navigateRange`/`formatNavigatorLabel` already handle `byYear` — no new date utils.

## Phase 0 — Shared foundation

1. `src/hooks/use-stats.ts` — add optional init arg: `useStats(init?: { preset?: DateRangePresetId; from?: Date; to?: Date })`; derive initial `activePreset`/`dateRange` in useState initializers (currently hardcoded `thisMonth`, lines 65–69). ~15 lines.
2. New `src/components/stats/stats-period-header.tsx` — extract `stats-view.tsx` lines 55–113 (MonthYearPicker + more-options row + DateRangePresetModal, modal state inside). Used by tab + 5 detail screens.
3. New `src/components/stats/currency-switcher.tsx` — chip row, render only when `byCurrency.length > 1`. Screens hold `useState` of selected currency, pick `stats = byCurrency.find(...)`.

## Phase 1 — Service additions (wrapped only)

`src/database/services-sqlite/stats-service.ts` — new export `fetchWrappedInsights(range): Promise<WrappedInsights[]>` (per currency), called only by wrapped screen. Reuses private `fetchStatsTransactions` with window widened to `subMonths(startOfMonth(range.from), 3) → range.to`; JS aggregation:
- **medianPurchase** — in-range expense amounts, sorted median
- **mostFrequent** — group in-range expenses by normalized title, max count
- **topCategoryTrend** — top expense category in-range; per-calendar-month totals for 3 trailing months + current; trailing avg

New `WrappedInsights` type in `src/types/stats.ts` (currency, medianPurchase, mostFrequent {title, count}, topCategoryTrend {categoryName, colorSchemeName, months[4], trailingAvg} — all nullable).

Rhythm insight reads existing `spendingByDayOfWeek` — not in this service call. Net-worth by-year = bucket `balanceTimeline` to month-ends client-side. Calendar heatmap = existing `dailyData`. No other service changes.

## Phase 2 — Main grid

Rewrite `src/app/(tabs)/stats-view.tsx` body: keep header/RefreshControl/skeleton/empty branches; replace `CurrencyStatSection` map with `CurrencySwitcher` + card grid.

New `src/components/stats/dashboard/`:
- `stat-card.tsx` — shared shell: Pressable, `theme.colors.secondary` bg, `theme.radius`, icon + uppercase title + chevron header, `soon?` variant, `half?`. Rows = flexDirection row + two flex:1.
- `cash-flow-card.tsx` — headline from `current.totalNet`; exports `InOutRow` (reused by cash-flow screen summary)
- `pace-card.tsx` — `current.totalExpense` + `DeltaBadge` vs previous + `avgDailyExpense`
- `top-categories-card.tsx` — top 3 `categoryBreakdown`, progress bars via `getThemeStrict(colorSchemeName)?.primary` pattern (copy from `stats-category-pie.tsx`)
- `wrapped-card.tsx` — subtitle from `transactionCount` + `topTransactions[0]?.amount` (free, no query)
- `net-worth-card.tsx` — `supplement.currentNetBalance`, delta line, ~48px sparkline (single Skia Path from `balanceTimeline`, no axes/gestures)
- `calendar-card.tsx` — compact heatmap (Phase 6 component w/ `compact` prop) or empty text
- Recurring + Spending Map: inline `<StatCard soon half .../>` — no dedicated files

Rewrite `src/components/stats/stats-skeleton.tsx` to match grid shapes (~40 lines).

**Delete** after tab compiles: `currency-stat-section.tsx`, `currency-hero-row.tsx`, `stat-hero-card.tsx`, `stats-averages-row.tsx`, `daily-expense-line-chart.tsx`, `balance-timeline-chart.tsx`. Keep: `chart-container.tsx`, `chart-crosshair.tsx`, `delta-badge.tsx`, `stats-category-pie.tsx`, `stats-empty-state.tsx`, `stats-pending-notice.tsx`, `use-chart-font.ts`.

Icons all exist (verified): `ArrowsTransferUpDown`, `Dashboard` (gauge), `ChartDonut`/`ChartPie`, `Sparkles`, `Calendar`, `Repeat`, `Map`, `TrendingUp/Down`, `ChevronRight`. No add-icons.py run.

## Phase 3 — Detail screen scaffolding

5 route files, each: `useLocalSearchParams` → `useStats(init)` → `StatsPeriodHeader` → `CurrencySwitcher` → content; minimal per-screen skeleton; `StatsEmptyState` when empty. Register in `_layout.tsx`.

## Phase 4 — Categories detail (mockup 4)

Modify `stats-category-pie.tsx`: center label shows selected slice name+amount (falls back to total); `DeltaBadge` on selection (`deltaPercent` already in `CategoryBreakdownItem`); keep internal expense/income tabs; "Total −$X" line above. Screen adds `headerRight` list-view toggle (full breakdown as legend rows).

## Phase 5 — Net worth detail (mockup 6)

- New `src/components/stats/net-worth-chart.tsx` — CartesianChart + Line, dashed gridlines, touch tooltip (month + value) via existing `chart-crosshair.tsx` + `use-chart-font.ts`; buckets timeline to month-ends when interval ≠ day.
- Header: `supplement.currentNetBalance` big + "↗ $X in {period}".
- "By account" list inline in route: `supplement.accountBalanceSummary` rows — DynamicIcon, name, Money, progress bar = balance/maxAbs.

## Phase 6 — Calendar detail (mockup 7)

- New `src/components/stats/spending-heatmap.tsx` — plain Views (no chart lib). Columns = weeks (locale week start), rows = 7 weekdays, ~12px cells in horizontal ScrollView for year spans. M/W/F row labels, month column labels, 5-bucket intensity (0 = faint, quartiles of nonzero expense → `theme.colors.primary` at 0.25/0.5/0.75/1 opacity), Less→More legend. `compact` prop for grid card.
- New `src/components/stats/rhythm-insight-card.tsx` — "Your priciest day is {weekday}" + 7 plain-View bars from `spendingByDayOfWeek`. Shared with Wrapped.
- Header: "Spent in {period}" + `current.totalExpense`.

## Phase 7 — Wrapped detail (mockup 5)

- New `src/components/stats/insight-card.tsx` — generic: icon, pill badge, bold sentence, support line, optional children (mini bars = plain Views).
- Route: `useStats` + `fetchWrappedInsights(dateRange)` in effect (stale-guard via fetch-id ref, same pattern as use-stats). Cards: CATEGORY (4-bar month chart + % vs 3-mo avg), FREQUENT, RHYTHM (`RhythmInsightCard`), SHAPE (median). Skip null cards.

## Phase 8 — Cash flow detail + Sankey (mockup 3, hardest, last)

Route sections: summary card (`InOutRow` + overspent/saved headline), sankey, Income legend list, Spending legend list, "Averages, by day" (3 cards: `avgDailyExpense/Income/Net` + `DeltaBadge` vs previous).

New `src/components/stats/sankey-flow.tsx` — static Skia `<Canvas>`:
- Left nodes = income categories (`totalIncome > 0`; fallback single "Income" node); right = top 6 expense categories + "Other".
- No real income→expense links exist → proportional distribution: `ribbon(i,j) = income_i × (expense_j / totalExpense)`. Overspent → synthetic left node "From balance" for shortfall; underspent → right node "Saved" (columns balance).
- Geometry: node bars = RoundedRect width 8 at x=0 / x=W−8; height ∝ value, 4px gaps; ribbons = cubic bezier paths (`moveTo → cubicTo(mx,…) → lineTo → cubicTo → close`, mx = W/2), filled with target category color at ~0.35 opacity.
- No in-canvas labels (legends below cover it). No gestures (deferred).

## Phase 9 — i18n + verification

Add to BOTH `en.json` and `ar.json` under `screens.stats`: `dashboard.*` (card titles, soon, overspent/saved, in/out, totalSpent, avgPerDay, insights, wrappedTitle/Subtitle, noSpendingWindow), `cashFlow.*`, `categories.*`, `wrapped.*` (badges + sentences), `netWorth.*` (byAccount, deltaIn), `calendar.*` (spentIn, less, more). Reuse existing `moreOptions`, `pieToggle.*`, `emptyState.*`, `chart.uncategorizedLabel`.

## Verification (each phase)

1. `pnpm types` → `pnpm lint` → `pnpm check-i18n-keys`
2. `pnpm unused-styles` after deletions
3. Manual (`pnpm android`): grid matches mockups; each card opens detail on same period; net-worth/calendar open By year; chevron nav on all screens; Soon cards inert; currency chip with 2+ currencies; pull-to-refresh; empty month states.

## Deferred (flagged)

- Recurring + Spending Map screens (placeholders only, per user)
- Sankey tap-to-highlight
- Detail→tab period sync-back
- Calendar card compact heatmap may ship as text summary first if it drags
