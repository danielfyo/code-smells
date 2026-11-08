"""Refactored version: a single local extension of the library."""

from collections.abc import Collection
from dataclasses import dataclass, field
from datetime import date, timedelta


# REFACTOR: Introduce Local Extension. We cannot modify `datetime.date`, so we
# create our own wrapper with the missing operation and every module uses it.
@dataclass(frozen=True)
class BusinessCalendar:
    holidays: Collection[date] = field(default_factory=frozenset)

    def is_business_day(self, day: date) -> bool:
        return day.weekday() < 5 and day not in self.holidays

    def add_business_days(self, start: date, days: int) -> date:
        current = start
        while days > 0:
            current += timedelta(days=1)
            if self.is_business_day(current):
                days -= 1
        return current


CALENDAR = BusinessCalendar(holidays=frozenset({date(2026, 12, 25)}))


def invoice_due_date(issued: date, calendar: BusinessCalendar = BusinessCalendar()) -> date:
    # REFACTOR: the original behaviour (no holidays) is kept by default.
    return calendar.add_business_days(issued, 30)


def shipment_eta(dispatched: date, business_days: int,
                 calendar: BusinessCalendar = CALENDAR) -> date:
    return calendar.add_business_days(dispatched, business_days)
