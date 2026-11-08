"""Refactored version: named enums instead of anonymous booleans."""

from dataclasses import dataclass
from enum import Enum
from typing import Any


# REFACTOR: Replace Boolean Parameter with Enum. Each decision has its own type, so
# the call reads by itself: book_seat("Ana", "IB123", Seat.WINDOW, Cabin.ECONOMY, Fare.FLEXIBLE).
class Seat(Enum):
    WINDOW = "window"
    AISLE = "aisle"


class Cabin(Enum):
    ECONOMY = ("economy", 1)
    BUSINESS = ("business", 3)

    def __init__(self, label: str, multiplier: int) -> None:
        self.label = label
        self.multiplier = multiplier


class Fare(Enum):
    BASIC = 0
    FLEXIBLE = 40


@dataclass(frozen=True)
class Booking:
    passenger: str
    flight: str
    seat: Seat
    cabin: Cabin
    fare: Fare

    @property
    def price(self) -> float:
        return 120.0 * self.cabin.multiplier + self.fare.value

    def as_dict(self) -> dict[str, Any]:
        return {
            "passenger": self.passenger,
            "flight": self.flight,
            "seat": self.seat.value,
            "cabin": self.cabin.label,
            "price": self.price,
        }


def book_seat(passenger: str, flight: str, seat: Seat, cabin: Cabin, fare: Fare) -> Booking:
    return Booking(passenger, flight, seat, cabin, fare)


def can_change_flight(booking: Booking) -> bool:
    # REFACTOR: the meaning is preserved in the type; no need to infer it from the price.
    return booking.cabin is Cabin.BUSINESS or booking.fare is Fare.FLEXIBLE
