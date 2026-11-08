import pytest

from . import refactored, smelly

RUNNERS = ["Anna", "Louis", "Eve", "Ian"]
TIMES = [42.3, 39.8, 45.0, 40.1]


def test_same_podium() -> None:
    expected = ["1. Louis (39.8 min)", "2. Ian (40.1 min)", "3. Anna (42.3 min)"]
    assert smelly.podium(RUNNERS, TIMES) == refactored.podium(RUNNERS, TIMES) == expected


def test_fewer_than_three_runners() -> None:
    assert smelly.podium(["Anna"], [50.0]) == refactored.podium(["Anna"], [50.0])


def test_refactored_detects_mismatched_lists() -> None:
    with pytest.raises(ValueError):
        refactored.podium(["Anna", "Louis"], [40.0])
