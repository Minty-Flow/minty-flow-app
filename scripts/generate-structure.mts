#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT: string = process.argv[2] || ".";
const OUTPUT = "STRUCTURE.md";

const IGNORE: Set<string> = new Set([
  "node_modules",
  ".git",
  ".expo",
  "dist",
  "build",
  "android",
  "ios",
  "tabler-icons",
]);

const MAX_DEPTH = 8; // safety valve

function walk(
  dir: string,
  prefix: string = "",
  depth: number = 0
): string {
  if (depth > MAX_DEPTH) return "";

  const entries: fs.Dirent[] = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e: fs.Dirent) => !IGNORE.has(e.name))
    .sort((a: fs.Dirent, b: fs.Dirent) => {
      // folders first, then alphabetical
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  return entries
    .map((entry: fs.Dirent, index: number) => {
      const isLast = index === entries.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const nextPrefix = prefix + (isLast ? "    " : "│   ");
      const fullPath = path.join(dir, entry.name);

      // const icon = entry.isDirectory() ? "📁 " : "📄 ";

      if (entry.isDirectory()) {
        return (
          prefix +
          connector +
          // icon +
          entry.name +
          "/\n" +
          walk(fullPath, nextPrefix, depth + 1)
        );
      }

      // return prefix + connector + icon + entry.name + "\n";
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