# 01 — Re-enable pre-commit hook

**What to build:** The pre-commit hook (structure + lint:fix + number checks + typecheck) is currently disabled because pnpm's automatic dependency check re-installs packages on every commit and hangs on a slow connection. Once every other ticket set in this breakdown is done and merged, restore the hook — and first make it resilient so it never hangs again: skip/verify-once the pnpm dependency check inside the hook instead of triggering a full re-install.

**Blocked by:** 1-01 Fix account inline select scroll, 2-01 Remove transfer type from category create/modify, 3-01 Add currency search by symbol name and code, 4-01 Fix app crash when creating loan budget or goal

**Status:** ready-for-agent

- [ ] All other ticket sets delivered and merged
- [ ] Hook re-enabled (renamed back to active)
- [ ] Hook no longer triggers a full pnpm re-install on commit
- [ ] Hook completes in reasonable time on a slow connection