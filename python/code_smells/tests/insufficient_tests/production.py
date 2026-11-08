"""Code under test: VAT calculation for an invoice with several tax rates."""

VAT_RATES = {"general": 0.21, "reduced": 0.10, "super_reduced": 0.04}


def invoice_total(lines: list[tuple[float, int, str]]) -> float:
    """VAT-inclusive total of the lines (unit price, quantity, VAT type)."""
    total = 0.0
    for unit_price, quantity, vat_type in lines:
        if quantity < 0 or unit_price < 0:
            raise ValueError("price and quantity must be non-negative")
        if vat_type not in VAT_RATES:
            raise KeyError(vat_type)
        total += unit_price * quantity * (1 + VAT_RATES[vat_type])
    return round(total, 2)
