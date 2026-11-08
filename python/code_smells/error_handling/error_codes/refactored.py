"""Refactored version: errors as exceptions with a type and a message."""

from dataclasses import dataclass


# REFACTOR: Replace Error Code with Exception. Each error has its own type; they
# cannot be confused with a balance nor ignored by accident.
class WalletError(Exception):
    message = "Wallet error"

    def __str__(self) -> str:
        return self.message


class InsufficientFunds(WalletError):
    message = "Insufficient balance"


class InvalidAmount(WalletError):
    message = "Invalid amount"


class WalletFrozen(WalletError):
    message = "Wallet frozen"


@dataclass
class Wallet:
    balance: float
    frozen: bool = False

    def withdraw(self, amount: float) -> float:
        if self.frozen:
            raise WalletFrozen()
        if amount <= 0:
            raise InvalidAmount()
        if amount > self.balance:
            raise InsufficientFunds()
        self.balance -= amount
        return self.balance


def pay_bill(wallet: Wallet, amount: float) -> str:
    try:
        remaining = wallet.withdraw(amount)
    except WalletError as exc:
        return str(exc)
    return f"Paid. Remaining balance: {remaining:.2f}"
