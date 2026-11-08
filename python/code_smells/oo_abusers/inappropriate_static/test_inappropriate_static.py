"""Same logic; the instance-based version is tested without patching globals."""

from datetime import date, timedelta

import pytest

from code_smells.oo_abusers.inappropriate_static import refactored, smelly


@pytest.mark.parametrize("offset", [-10, 10])
def test_same_result_with_real_clock(offset: int) -> None:
    due = date.today() + timedelta(days=offset)
    assert smelly.InvoiceService.amount_due_eur(
        100, "USD", due
    ) == refactored.InvoiceService().amount_due_eur(100, "USD", due)


def test_smelly_needs_monkeypatch(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(smelly.CurrencyConverter, "_rates", {"USD": 0.5})
    assert smelly.InvoiceService.amount_due_eur(100, "USD", date.max) == 50.0


def test_refactored_injects_doubles() -> None:
    service = refactored.InvoiceService(
        rates=refactored.TableRateProvider({"USD": 0.5}),
        today=lambda: date(2026, 1, 31),
    )
    assert service.amount_due_eur(100, "USD", date(2026, 1, 1)) == 52.5
    assert service.amount_due_eur(100, "USD", date(2026, 2, 1)) == 50.0
