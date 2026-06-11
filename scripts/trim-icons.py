#!/usr/bin/env python3
"""
Moves unused icon files outside src/ to unused-icons/,
then regenerates the barrel index.ts files for filled/ and outline/.
"""

import re
import os
import shutil
from pathlib import Path

ROOT = Path(__file__).parent.parent
ICON_SVG = ROOT / "src/components/ui/icon-svg.tsx"
FILLED_DIR = ROOT / "src/components/icons/filled"
OUTLINE_DIR = ROOT / "src/components/icons/outline"
UNUSED_DIR = ROOT / "unused-icons"

# ── 1. Parse icon-svg.tsx for used icon names ──────────────────────────────
content = ICON_SVG.read_text()

filled_used = set(re.findall(r'FilledIcons\.(\w+)', content))
outline_used = set(re.findall(r'OutlineIcons\.(\w+)', content))

print(f"Used filled:  {len(filled_used)}")
print(f"Used outline: {len(outline_used)}")

# ── 2. Move unused files ───────────────────────────────────────────────────
def move_unused(src_dir: Path, used_names: set[str], kind: str):
    dest_dir = UNUSED_DIR / kind
    dest_dir.mkdir(parents=True, exist_ok=True)

    moved = 0
    kept = 0
    for f in src_dir.iterdir():
        if f.name == "index.ts":
            continue
        if f.suffix != ".tsx":
            continue
        name = f.stem  # e.g. "ArrowUpCircle"
        if name not in used_names:
            shutil.move(str(f), str(dest_dir / f.name))
            moved += 1
        else:
            kept += 1

    print(f"{kind}: kept {kept}, moved {moved} to unused-icons/{kind}/")
    return kept

kept_filled = move_unused(FILLED_DIR, filled_used, "filled")
kept_outline = move_unused(OUTLINE_DIR, outline_used, "outline")

# ── 3. Regenerate barrel index.ts files ───────────────────────────────────
def regen_barrel(src_dir: Path):
    files = sorted(
        f.stem for f in src_dir.iterdir()
        if f.suffix == ".tsx" and f.name != "index.ts"
    )
    lines = [f'export {{ default as {name} }} from "./{name}"' for name in files]
    (src_dir / "index.ts").write_text("\n".join(lines) + "\n")
    print(f"  Regenerated {src_dir}/index.ts ({len(files)} exports)")

regen_barrel(FILLED_DIR)
regen_barrel(OUTLINE_DIR)

print("\nDone.")
