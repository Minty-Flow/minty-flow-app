# Money Architecture

## Goal

Minty Flow stores monetary values in integer minor units so money logic is deterministic across currencies, math input, transfers, charts, import/export, and future schema changes.

This document defines the usage contract future developers should follow. The short version:

- Persist money as integer minor units.
- Parse user-entered amount text through `src/utils/money.ts`.
- Format displayed money through `src/utils/number-format.ts` or `src/components/money.tsx`.
- Do not hand-roll money parsing, conversion, rounding, or formatting in feature code.

## Source Of Truth

### `src/utils/money.ts`

Owns money domain logic:

- `getMinorUnitDigits`
- `assertMinorUnits`
- `parseMajorUnits`
- `majorNumberToMinorUnits`
- `toMajorUnits`
- `convertMinorUnits`
- `rescaleMinorUnits`
- `minorUnitsToDecimalString`

Use this file whenever the code is doing real money work.

### `src/utils/number-format.ts`

Owns display formatting:

- `formatMoney`
- `formatNumber`
- `formatPercent`
- editable-number helpers

This file is for presentation, not persistence.

### `src/components/money.tsx`

Preferred UI wrapper for rendering a money value. It applies sign rules, privacy masking, formatting preferences, and the shared money formatter.

## Mandatory Rules

### Storage

- Database money columns are integer minor units.
- Service-layer money values are integer minor units.
- Zustand store money values are integer minor units.
- Feature code must never persist floating-point major-unit amounts.

### Parsing

- Amount text input may temporarily live as raw text while the user edits.
- When committing an entered amount, convert it with `parseMajorUnits(input, currencyCode)`.
- Do not parse money with `parseFloat`, `Number.parseFloat`, or `Number(...)` in feature code.

### Formatting

- Render money with `Money` or `formatMoney`.
- Render non-money numeric UI with `formatNumber` or `formatPercent` when shared formatting is useful.
- Do not build money strings with `toFixed`, concatenation, or `Intl.NumberFormat` directly in feature code.

### Conversion

- Use `convertMinorUnits` for FX conversions.
- Use `rescaleMinorUnits` when a stored amount needs to preserve its displayed major-unit value across currencies with different exponents.
- Do not write `amount * rate` or `amount / 100` directly for stored money values in feature code.

### Validation

- Use `assertMinorUnits` at trust boundaries when a function expects stored money.
- Keep money as integers end to end once it has been parsed.

## Naming Contract

When introducing local variables, make the unit obvious:

- Minor units: `amountMinor`, `balanceMinor`, `valueMinor`, `convertedMinor`
- Raw input text: `amountInput`, `draftInput`
- Major-unit numbers for temporary math or display-only cases: `sourceMajor`, `targetMajor`

Avoid ambiguous names like `amount`, `value`, or `price` when the unit is not clear in local logic.

## What Belongs Outside The Money Helpers

Do not over-centralize unrelated numeric logic. These usually do not need money helpers:

- progress ratios
- chart percentages
- file size formatting
- layout widths
- counters
- exchange-rate editing before final validation

The rule is simple: if the value represents stored or displayed money, use the shared money path. If it is generic math or UI, keep it local unless duplication becomes real.

## Safe Flow

### Input

1. User edits raw text
2. Feature keeps temporary string state
3. Commit with `parseMajorUnits`
4. Store/pass integer minor units

### Persistence

1. Service receives minor units
2. Optional `assertMinorUnits`
3. Write integer values to SQLite

### Rendering

1. Feature reads minor units
2. Passes value and currency to `Money` or `formatMoney`
3. Shared formatting handles sign, grouping, privacy, and currency exponent

## Anti-Patterns

Avoid these in money code:

- `parseFloat(amountInput)`
- `Number(amountString)`
- `amount.toFixed(2)`
- `new Intl.NumberFormat(...).format(amount)` for money in feature code
- `amount * rate` for stored money
- `amount / 100` or `amount * 100` to reinterpret stored money

These are the kinds of shortcuts that silently break multi-currency behavior or rounding guarantees.

## Migration Notes

The v3 SQLite migration converts legacy decimal-era money into integer minor units. That migration is the boundary between the old representation and the new one. New runtime code should assume integer minor units everywhere outside explicitly labeled migration/import compatibility code.

## Enforcement

The repo already has `pnpm check-number-formatting`.

When tightening this area further, prefer adding invariant checks there instead of spreading one-off reminders across feature files.
