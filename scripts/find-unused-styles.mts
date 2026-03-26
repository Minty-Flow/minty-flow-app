#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TARGET = path.resolve(ROOT, process.argv[2] || "src");

interface StyleBlock {
  file: string;
  varName: string;
  block: string;
  start: number;
  blockEnd: number;
  blockStartLine: number;
}

interface DefinedKey {
  key: string;
  lineOffsetInBlock: number;
  column: number;
}

function findFiles(dir: string, acc: string[] = []): string[] {
  if (!fs.existsSync(dir)) return acc;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const e of entries) {
    const full = path.join(dir, e.name);

    if (e.isDirectory()) {
      if (e.name !== "node_modules" && e.name !== ".git") {
        findFiles(full, acc);
      }
    } else if (e.name.endsWith(".ts") || e.name.endsWith(".tsx")) {
      acc.push(full);
    }
  }

  return acc;
}

/**
 * Extract style blocks from a file.
 */
function getStyleBlocks(file: string, content: string): StyleBlock[] {
  const blocks: StyleBlock[] = [];

  const re = /(export\s+)?const\s+(\w+)\s*=\s*StyleSheet\.create\s*\(/g;

  let m: RegExpExecArray | null;

  while ((m = re.exec(content)) !== null) {
    const varName = m[2];
    const start = m.index;

    const arrowMatch = /=>\s*\(\s*\{/.exec(content.slice(start));
    if (!arrowMatch) continue;

    const arrowIndex = start + arrowMatch.index;
    const openBrace = content.indexOf("{", arrowIndex);

    let depth = 1;
    let i = openBrace + 1;

    for (; i < content.length; i++) {
      if (content[i] === "{") depth++;
      else if (content[i] === "}") {
        depth--;
        if (depth === 0) break;
      }
    }

    const block = content.slice(openBrace + 1, i);

    const blockStartLine =
      content.slice(0, openBrace + 1).split("\n").length;

    const createStart = content.indexOf(
      "(",
      content.indexOf("StyleSheet.create", start)
    );

    let d = 1;
    let end = createStart + 1;

    for (; end < content.length; end++) {
      const c = content[end];
      if (c === "(" || c === "{") d++;
      else if (c === ")" || c === "}") d--;
      if (d === 0) break;
    }

    blocks.push({
      file,
      varName,
      block,
      start,
      blockEnd: end + 1,
      blockStartLine,
    });
  }

  return blocks;
}

/**
 * Extract top-level style keys from a block string.
 */
function getDefinedKeys(blockStr: string): DefinedKey[] {
  const keys: DefinedKey[] = [];
  let depth = 0;
  const lines = blockStr.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const open = (line.match(/{/g) || []).length;
    const close = (line.match(/}/g) || []).length;

    const match = line.match(/^\s*(\w+):\s*\{/);

    if (match && depth === 0) {
      const column = (line.match(/^\s*/)?.[0]?.length ?? 0) + 1;

      keys.push({
        key: match[1],
        lineOffsetInBlock: i,
        column,
      });
    }

    depth += open - close;
  }

  return keys;
}

/**
 * Resolve an import specifier from a source file to an absolute path.
 * Tries .ts and .tsx extensions as well as direct resolution.
 */
function resolveImport(
  fromFile: string,
  importSpec: string,
  knownFiles: Set<string>
): string | null {
  if (!importSpec.startsWith(".")) return null;

  const dir = path.dirname(fromFile);
  const base = path.resolve(dir, importSpec);

  const candidates = [
    base,
    base + ".ts",
    base + ".tsx",
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
  ];

  for (const candidate of candidates) {
    if (knownFiles.has(candidate)) return candidate;
  }

  return null;
}

/**
 * Build a forward import graph: file -> set of files it directly imports.
 */
function buildImportGraph(
  files: string[],
  contents: Map<string, string>,
  knownFiles: Set<string>
): Map<string, Set<string>> {
  const graph = new Map<string, Set<string>>();

  for (const file of files) {
    const content = contents.get(file) ?? "";
    const importRe = /from\s+['"]([^'"]+)['"]/g;
    let m: RegExpExecArray | null;
    const imports = new Set<string>();

    while ((m = importRe.exec(content)) !== null) {
      const resolved = resolveImport(file, m[1], knownFiles);
      if (resolved) {
        imports.add(resolved);
      }
    }

    if (imports.size > 0) {
      graph.set(file, imports);
    }
  }

  return graph;
}

/**
 * Build a reverse map from a forward graph: file -> set of files that import it.
 */
function buildReverseMap(
  graph: Map<string, Set<string>>
): Map<string, Set<string>> {
  const reverse = new Map<string, Set<string>>();

  for (const [file, imports] of graph.entries()) {
    for (const imported of imports) {
      if (!reverse.has(imported)) reverse.set(imported, new Set());
      reverse.get(imported)!.add(file);
    }
  }

  return reverse;
}

/**
 * Find all files that depend on the given file (directly or indirectly) by traversing the reverse graph.
 */
function findDependentFiles(
  startFile: string,
  reverseMap: Map<string, Set<string>>
): Set<string> {
  const visited = new Set<string>();
  const queue: string[] = [startFile];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const dependents = reverseMap.get(current);
    if (dependents) {
      for (const dep of dependents) {
        if (!visited.has(dep)) {
          visited.add(dep);
          queue.push(dep);
        }
      }
    }
  }

  return visited;
}

/**
 * Collect every property-access key used in a set of files.
 * Matches both `obj.key` and `obj["key"]` forms.
 */
function collectUsedKeys(
  files: Iterable<string>,
  contents: Map<string, string>
): Set<string> {
  const used = new Set<string>();

  const dotRe = /\.(\w+)/g;
  const bracketRe = /\["(\w+)"\]/g;

  for (const file of files) {
    const content = contents.get(file) ?? "";

    let m: RegExpExecArray | null;

    dotRe.lastIndex = 0;
    while ((m = dotRe.exec(content)) !== null) {
      used.add(m[1]);
    }

    bracketRe.lastIndex = 0;
    while ((m = bracketRe.exec(content)) !== null) {
      used.add(m[1]);
    }
  }

  return used;
}

function run(): void {
  const files = findFiles(TARGET);
  const fileSet = new Set(files);

  // Pre-read all files once
  const contents = new Map<string, string>();
  for (const file of files) {
    contents.set(file, fs.readFileSync(file, "utf8"));
  }

  // Build import graph and reverse map for all files
  const importGraph = buildImportGraph(files, contents, fileSet);
  const reverseMap = buildReverseMap(importGraph);

  // Find all style files and extract their blocks
  const styleFiles = new Set<string>();
  const allBlocks: StyleBlock[] = [];

  for (const file of files) {
    const content = contents.get(file)!;

    if (!content.includes("StyleSheet.create")) continue;

    styleFiles.add(file);
    allBlocks.push(...getStyleBlocks(file, content));
  }

  let totalUnused = 0;

  for (const block of allBlocks) {
    const defined = getDefinedKeys(block.block);

    // Collect usage from all files that depend on this style file (directly or indirectly)
    const dependents = findDependentFiles(block.file, reverseMap);
    const filesToSearch = new Set([...dependents, block.file]);
    const usedKeys = collectUsedKeys(filesToSearch, contents);

    const unused = defined.filter((k) => !usedKeys.has(k.key));

    if (unused.length > 0) {
      totalUnused += unused.length;

      const relative = path.relative(ROOT, block.file);

      for (const u of unused) {
        const line = block.blockStartLine + u.lineOffsetInBlock;

        console.log(
          `${relative}:${line}:${u.column}: unused style key "${u.key}" (${block.varName})`
        );
      }
    }
  }

  if (totalUnused === 0) {
    console.log("No unused style keys found.");
  } else {
    console.log(`\nTotal: ${totalUnused} unused style key(s).`);
  }
}

run();