# Domain Docs

How the engineering skills should consume this repo's domain documentation when
exploring the codebase. Layout: **single-context**.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root (may not exist yet — created lazily by
  `/domain-modeling`).
- **`docs/adr/`**: read ADRs that touch the area you're about to work in.

If any of these files don't exist, **proceed silently**. Don't flag their
absence; don't suggest creating them upfront. `/domain-modeling` (reached via
`/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily
when terms or decisions actually get resolved.

## File structure

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-*.md
│   └── 0002-*.md
└── src/
```

Not a monorepo (`pnpm-workspace.yaml` exists but declares no packages), so
there is no `CONTEXT-MAP.md` and no per-context `src/<context>/docs/adr/`.

## Use the glossary's vocabulary

When output names a domain concept (issue title, refactor proposal,
hypothesis, test name), use the term as defined in `CONTEXT.md`. Don't drift to
synonyms the glossary avoids. A concept missing from the glossary is a signal:
either you're inventing language the project doesn't use (reconsider) or
there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly rather than
silently overriding:

> _Contradicts ADR-0007 (…), but worth reopening because…_
