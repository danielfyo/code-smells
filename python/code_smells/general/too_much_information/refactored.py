"""Bank account."""


# REFACTOR: Encapsulate Field + Hide Method. The public interface is minimal: `deposit`,
# `withdraw`, `balance` (read-only, derived from the movements) and an immutable copy of the
# history. Internal details carry a `_` prefix.
class BankAccount:
    def __init__(self, iban: str) -> None:
        self.iban = iban
        self._movements: list[float] = []

    @property
    def balance(self) -> float:
        return sum(self._movements)

    @property
    def movements(self) -> tuple[float, ...]:
        return tuple(self._movements)

    def deposit(self, amount: float) -> None:
        self._movements.append(amount)

    def withdraw(self, amount: float) -> None:
        if not self._can_withdraw(amount):
            raise ValueError("insufficient funds")
        self._movements.append(-amount)

    def _can_withdraw(self, amount: float) -> bool:
        return self.balance - amount >= 0
