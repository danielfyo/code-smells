"""The refactored facade preserves the behaviour of the God Class."""

from datetime import date

import pytest

from code_smells.bloaters.large_class import refactored, smelly

D1, D3, D5 = date(2026, 5, 1), date(2026, 5, 3), date(2026, 5, 5)


def test_same_booking_flow() -> None:
    old = smelly.HotelManager()
    old.add_room("101", 80.0)
    new = refactored.HotelManager()
    new.rooms.add("101", 80.0)

    assert old.book("ana", "101", D1, D3) == new.book("ana", "101", D1, D3) == 176.0
    old.pay("ana", 100)
    new.pay("ana", 100)
    assert old.outstanding("ana") == new.ledger.outstanding("ana") == 76.0
    assert old.sent_emails == new.notifier.sent


def test_both_reject_overlaps_and_unknown_rooms() -> None:
    old = smelly.HotelManager()
    old.add_room("101", 80.0)
    new = refactored.HotelManager()
    new.rooms.add("101", 80.0)
    old.book("ana", "101", D1, D5)
    new.book("ana", "101", D1, D5)
    for hotel in (old, new):
        with pytest.raises(ValueError):
            hotel.book("luis", "101", D3, D5)
        with pytest.raises(KeyError):
            hotel.book("luis", "999", D3, D5)
