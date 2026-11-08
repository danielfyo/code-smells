"""Refactored version: each responsibility lives in its own small class."""

from dataclasses import dataclass, field
from datetime import date


@dataclass(frozen=True)
class Booking:
    room: str
    guest: str
    check_in: date
    check_out: date

    @property
    def nights(self) -> int:
        return (self.check_out - self.check_in).days

    def overlaps(self, room: str, check_in: date, check_out: date) -> bool:
        return self.room == room and check_in < self.check_out and self.check_in < check_out


# REFACTOR: Extract Class. Each cohesive group of fields becomes a class.
@dataclass
class RoomCatalog:
    rates: dict[str, float] = field(default_factory=dict)

    def add(self, number: str, nightly_rate: float) -> None:
        self.rates[number] = nightly_rate

    def rate_of(self, number: str) -> float:
        return self.rates[number]  # KeyError if it does not exist, as before


@dataclass
class BookingCalendar:
    bookings: list[Booking] = field(default_factory=list)

    def is_available(self, room: str, check_in: date, check_out: date) -> bool:
        return not any(b.overlaps(room, check_in, check_out) for b in self.bookings)

    def add(self, booking: Booking) -> None:
        if not self.is_available(booking.room, booking.check_in, booking.check_out):
            raise ValueError("Room already booked")
        self.bookings.append(booking)


@dataclass
class Ledger:
    tax_rate: float = 0.10
    balances: dict[str, float] = field(default_factory=dict)

    def charge(self, guest: str, net: float) -> float:
        amount = round(net * (1 + self.tax_rate), 2)
        self.balances[guest] = self.balances.get(guest, 0) + amount
        return amount

    def pay(self, guest: str, amount: float) -> None:
        self.balances[guest] = round(self.balances.get(guest, 0) - amount, 2)

    def outstanding(self, guest: str) -> float:
        return self.balances.get(guest, 0)


@dataclass
class Notifier:
    sent: list[str] = field(default_factory=list)

    def send(self, message: str) -> None:
        self.sent.append(message)


@dataclass
class HotelManager:
    # REFACTOR: the former God Class remains as a thin facade coordinating collaborators.
    rooms: RoomCatalog = field(default_factory=RoomCatalog)
    calendar: BookingCalendar = field(default_factory=BookingCalendar)
    ledger: Ledger = field(default_factory=Ledger)
    notifier: Notifier = field(default_factory=Notifier)

    def book(self, guest: str, number: str, check_in: date, check_out: date) -> float:
        rate = self.rooms.rate_of(number)
        booking = Booking(number, guest, check_in, check_out)
        self.calendar.add(booking)
        amount = self.ledger.charge(guest, booking.nights * rate)
        self.notifier.send(f"{guest}: booking {number} confirmed ({amount:.2f} EUR)")
        return amount

    def pay(self, guest: str, amount: float) -> None:
        self.ledger.pay(guest, amount)
        self.notifier.send(f"{guest}: payment received ({amount:.2f} EUR)")
