"""Refactored version: each constant lives next to what it really represents."""

from datetime import datetime, timedelta

# REFACTOR: Move Field. General-purpose constants move out of the concrete class to
# a neutral level (here, the module; in a real project, e.g. a `dates.py` module).
# That way, the classes that use them no longer depend on each other.
DATE_FORMAT = "%d/%m/%Y"
ONE_DAY = timedelta(days=1)


class PdfInvoiceRenderer:
    # REFACTOR: only what is PDF-specific stays here.
    PAGE_WIDTH_MM = 210

    def header(self, number: str, issued: datetime) -> str:
        return f"Invoice {number} - {issued.strftime(DATE_FORMAT)}"


class PaymentReminder:
    # REFACTOR: it no longer knows PdfInvoiceRenderer; it also uses timedelta instead
    # of manual arithmetic with seconds (Replace Magic Literal).
    def message(self, due: datetime, now: datetime) -> str:
        days = (due - now) // ONE_DAY
        return f"Due on {due.strftime(DATE_FORMAT)} (in {days} days)"

    def next_reminder(self, now: datetime) -> datetime:
        return now + 3 * ONE_DAY
