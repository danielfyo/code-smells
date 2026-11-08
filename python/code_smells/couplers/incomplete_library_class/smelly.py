"""Smelly version: `datetime.date` knows nothing about business days and the logic spreads."""

from datetime import date, timedelta


def invoice_due_date(issued: date) -> date:
    # SMELL: Incomplete Library Class. The standard library does not offer "add N
    # business days", so each module improvises it with its own loop...
    current, added = issued, 0
    while added < 30:
        current += timedelta(days=1)
        if current.weekday() < 5:
            added += 1
    return current


def shipment_eta(dispatched: date, business_days: int) -> date:
    # SMELL: ...with a slightly different implementation (no holidays in one and
    # holidays in the other). The library extension is scattered.
    current = dispatched
    remaining = business_days
    while remaining > 0:
        current = current + timedelta(days=1)
        if current.weekday() not in (5, 6) and current not in {date(2026, 12, 25)}:
            remaining -= 1
    return current
