"""Same result in the correct order; documents the failures when steps are skipped."""

import pytest

from code_smells.couplers.hidden_temporal_coupling import refactored, smelly

ROWS = [("ana", 2000.0), ("luis", 1500.0)]


def test_same_payslips_when_called_in_order() -> None:
    run = smelly.PayrollRun()
    run.load_employees(ROWS)
    run.set_tax_rate(0.15)
    assert run.generate() == refactored.run_payroll(ROWS, 0.15)


def test_smelly_wrong_order_fails_silently_or_late() -> None:
    forgot_load = smelly.PayrollRun()
    forgot_load.set_tax_rate(0.15)
    assert forgot_load.generate() == []  # silent: no payslips at all
    forgot_rate = smelly.PayrollRun()
    forgot_rate.load_employees(ROWS)
    with pytest.raises(TypeError):
        forgot_rate.generate()


def test_refactored_cannot_be_half_configured() -> None:
    with pytest.raises(TypeError):
        refactored.PayrollRun((refactored.Employee("ana", 1),))  # type: ignore[call-arg]
