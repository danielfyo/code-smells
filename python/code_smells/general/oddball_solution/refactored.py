"""Formatting amounts in different ERP documents."""


# REFACTOR: Substitute Algorithm + Extract Function. A single solution is chosen
# (`format_eur`) and every document reuses it. A format change is made in one place and all
# documents stay consistent.
def format_eur(amount: float) -> str:
    """European format: dot for thousands, comma for decimals, two decimals, symbol last."""
    us_style = f"{amount:,.2f}"
    return us_style.translate(str.maketrans(",.", ".,")) + " €"


def invoice_line(concept: str, amount: float) -> str:
    return f"{concept}: {format_eur(amount)}"


def delivery_note_line(concept: str, amount: float) -> str:
    return f"{concept}: {format_eur(amount)}"


def reminder_line(concept: str, amount: float) -> str:
    return f"{concept}: {format_eur(amount)}"
