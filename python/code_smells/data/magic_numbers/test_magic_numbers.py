"""Same fees with named constants."""

import pytest

from code_smells.data.magic_numbers import refactored, smelly


@pytest.mark.parametrize("plan", ["B", "P"])
@pytest.mark.parametrize("age", [18, 26, 40, 65])
@pytest.mark.parametrize("months", [1, 12])
def test_same_fee(plan: str, age: int, months: int) -> None:
    assert smelly.membership_fee(plan, age, months) == refactored.membership_fee(plan, age, months)


def test_unknown_plan() -> None:
    for module in (smelly, refactored):
        with pytest.raises(ValueError):
            module.membership_fee("X", 30, 1)
