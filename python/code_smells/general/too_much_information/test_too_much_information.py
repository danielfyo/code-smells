import pytest

from . import refactored, smelly


@pytest.mark.parametrize("module", [smelly, refactored])
def test_same_operations(module) -> None:
    account = module.BankAccount("ES00 0000")
    account.deposit(100)
    account.withdraw(30)
    assert account.balance == 70
    assert list(account.movements) == [100, -30]
    with pytest.raises(ValueError):
        account.withdraw(1000)


def test_smelly_state_can_be_corrupted() -> None:
    account = smelly.BankAccount("ES00 0000")
    account.deposit(100)
    account.balance = 1_000_000  # nothing prevents it
    assert account.balance != sum(account.movements)


def test_refactored_state_is_protected() -> None:
    account = refactored.BankAccount("ES00 0000")
    with pytest.raises(AttributeError):
        account.balance = 1_000_000  # type: ignore[misc]
    with pytest.raises(AttributeError):
        account.movements.append(5)  # type: ignore[attr-defined]
