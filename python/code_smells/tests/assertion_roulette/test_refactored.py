"""Clean tests: one comparison with a readable diff and well-named tests."""

from datetime import date

import pytest

from .production import Order, parse_order


# REFACTOR: Compare Whole Object + Split Test + Assertion Message. The whole object is
# compared (pytest shows the field-by-field diff), each case has its own name and, where a
# single detail must be checked, the assertion carries an explanatory message.
def test_parses_all_fields_of_an_express_order() -> None:
    order = parse_order("A-1; anna smith ;2026-02-01; 15,50 ;yes")
    assert order == Order("A-1", "Anna Smith", date(2026, 2, 1), 15.5, True)


@pytest.mark.parametrize(
    ("flag", "expected"), [("yes", True), ("y", True), ("1", True), ("no", False)]
)
def test_express_flag(flag: str, expected: bool) -> None:
    order = parse_order(f"B-2;louis;2026-02-03;7;{flag}")
    assert order.is_express is expected, f"flag {flag!r} should give {expected}"


def test_total_accepts_comma_decimal_separator() -> None:
    assert parse_order("C-3;eve;2026-02-04;1,25;no").total == 1.25, "comma as decimal separator"
