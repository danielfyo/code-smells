import inspect

import pytest

from . import refactored, smelly


@pytest.mark.parametrize(("gross", "bonus"), [(2000, 0), (2500, 1500), (1200.5, 99.5)])
def test_same_net_salary(gross: float, bonus: float) -> None:
    assert smelly.net_salary(gross, bonus) == refactored.net_salary(gross, bonus)


def test_bonus_is_not_capped() -> None:
    # The commented-out cap in the smelly version is NOT active, though a reader might think so.
    assert refactored.net_salary(0, 2000) == round(2000 * (1 - 0.15 - 0.0635), 2)


def test_refactored_has_no_commented_code() -> None:
    source = inspect.getsource(refactored)
    assert "# def " not in source and "# print(" not in source
