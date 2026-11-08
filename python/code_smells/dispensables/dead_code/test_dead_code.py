"""Removing dead code does not change any observable result."""

import pytest

from code_smells.dispensables.dead_code import refactored, smelly


@pytest.mark.parametrize("minutes", [0, 1, 59, 60, 61, 300, 2000])
@pytest.mark.parametrize("resident", [False, True])
def test_same_fee(minutes: int, resident: bool) -> None:
    assert smelly.parking_fee(minutes, resident) == refactored.parking_fee(minutes, resident)
