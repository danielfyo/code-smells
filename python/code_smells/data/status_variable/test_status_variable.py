"""Same results without flag variables."""

import pytest

from code_smells.data.status_variable import refactored, smelly

BINS = [
    {"code": "A1", "capacity": 10, "used": 9, "blocked": False},
    {"code": "A2", "capacity": 10, "used": 0, "blocked": True},
    {"code": "B1", "capacity": 20, "used": 5, "blocked": False},
    {"code": "B2", "capacity": 50, "used": 0, "blocked": False},
]


@pytest.mark.parametrize("volume", [1, 5, 15, 40, 100])
def test_same_bin(volume: float) -> None:
    assert smelly.find_free_bin(BINS, volume) == refactored.find_free_bin(BINS, volume)


def test_same_validation() -> None:
    broken = [*BINS, {"code": "C1", "capacity": 1, "used": 2, "blocked": False}]
    for bins in (BINS, broken, []):
        assert smelly.all_bins_ok(bins) == refactored.all_bins_ok(bins)
