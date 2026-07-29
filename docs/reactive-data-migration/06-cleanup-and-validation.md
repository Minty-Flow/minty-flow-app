# Phase 6: Cleanup And Validation

## Goal

Remove legacy reactivity and verify the app behaves as a Drizzle-backed,
database-reactive app.

## Cleanup

Delete only after equivalent Drizzle reads and writes are live:

- `src/database/events.ts` domain events.
- Zustand DB stores under `src/stores/db/`.
- Raw SQL repos that no longer have callers.
- Manual refresh subscriptions in screens.
- Obsolete custom migration bootstrap after Drizzle migration adoption has shipped safely.

Keep MMKV/Zustand stores for UI preferences and app state:

- theme
- language
- money formatting
- transfer display preference
- trash retention preference
- onboarding/profile/app-lock/preferences

## Dev Tools

Add Drizzle Studio only in development:

- Use `useDrizzleStudio(expoDb)` near the DB root.
- Guard by `__DEV__`.
- Do not call it on web.
- Keep it out of production behavior.

## Validation Matrix

Run commands:

```bash
pnpm lint:fix
pnpm types
pnpm structure
pnpm check-i18n-keys
pnpm unused-styles
pnpm check-number-formatting
```

Manual flows:

- Create, edit, delete, restore, and destroy transactions.
- Create, edit, delete, restore, and destroy transfers with combined and separate layouts.
- Create and archive accounts.
- Create/update/delete categories and tags.
- Create/update/delete budgets, goals, and loans.
- Generate recurring transactions.
- Confirm and unconfirm pending transactions.
- Empty trash and retention auto-purge.
- Export backup, import backup, interrupt import, recover.
- Open stats screens after writes and after app restart.

## Release Checks

- Existing v3 database upgrades in place.
- Fresh install works.
- App restart keeps all data.
- No screen depends on a stale Zustand DB cache.
- No `console.*` added.
- No money parsing/formatting rule is bypassed.

## Acceptance Criteria

- Dirty-event domain reactivity is gone.
- `useLiveQuery` is the only DB read reactivity mechanism.
- All pre-commit commands pass.
- Drizzle Studio works in a dev build.

