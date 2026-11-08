"""Refactored version: the base defines the algorithm and subclasses supply the details."""

from dataclasses import dataclass
from typing import ClassVar


@dataclass
class Document:
    number: str
    amount: float
    # REFACTOR: the base only declares what it needs; it does not know which subclasses exist.
    prefix: ClassVar[str] = "DOC"
    sign: ClassVar[int] = 1

    # REFACTOR: Form Template Method. The common algorithm stays in the base and the
    # variations come from attributes/methods that the derived classes override.
    def describe(self) -> str:
        return f"{self.prefix}-{self.number}: {self.signed_amount():.2f}"

    def signed_amount(self) -> float:
        return self.sign * self.amount


# REFACTOR: Replace Conditional with Polymorphism (Push Down Field). Each subclass
# declares its own prefix and sign.
class Invoice(Document):
    prefix = "FAC"


class CreditNote(Document):
    prefix = "ABO"
    sign = -1
