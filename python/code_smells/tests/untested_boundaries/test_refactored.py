"""Clean tests: boundary value analysis."""

import pytest

from .production import ticket_price


# REFACTOR: Boundary Value Analysis. Each boundary is tested from both sides (the last value
# of one band and the first of the next) as well as the invalid domain.
@pytest.mark.parametrize(
    ("age", "price"),
    [
        (0, 0.0),
        (5, 0.0),
        (6, 6.0),
        (17, 6.0),
        (18, 12.0),
        (64, 12.0),
        (65, 6.0),
        (120, 6.0),
    ],
)
def test_price_at_boundaries(age: int, price: float) -> None:
    assert ticket_price(age) == price


def test_negative_age_is_rejected() -> None:
    with pytest.raises(ValueError):
        ticket_price(-1)
