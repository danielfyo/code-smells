"""Refactored version: the exchange goes through explicit, narrow interfaces."""

from dataclasses import dataclass, field
from typing import Protocol

REDEEM_COST = 100
REDEEM_DISCOUNT = 0.10


class LoyaltyLedger(Protocol):
    """The only thing the checkout needs to know about the loyalty programme."""

    def take_discount(self, customer: str) -> float: ...
    def earn(self, customer: str, amount_paid: float) -> None: ...


# REFACTOR: Move Function + Encapsulate Variable. All loyalty state (points AND
# redeemed discounts) lives in a single module with public methods.
@dataclass
class LoyaltyProgram:
    _points: dict[str, int] = field(default_factory=dict)
    _redeemed: dict[str, float] = field(default_factory=dict)

    def points(self, customer: str) -> int:
        return self._points.get(customer, 0)

    def redeem(self, customer: str) -> bool:
        if self.points(customer) < REDEEM_COST:
            return False
        self._points[customer] -= REDEEM_COST
        self._redeemed[customer] = REDEEM_DISCOUNT
        return True

    def take_discount(self, customer: str) -> float:
        return self._redeemed.pop(customer, 0.0)

    def earn(self, customer: str, amount_paid: float) -> None:
        self._points[customer] = self.points(customer) + int(amount_paid)


class Checkout:
    # REFACTOR: Hide Delegate. Checkout depends on the Protocol, not on the internals.
    def pay(self, customer: str, amount: float, loyalty: LoyaltyLedger) -> float:
        total = round(amount * (1 - loyalty.take_discount(customer)), 2)
        loyalty.earn(customer, total)
        return total
