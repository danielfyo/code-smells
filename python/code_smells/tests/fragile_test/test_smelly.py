"""Smelly tests: Fragile Test."""

from unittest import mock

from .production import ShoppingCart


# SMELL: Fragile Test. The tests are coupled to implementation details: the internal
# `_items` structure (a dict of tuples), private methods that are spied on or replaced, and
# the exact number of internal calls. Any refactoring that keeps the behavior (e.g. using a
# dataclass for the lines) breaks them.
def test_add_stores_tuple() -> None:
    cart = ShoppingCart()
    cart.add("TEA", 3.0, 2)
    assert cart._items == {"TEA": (3.0, 2)}


def test_total_calls_private_helpers() -> None:
    cart = ShoppingCart()
    cart.add("TEA", 3.0, 10)
    with mock.patch.object(ShoppingCart, "_discount_rate", return_value=0.10) as rate:
        assert cart.total() == 27.0
        rate.assert_called_once_with()


def test_summary_exact_text() -> None:
    cart = ShoppingCart()
    cart.add("TEA", 3.0)
    assert cart.summary() == "1 products, total 3.00 EUR"
