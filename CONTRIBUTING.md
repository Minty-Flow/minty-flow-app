# Contributing to Minty Flow

Thanks for taking the time to help out. Minty Flow is a local-first personal
finance app built with Expo / React Native. Bug reports, translations, and
pull requests are all welcome.

By participating you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- **Report a bug** — open an issue with steps to reproduce, expected vs. actual
  behaviour, device / OS, and app version.
- **Suggest a feature** — open an issue describing the problem it solves before
  writing code, so we can agree on the approach.
- **Add a translation** — see the [Translation guide](#translation-guide)
  below. No coding experience needed.
- **Fix or build something** — see below.

## Development setup

Prerequisites: Node.js 18+, pnpm, Android Studio (with an AVD) or Xcode.

```bash
pnpm install
pnpm prebuild        # generate native projects (first run / after native dep changes)
pnpm android         # or: pnpm ios (macOS only)
```

Native modules (`expo-sqlite`, MMKV) require a **dev build** — Expo Go will not
work.

## Branch and PR flow

1. Fork the repo and branch off `main` (`feat/…`, `fix/…`, `docs/…`).
2. Keep the change focused — one logical change per PR.
3. Make sure the checks below pass before pushing.
4. Open the PR against `main` with a clear description of what changed and why.
   Link the issue it closes.

## Checks

The pre-commit hook (husky) runs these automatically and they must all pass:

```bash
pnpm structure                # regenerate docs/STRUCTURE.md
pnpm lint:fix                 # Biome check + autofix
pnpm check-number-formatting  # centralized money-formatting rules
pnpm types                    # tsc --noEmit
```

There is no test framework set up; verify changes by running the app.

## Translation guide

Minty Flow's interface text lives in JSON files under
`src/i18n/translation/` — `en.json` is the source of truth, `ar.json` is the
Arabic translation. Adding a language means adding one more file there.

You do **not** need a working dev build to translate. You only need a text
editor and, ideally, the repo cloned so the checks can run.

### Steps

1. **Pick your language code.** Use the [ISO 639-1][iso639] two-letter code
   (e.g. `fr` for French, `es` for Spanish). For a regional variant use
   `code-REGION` (e.g. `pt-BR`).
2. **Copy the source file.** Duplicate `src/i18n/translation/en.json` to
   `src/i18n/translation/<code>.json`.
3. **Translate the values, never the keys.** In `"home.greeting": "Good
   morning"`, only `Good morning` changes. Leave everything on the left of the
   colon exactly as it is.
4. **Keep the placeholders.** Tokens like `{{count}}`, `{{name}}`, or `%s` must
   appear untouched in your translation — they are filled in at runtime. Word
   order around them can change.
5. **Mind the length.** Some strings sit in tight buttons and labels. Prefer a
   short natural phrasing over a literal one that overflows.
6. **Register the language** so the app can offer it: add an entry to
   `src/i18n/language.constants.ts` and load the new file in
   `src/i18n/config.ts` (follow how `ar` is wired up). If you are not
   comfortable editing these two files, submit the JSON file alone and note it
   in your PR — a maintainer will wire it in.
7. **Right-to-left languages** (Hebrew, Persian, …): the language → direction
   check currently lives in `src/stores/language.store.ts` (search for
   `LangCodeEnum.AR`). Extend that check to include your code; layout
   mirroring is handled from there. Flag this in your PR if unsure.
8. **Run the check** (if you have the repo set up):

   ```bash
   pnpm check-i18n-keys
   ```

   It fails if any key from `en.json` is missing in your file. Fix reported
   keys until it passes.
9. **Open a PR** titled `i18n: add <Language>`. Mention any strings you were
   unsure about so reviewers can help.

### Updating an existing translation

Found a wrong or awkward string? Edit the value directly in that language's
JSON file and open a PR — small fixes are very welcome and don't need an issue
first.

### Credit

Every translator is credited by name or handle in the **Supported languages**
section of the README. Tell us in the PR how you'd like to be listed (or if
you'd rather not be).

[iso639]: https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes

## Code style

- TypeScript strict — no `any`. `const` over `let`; prefer immutability.
- Early returns; keep functions under ~50 lines.
- No `console.*` — use `src/utils/logger.ts`.
- Biome owns formatting and import order (packages → `~/` aliases → relative).
- All styles use the `StyleSheet.create((t) => …)` callback form, in
  co-located `*.styles.ts` files.
- Money is always stored and passed as integer minor units. Use
  `src/utils/money.ts` and `src/components/money.tsx` — never hand-roll with
  `parseFloat`, `toFixed`, or `Intl.NumberFormat`.
- Comment only when the *why* is non-obvious. Prefixes: `BUG`, `FIXME`,
  `HACK`, `XXX`, `TODO`.

See [`docs/STRUCTURE.md`](docs/STRUCTURE.md) for the full project layout.

## License

Contributions are licensed under the same license as this project (see
[LICENSE](LICENSE)).
