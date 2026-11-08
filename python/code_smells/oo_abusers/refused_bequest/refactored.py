"""Refactored version: the hierarchy only shares what both really are."""

from dataclasses import dataclass
from typing import Protocol


# REFACTOR: Extract Superclass / Push Down Method. The common part (spending a balance)
# moves up to a minimal base; deposits and interest move down to the only class supporting them.
@dataclass
class Spendable:
    owner: str
    balance: float = 0

    def withdraw(self, amount: float) -> None:
        if amount > self.balance:
            raise ValueError("Insufficient balance")
        self.balance -= amount


@dataclass
class BankAccount(Spendable):
    def deposit(self, amount: float) -> None:
        self.balance += amount

    def monthly_interest(self) -> float:
        return round(self.balance * 0.001, 2)


@dataclass
class GiftCard(Spendable):
    # REFACTOR: the gift card no longer inherits methods it would have to refuse.
    pass


class InterestBearing(Protocol):
    def deposit(self, amount: float) -> None: ...
    def monthly_interest(self) -> float: ...


def apply_month_end(accounts: list[InterestBearing]) -> None:
    # REFACTOR: the parameter type states what is needed; a GiftCard does not fit
    # and the type checker detects it before running.
    for acc in accounts:
        acc.deposit(acc.monthly_interest())
