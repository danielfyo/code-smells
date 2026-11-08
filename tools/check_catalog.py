#!/usr/bin/env python3
"""Check that every catalog.json entry has its documentation and its implementations.

Usage: python3 tools/check_catalog.py [--strict]
With --strict the exit code is 1 when anything is missing.
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

# Minimum requirement per language: the folder exists and contains both versions.
REQUIRED = {
    "python": lambda p: any(p.glob("*smelly*")) and any(p.glob("*refactored*")),
    "csharp": lambda p: any(p.glob("*.cs")) or any(p.glob("*.md")),
    "react-ts": lambda p: any(p.rglob("*mell*")) and any(p.rglob("*efactored*")),
    "go": lambda p: (p / "smelly").is_dir() and (p / "refactored").is_dir(),
}


def main() -> int:
    catalog = json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))
    missing, total = [], 0
    for cat in catalog:
        for s in cat["smells"]:
            total += 1
            if not (ROOT / s["doc"]).exists():
                missing.append(f"{s['id']} {s['slug']}: missing doc {s['doc']}")
            for lang, rel in s["code"].items():
                p = ROOT / rel
                if not p.is_dir() or not REQUIRED[lang](p):
                    missing.append(f"{s['id']} {s['slug']}: missing {lang} at {rel}")
    for m in missing:
        print("✗", m)
    print(f"\n{total} smells checked, {len(missing)} missing items.")
    return 1 if missing and "--strict" in sys.argv else 0


if __name__ == "__main__":
    sys.exit(main())
