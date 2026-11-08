"""Same amounts; and a VAT change is made in a single place."""

from code_smells.change_preventers.shotgun_surgery import refactored, smelly


def test_same_amounts() -> None:
    old_cart, new_cart = smelly.Cart(), refactored.Cart()
    for cart in (old_cart, new_cart):
        cart.add("MUG", 8.0)
        cart.add("TEA", 4.5)
    assert old_cart.total() == new_cart.total()
    assert smelly.InvoicePrinter().tax_line(12.5) == refactored.InvoicePrinter().tax_line(12.5)
    assert smelly.PriceTag().label("MUG", 8.0) == refactored.PriceTag().label("MUG", 8.0)
    assert smelly.RefundCalculator().refund(10) == refactored.RefundCalculator().refund(10)


def test_rate_change_in_one_place() -> None:
    reduced = refactored.VatPolicy(0.10)
    assert refactored.PriceTag(reduced).label("BREAD", 1.0) == "BREAD: 1.10 EUR (VAT incl.)"
    assert refactored.InvoicePrinter(reduced).tax_line(10) == "VAT (10%): 1.00"
