import math

from . import refactored, smelly


def test_same_budget() -> None:
    assert smelly.garden_budget(5) == refactored.garden_budget(5)


def test_smelly_pi_was_silently_shadowed() -> None:
    assert smelly.pi == 3.14  # math's `pi` was overwritten
    assert smelly.circle_area_quick(10) == 314.0


def test_refactored_uses_precise_pi() -> None:
    assert refactored.circle_area_quick(10) == round(math.pi * 100, 4)


def test_smelly_namespace_is_polluted() -> None:
    assert hasattr(smelly, "sqrt") and hasattr(smelly, "factorial")
    assert not hasattr(refactored, "sqrt")
