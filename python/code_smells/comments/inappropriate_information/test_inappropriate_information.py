"""The smell lives purely in comments: both versions behave the same."""

import inspect

import pytest

from . import refactored, smelly


@pytest.mark.parametrize(("weight", "islands"), [(0, False), (2.5, False), (10, True)])
def test_same_behavior(weight: float, islands: bool) -> None:
    assert smelly.shipping_cost(weight, islands) == refactored.shipping_cost(weight, islands)


def test_known_value() -> None:
    assert refactored.shipping_cost(2, True) == 12.9


def test_refactored_has_no_change_log() -> None:
    source = inspect.getsource(refactored)
    assert "TICKET-" not in source
    assert "Modified:" not in source
