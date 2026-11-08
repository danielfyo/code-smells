"""The behaviour moves into the class without changing results."""

from datetime import date

import pytest

from code_smells.dispensables.data_class import refactored, smelly

START, END = date(2026, 1, 1), date(2026, 1, 31)


def test_same_behaviour() -> None:
    service = smelly.SubscriptionService()
    old = smelly.Subscription("pro", START, END, 9.99)
    new = refactored.Subscription("pro", START, END, 9.99)

    on = date(2026, 2, 15)
    assert service.is_active(old, on) == new.is_active(on) is False
    service.renew(old, 1)
    new.renew(1)
    assert service.is_active(old, on) == new.is_active(on) is True
    assert old.get_end() == new.end
    for months in (3, 12):
        assert service.renewal_price(old, months) == new.renewal_price(months)


def test_only_refactored_guards_invariants() -> None:
    smelly.Subscription("pro", END, START, -1)  # an impossible state is accepted
    with pytest.raises(ValueError):
        refactored.Subscription("pro", END, START, -1)
