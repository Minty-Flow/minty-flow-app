<p align="center">
  <img src="src/assets/images/icon.png" width="96" alt="Minty Flow icon" />
</p>

<h1 align="center">Minty Flow</h1>

<p align="center">
  A free, open-source, and beautifully simple personal finance tracker — fully offline, privacy-first, built for Android (iOS coming soon/when im rich).
</p>

---

## Download

<!-- [![Google Play - Download](https://img.shields.io/badge/Google_Play-Download-C0FFCA?style=for-the-badge&logo=google-play&logoColor=C0FFCA)](https://play.google.com/store/apps/details?id=com.mintyflow.tracker)
[![GitHub - Releases](https://img.shields.io/badge/GitHub-Releases-C0FFCA?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Minty-Flow/minty-flow-app/releases)
[![Minty Flow - Website](https://img.shields.io/badge/Minty_Flow-Website-C0FFCA?style=for-the-badge&logo=googlechrome&logoColor=white)](https://minty-flow.github.io)
 -->

[![Google Play - Download](https://img.shields.io/badge/Google_Play-Download-161b22?style=for-the-badge&logo=google-play&logoColor=C0FFCA&labelColor=21262d)](https://play.google.com/store/apps/details?id=com.mintyflow.tracker)
[![GitHub - Releases](https://img.shields.io/badge/GitHub-Releases-161b22?style=for-the-badge&logo=github&logoColor=C0FFCA&labelColor=21262d)](https://github.com/Minty-Flow/minty-flow-app/releases)
[![Minty Flow - Website](https://img.shields.io/badge/Minty_Flow-Website-161b22?style=for-the-badge&logo=googlechrome&logoColor=C0FFCA&labelColor=21262d)](https://minty-flow.github.io)


> **iOS support is coming.** The app is built with React Native and the iOS build works locally — a public TestFlight release is in progress.

---

## What you can do with it

**Track money without the friction**

- Log income, expense, and transfers through a fast, uncluttered entry form
- Unlimited accounts, multi-currency, with exchange-rate conversion
- Organise with categories, tags, file attachments, and optional geo-tagging
- Automate the repeat stuff: recurring transactions (RRULE) and a built-in bill splitter

**Stay ahead of your money**

- Budgets with period limits and alert thresholds
- Savings goals with live progress
- Track money lent and borrowed, with one-tap settlement

**Your data stays yours**

- Fully offline — no cloud, no sync, no account to create
- No trackers, no analytics, no ads
- Biometric / PIN app lock
- JSON export and import recovery, so you're never locked in

**Make it feel like yours**

- Themes: Minty (Light/Dark/OLED), Catppuccin (Frappé/Macchiato/Mocha), Palenight, Nord, Monochrome
- English and Arabic, with full RTL layout

Free — every feature, no paywall.

---

## Development

### Prerequisites

- Node.js 18+
- pnpm
- Android Studio with AVD (for Android)
- Xcode (for iOS, macOS only)

> Native modules (`expo-sqlite`, MMKV) require a **dev build**. `pnpm start` with Expo Go will not work.

### Setup

```bash
# Install dependencies
pnpm install

# Generate native projects (first time or after native dep changes)
pnpm prebuild

# Run
pnpm android    # Android
pnpm ios        # iOS (macOS only)
```

### Useful commands

| Command | Description |
|---|---|
| `pnpm lint` | Biome lint check |
| `pnpm lint:fix` | Lint and auto-fix |
| `pnpm types` | TypeScript type check |
| `pnpm structure` | Regenerate docs/STRUCTURE.md |
| `pnpm check-i18n-keys` | Find missing translation keys |
| `pnpm unused-styles` | Find unused unistyles StyleSheets |
| `pnpm check-number-formatting` | Verify centralized number formatting rules |

**Pre-commit hook** (husky): runs `pnpm structure` → `pnpm lint:fix` → `pnpm check-number-formatting` → `pnpm types` automatically. All four must pass.

### Editor setup (Biome)

Linting and formatting are handled by [Biome](https://biomejs.dev) — not ESLint
or Prettier. To get inline lint diagnostics and format-on-save in your editor:

1. **Install the Biome extension** for your editor
   ([first-party editor integrations](https://biomejs.dev/guides/editors/first-party-extensions/)):
   - VS Code / Cursor / Windsurf — [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
   - Zed — bundled, no install needed
   - JetBrains — [Biome plugin](https://plugins.jetbrains.com/plugin/22761-biome)
2. **Install Biome globally** so the extension can resolve the CLI outside the
   project sandbox:
   ```bash
   pnpm add -g @biomejs/biome
   ```
3. Set Biome as the default formatter and enable format-on-save. Editor config
   files (`.vscode/`, `.zed/`) are intentionally **not** committed — configure
   your own.

`biome.json` at the repo root is the shared source of truth; the CLI
(`pnpm lint`) and your editor both read it.

### Icons

Icons are generated from [tabler-icons](https://github.com/tabler/tabler-icons)
via `svgr` into `src/components/icons/{filled,outline}`. That folder holds the
full tabler set (every icon, used or not) as the single source of truth —
`src/components/ui/icon-svg.tsx` only imports the ones it actually uses, so
unused icons sit on disk but never enter the bundle.

One-time setup — clone tabler-icons as a sibling of this repo, shallow and
sparse so you only pull the `icons/` folder, not the whole tabler monorepo history:

```bash
git clone --depth=1 --filter=blob:none --sparse https://github.com/tabler/tabler-icons.git
cd tabler-icons
git sparse-checkout set icons
cd ..
```

To pick up new/updated tabler icons:

```bash
cd tabler-icons && git pull && cd ..
pnpm icons:sync
```

To use a new icon, add one import + one `ICON_MAP` entry in `icon-svg.tsx` —
the file is already on disk after `icons:sync`.

---

## Contributing

Issues, translations, and pull requests are welcome. See
[CONTRIBUTING.md](CONTRIBUTING.md) for setup, branch, and style guidelines.
By taking part you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Support

Minty Flow is a personal project built in free time. If you find it useful:

- ⭐ Star the repo on GitHub
- Leave a review on Google Play
- Tell a friend

---

## Supported languages

Minty Flow currently ships in:

- **English** — source language
- **Arabic (العربية)** — complete translation with full right-to-left layout

> Want to see Minty Flow in your language? Follow the
> [Translation guide](CONTRIBUTING.md#translation-guide) — no coding required,
> and contributors are credited here.


