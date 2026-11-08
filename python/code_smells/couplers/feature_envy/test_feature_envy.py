"""Same amounts with the logic moved to OrderLine."""

from code_smells.couplers.feature_envy import refactored, smelly

RAW = [(10.0, 3, 10, 0.5), (99.99, 1, 0, 2.0), (2.5, 12, 25, 0.1)]


def test_same_results() -> None:
    old_lines = [smelly.OrderLine(*r) for r in RAW]
    new_lines = [refactored.OrderLine(*r) for r in RAW]
    billing = smelly.BillingService()
    for old, new in zip(old_lines, new_lines):
        assert billing.line_total(old) == new.total
        assert billing.line_shipping_weight(old) == new.shipping_weight
    assert billing.invoice_total(old_lines) == refactored.BillingService().invoice_total(new_lines)
