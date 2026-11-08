"""The automated build produces the same deliverable the manual recipe described."""

import hashlib
import json
import subprocess
import sys
import zipfile
from pathlib import Path

import pytest

from .refactored import build

PYTHON_ROOT = Path(__file__).resolve().parents[3]


def test_build_produces_zip_and_checksum(tmp_path: Path) -> None:
    archive = build.build(tmp_path)
    assert archive.name == "sample_app-1.4.2.zip"
    with zipfile.ZipFile(archive) as zf:
        assert sorted(zf.namelist()) == ["_version.py", "app.py", "messages.json"]
        assert zf.read("_version.py").decode() == '__version__ = "1.4.2"\n'
    checksum = (tmp_path / "sample_app-1.4.2.zip.sha256").read_text().split()[0]
    assert checksum == hashlib.sha256(archive.read_bytes()).hexdigest()


def test_build_rejects_incomplete_translations(tmp_path: Path) -> None:
    app = tmp_path / "app"
    app.mkdir()
    (app / "messages.json").write_text(json.dumps({"en": {}}), encoding="utf-8")
    with pytest.raises(ValueError, match="greeting"):
        build.build(tmp_path / "dist", app_dir=app)


def test_single_command_from_cli(tmp_path: Path) -> None:
    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "code_smells.environment.multi_step_build.refactored.build",
            "--out",
            str(tmp_path),
        ],
        cwd=PYTHON_ROOT,
        capture_output=True,
        text=True,
        check=True,
    )
    assert "sample_app-1.4.2.zip" in result.stdout
    assert (tmp_path / "sample_app-1.4.2.zip").exists()
