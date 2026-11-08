import pytest

from . import refactored, smelly


@pytest.mark.parametrize(("plan", "months"), [("basic", 1), ("premium", 3), ("basic", 12)])
def test_same_invoice(plan: str, months: int) -> None:
    old, new = smelly.EmailSender(), refactored.EmailSender()
    old.send_invoice("Anna", smelly.Membership(plan, months))
    new.send_invoice("Anna", refactored.Membership(plan, months))
    assert old.sent == new.sent


def test_price_is_reusable_without_email() -> None:
    assert refactored.Membership("basic", 12).price() == pytest.approx(306.0)
