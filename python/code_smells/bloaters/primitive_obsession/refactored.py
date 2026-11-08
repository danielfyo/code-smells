"""Refactored version: small domain types that validate themselves."""

from dataclasses import dataclass
from decimal import ROUND_HALF_UP, Decimal


# REFACTOR: Replace Primitive with Object (Value Object). The email is validated and
# normalised once, on construction; afterwards it is always valid.
@dataclass(frozen=True)
class Email:
    value: str

    def __post_init__(self) -> None:
        if "@" not in self.value or self.value.startswith("@"):
            raise ValueError("Invalid email")
        object.__setattr__(self, "value", self.value.lower())


# REFACTOR: Value Object Money. Amount and currency travel together; Decimal avoids
# rounding errors and addition rejects mixed currencies in a single place.
@dataclass(frozen=True)
class Money:
    amount: Decimal
    currency: str

    @classmethod
    def of(cls, amount: float | str, currency: str) -> "Money":
        value = Decimal(str(amount)).quantize(Decimal("0.01"), ROUND_HALF_UP)
        if value < 0:
            raise ValueError("Negative amount")
        return cls(value, currency.upper())

    def __add__(self, other: "Money") -> "Money":
        if other.currency != self.currency:
            raise ValueError("Different currencies")
        return Money(self.amount + other.amount, self.currency)


@dataclass(frozen=True)
class Payment:
    email: Email
    money: Money


def register_payment(email: str, amount: float, currency: str) -> Payment:
    return Payment(Email(email), Money.of(amount, currency))


def total(payments: list[Payment]) -> Money:
    result = payments[0].money
    for p in payments[1:]:
        result = result + p.money
    return result
