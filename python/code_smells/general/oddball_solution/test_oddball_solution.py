from . import refactored, smelly


def test_smelly_documents_disagree() -> None:
    lines = {
        smelly.invoice_line("Total", 1234.5).split(": ")[1],
        smelly.delivery_note_line("Total", 1234.5).split(": ")[1],
        smelly.reminder_line("Total", 1234.5).split(": ")[1],
    }
    assert lines == {"1.234,50 €", "1234,50 €", "EUR 1234,5"}


def test_refactored_documents_agree_with_invoice_format() -> None:
    expected = smelly.invoice_line("Total", 1234.5)
    assert refactored.invoice_line("Total", 1234.5) == expected
    assert refactored.delivery_note_line("Total", 1234.5) == expected
    assert refactored.reminder_line("Total", 1234.5) == expected
    assert refactored.format_eur(1_000_000) == "1.000.000,00 €"
