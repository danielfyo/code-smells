"""Transfers between wallets in a payments app (smelly version)."""


# SMELL: Assert for Validation. `assert` is used to validate input data. With `python -O`
# (common in some deployments) asserts are stripped from the bytecode: the validation
# disappears and negative amounts or overdrawn balances are allowed.
def transfer(balances: dict[str, float], source: str, target: str, amount: float) -> None:
    assert amount > 0, "amount must be positive"
    assert balances[source] >= amount, "insufficient funds"
    balances[source] -= amount
    balances[target] = balances.get(target, 0.0) + amount
