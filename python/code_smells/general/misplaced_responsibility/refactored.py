"""Gym membership billing."""

from dataclasses import dataclass

MONTHLY_PRICES = {"basic": 30.0, "premium": 55.0}
ANNUAL_DISCOUNT = 0.85


# REFACTOR: Move Method. The price calculation moves to `Membership`, where the data it uses
# lives and where the reader would look for it. The email sender only formats and sends.
@dataclass
class Membership:
    plan: str
    months: int

    def price(self) -> float:
        total = MONTHLY_PRICES[self.plan] * self.months
        return total * ANNUAL_DISCOUNT if self.months >= 12 else total


class EmailSender:
    def __init__(self) -> None:
        self.sent: list[str] = []

    def send_invoice(self, member: str, membership: Membership) -> None:
        self.sent.append(f"{member}: {membership.price():.2f} EUR")
