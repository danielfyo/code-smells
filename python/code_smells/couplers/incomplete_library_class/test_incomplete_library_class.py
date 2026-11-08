"""The local extension reproduces both scattered calculations."""

from datetime import date

import pytest

from code_smells.couplers.incomplete_library_class import refactored, smelly


@pytest.mark.parametrize("issued", [date(2026, 1, 2), date(2026, 6, 6), date(2026, 11, 30)])
def test_same_due_date(issued: date) -> None:
    assert smelly.invoice_due_date(issued) == refactored.invoice_due_date(issued)


@pytest.mark.parametrize("start,days", [(date(2026, 12, 23), 3), (date(2026, 3, 6), 1)])
def test_same_eta(start: date, days: int) -> None:
    assert smelly.shipment_eta(start, days) == refactored.shipment_eta(start, days)
    assert refactored.shipment_eta(date(2026, 12, 24), 1) == date(2026, 12, 28)
