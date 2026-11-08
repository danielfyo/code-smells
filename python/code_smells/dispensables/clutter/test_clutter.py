"""Removing the noise does not change the cart's behaviour."""

from code_smells.dispensables.clutter import refactored, smelly


def test_same_behaviour() -> None:
    old, new = smelly.ShoppingCart(), refactored.ShoppingCart()
    assert old.is_empty() == new.is_empty() is True
    for cart in (old, new):
        cart.add_item("coffee", 4.5, 2)
        cart.add_item("leche", 1.2)
    assert old.get_total() == new.get_total() == 10.2
    assert old.is_empty() == new.is_empty() is False
