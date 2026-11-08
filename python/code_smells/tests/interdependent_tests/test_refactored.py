"""Clean tests: each test sets up its own state (fresh fixture)."""

import pytest

from .production import RoomBookings


# REFACTOR: Fresh Fixture. Each test gets a new instance and explicitly sets up what it
# needs. They can run alone, in any order and in parallel.
@pytest.fixture
def bookings() -> RoomBookings:
    return RoomBookings()


def test_book_room(bookings: RoomBookings) -> None:
    bookings.book("Blue Room", "10:00", "Anna")
    assert bookings.owner("Blue Room", "10:00") == "Anna"


def test_double_booking_is_rejected(bookings: RoomBookings) -> None:
    bookings.book("Blue Room", "10:00", "Anna")
    with pytest.raises(ValueError):
        bookings.book("Blue Room", "10:00", "Louis")


def test_cancel_booking(bookings: RoomBookings) -> None:
    bookings.book("Blue Room", "10:00", "Anna")
    bookings.cancel("Blue Room", "10:00")
    assert bookings.count() == 0
