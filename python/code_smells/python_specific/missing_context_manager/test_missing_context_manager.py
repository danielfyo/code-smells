import builtins
import sqlite3
from pathlib import Path
from unittest import mock

import pytest

from . import refactored, smelly

READINGS = [("M-1", 120.5), ("M-2", 98.0)]


@pytest.mark.parametrize("module", [smelly, refactored])
def test_same_file_content(module, tmp_path: Path) -> None:
    target = tmp_path / "out.csv"
    module.export_readings(target, READINGS)
    assert target.read_text(encoding="utf-8") == "M-1;120.5\nM-2;98.0\n"


def _track_open_files(monkeypatch: pytest.MonkeyPatch) -> list:
    opened: list = []
    real_open = builtins.open

    def tracking_open(*args, **kwargs):
        handle = real_open(*args, **kwargs)
        opened.append(handle)
        return handle

    monkeypatch.setattr(builtins, "open", tracking_open)
    monkeypatch.setattr(Path, "open", lambda self, *a, **k: tracking_open(self, *a, **k))
    return opened


def test_smelly_leaks_file_on_error(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    opened = _track_open_files(monkeypatch)
    with pytest.raises(ValueError):
        smelly.export_readings(tmp_path / "out.csv", [("M-1", 1.0), ("M-2", -3.0)])
    assert not opened[0].closed  # leak!
    opened[0].close()


def test_refactored_closes_file_on_error(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    opened = _track_open_files(monkeypatch)
    with pytest.raises(ValueError):
        refactored.export_readings(tmp_path / "out.csv", [("M-1", 1.0), ("M-2", -3.0)])
    assert opened[0].closed


def test_count_readings_closes_connection(tmp_path: Path) -> None:
    db = tmp_path / "meters.db"
    with sqlite3.connect(db) as conn:
        conn.execute("CREATE TABLE readings (meter TEXT)")
        conn.executemany("INSERT INTO readings VALUES (?)", [("a",), ("b",)])
    conn.close()
    assert smelly.count_readings(db) == refactored.count_readings(db) == 2
    fake = mock.MagicMock()
    fake.execute.return_value.fetchone.return_value = (0,)
    with mock.patch.object(sqlite3, "connect", return_value=fake):
        refactored.count_readings(db)
    fake.close.assert_called_once()
