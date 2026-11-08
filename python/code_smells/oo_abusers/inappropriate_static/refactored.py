"""Refactored version: dependencies are injected and can be replaced."""

from collections.abc import Callable, Mapping
from dataclasses import dataclass, field
from datetime import date
from typing import Protocol


class RateProvider(Protocol):
    def to_eur(self, amount: float, currency: str) -> float: ...


# REFACTOR: Replace Static with Instance. Exchange rates are data of an instance
# and the converter can be swapped for any other one that satisfies the Protocol.
@dataclass(frozen=True)
class TableRateProvider:
    rates: Mapping[str, float] = field(
        default_factory=lambda: {"USD": 0.92, "GBP": 1.17, "EUR": 1.0}
    )

    def to_eur(self, amount: float, currency: str) -> float:
        return round(amount * self.rates[currency], 2)


@dataclass(frozen=True)
class InvoiceService:
    # REFACTOR: Inject Dependency. The clock and the converter arrive via the constructor,
    # with production defaults; tests pass deterministic doubles.
    rates: RateProvider = field(default_factory=TableRateProvider)
    today: Callable[[], date] = date.today

    def is_overdue(self, due: date) -> bool:
        return self.today() > due

    def amount_due_eur(self, amount: float, currency: str, due: date) -> float:
        base = self.rates.to_eur(amount, currency)
        return round(base * 1.05, 2) if self.is_overdue(due) else base
