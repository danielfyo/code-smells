"""Exporting electricity meter readings to a file."""

import sqlite3
from contextlib import closing
from pathlib import Path


# REFACTOR: Use Context Manager (`with`). The resource is always closed when leaving the
# block, exception or not. For objects whose `with` does not close them (the sqlite3
# connection manages transactions, not closing) `contextlib.closing` is used.
def export_readings(path: Path, readings: list[tuple[str, float]]) -> None:
    with path.open("w", encoding="utf-8") as handle:
        for meter_id, kwh in readings:
            if kwh < 0:
                raise ValueError(f"negative reading for {meter_id}")
            handle.write(f"{meter_id};{kwh}\n")


def count_readings(db_path: Path) -> int:
    with closing(sqlite3.connect(db_path)) as conn:
        return conn.execute("SELECT COUNT(*) FROM readings").fetchone()[0]
