"""Same bookings expressed with readable enums."""

from itertools import product

import pytest

from code_smells.data.boolean_blindness import refactored as r
from code_smells.data.boolean_blindness import smelly


@pytest.mark.parametrize(
    ("window", "business", "refundable"), list(product([True, False], repeat=3))
)
def test_same_booking(window: bool, business: bool, refundable: bool) -> None:
    old = smelly.book_seat("Ana", "IB123", window, business, refundable)
    new = r.book_seat(
        "Ana",
        "IB123",
        r.Seat.WINDOW if window else r.Seat.AISLE,
        r.Cabin.BUSINESS if business else r.Cabin.ECONOMY,
        r.Fare.FLEXIBLE if refundable else r.Fare.BASIC,
    )
    assert old == new.as_dict()
    assert smelly.can_change_flight(old) == r.can_change_flight(new)
