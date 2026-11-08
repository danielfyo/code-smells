from datetime import date

from . import refactored, smelly

TODAY = date(2026, 3, 10)
LOANS = [
    {"due": date(2026, 3, 1), "r": None},  # 9 days overdue
    {"due": date(2026, 3, 8), "r": None},  # 2 days overdue
    {"due": date(2026, 3, 1), "r": date(2026, 3, 2)},  # returned
    {"due": date(2026, 3, 20), "r": None},  # still within the loan period
]


def test_same_result() -> None:
    assert smelly.proc(LOANS, TODAY) == refactored.overdue_summary(LOANS, TODAY) == (2, 2.75)


def test_empty() -> None:
    assert refactored.overdue_summary([], TODAY) == (0, 0)
