"""Smelly tests: Insufficient Tests."""

from .production import invoice_total


# SMELL: Insufficient Tests. A single happy-path test with the general rate. The other VAT
# rates, the empty invoice, the validation errors and the rounding are not tested. Branch
# coverage is low and nobody measures it; a bug in `reduced` would slip through.
def test_invoice_total() -> None:
    assert invoice_total([(100.0, 2, "general")]) == 242.0
