# 03 — Add route-level error boundary

**What to build:** A single render throw currently blanks the entire app because nothing catches it. Add a reusable error boundary at the routing level that shows a recoverable error screen instead of a white/crash screen, so future render bugs (like this crash class) degrade gracefully.

**Blocked by:** 02 — Fix empty-currency crash in amount input

**Status:** ready-for-agent

- [ ] Forced render error shows error screen, app shell survives
- [ ] Normal navigation unaffected, no visual regression in screens