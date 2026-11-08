"""Same texts and dates without the artificial coupling."""

from datetime import datetime

from code_smells.couplers.artificial_coupling import refactored, smelly

NOW = datetime(2026, 4, 1, 10, 0)
DUE = datetime(2026, 4, 15, 9, 0)


def test_same_behaviour() -> None:
    assert smelly.PaymentReminder().message(DUE, NOW) == refactored.PaymentReminder().message(DUE, NOW)
    assert smelly.PaymentReminder().next_reminder(NOW) == refactored.PaymentReminder().next_reminder(NOW)
    assert smelly.PdfInvoiceRenderer().header("F-1", NOW) == refactored.PdfInvoiceRenderer().header("F-1", NOW)


def test_reminder_no_longer_depends_on_renderer() -> None:
    assert "PdfInvoiceRenderer" not in refactored.PaymentReminder.message.__code__.co_names
    assert "PdfInvoiceRenderer" in smelly.PaymentReminder.message.__code__.co_names
