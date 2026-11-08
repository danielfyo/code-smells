"""Same messages; magic codes can be confused with real balances."""

import pytest

from code_smells.error_handling.error_codes import refactored, smelly


@pytest.mark.parametrize(("amount", "frozen"), [(30, False), (500, False), (-5, False), (10, True)])
def test_same_messages(amount: float, frozen: bool) -> None:
    old, new = smelly.Wallet(100), refactored.Wallet(100)
    old.frozen = new.frozen = frozen
    assert smelly.pay_bill(old, amount) == refactored.pay_bill(new, amount)


def test_smelly_error_code_looks_like_balance() -> None:
    remaining = smelly.Wallet(100).withdraw(500)
    assert remaining == -1  # a careless caller would show "balance: -1"
    with pytest.raises(refactored.InsufficientFunds):
        refactored.Wallet(100).withdraw(500)
