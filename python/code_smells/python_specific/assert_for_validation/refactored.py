"""Transfers between wallets in a payments app."""


class TransferError(ValueError):
    """Validation error for a transfer."""


# REFACTOR: Replace Assert with Explicit Validation. Input checks raise explicit exceptions
# that do not depend on interpreter options. `assert` is reserved for internal invariants
# ("this cannot happen if the code is correct").
def transfer(balances: dict[str, float], source: str, target: str, amount: float) -> None:
    if amount <= 0:
        raise TransferError("amount must be positive")
    if balances[source] < amount:
        raise TransferError("insufficient funds")
    balances[source] -= amount
    balances[target] = balances.get(target, 0.0) + amount
