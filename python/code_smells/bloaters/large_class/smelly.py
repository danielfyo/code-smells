"""Smelly version: a hotel class that knows and does everything."""

from datetime import date


class HotelManager:
    # SMELL: Large Class / God Class. It manages rooms, bookings, billing and
    # notifications. Its fields form groups that never touch each other: a clear
    # sign that several classes are waiting to get out.
    def __init__(self) -> None:
        self.rooms: dict[str, float] = {}           # inventory
        self.bookings: list[tuple[str, str, date, date]] = []  # bookings
        self.invoices: dict[str, float] = {}         # billing
        self.sent_emails: list[str] = []             # notifications
        self.tax_rate = 0.10

    def add_room(self, number: str, nightly_rate: float) -> None:
        self.rooms[number] = nightly_rate

    def is_available(self, number: str, check_in: date, check_out: date) -> bool:
        for room, _, start, end in self.bookings:
            if room == number and check_in < end and start < check_out:
                return False
        return True

    def book(self, guest: str, number: str, check_in: date, check_out: date) -> float:
        # SMELL: a single method crosses three different responsibilities.
        if number not in self.rooms:
            raise KeyError(number)
        if not self.is_available(number, check_in, check_out):
            raise ValueError("Room already booked")
        self.bookings.append((number, guest, check_in, check_out))
        nights = (check_out - check_in).days
        amount = round(nights * self.rooms[number] * (1 + self.tax_rate), 2)
        self.invoices[guest] = self.invoices.get(guest, 0) + amount
        self.sent_emails.append(f"{guest}: booking {number} confirmed ({amount:.2f} EUR)")
        return amount

    def outstanding(self, guest: str) -> float:
        return self.invoices.get(guest, 0)

    def pay(self, guest: str, amount: float) -> None:
        self.invoices[guest] = round(self.invoices.get(guest, 0) - amount, 2)
        self.sent_emails.append(f"{guest}: payment received ({amount:.2f} EUR)")
