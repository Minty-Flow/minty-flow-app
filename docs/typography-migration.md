# Typography Integration

## Overview

`src/styles/theme/typography.ts` defines a Material Design 3 scale (15 tokens). These tokens are now injected into the Unistyles theme as `theme.typography`, making them accessible anywhere via the `StyleSheet.create((t) => ...)` callback.

## Token Reference

| Token | fontSize | fontWeight |
|-------|----------|------------|
| `displayLarge` | 48 | "500" |
| `displayMedium` | 36 | "500" |
| `displaySmall` | 24 | "500" |
| `headlineLarge` | 26 | "700" |
| `headlineMedium` | 22 | "700" |
| `headlineSmall` | 18 | "700" |
| `titleLarge` | 24 | "500" |
| `titleMedium` | 20 | "500" |
| `titleSmall` | 16 | "500" |
| `bodyLarge` | 16 | "400" |
| `bodyIntermediate` | 15 | "500" |
| `bodyMedium` | 13 | "400" |
| `bodySmall` | 10 | "400" |
| `labelLarge` | 14 | "400" |
| `labelMedium` | 12 | "400" |
| `labelSmall` | 10 | "400" |
| `labelXSmall` | 11 | "400" |

## Usage Patterns

### Spread (when token weight matches intent)
```ts
StyleSheet.create((t) => ({
  label: {
    ...t.typography.titleSmall,   // fontSize: 16, fontWeight: "500"
    color: t.colors.onSurface,
  },
}))
```

### Spread + override (when weight differs)
```ts
StyleSheet.create((t) => ({
  heading: {
    ...t.typography.titleSmall,
    fontWeight: "600",            // overrides "500" from token
    color: t.colors.onSurface,
  },
}))
```

### Size-only (when only fontSize is set, no fontWeight)
```ts
StyleSheet.create((t) => ({
  hint: {
    fontSize: t.typography.bodyMedium.fontSize,
    color: t.colors.customColors.semi,
  },
}))
```

## Text Component Variant Mapping

| Variant | Token | Notes |
|---------|-------|-------|
| `default` | `bodyLarge` | |
| `h1` | `displayMedium` | |
| `h2` | `headlineLarge` | Was 30px, now 26px |
| `h3` | `displaySmall` | |
| `h4` | `titleMedium` | |
| `p` | `bodyLarge` | |
| `lead` | `titleMedium` | |
| `large` | `headlineSmall` | |
| `small` | `labelLarge` | |
| `muted` | `labelLarge` | |
| `link` | `bodyLarge` | |
| `code` | `labelLarge.fontSize` | Keeps mono font + "600" weight |

## Sizes Outside the Scale (keep hardcoded)

| Size | Where | Notes |
|------|-------|-------|
| 64px | Big number displays | Hero display, not a text role |

## Files Modified

| File | Change |
|------|--------|
| `src/styles/theme/types.ts` | Added `typography: MintyTypographyTokens` to `UnistylesTheme` |
| `src/styles/theme/factory.ts` | Injects `typography` constant into `buildTheme()` |
| `src/styles/theme/typography.ts` | Added `bodyIntermediate` (15px) and `labelXSmall` (11px) tokens |
| `src/components/ui/text.tsx` | All variants use `theme.typography.*` tokens |
| `src/components/theme/theme.styles.ts` | Migrated |
| `src/components/transaction/transaction-form-v3/form.styles.ts` | Migrated |
| `src/components/transaction/location-picker-modal.tsx` | `title` migrated |
| `src/components/transaction/notes-modal.tsx` | `title`, `cancelText`, `doneText` migrated |
| `src/components/loans/loan-modify/loan-modify.styles.ts` | Migrated |
| `src/components/goals/goal-modify/goal-modify.styles.ts` | Migrated |
| `src/app/settings/preferences/language.tsx` | Fully migrated |
| `src/app/settings/data-management/export-history.tsx` | `emptyTitle` migrated |

## What Remains

Only `64px` (hero number displays) stays hardcoded — no equivalent token in the scale.
