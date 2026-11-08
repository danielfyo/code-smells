"""The separated pieces produce the same reports."""

from code_smells.change_preventers.divergent_change import refactored, smelly

CSV = """seller;amount
ana;6000
luis;2500
ana;5000
"""


def test_same_outputs() -> None:
    report = smelly.SalesReport(CSV)
    commissions = refactored.commissions_from_csv(CSV)
    assert report.commissions() == commissions == {"ana": 880.0, "luis": 125.0}
    assert report.as_json() == refactored.JsonFormatter().format(commissions)
    assert report.as_text() == refactored.TextFormatter().format(commissions)
