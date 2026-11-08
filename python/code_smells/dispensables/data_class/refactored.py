"""Refactored version: the subscription encapsulates its data and its behaviour."""

from dataclasses import dataclass
from datetime import date, timedelta


@dataclass
class Subscription:
    plan: str
    start: date
    end: date
    monthly_price: float

    def __post_init__(self) -> None:
        # REFACTOR: Encapsulate Record. The object protects its invariants from birth.
        if self.end < self.start or self.monthly_price < 0:
            raise ValueError("Invalid subscription")

    # REFACTOR: Move Method. The behaviour that only used this data moves here;
    # Remove Setting Method: there is no public set_end anymore, only the business operation.
    def is_active(self, on: date) -> bool:
        return self.start <= on <= self.end

    def renew(self, months: int) -> None:
        self.end += timedelta(days=30 * months)

    def renewal_price(self, months: int) -> float:
        discount = 0.15 if months >= 12 else 0.0
        return round(self.monthly_price * months * (1 - discount), 2)
