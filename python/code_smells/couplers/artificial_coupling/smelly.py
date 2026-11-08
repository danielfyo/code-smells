"""Smelly version: generic constants declared inside a concrete class."""

from datetime import datetime, timedelta


class PdfInvoiceRenderer:
    # SMELL: Artificial Coupling. SECONDS_PER_DAY and DATE_FORMAT have nothing to do
    # with rendering PDFs, but they live here because it was the first place needing them.
    SECONDS_PER_DAY = 86_400
    DATE_FORMAT = "%d/%m/%Y"
    PAGE_WIDTH_MM = 210

    def header(self, number: str, issued: datetime) -> str:
        return f"Invoice {number} - {issued.strftime(self.DATE_FORMAT)}"


class PaymentReminder:
    # SMELL: to compute a reminder you have to import (and depend on) the PDF
    # renderer. If that class is removed or moved, this breaks even though there is
    # no real conceptual relationship between the two.
    def message(self, due: datetime, now: datetime) -> str:
        seconds = (due - now).total_seconds()
        days = int(seconds // PdfInvoiceRenderer.SECONDS_PER_DAY)
        return f"Due on {due.strftime(PdfInvoiceRenderer.DATE_FORMAT)} (in {days} days)"

    def next_reminder(self, now: datetime) -> datetime:
        return now + timedelta(seconds=3 * PdfInvoiceRenderer.SECONDS_PER_DAY)
