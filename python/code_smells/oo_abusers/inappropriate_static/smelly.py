"""Smelly version: static utilities that hide dependencies (clock and exchange rates)."""

from datetime import date


class CurrencyConverter:
    # SMELL: Inappropriate Static. Exchange rates are hidden class state and the
    # static method cannot be replaced by another implementation.
    _rates = {"USD": 0.92, "GBP": 1.17, "EUR": 1.0}

    @staticmethod
    def to_eur(amount: float, currency: str) -> float:
        return round(amount * CurrencyConverter._rates[currency], 2)


class InvoiceService:
    @staticmethod
    def is_overdue(due: date) -> bool:
        # SMELL: hidden dependency on the system clock: the result changes
        # depending on the day the test runs.
        return date.today() > due

    @staticmethod
    def amount_due_eur(amount: float, currency: str, due: date) -> float:
        # SMELL: chained static calls; to test with other exchange rates you have
        # to patch global class attributes (monkeypatch).
        base = CurrencyConverter.to_eur(amount, currency)
        if InvoiceService.is_overdue(due):
            return round(base * 1.05, 2)
        return base
