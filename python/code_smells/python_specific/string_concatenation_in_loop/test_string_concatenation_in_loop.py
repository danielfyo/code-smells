import pytest

from . import refactored, smelly

ITEMS = {"screws": 250, "nuts": 180, "washers": 75}


def test_same_report() -> None:
    assert smelly.inventory_report(ITEMS) == refactored.inventory_report(ITEMS)
    assert refactored.inventory_report(ITEMS).endswith("Total: 505 units")


@pytest.mark.parametrize("values", [["a", "b", "c"], ["single"]])
def test_same_csv_row(values: list[str]) -> None:
    assert smelly.csv_row(values) == refactored.csv_row(values)


def test_empty_values() -> None:
    assert smelly.csv_row([]) == refactored.csv_row([]) == ""
    assert refactored.inventory_report({}) == "Total: 0 units"
