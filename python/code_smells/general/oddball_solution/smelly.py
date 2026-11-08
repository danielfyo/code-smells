"""Formatting amounts in different ERP documents (smelly version)."""


# SMELL: Oddball Solution. The same problem (showing a euro amount in European format) is
# solved in three different ways in three places. Each one has its own quirks (thousands
# separator, rounding, symbol position) and documents for the same customer show figures
# that look different.
def invoice_line(concept: str, amount: float) -> str:
    text = f"{amount:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return f"{concept}: {text} €"


def delivery_note_line(concept: str, amount: float) -> str:
    euros = int(amount)
    cents = round((amount - euros) * 100)
    return f"{concept}: {euros},{cents:02d} €"  # no thousands separator


def reminder_line(concept: str, amount: float) -> str:
    return f"{concept}: EUR {str(round(amount, 2)).replace('.', ',')}"  # "12,5" not "12,50"
