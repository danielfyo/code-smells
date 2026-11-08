"""The simple exporter produces the same CSV as all the speculative machinery."""

from code_smells.dispensables.speculative_generality import refactored, smelly

INVOICES = [{"number": "F-1", "total": 100}, {"number": "F-2", "total": 12.345}]


def test_same_csv() -> None:
    assert smelly.export_invoices(INVOICES) == refactored.export_invoices(INVOICES)
    assert refactored.export_invoices([]) == smelly.export_invoices([]) == "number;total"
