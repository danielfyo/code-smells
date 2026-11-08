"""Build the distributable `sample_app` package with a single command.

Usage:  python3 -m code_smells.environment.multi_step_build.refactored.build [--out DIR]
        (or simply `make build` from this folder)
"""

# REFACTOR: Automate the Build (one-step build). The manual steps from BUILD.md become small,
# deterministic functions chained by `build()`. It works from any directory and on any
# operating system (stdlib only), fails fast with a clear message, and runs the same way for
# a person and for CI.

import argparse
import hashlib
import json
import zipfile
from pathlib import Path

APP_DIR = Path(__file__).resolve().parent.parent / "sample_app"
PACKAGED_FILES = ("app.py", "messages.json")


def read_version(app_dir: Path) -> str:
    return (app_dir / "VERSION").read_text(encoding="utf-8").strip()


def validate_messages(app_dir: Path) -> None:
    messages = json.loads((app_dir / "messages.json").read_text(encoding="utf-8"))
    missing = [lang for lang, texts in messages.items() if "greeting" not in texts]
    if missing:
        raise ValueError(f"Missing 'greeting' in: {', '.join(missing)}")


def write_zip(app_dir: Path, version: str, out_dir: Path) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    archive = out_dir / f"sample_app-{version}.zip"
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as zf:
        for name in PACKAGED_FILES:
            zf.write(app_dir / name, arcname=name)
        # The version file is generated in memory: it never dirties the working tree.
        zf.writestr("_version.py", f'__version__ = "{version}"\n')
    return archive


def write_checksum(archive: Path) -> Path:
    digest = hashlib.sha256(archive.read_bytes()).hexdigest()
    checksum_file = archive.with_name(archive.name + ".sha256")
    checksum_file.write_text(f"{digest}  {archive.name}\n", encoding="utf-8")
    return checksum_file


def build(out_dir: Path, app_dir: Path = APP_DIR) -> Path:
    validate_messages(app_dir)
    archive = write_zip(app_dir, read_version(app_dir), out_dir)
    write_checksum(archive)
    return archive


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=Path("dist"))
    args = parser.parse_args(argv)
    print(f"Package built: {build(args.out)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
