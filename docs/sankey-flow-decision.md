# SankeyFlow — open decision

**Status:** unresolved, kept as-is on purpose.
**Component:** `src/components/stats/sankey-flow.tsx` (144 lines)
**Only caller:** `src/app/stats/cash-flow.tsx:284`
**Raised by:** over-engineering review, 2026-07-17. Not a bug — the component works.

## The question

Does the Sankey earn its complexity, given the ribbons don't encode real data?

## What it does today

Two columns of nodes (income sources left, expense categories right) joined by
curved Skia ribbons. Left column is scaled by its own total, right column is
rejected unless it sums to the same total (±0.01).

## Why it was flagged

**The ribbons are computed, not observed.** The width of the ribbon from source
`i` to target `j` is:

```ts
const value = (source.value * target.value) / total
```

That's an outer product of the two columns' marginals. The code says so itself:

```ts
// No real income→expense links exist: distribute each source
// proportionally across all targets (ribbon = left_i × right_j / total)
```

Nothing in the schema links a specific income transaction to a specific expense
category — money isn't tracked that way. So every ribbon is a synthetic
proportional split, not a measured flow.

The consequence: **the ribbon layer carries zero information the two node
columns don't already show.** Ribbon widths are fully determined by the column
heights. A reader who studies the ribbons learns nothing new, and a reader who
*believes* them concludes something false — that "Salary funded 40% of Groceries"
when that relationship was never recorded.

A Sankey diagram's entire purpose is to show flow *structure*. With no structure
in the data, this is two stacked proportional bars rendered through bezier paths.

## Options

**A. Keep it.** It looks good, users like the wrapped/cash-flow aesthetic, and
   nobody reads ribbon widths that literally. Cost: 144 lines + a Skia canvas on
   a screen that already runs several charts.

**B. Replace with two stacked bars.** Identical information, a fraction of the
   code, no implied causality. Cost: less visually interesting.

**C. Make the ribbons real.** Requires actually modelling income→expense
   attribution (envelope budgeting / fund assignment). That's a real feature, not
   a chart change, and it's the only option where a Sankey is the right diagram.

## Recommendation

**B** on information-design grounds, **A** is defensible on product grounds.
The deciding question isn't code size — it's whether a chart that implies
a relationship the data doesn't contain is acceptable in a finance app.

If **A**: consider dropping ribbon opacity further (currently `0.35`) or
labelling them as proportional, so the visual doesn't assert a link.

## If removing (option B)

- Delete `src/components/stats/sankey-flow.tsx`
- `cash-flow.tsx`: drop the `SankeyFlow` import and its `<SankeyFlow left={left} right={right} />` usage (~line 284); `left`/`right` already hold the node data a bar chart needs
- Check whether `@shopify/react-native-skia` is still needed elsewhere — it is
  (`net-worth-chart`, `stats-category-pie`, `chart-crosshair`, `use-chart-font`),
  so the dependency stays either way
- Net: ~-150 lines

src/database/services-sqlite/data-management-service.ts:398-404
🟡 risk: pickBackupFile dropped the .json extension guard entirely, now accepts any file (not just .json/.zip), leaning on readPickedBackup's .zip suffix check + validateBackup to reject garbage. Confirm the DocumentPicker call above still restricts type — if it's "*/*", a picked non-JSON/non-zip file (e.g. .txt) silently attempts a JSON parse. Not a crash if validateBackup handles it, but worth an explicit check.

src/database/services-sqlite/data-management-service.ts:139-143
🔵 nit: defaultExportBaseName(type) ignores "zip" in its stem branch (type === "csv" ? ... : "...backup"), so zip exports get the same base name as JSON exports (minty-flow-backup-<date>.zip). Probably intended (zip is a full backup) but the type param name implies per-type naming — confirm zip sharing json's stem is deliberate.
