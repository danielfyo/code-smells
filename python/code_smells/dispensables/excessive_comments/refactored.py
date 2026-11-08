"""Refactored version: the code explains itself and the comments become unnecessary."""

from dataclasses import dataclass
from datetime import date
from enum import Enum

MAX_FINE = 10.0


class MemberType(Enum):
    STANDARD = 1
    PREMIUM = 2


DAILY_FINE = {MemberType.STANDARD: 0.5, MemberType.PREMIUM: 0.25}


@dataclass(frozen=True)
class Loan:
    due: date
    member_type: MemberType
    book_price: float

    # REFACTOR: Rename Variable / Extract Variable / Extract Function. Each comment
    # became a name: days_overdue, daily_rate, late_fee...
    def days_overdue(self, returned_on: date) -> int:
        return max((returned_on - self.due).days, 0)

    def late_fee(self, returned_on: date) -> float:
        daily_rate = DAILY_FINE[self.member_type]
        return min(self.days_overdue(returned_on) * daily_rate, MAX_FINE, self.book_price)
