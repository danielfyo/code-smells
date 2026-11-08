"""Smelly version: withdrawing money from a wallet returns magic codes."""


class Wallet:
    def __init__(self, balance: float) -> None:
        self.balance = balance
        self.frozen = False

    def withdraw(self, amount: float) -> float:
        # SMELL: Returning Error Codes. -1, -2 and -3 mean different errors and are
        # mixed with the domain of valid values (the remaining balance). If the
        # caller does not check the code, it will treat -1 as a real balance.
        if self.frozen:
            return -3
        if amount <= 0:
            return -2
        if amount > self.balance:
            return -1
        self.balance -= amount
        return self.balance


def pay_bill(wallet: Wallet, amount: float) -> str:
    result = wallet.withdraw(amount)
    # SMELL: every caller needs to know the code table.
    if result == -1:
        return "Insufficient balance"
    if result == -2:
        return "Invalid amount"
    if result == -3:
        return "Wallet frozen"
    return f"Paid. Remaining balance: {result:.2f}"
