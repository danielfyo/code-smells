from datetime import date

import pytest

from . import refactored, smelly

CHECK_IN = date(2026, 7, 15)


@pytest.mark.parametrize(
    ("cancelled_on", "expected"),
    [(date(2026, 7, 8), 0.0), (date(2026, 7, 13), 150.0), (date(2026, 7, 14), 300.0)],
)
def test_same_policy(cancelled_on: date, expected: float) -> None:
    assert smelly.cancellation_fee(300.0, CHECK_IN, cancelled_on) == expected
    assert refactored.cancellation_fee(300.0, CHECK_IN, cancelled_on) == expected
