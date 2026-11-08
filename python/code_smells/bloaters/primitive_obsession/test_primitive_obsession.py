"""Domain types reproduce the rules and also remove float errors."""

from decimal import Decimal

import pytest

from code_smells.bloaters.primitive_obsession import refactored, smelly


def test_same_validation_rules() -> None:
    for module in (smelly, refactored):
        with pytest.raises(ValueError):
            module.register_payment("no-email", 10, "eur")
        with pytest.raises(ValueError):
            module.register_payment("a@b.com", -1, "eur")


def test_same_totals() -> None:
    raw = [("Ana@Shop.com", 10.10, "eur"), ("luis@shop.com", 20.20, "EUR")]
    old_amount, old_cur = smelly.total([smelly.register_payment(*r) for r in raw])
    new = refactored.total([refactored.register_payment(*r) for r in raw])
    assert (Decimal(str(old_amount)), old_cur) == (new.amount, new.currency)
    assert refactored.register_payment(*raw[0]).email.value == "ana@shop.com"


def test_both_reject_mixed_currencies() -> None:
    with pytest.raises(ValueError):
        smelly.total(
            [smelly.register_payment("a@b.c", 1, "EUR"), smelly.register_payment("a@b.c", 1, "USD")]
        )
    with pytest.raises(ValueError):
        refactored.total(
            [
                refactored.register_payment("a@b.c", 1, "EUR"),
                refactored.register_payment("a@b.c", 1, "USD"),
            ]
        )
