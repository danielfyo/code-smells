"""Same discounts; a missing customer goes from silent None to an explicit error."""

import pytest

from code_smells.data.null_abuse import refactored, smelly


@pytest.mark.parametrize("cid", ["c1", "c2", "missing"])
def test_same_discount(cid: str) -> None:
    assert smelly.discount_for(smelly.CustomerRepository(), cid) == \
        refactored.discount_for(refactored.CustomerRepository(), cid)


@pytest.mark.parametrize("cid", ["c1", "c2"])
def test_same_plan_name(cid: str) -> None:
    assert smelly.plan_name(smelly.CustomerRepository(), cid) == \
        refactored.plan_name(refactored.CustomerRepository(), cid)


def test_missing_customer() -> None:
    assert f"Plan: {smelly.plan_name(smelly.CustomerRepository(), 'x')}" == "Plan: None"  # bug
    with pytest.raises(refactored.CustomerNotFound):
        refactored.plan_name(refactored.CustomerRepository(), "x")
