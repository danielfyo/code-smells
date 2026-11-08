"""Smelly version: a gift card inherits from bank account and refuses part of it."""


class BankAccount:
    def __init__(self, owner: str, balance: float = 0) -> None:
        self.owner = owner
        self.balance = balance

    def deposit(self, amount: float) -> None:
        self.balance += amount

    def withdraw(self, amount: float) -> None:
        if amount > self.balance:
            raise ValueError("Insufficient balance")
        self.balance -= amount

    def monthly_interest(self) -> float:
        return round(self.balance * 0.001, 2)


class GiftCard(BankAccount):
    # SMELL: Refused Bequest. It inherited from BankAccount only to reuse
    # `balance` and `withdraw`, but a gift card does NOT allow top-ups nor earn
    # interest: the subclass "refuses" that inheritance by raising exceptions or
    # returning fake values. It violates Liskov: it cannot be used where a
    # BankAccount is expected.
    def deposit(self, amount: float) -> None:
        raise NotImplementedError("Gift cards cannot be topped up")

    def monthly_interest(self) -> float:
        return 0.0  # silent refusal


def apply_month_end(accounts: list[BankAccount]) -> None:
    # Client code that trusts the BankAccount contract.
    for acc in accounts:
        acc.deposit(acc.monthly_interest())
