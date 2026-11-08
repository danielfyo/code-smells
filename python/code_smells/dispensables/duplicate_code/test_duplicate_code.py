"""Equivalence in the shared brackets and documentation of the diverging copies bug."""

import pytest

from code_smells.dispensables.duplicate_code import refactored, smelly


@pytest.mark.parametrize("gross", [1000, 1500, 2200, 4000])
def test_full_time_equivalent(gross: float) -> None:
    assert smelly.full_time_net_salary(gross) == refactored.full_time_net_salary(gross)


@pytest.mark.parametrize("rate,hours", [(10, 80), (20, 120)])
def test_part_time_equivalent_in_lower_brackets(rate: float, hours: float) -> None:
    assert smelly.part_time_net_salary(rate, hours) == refactored.part_time_net_salary(rate, hours)


def test_smelly_copies_diverged() -> None:
    # Same gross (4000), different net depending on which function computes it: bug.
    assert smelly.full_time_net_salary(4000) != smelly.part_time_net_salary(40, 100)
    assert refactored.full_time_net_salary(4000) == refactored.part_time_net_salary(40, 100)
