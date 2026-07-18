#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const DIRS = [
  "src/components/icons/filled",
  "src/components/icons/outline"
];

function regenBarrel(dir: string): void {
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.replace(/\.tsx$/, ""))
    .sort((a, b) => a.localeCompare(b));

  const lines = files.map(
    (name) => `export { default as ${name} } from "./${name}"`
  );
  fs.writeFileSync(path.join(dir, "index.ts"), lines.join("\n") + "\n");
  console.log(`✔ ${dir}/index.ts (${files.length} exports)`);
}

for (const dir of DIRS) regenBarrel(dir);
