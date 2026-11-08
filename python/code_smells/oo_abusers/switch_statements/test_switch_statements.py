"""Polymorphism produces the same results as the repeated switches."""

import pytest

from code_smells.oo_abusers.switch_statements import refactored, smelly

CASES = [("salaried", 36000, 0), ("hourly", 15, 120), ("contractor", 40, 100)]


@pytest.mark.parametrize("kind,base,hours", CASES)
def test_same_behaviour(kind: str, base: float, hours: float) -> None:
    old = smelly.Employee("Ana", kind, base, hours)
    new = refactored.employee_from(kind, "Ana", base, hours)
    assert smelly.monthly_pay(old) == pytest.approx(new.monthly_pay())
    assert smelly.vacation_days(old) == new.vacation_days()
    assert smelly.payslip_title(old) == new.payslip_title()


def test_unknown_kind_rejected() -> None:
    with pytest.raises(ValueError):
        smelly.monthly_pay(smelly.Employee("X", "intern", 1))
    with pytest.raises(ValueError):
        refactored.employee_from("intern", "X", 1)
