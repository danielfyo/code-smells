import pytest

from . import refactored, smelly


@pytest.mark.parametrize("postal_code", ["28001", "28045"])
def test_same_cost_for_zones_with_rate(postal_code: str) -> None:
    assert smelly.parking_cost(postal_code, 2) == refactored.parking_cost(postal_code, 2)


def test_smelly_returns_implicit_none() -> None:
    assert smelly.hourly_rate("28290") is None
    assert smelly.hourly_rate("99999") is None  # indistinguishable from the previous case
    with pytest.raises(TypeError):
        smelly.parking_cost("28290", 2)  # the error surfaces far from its cause


def test_refactored_returns_are_explicit() -> None:
    assert refactored.parking_cost("28290", 2) == 0.0
    with pytest.raises(refactored.UnknownPostalCode):
        refactored.parking_cost("99999", 2)
