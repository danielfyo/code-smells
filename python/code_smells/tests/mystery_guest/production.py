"""Code under test: finding below-minimum stock from an inventory CSV."""

import csv
from collections.abc import Iterable
from pathlib import Path


def low_stock_items(rows: Iterable[dict[str, str]]) -> list[str]:
    """SKUs whose stock is below the minimum, sorted alphabetically."""
    return sorted(row["sku"] for row in rows if int(row["stock"]) < int(row["minimum"]))


def low_stock_from_file(path: Path) -> list[str]:
    with path.open(newline="", encoding="utf-8") as handle:
        return low_stock_items(csv.DictReader(handle))
