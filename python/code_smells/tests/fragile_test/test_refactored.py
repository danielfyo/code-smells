"""Clean tests: they verify observable behavior through the public API."""

from .production import ShoppingCart


# REFACTOR: Test Behavior, Not Implementation. Only the public interface is used (`add`,
# `total`, `summary`) and results are checked, not how they are computed. The internal
# implementation can change freely as long as the behavior stays the same.
def test_total_without_discount() -> None:
    cart = ShoppingCart()
    cart.add("TEA", 3.0, 2)
    cart.add("TEA", 3.0, 1)
    assert cart.total() == 9.0


def test_ten_units_get_volume_discount() -> None:
    cart = ShoppingCart()
    cart.add("TEA", 3.0, 4)
    cart.add("COFFEE", 5.0, 6)
    assert cart.total() == 37.8


def test_summary_mentions_total() -> None:
    cart = ShoppingCart()
    cart.add("TEA", 3.0)
    assert "3.00 EUR" in cart.summary()
