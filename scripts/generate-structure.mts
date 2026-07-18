#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT: string = process.argv[2] || ".";
const OUTPUT = "./docs/STRUCTURE.md";

// Only bare names here — path-based ignores go in IGNORE_PATHS
const IGNORE: Set<string> = new Set([
  "node_modules",
  ".git",
  ".expo",
  "dist",
  "build",
  "android",
  "ios",
  "tabler-icons",
  "unused-icons",
  ".claude",
  ".opencode",
  ".agents"
]);

// Ignored by path segment match (relative to ROOT)
const IGNORE_PATHS: string[] = [
  "CLAUDE.md",
  "AGENTS.md",
  "RELEASE_NOTES.md",
  ".oac.json"
];

// Dirs listed but not recursed into — contents are generated, not hand-authored
const COLLAPSE_PATHS: Record<string, string> = {
  "src/components/icons/filled": "tabler-icons, generated via `pnpm icons:sync` — not enumerated",
  "src/components/icons/outline": "tabler-icons, generated via `pnpm icons:sync` — not enumerated"
};

const MAX_DEPTH = 8;

function isIgnoredPath(fullPath: string): boolean {
  const rel = path.relative(ROOT, fullPath);
  return IGNORE_PATHS.some(
    (p) => rel === p || rel.startsWith(p + path.sep)
  );
}

function walk(dir: string, prefix: string = "", depth: number = 0): string {
  if (depth > MAX_DEPTH) return "";

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return ""; // unreadable directory (permissions, broken symlink, etc.)
  }

  entries = entries
    .filter((e) => {
      if (IGNORE.has(e.name)) return false;
      if (isIgnoredPath(path.join(dir, e.name))) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  return entries
    .map((entry, index) => {
      const isLast = index === entries.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const nextPrefix = prefix + (isLast ? "    " : "│   ");
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const rel = path.relative(ROOT, fullPath);
        const collapseNote = COLLAPSE_PATHS[rel];
        if (collapseNote) {
          return prefix + connector + entry.name + `/ /* ${collapseNote} */\n`;
        }

        // Guard against symlinked directories → prevents infinite loops
        const real = fs.realpathSync(fullPath);
        const rootReal = fs.realpathSync(ROOT);
        if (!real.startsWith(rootReal)) {
          return prefix + connector + entry.name + "/ → (external symlink, skipped)\n";
        }

        return (
          prefix +
          connector +
          entry.name +
          "/\n" +
          walk(fullPath, nextPrefix, depth + 1)
        );
      }

      return prefix + connector + entry.name + "\n";
    })
    .join("");
}

function run(): void {
  const tree = `# Project Structure
Generated on: ${new Date().toISOString()}
\`\`\`
${ROOT}/
${walk(ROOT)}
\`\`\`
`;

  if (fs.existsSync(OUTPUT)) {
    console.warn("⚠ Overwriting existing STRUCTURE.md");
  }
  fs.writeFileSync(OUTPUT, tree, "utf8");
  console.log(`✔ Project structure written to ${OUTPUT}`);
}

run();
