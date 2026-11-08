from decimal import Decimal

from . import refactored, smelly


def test_smelly_loses_cents() -> None:
    shares = smelly.split_bill(100.0, 3)
    assert shares == [33.33, 33.33, 33.33]
    assert sum(shares) != 100.0  # one cent is missing!


def test_smelly_float_tip_is_inexact() -> None:
    assert smelly.add_tip(0.1, 2.0) != 0.3  # 0.30000000000000004


def test_refactored_split_is_exact() -> None:
    shares = refactored.split_bill(Decimal("100.00"), 3)
    assert shares == [Decimal("33.34"), Decimal("33.33"), Decimal("33.33")]
    assert sum(shares) == Decimal("100.00")


def test_refactored_tip_is_exact() -> None:
    assert refactored.add_tip(Decimal("0.10"), Decimal(2)) == Decimal("0.30")
    assert refactored.add_tip(Decimal("45.50"), Decimal("0.10")) == Decimal("50.05")


def test_even_split_matches_smelly() -> None:
    assert [float(s) for s in refactored.split_bill(Decimal(90), 3)] == smelly.split_bill(90, 3)
