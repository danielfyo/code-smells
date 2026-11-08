"""Documents the contamination of global state and the isolation of the new version."""

import pytest

from code_smells.couplers.global_data import refactored, smelly


@pytest.fixture
def reset_globals():
    yield
    smelly.CONFIG.update(prefix="INV", tax_rate=0.21)
    smelly.next_invoice_number = 1


def test_same_sequence(reset_globals) -> None:
    issuer = refactored.InvoiceIssuer()
    for net in (100, 50):
        assert smelly.issue_invoice(net) == issuer.issue(net)


def test_smelly_global_state_leaks(reset_globals) -> None:
    smelly.issue_invoice(10)
    smelly.switch_to_reduced_vat()
    # Another independent "client" sees the number and VAT modified by the first one.
    assert smelly.issue_invoice(100) == {"number": "INV-0002", "total": 110.0}


def test_refactored_instances_are_isolated() -> None:
    a, b = refactored.InvoiceIssuer(), refactored.InvoiceIssuer()
    a.issue(10)
    a.with_config(refactored.InvoiceConfig(tax_rate=0.10))
    assert b.issue(100) == {"number": "INV-0001", "total": 121.0}
