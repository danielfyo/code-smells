"""Each explicit function is equivalent to one branch of the flag."""

from code_smells.functions.flag_arguments import refactored, smelly

STOCK = {"PEN": 120, "INK": 15, "PAD": 40}


def test_same_reports() -> None:
    assert smelly.stock_report(STOCK, False) == refactored.summary_stock_report(STOCK)
    assert smelly.stock_report(STOCK, True) == refactored.detailed_stock_report(STOCK)
