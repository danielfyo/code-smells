"""Same result on the happy path; documents the stock loss caused by swallowing errors."""

import pytest

from code_smells.error_handling.swallowed_exceptions import refactored, smelly


def inventory() -> dict[str, dict[str, int]]:
    return {"MAD": {"CHAIR": 10}, "BCN": {}}


def test_same_happy_path() -> None:
    old, new = inventory(), inventory()
    smelly.transfer_stock(old, "CHAIR", "MAD", "BCN", 4)
    refactored.transfer_stock(new, "CHAIR", "MAD", "BCN", 4)
    assert old == new == {"MAD": {"CHAIR": 6}, "BCN": {"CHAIR": 4}}


def test_smelly_loses_units_silently() -> None:
    stock = inventory()
    smelly.transfer_stock(stock, "CHAIR", "MAD", "VLC", 4)  # raises nothing
    assert stock == {"MAD": {"CHAIR": 6}, "BCN": {}}  # 4 chairs vanished!


def test_refactored_fails_loudly_and_keeps_state() -> None:
    stock = inventory()
    with pytest.raises(refactored.UnknownWarehouse):
        refactored.transfer_stock(stock, "CHAIR", "MAD", "VLC", 4)
    with pytest.raises(refactored.InsufficientStock):
        refactored.transfer_stock(stock, "CHAIR", "MAD", "BCN", 99)
    assert stock == inventory()
