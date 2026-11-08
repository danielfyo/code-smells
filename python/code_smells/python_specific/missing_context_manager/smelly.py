"""Exporting electricity meter readings to a file (smelly version)."""

import sqlite3
from pathlib import Path


def export_readings(path: Path, readings: list[tuple[str, float]]) -> None:
    # SMELL: Missing Context Manager. If a reading is invalid and an exception is raised in
    # the middle of the loop, `close()` never runs: the file descriptor stays open (resource
    # leak) and what was written may stay in the buffer without being flushed to disk.
    handle = open(path, "w", encoding="utf-8")
    for meter_id, kwh in readings:
        if kwh < 0:
            raise ValueError(f"negative reading for {meter_id}")
        handle.write(f"{meter_id};{kwh}\n")
    handle.close()


def count_readings(db_path: Path) -> int:
    # SMELL: same thing with a database connection.
    conn = sqlite3.connect(db_path)
    count = conn.execute("SELECT COUNT(*) FROM readings").fetchone()[0]
    conn.close()
    return count
