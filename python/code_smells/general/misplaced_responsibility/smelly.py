"""Gym membership billing (smelly version)."""

from dataclasses import dataclass


@dataclass
class Membership:
    plan: str  # "basic" | "premium"
    months: int


class EmailSender:
    def __init__(self) -> None:
        self.sent: list[str] = []

    def send_invoice(self, member: str, membership: Membership) -> None:
        # SMELL: Misplaced Responsibility. The price calculation (a membership business rule)
        # lives inside the component that sends emails, because "that is where it was
        # needed". Nobody would look for it here, and anywhere else needing the price will
        # duplicate it.
        monthly = 30.0 if membership.plan == "basic" else 55.0
        total = monthly * membership.months
        if membership.months >= 12:
            total *= 0.85
        self.sent.append(f"{member}: {total:.2f} EUR")
