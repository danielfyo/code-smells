"""Clean tests: the test data lives inside the test."""

from pathlib import Path

from .production import low_stock_from_file, low_stock_items


# REFACTOR: Inline Resource / Fresh Fixture. The relevant data lives in the test itself, in
# plain sight. The logic is tested without I/O and, for file reading, a temporary file is
# created with `tmp_path` whose content is also visible here.
def test_items_below_minimum_are_reported_sorted() -> None:
    rows = [
        {"sku": "WASHER-6", "stock": "0", "minimum": "30"},
        {"sku": "BOLT-M6", "stock": "120", "minimum": "100"},
        {"sku": "NUT-M6", "stock": "15", "minimum": "50"},
    ]
    assert low_stock_items(rows) == ["NUT-M6", "WASHER-6"]


def test_stock_equal_to_minimum_is_not_low() -> None:
    assert low_stock_items([{"sku": "SCREW-4X40", "stock": "80", "minimum": "80"}]) == []


def test_reads_csv_file(tmp_path: Path) -> None:
    csv_file = tmp_path / "inventory.csv"
    csv_file.write_text("sku,stock,minimum\nNUT-M6,15,50\nBOLT-M6,120,100\n", encoding="utf-8")
    assert low_stock_from_file(csv_file) == ["NUT-M6"]
