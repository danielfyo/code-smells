#!/usr/bin/env python3
"""Fail if any relative link in the repository's Markdown files points to a missing file.

Usage: python3 tools/check_links.py
External links (http, https, mailto) and pure anchors are not checked; links inside fenced
code blocks are ignored.
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LINK = re.compile(r"\]\(([^)\s]+)\)")
FENCE = re.compile(r"^(```|~~~)")
SKIP_DIRS = {"node_modules", ".git", "bin", "obj", ".pytest_cache", ".venv"}


def markdown_files() -> list[Path]:
    return [p for p in ROOT.rglob("*.md") if not SKIP_DIRS.intersection(p.parts)]


def broken_links(md: Path) -> list[str]:
    broken, in_code = [], False
    for number, line in enumerate(md.read_text(encoding="utf-8").splitlines(), 1):
        if FENCE.match(line.strip()):
            in_code = not in_code
            continue
        if in_code:
            continue
        for target in LINK.findall(line):
            path = target.split("#", 1)[0]
            if not path or re.match(r"^[a-z][a-z0-9+.-]*:", path):
                continue
            if not (md.parent / path).exists():
                broken.append(f"{md.relative_to(ROOT)}:{number}: {target}")
    return broken


def main() -> int:
    files = markdown_files()
    problems = [b for md in files for b in broken_links(md)]
    for problem in problems:
        print("✗", problem)
    print(f"{len(files)} Markdown files checked, {len(problems)} broken links.")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
