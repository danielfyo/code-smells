"""Documents the Liskov violation in the smelly version and the correct design."""

import pytest

from code_smells.oo_abusers.refused_bequest import refactored, smelly


def test_smelly_gift_card_breaks_substitution() -> None:
    accounts = [smelly.BankAccount("ana", 1000), smelly.GiftCard("luis", 50)]
    with pytest.raises(NotImplementedError):
        smelly.apply_month_end(accounts)  # the subclass breaks the client
    assert isinstance(accounts[1], smelly.BankAccount)  # ...even though it "is" an account


def test_refactored_shares_only_spending() -> None:
    account, card = refactored.BankAccount("ana", 1000), refactored.GiftCard("luis", 50)
    refactored.apply_month_end([account])
    assert account.balance == 1001.0
    card.withdraw(20)
    assert card.balance == 30
    assert not hasattr(card, "deposit")
    with pytest.raises(ValueError):
        card.withdraw(100)


def test_withdraw_behaviour_is_identical() -> None:
    old, new = smelly.GiftCard("x", 50), refactored.GiftCard("x", 50)
    old.withdraw(20)
    new.withdraw(20)
    assert old.balance == new.balance
