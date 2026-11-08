"""Smelly version: the loyalty programme and the checkout pass data through the back door."""


class Checkout:
    def __init__(self) -> None:
        # Internal structure of Checkout...
        self._pending_discounts: dict[str, float] = {}

    def pay(self, customer: str, amount: float, loyalty: "LoyaltyProgram") -> float:
        # SMELL: Insider Trading. Checkout reads LoyaltyProgram's internal points
        # dictionary and also consumes discounts that someone secretly wrote into
        # its own private state.
        discount = self._pending_discounts.pop(customer, 0.0)
        total = round(amount * (1 - discount), 2)
        loyalty._points[customer] = loyalty._points.get(customer, 0) + int(total)
        return total


class LoyaltyProgram:
    def __init__(self) -> None:
        self._points: dict[str, int] = {}

    def redeem(self, customer: str, checkout: Checkout) -> bool:
        # SMELL: ...and LoyaltyProgram writes directly into Checkout's private
        # state. Neither exposes an interface for this exchange: the agreement
        # between both modules is implicit and fragile.
        if self._points.get(customer, 0) < 100:
            return False
        self._points[customer] -= 100
        checkout._pending_discounts[customer] = 0.10
        return True
