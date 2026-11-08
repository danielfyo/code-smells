"""Smelly tests: Mystery Guest."""

from pathlib import Path

from .production import low_stock_from_file


# SMELL: Mystery Guest. The test depends on an external file (`inventory.csv`) whose content
# is not visible when reading the test. Why those two SKUs? You have to open another file to
# understand the assertion, and if someone edits the CSV for another test, this one breaks.
def test_low_stock() -> None:
    result = low_stock_from_file(Path(__file__).parent / "inventory.csv")
    assert result == ["NUT-M6", "WASHER-6"]
