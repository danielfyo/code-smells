"""Booking management for a holiday cottage."""

from dataclasses import dataclass

WEEKLY_DISCOUNT = 0.9


# REFACTOR: Replace Dict with Dataclass. Fields are declared and typed, the editor
# autocompletes them, a typo is an immediate error (AttributeError with `slots=True`) and the
# behavior (total, pay) lives next to the data.
@dataclass(slots=True)
class Booking:
    guest: str
    nights: int
    price_per_night: float
    paid: bool = False

    def total(self) -> float:
        total = self.nights * self.price_per_night
        if self.nights >= 7:
            total *= WEEKLY_DISCOUNT
        return round(total, 2)

    def mark_paid(self) -> None:
        self.paid = True
