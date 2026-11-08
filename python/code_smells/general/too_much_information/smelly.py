"""Bank account (smelly version)."""


# SMELL: Too Much Information. The class exposes all of its internals: the mutable list of
# movements, the balance as a writable attribute and helper methods that only make sense
# internally. Any client can leave the account in an inconsistent state (a balance that does
# not match the movements) and becomes coupled to the representation.
class BankAccount:
    def __init__(self, iban: str) -> None:
        self.iban = iban
        self.balance = 0.0
        self.movements: list[float] = []
        self.overdraft_checked = False

    def check_overdraft(self, amount: float) -> bool:
        self.overdraft_checked = True
        return self.balance - amount >= 0

    def apply_movement(self, amount: float) -> None:
        self.movements.append(amount)
        self.balance += amount

    def deposit(self, amount: float) -> None:
        self.apply_movement(amount)

    def withdraw(self, amount: float) -> None:
        if not self.check_overdraft(amount):
            raise ValueError("insufficient funds")
        self.apply_movement(-amount)
