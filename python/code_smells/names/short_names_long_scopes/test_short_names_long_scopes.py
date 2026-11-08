from . import refactored, smelly

ROWS = [("anna", "North", 100.0), ("louis", "South", 300.0), ("eve", "North", 100.0)]


def test_same_report() -> None:
    expected = ["North: 200.00 (40.0%)", "South: 300.00 (60.0%)", "TOTAL: 500.00", "BEST: South"]
    assert smelly.sales_report(ROWS) == refactored.sales_report(ROWS) == expected


def test_empty_report() -> None:
    assert smelly.sales_report([]) == refactored.sales_report([]) == ["TOTAL: 0.00", "BEST: "]
