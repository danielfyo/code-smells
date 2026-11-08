"""Same results without using exceptions as ifs."""

import pytest

from code_smells.error_handling.exceptions_for_control_flow import refactored, smelly

COUPONS = {"SAVE5": 5.0, "HALF": 25.0}


@pytest.mark.parametrize("codes", [[], ["SAVE5"], ["NOPE", "HALF"], ["HALF", "HALF", "HALF"]])
def test_same_total(codes: list[str]) -> None:
    assert smelly.apply_coupons(50, codes, COUPONS) == refactored.apply_coupons(50, codes, COUPONS)


@pytest.mark.parametrize(
    "slots", [[], [("09:00", False)], [("09:00", False), ("10:00", True), ("11:00", True)]]
)
def test_same_slot(slots: list[tuple[str, bool]]) -> None:
    assert smelly.first_available_slot(slots) == refactored.first_available_slot(slots)
