"""Smelly tests: Interdependent Tests."""

import pytest

from .production import RoomBookings

# SMELL: Interdependent Tests. All tests share a module-level instance and each one depends
# on what the previous one left behind. They only pass in this exact order: run one alone
# (`pytest -k cancel`), in parallel (xdist) or in random order, and they fail.
bookings = RoomBookings()


def test_book_room() -> None:
    bookings.book("Blue Room", "10:00", "Anna")
    assert bookings.count() == 1


def test_double_booking_is_rejected() -> None:
    # Depends on test_book_room having run first.
    with pytest.raises(ValueError):
        bookings.book("Blue Room", "10:00", "Louis")


def test_cancel_booking() -> None:
    # Depends on the two previous tests.
    bookings.cancel("Blue Room", "10:00")
    assert bookings.count() == 0
